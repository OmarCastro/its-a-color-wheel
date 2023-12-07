import { calculateDistanceBetween2Points, CircleInfo } from './geometry.js'
import { shadowDomCustomCssVariableObserver, cleanPropertyValue } from './observe-css-var.feature.js'
import html from './color-wheel.element.html'
import css from './color-wheel.element.css'

let loadTemplate = () => {
  const templateElement = document.createElement('template')
  templateElement.innerHTML = html
  loadTemplate = () => templateElement
  return templateElement
}

let loadStyles = () => {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(css)
  loadStyles = () => sheet
  return sheet
}

const uiModeObserver = shadowDomCustomCssVariableObserver('--ui-mode', ({ target }) => target instanceof ColorWheelElement && updateContainerUIModeClass(target))
const defaultUiModeObserver = shadowDomCustomCssVariableObserver('--default-ui-mode', ({ target }) => target instanceof ColorWheelElement && updateContainerUIModeClass(target))
/** @type {(shadowRoot: ParentNode | null, selector: string) => HTMLElement } */
const queryRequired = (shadowRoot, selector) => {
  if (!shadowRoot) { throw new Error(`Color-wheel: Error from shadowDOM: parent node is ${shadowRoot}`) }
  const result = shadowRoot.querySelector(selector)
  if (!result || !(result instanceof HTMLElement)) { throw new Error(`Color-wheel: Error from shadowDOM: html element "${selector}" not found`) }
  return result
}

class ColorWheelElement extends HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.adoptedStyleSheets = [loadStyles()]
    const template = loadTemplate()

    shadowRoot.append(document.importNode(template.content, true))
    const fromShadowRoot = queryRequired.bind(null, shadowRoot)
    const wheelContainer = fromShadowRoot('.color-wheel-container')
    const innerRadiusCalc = fromShadowRoot('.inner-radius-calc')
    const wheel = fromShadowRoot('.color-wheel')
    const slider = fromShadowRoot('.slider')
    if (!wheelContainer || !innerRadiusCalc) {
      throw new Error('Error loading Color-wheel: ".color-wheel-container", ".inner-radius-calc", ".color-wheel" or  not found')
    }
    const wheelStyle = window.getComputedStyle(wheel)

    uiModeObserver.observe(this)
    defaultUiModeObserver.observe(this)
    updateContainerUIModeClass(this)
    reflectLightness(this)
    reflectValue(this)

    const getWheelCenterPoint = () => {
      const pointerBox = wheelContainer.getBoundingClientRect()
      const centerPoint = wheelStyle.transformOrigin
      const centers = centerPoint.split(' ')
      const centerY = pointerBox.top + parseInt(centers[1])
      const centerX = pointerBox.left + parseInt(centers[0])
      return { x: centerX, y: centerY }
    }

    const getRadiusValues = () => {
      const pointerBox = wheelContainer.getBoundingClientRect()
      const innerRadiusCSSValue = wheelStyle.getPropertyValue('--inner-radius').trim()
      if (/[0-9]+%/g.test(innerRadiusCSSValue)) {
        const innerRadiusPerc = parseFloat(innerRadiusCSSValue) & 1
        return CircleInfo.fromRectWithPercentInnerRadius(pointerBox, innerRadiusPerc)
      }
      const innerRadius = innerRadiusCalc.getBoundingClientRect().width
      return CircleInfo.fromRectWithInnerRadius(pointerBox, innerRadius)
    }

    /**
     * Inits drag event, calling `callback` until it finishes, preventing default event and propagation during the operation
     * @param {(event: PointerEvent) => void} callback - callback to execute
     */
    const initDrag = (callback) => {
      const window = this.ownerDocument.defaultView
      if (!window) { return }
      /** @param {PointerEvent} e - event to pass to `callback` */
      const defaultPrevented = e => { e.preventDefault(); e.stopPropagation(); callback(e) }
      window.addEventListener('pointermove', defaultPrevented, { capture: true })
      window.addEventListener('pointerup', () => {
        window.removeEventListener('pointermove', defaultPrevented, { capture: true })
      }, { once: true, capture: true })
    }

    const fromCenterPointAndRadius = ({ centerPoint, innerRadiusPerc, radius }) => ({
      calculateSaturationFromMouseEvent (event) {
        const r = calculateDistanceBetween2Points(centerPoint, { x: event.clientX, y: event.clientY })
        const rperc = Math.min(100, Math.max(0, r * 100 / radius))
        return Math.round(Math.min(100, Math.max(0, (rperc - innerRadiusPerc) * 100 / (100 - innerRadiusPerc))))
      },
    })

    /**
     * Init slider drag and drop
     */
    const initSliderDrag = () => {
      const centerPoint = getWheelCenterPoint()
      const calculations = fromCenterPointAndRadius({
        ...getRadiusValues(),
        centerPoint,
      })

      /** @param {PointerEvent} e - pointermove event */
      const slideSaturation = (e) => {
        this.saturation = calculations.calculateSaturationFromMouseEvent({
          clientX: centerPoint.x,
          clientY: Math.min(centerPoint.y, e.clientY),
        })
        const event = new CustomEvent('input', { bubbles: true })
        this.dispatchEvent(event)
      }
      initDrag(slideSaturation)
    }

    /** @param {PointerEvent} pointerEvent - pointerdown event */
    const initWheelDrag = (pointerEvent) => {
      const centerPoint = getWheelCenterPoint()
      const { hue } = this
      const calculations = fromCenterPointAndRadius({
        ...getRadiusValues(),
        centerPoint,
      })

      /**
       * @param {PointerEvent} e - pointermove event
       * @returns theta value in degrees
       */
      const getAngle = (e) => {
        const deltaX = e.clientX - centerPoint.x
        const deltaY = centerPoint.y - e.clientY
        const thetaRadians = Math.atan2(deltaY, deltaX)
        return thetaRadians * -180 / Math.PI
      }

      const initDeg = getAngle(pointerEvent)
      const uiMode = this.uiMode

      if ((uiMode || '').trim() === 'mobile') {
        /** @param {PointerEvent} e - pointermove event */
        const rotateWheel = (e) => {
          const deg = getAngle(e)
          const newHue = Math.round(deg - initDeg + hue + 360) % 360
          this.hue = newHue
          const event = new CustomEvent('input', { bubbles: true })
          this.dispatchEvent(event)
        }
        initDrag(rotateWheel)
      } else {
        /** @param {PointerEvent} e - pointermove event */
        const rotateSlider = (e) => {
          const deg = getAngle(e)
          const newHue = Math.round(-deg + 360 * 2 - 90) % 360
          this.hue = newHue
          const newSaturation = calculations.calculateSaturationFromMouseEvent(e)
          this.saturation = newSaturation
          const event = new CustomEvent('input', { bubbles: true })
          this.dispatchEvent(event)
        }
        rotateSlider(pointerEvent)
        initDrag(rotateSlider)
      }
    }

    wheel.addEventListener('pointerdown', (event) => {
      event.preventDefault()
      event.stopPropagation()
      initWheelDrag(/** @type {PointerEvent} */ (event))
    })

    slider.addEventListener('pointerdown', (event) => {
      event.preventDefault()
      event.stopPropagation()
      initSliderDrag()
    })
    reflectHue(this)
    reflectSaturation(this)
  }

  static get observedAttributes () {
    return ['saturation', 'hue', 'lightness', 'value']
  }

  /**
   * @param {string} name - changed attribute name
   * @param {string} oldValue - old attribute value
   * @param {string} newValue - new attribute value
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (oldValue === newValue) return
    switch (name) {
      case 'saturation':
        reflectSaturation(this)
        return
      case 'hue':
        reflectHue(this)
        return
      case 'lightness':
        reflectLightness(this)
        return
      case 'value':
        reflectValue(this)
    }
  }

  get uiMode () {
    const computedStyle = getComputedStyle(getContainer(this))
    const uiMode = cleanPropertyValue(computedStyle.getPropertyValue('--ui-mode'))
    switch (uiMode) {
      case 'desktop':
      case 'mobile':
        return uiMode
    }
    return cleanPropertyValue(computedStyle.getPropertyValue('--default-ui-mode'))
  }

  get hue () {
    return getNumericValueFromAttribute(this, 'hue', 0)
  }

  set hue (hue) {
    this.setAttribute('hue', String(hue))
  }

  get saturation () {
    return getNumericValueFromAttribute(this, 'saturation', 0)
  }

  set saturation (saturation) {
    this.setAttribute('saturation', String(saturation))
  }

  get value () {
    return getNumericValueFromAttribute(this, 'value', 100)
  }

  set value (value) {
    this.setAttribute('value', String(value))
  }

  get lightness () {
    return getNumericValueFromAttribute(this, 'lightness', 50)
  }

  set lightness (lightness) {
    this.setAttribute('lightness', String(lightness))
  }
}

/**
 * @param {ColorWheelElement} element - target Element
 * @param {string} attribute - attribute
 * @param {number} defaultValue - default value
 * @returns {number} - numeric value, or default if not defined or invalid
 */
function getNumericValueFromAttribute (element, attribute, defaultValue) {
  const value = element.getAttribute(attribute)
  if (!value) { return defaultValue }
  const asInt = parseInt(value)
  return isNaN(asInt) ? defaultValue : asInt
}

/**
 * @param {ColorWheelElement} element - target element
 * @returns {HTMLElement} container element
 */
const getContainer = element => queryRequired(element.shadowRoot, '.container')

/**
 * @param {ColorWheelElement} element - target element
 * @param {string} property - css
 * @param {string | number} value - new valuw
 */
const setContainerProperty = (element, property, value) => { getContainer(element).style.setProperty(property, String(value)) }

/**
 *
 * @param {ColorWheelElement} element - target element
 */
function updateContainerUIModeClass (element) {
  const container = getContainer(element)
  const { uiMode } = element
  container.classList.toggle('container--desktop-ui', uiMode === 'desktop')
  container.classList.toggle('container--mobile-ui', uiMode === 'mobile')
}

/**
 * updates ColorWheelElement color view based on the data
 * By default it used the HSV color scheme, it only uses HSL when only HSL attributes are defined
 * @param {ColorWheelElement} element - target element
 */
function reflectHsl (element) {
  const container = getContainer(element)
  if (!container) { return }
  const setHSLMode = element.hasAttribute('lightness') && !element.hasAttribute('value')
  container.classList.toggle('container--hsl', setHSLMode)
}

/** @param {ColorWheelElement} element - target element */
const reflectHue = element => { setContainerProperty(element, '--hue', element.hue) }
/** @param {ColorWheelElement} element - target element */
const reflectSaturation = element => { setContainerProperty(element, '--saturation', element.saturation) }
/** @param {ColorWheelElement} element - target element */
const reflectLightness = element => { reflectHsl(element); setContainerProperty(element, '--lightness', element.lightness) }
/** @param {ColorWheelElement} element - target element */
const reflectValue = element => { reflectHsl(element); setContainerProperty(element, '--value', element.value) }

const url = new URL(import.meta.url)
const elementName = url.searchParams.get('named')
if (elementName) {
  if (customElements.get(elementName) != null) {
    console.error(`A custom element with name "${elementName}" already exists`)
  } else {
    customElements.define(elementName, ColorWheelElement)
  }
}
