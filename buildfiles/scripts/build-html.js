/* eslint-disable jsdoc/require-jsdoc, jsdoc/require-param-description */
import Prism from 'prismjs'
import { minimatch } from 'minimatch'
import { imageSizeFromFile } from 'image-size/fromFile'
import { JSDOM } from 'jsdom'
import { marked } from 'marked'
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { resolve, relative } from 'node:path'

const dom = new JSDOM('', {
  url: import.meta.url,
})
/** @type {Window} */
const window = dom.window
const document = window.document
const DOMParser = window.DOMParser

globalThis.window = dom.window
globalThis.document = document

if (document == null) {
  throw new Error('error parsing document')
}
// @ts-ignore
await import('prismjs/plugins/keep-markup/prism-keep-markup.js')
// @ts-ignore
await import('prismjs/components/prism-json.js')
await import('prismjs/components/prism-bash.js')

const projectPath = new URL('../../', import.meta.url)
const docsPath = new URL('docs', projectPath).pathname
const docsOutputPath = new URL('build/docs', projectPath).pathname

const fs = await import('fs')

const data = fs.readFileSync(`${docsPath}/${process.argv[2]}`, 'utf8')

const parsed = new DOMParser().parseFromString(data, 'text/html')
document.replaceChild(parsed.documentElement, document.documentElement)

const exampleCode = (strings, ...expr) => {
  let statement = strings[0]

  for (let i = 0; i < expr.length; i++) {
    statement += String(expr[i]).replace(/</g, '&lt')
      .replaceAll('{{elementName}}', '<span class="component-name-ref keep-markup">color-wheel</span>')
      .replace(/{{([^:]+):ui-mode}}/, '<span contenteditable="true" class="ui-mode-edit">$1</span>')
      .replace(/{{([^:]+):inner-radius}}/, '<span contenteditable="true" class="inner-radius-edit">$1</span>')
      .replace(/{{([^:]+):lightness}}/, '<span contenteditable="true" class="lightness-edit">$1</span>')
      .replace(/{{([^:]+):value}}/, '<span contenteditable="true" class="value-edit">$1</span>')
    statement += strings[i + 1]
  }

  return statement
}

/**
 * @param {string} selector
 * @returns {Element[]} element array to use array methods
 */
const queryAll = (selector) => [...document.documentElement.querySelectorAll(selector)]

const readFileImport = (file) => existsSync(`${docsOutputPath}/${file}`) ? fs.readFileSync(`${docsOutputPath}/${file}`, 'utf8') : fs.readFileSync(`${docsPath}/${file}`, 'utf8')

const promises = []

queryAll('script.html-example').forEach(element => {
  const pre = document.createElement('pre')
  pre.innerHTML = exampleCode`<code class="language-markup keep-markup">${dedent(element.innerHTML)}</code>`
  element.replaceWith(pre)
})

queryAll('script.css-example').forEach(element => {
  const pre = document.createElement('pre')
  pre.innerHTML = exampleCode`<code class="language-css keep-markup">${dedent(element.innerHTML)}</code>`
  element.replaceWith(pre)
})

queryAll('script.json-example').forEach(element => {
  const pre = document.createElement('pre')
  pre.innerHTML = exampleCode`<code class="language-json keep-markup">${dedent(element.innerHTML)}</code>`
  element.replaceWith(pre)
})

queryAll('script.js-example').forEach(element => {
  const pre = document.createElement('pre')
  pre.innerHTML = exampleCode`<code class="language-js keep-markup">${dedent(element.innerHTML)}</code>`
  element.replaceWith(pre)
})

queryAll('svg[ss:include]').forEach(element => {
  const ssInclude = element.getAttribute('ss:include')
  const svgText = readFileImport(ssInclude)
  element.outerHTML = svgText
})

queryAll('[ss:markdown]:not([ss:include])').forEach(element => {
  const md = dedent(element.innerHTML)
  element.innerHTML = marked(md, { mangle: false, headerIds: false })
})

queryAll('[ss:markdown][ss:include]').forEach(element => {
  const ssInclude = element.getAttribute('ss:include')
  const md = readFileImport(ssInclude)
  element.innerHTML = marked(md, { mangle: false, headerIds: false })
})

queryAll('code').forEach(element => {
  Prism.highlightElement(element, false)
})

queryAll('img[ss:size]').forEach(element => {
  const imageSrc = element.getAttribute('src')
  const size = imageSizeFromFile(`${docsOutputPath}/${imageSrc}`)
  element.removeAttribute('ss:size')
  element.setAttribute('width', `${size.width}`)
  element.setAttribute('height', `${size.height}`)
})

promises.push(...queryAll('img[ss:badge-attrs]').map(async (element) => {
  const imageSrc = element.getAttribute('src')
  const svgText = await readFile(`${docsOutputPath}/${imageSrc}`, 'utf8')
  const div = document.createElement('div')
  div.innerHTML = svgText
  const badgeAttrs = element.getAttribute('ss:badge-attrs').split(/[, ]+/)
  element.removeAttribute('ss:badge-attrs')
  const svg = div.querySelector('svg')
  if (!svg) { throw Error(`${docsOutputPath}/${imageSrc} is not a valid svg`) }

  const alt = svg.getAttribute('aria-label')
  if (alt && !badgeAttrs.includes('-alt')) { element.setAttribute('alt', alt) }

  const title = svg.querySelector('title')?.textContent
  if (title && !badgeAttrs.includes('-title')) { element.setAttribute('title', title) }
}))

queryAll('link[href][rel="stylesheet"][ss:inline]').forEach(element => {
  const href = element.getAttribute('href')
  const cssText = fs.readFileSync(`${docsOutputPath}/${href}`, 'utf8')
  element.outerHTML = `<style>${cssText}</style>`
})

promises.push(...queryAll('link[href][ss:repeat-glob]').map(async (element) => {
  const href = element.getAttribute('href')
  if (!href) { return }
  for await (const filename of getFiles(docsOutputPath)) {
    const relativePath = relative(docsOutputPath, filename)
    if (!minimatch(relativePath, href)) { continue }
    const link = document.createElement('link')
    for (const { name, value } of element.attributes) {
      link.setAttribute(name, value)
    }
    link.removeAttribute('ss:repeat-glob')
    link.setAttribute('href', filename)
    element.insertAdjacentElement('afterend', link)
  }
  element.remove()
}))

const tocUtils = {
  getOrCreateId: (element) => {
    const id = element.getAttribute('id') || element.textContent.trim().toLowerCase().replaceAll(/\s+/g, '-')
    if (!element.hasAttribute('id')) {
      element.setAttribute('id', id)
    }
    return id
  },
  createMenuItem: (element) => {
    const a = document.createElement('a')
    const li = document.createElement('li')
    a.href = `#${element.id}`
    a.textContent = element.textContent
    li.append(a)
    return li
  },
  getParentOL: (element, path) => {
    while (path.length > 0) {
      const [title, possibleParent] = path.at(-1)
      if (title.tagName < element.tagName) {
        const possibleParentList = possibleParent.querySelector('ol')
        if (!possibleParentList) {
          const ol = document.createElement('ol')
          possibleParent.append(ol)
          return ol
        }
        return possibleParentList
      }
      path.pop()
    }
    return null
  },
}

await Promise.all(promises)

queryAll('[ss:toc]').forEach(element => {
  const ol = document.createElement('ol')
  /** @type {[HTMLElement, HTMLElement][]} */
  const path = []
  for (const element of queryAll(':is(h2, h3, h4, h5, h6):not(.no-toc), h1.yes-toc')) {
    tocUtils.getOrCreateId(element)
    const parent = tocUtils.getParentOL(element, path) || ol
    const li = tocUtils.createMenuItem(element)
    parent.append(li)
    path.push([element, li])
  }
  element.replaceWith(ol)
})

const minifiedHtml = '<!doctype html>' + minifyDOM(document.documentElement).outerHTML

fs.writeFileSync(`${docsOutputPath}/${process.argv[2]}`, minifiedHtml)

function dedent (templateStrings, ...values) {
  const matches = []
  const strings = typeof templateStrings === 'string' ? [templateStrings] : templateStrings.slice()
  strings[strings.length - 1] = strings[strings.length - 1].replace(/\r?\n([\t ]*)$/, '')
  for (const string of strings) {
    const match = string.match(/\n[\t ]+/g)
    match && matches.push(...match)
  }
  if (matches.length) {
    const size = Math.min(...matches.map(value => value.length - 1))
    const pattern = new RegExp(`\n[\t ]{${size}}`, 'g')
    for (let i = 0; i < strings.length; i++) {
      strings[i] = strings[i].replace(pattern, '\n')
    }
  }

  strings[0] = strings[0].replace(/^\r?\n/, '')
  let string = strings[0]
  for (let i = 0; i < values.length; i++) {
    string += values[i] + strings[i + 1]
  }
  return string
}

async function * getFiles (dir) {
  const dirents = await readdir(dir, { withFileTypes: true })

  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield * getFiles(res)
    } else {
      yield res
    }
  }
}

/**
 * Minifies the DOM tree
 * @param {Element} domElement - target DOM tree root element
 * @returns {Element} root element of the minified DOM
 */
function minifyDOM (domElement) {
  const window = domElement.ownerDocument.defaultView
  const Node = window.Node
  const { TEXT_NODE, ELEMENT_NODE, COMMENT_NODE } = Node

  /** @typedef {"remove-blank" | "1-space" | "pre"} WhitespaceMinify */
  /**
   * @typedef {object} MinificationState
   * @property {WhitespaceMinify} whitespaceMinify - current whitespace minification method
   */

  /**
   * Minify the text node based con current minification status
   * @param {ChildNode} node - current text node
   * @param {WhitespaceMinify} whitespaceMinify - whitespace minification removal method
   */
  function minifyTextNode (node, whitespaceMinify) {
    if (whitespaceMinify === 'pre') {
      return
    }
    // blank node is empty or contains whitespace only, so we remove it
    const isBlankNode = !/[^\s]/.test(node.nodeValue)
    if (isBlankNode && whitespaceMinify === 'remove-blank') {
      node.remove()
      return
    }
    if (whitespaceMinify === '1-space') {
      node.nodeValue = node.nodeValue.replace(/\s\s+/g, ' ')
    }
  }

  const defaultMinificationState = { whitespaceMinify: '1-space' }

  /**
   * @param {Element} element
   * @param {MinificationState} minificationState
   * @returns {MinificationState} update minification State
   */
  function updateMinificationStateForElement (element, minificationState) {
    const tag = element.tagName.toLowerCase()
    // by default, <pre> renders whitespace as is, so we do not want to minify in this case
    if (['pre'].includes(tag)) {
      return { ...minificationState, whitespaceMinify: 'pre' }
    }
    // <html> and <head> are not rendered in the viewport, so we remove it
    if (['html', 'head'].includes(tag)) {
      return { ...minificationState, whitespaceMinify: 'remove-blank' }
    }
    // in the <body>, the default whitespace behaviour is to merge multiple whitespaces to 1,
    // there will stil have some whitespace that will be merged, but at this point, there is
    // little benefit to remove even more duplicated whitespace
    if (['body'].includes(tag)) {
      return { ...minificationState, whitespaceMinify: '1-space' }
    }
    return minificationState
  }

  /**
   * @param {Element} currentElement - current element to minify
   * @param {MinificationState} minificationState - current minificationState
   */
  function walkElementMinification (currentElement, minificationState) {
    const { whitespaceMinify } = minificationState
    // we have to make a copy of the iterator for traversal, because we cannot
    // iterate through what we'll be modifying at the same time
    const values = [...currentElement?.childNodes?.values() || []]
    for (const node of values) {
      if (node.nodeType === COMMENT_NODE) {
        // remove comments node
        currentElement.removeChild(node)
      } else if (node.nodeType === TEXT_NODE) {
        minifyTextNode(node, whitespaceMinify)
      } else if (node.nodeType === ELEMENT_NODE) {
        // process child elements recursively
        const updatedState = updateMinificationStateForElement(node, minificationState)
        walkElementMinification(node, updatedState)
      }
    }
  }
  const initialMinificationState = updateMinificationStateForElement(domElement, defaultMinificationState)
  walkElementMinification(domElement, initialMinificationState)
  return domElement
}
