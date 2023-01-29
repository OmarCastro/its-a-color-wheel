import dedent from '../docs/dedent.util.ts';
import Prism from 'https://esm.sh/v103/prismjs@1.29.0'
import { DOMParser, Element } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { minifyHTML } from "https://deno.land/x/minifier/mod.ts";

const projectPath = new URL('../',import.meta.url).pathname;
const text = await Deno.readTextFile(`${projectPath}/docs/index.html`);

const document = new DOMParser().parseFromString(text, "text/html");

if(document == null){
    throw "error parsing document"
}

const exampleCode =  (strings:  TemplateStringsArray, ...expr: unknown[]) => {

    let statement = strings[0];
  
  
    for(let i = 0; i < expr.length; i++){
        statement += String(expr[i]).replace(/</g, "&lt")
        .replaceAll("{{elementName}}", '<span class="component-name-ref keep-markup">color-wheel</span>')
        .replace(/{{([^:]+):ui-mode}}/, '<span contenteditable="true" class="ui-mode-edit">$1</span>')
        .replace(/{{([^:]+):inner-radius}}/, '<span contenteditable="true" class="inner-radius-edit">$1</span>')
        .replace(/{{([^:]+):lightness}}/, '<span contenteditable="true" class="lightness-edit">$1</span>')
        .replace(/{{([^:]+):value}}/, '<span contenteditable="true" class="value-edit">$1</span>')
        statement += strings[i+1]
    }
  
    return statement
  }

  (globalThis as any).document = document;
  await import('https://esm.sh/prismjs@1.29.0/plugins/keep-markup/prism-keep-markup.js');
  

  const queryAll = (selector: string) => [...document.body.querySelectorAll(selector)] as Element[]
  
  queryAll("script.html-example").forEach(element => {
    const pre = document.createElement("pre")
    pre.innerHTML = exampleCode`<code class="language-markup keep-markup">${dedent(element.innerHTML)}</code>`
    element.replaceWith(pre)
  })
  
  queryAll("script.css-example").forEach(element => {
    const pre = document.createElement("pre")
    pre.innerHTML = exampleCode`<code class="language-css keep-markup">${dedent(element.innerHTML)}</code>`
    element.replaceWith(pre)
  })

  queryAll("code").forEach(element => {
    Prism.highlightElement(element as never, false)
  })

  console.log(document.documentElement?.outerHTML)
  console.log(Prism.plugins)

  const minifiedHtml = minifyHTML(document.documentElement?.outerHTML || "")
  
  await Deno.writeTextFile(`${projectPath}/build/docs/index.html`, "<!DOCTYPE html>" + minifiedHtml);