/** 
 * All observers information are saved here
 * @type {WeakMap<HTMLElement, ObserverOption[]>} 
 */
const observerOptionsMap = new WeakMap()

const resizeObserver = new ResizeObserver(entries => {
  const targets = new Set(entries.map(entry => entry.target))
  for (const target of targets) {
    const rootNode = target.getRootNode()
    if (!(rootNode instanceof ShadowRoot)) { continue }
    const host = rootNode.host
    if (!(host instanceof HTMLElement)) { continue }
    const options = observerOptionsMap.get(host)
    options && options.forEach(option => {
      const computedStyle = getComputedStyle(host)
      const newValue = cleanPropertyValue(computedStyle.getPropertyValue(option.customPropertyName))
      if (option.currentPropertyValue !== newValue) {
        const callbackOptions = {
          target: host,
          previousValue: option.currentPropertyValue,
          value: newValue,
        }
        option.currentPropertyValue = newValue
        option.handler(callbackOptions)
      }
    })
  }
})


/**
 * @param {string} name - css custom property name
 * @returns {string} css class name of observer
 */
const observerClassName = (name) => `css-watch-observer__${name}`

/**
 * @param {string} name - css custom property name
 * @returns {string} css class name of observer's resize target
 */
const observerTargetClassName = (name) => `${observerClassName(name)}--target`


/** 
 * {@link cssPropertyTemplate} memoization cache
 * @type {{[name: string]: HTMLTemplateElement}} 
 */
const templateCache = {}

/**
 * @param {string} name - css property name
 * @returns {HTMLTemplateElement} template
 */
function cssPropertyTemplate (name) {
  if (!templateCache[name]) {
    const template = document.createElement('template')
    const className = observerClassName(name)
    const targetClassName = observerTargetClassName(name)
    template.innerHTML = `<style class="${className}">.${targetClassName} {visibility:hidden;position:absolute;pointer-events:none}.${targetClassName}::before {content:var(${name})}</style><span class="${className} ${targetClassName}"></span>`
    templateCache[name] = template
  }

  return templateCache[name]
}

/**
 * Creates an CSS variable observer
 * @param {string} customPropertyName - custom property name to observe
 * @param {ObserverCallback} callback - observer change callback handler
 * @returns {Observer} created observer
 */
export function shadowDomCustomCssVariableObserver (customPropertyName, callback) {
  const template = cssPropertyTemplate(customPropertyName)
  const className = observerClassName(customPropertyName)
  const targetClassName = observerTargetClassName(customPropertyName)
  return {
    observe: (element) => {
      const observerOptions = observerOptionsMap.get(element) || []
      const observerOptionsWithName = observerOptions.filter(option => option.customPropertyName === customPropertyName)

      if (observerOptionsWithName.length <= 0) {
        element.shadowRoot?.append(document.importNode(template.content, true))
        const elementToObserve = element.shadowRoot?.querySelector(`.${targetClassName}`)
        elementToObserve && resizeObserver.observe(elementToObserve)
      }

      observerOptionsMap.set(element, [...observerOptions, {
        currentPropertyValue: cleanPropertyValue(getComputedStyle(element).getPropertyValue(customPropertyName)),
        handler: callback,
        customPropertyName,
      }])
    },

    unobserve: (element) => {
      const observerOptions = observerOptionsMap.get(element) || []
      const newObserverOptions = observerOptions.filter(option => option.handler !== callback || option.customPropertyName !== customPropertyName)
      const newObserverOptionsWithName = newObserverOptions.filter(option => option.customPropertyName === customPropertyName)
      if (newObserverOptionsWithName.length <= 0) {
        const elementToObserve = element.shadowRoot?.querySelector(`.${targetClassName}`)
        elementToObserve && resizeObserver.unobserve(elementToObserve)
        element.shadowRoot?.querySelectorAll(`.${className}`).forEach(el => el.remove())
      }
      observerOptionsMap.set(element, newObserverOptions)
    },
  }
}

const TRIM_QUOTES_REGEX = /^["'](.+(?=["']$))["']$/

/**
 * Cleans custom property value, they are strings, so the quotes are included.
 * This function simply converts CSS string value to JS string
 * @param {string} propValue - CSS value
 * @returns {string} CSS string value as JS string
 */
export function cleanPropertyValue (propValue) {
  if (typeof propValue !== 'string') {
    return ''
  }
  const trimmed = propValue.trim()
  return trimmed.replace(TRIM_QUOTES_REGEX, '$1')
}

/**
 * @typedef {object} ObserverOption
 * @property {ObserverCallback} handler - observer change callback handler
 * @property {string} currentPropertyValue - current value of CSS custom property
 * @property {string} customPropertyName - observing CSS custom property
 */

/**
 * @callback ObserverCallback
 * @param {ObserverEvent} event
 */

/**
 * @typedef {object} ObserverEvent
 * @property {HTMLElement} target - observing element
 * @property {string} previousValue - previous value
 * @property {string} value - updated value
 */

/**
 * @typedef {object} Observer
 * @property {(element: HTMLElement) => void} observe - observe an element
 * @property {(element: HTMLElement) => void} unobserve - unobserve an element
 */
