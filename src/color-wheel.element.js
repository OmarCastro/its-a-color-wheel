import { calculateDistanceBetween2Points } from './geometry.js'
import {shadowDomCustomCssVariableObserver, cleanPropertyValue} from './observe-css-var.feature.js'

const url = new URL(import.meta.url)


let loadTemplate = () => {
  const templatePromise = fetch(new URL("./color-wheel.element.html", url))
    .then(response => response.text())
    .then((html) => {
    const templateElement = document.createElement("template")
    templateElement.innerHTML = html
    return templateElement
  })
  loadTemplate = () => templatePromise
  return templatePromise
}

let loadStyles = () => {
  const stylesPromise = fetch(new URL("./color-wheel.element.css", url))
    .then(response => response.text())
    .then((css) => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      return sheet
  })
  loadStyles = () => stylesPromise
  return stylesPromise
}
  

  /**
   * 
   * @param {ColorWheelElement} element 
   */
  function updateContainerClass(element){
    const container = element.shadowRoot.querySelector('.container')
    const {uiMode} = element
    container.classList.toggle('container--desktop-ui', uiMode === 'desktop')
    container.classList.toggle('container--mobile-ui', uiMode === 'mobile')
  }


  const uiModeObserver = shadowDomCustomCssVariableObserver('--ui-mode', ({target}) => updateContainerClass(target))
  const defaultUiModeObserver = shadowDomCustomCssVariableObserver('--default-ui-mode', ({target}) => updateContainerClass(target))
  
  class ColorWheelElement extends HTMLElement {
    constructor(){
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
      loadStyles().then((sheet) => {
        shadowRoot.adoptedStyleSheets = [sheet];
      })

      loadTemplate().then((template) => {
        shadowRoot.append(document.importNode(template.content, true))
        const wheelContainer = shadowRoot.querySelector('.color-wheel-container')
        const innerRadiusCalc = shadowRoot.querySelector('.inner-radius-calc')
        const wheel = shadowRoot.querySelector('.color-wheel')
        const slider = shadowRoot.querySelector('.slider')
        const wheelStyle = window.getComputedStyle(wheel)
             
        uiModeObserver.observe(this)
        defaultUiModeObserver.observe(this)
        updateContainerClass(this)
        reflectLightness(this)
        reflectValue(this)

        const getWheelCenterPoint = () => {
            const pointerBox = wheelContainer.getBoundingClientRect();
            const centerPoint = wheelStyle.transformOrigin;
            const centers = centerPoint.split(" ");
            const centerY = pointerBox.top + parseInt(centers[1]);
            const centerX = pointerBox.left + parseInt(centers[0]);
            return { x: centerX, y: centerY }
        }

        const getRadiusValues = () => {
          const pointerBox = wheelContainer.getBoundingClientRect();
          const radius = Math.min(pointerBox.width, pointerBox.height) / 2
            const innerRadiusCSSValue = wheelStyle.getPropertyValue("--inner-radius").trim()
            if(/[0-9]+%/g.test(innerRadiusCSSValue)){
              const innerRadiusPerc = parseInt(innerRadiusCSSValue)
              const innerRadius = (innerRadiusPerc * 0.01) * radius
              return { innerRadiusPerc, radius, innerRadius }
            } 
            const innerRadius = innerRadiusCalc.getBoundingClientRect().width
            const innerRadiusPerc = innerRadius * 100 / radius
            return { innerRadiusPerc, radius, innerRadius }
        }

        const initDrag = (callback) => {
            const defaultPrevented = e => { e.preventDefault(); e.stopPropagation(); callback(e) } 
            globalThis.addEventListener("pointermove", defaultPrevented, {capture: true})
            globalThis.addEventListener("pointerup", () => {
              globalThis.removeEventListener("pointermove", defaultPrevented, {capture: true})
            }, { once: true, capture: true })
        }

        const fromCenterPointAndRadius = ({ centerPoint, innerRadiusPerc, radius }) => ({
            calculateDistanceFromMouseEvent: (event) => calculateDistanceBetween2Points(centerPoint,  { x: event.clientX, y: event.clientY })
            ,
            calculateSaturationFromMouseEvent(event) {
                const r = this.calculateDistanceBetween2Points(centerPoint,  { x: event.clientX, y: event.clientY })
                const rperc = Math.min(100, Math.max(0, r * 100 / radius))
                return Math.round(Math.min(100, Math.max(0, (rperc - innerRadiusPerc) * 100 / (100 - innerRadiusPerc))))
            }
        })

        const initSliderDrag = () => {
            const centerPoint = getWheelCenterPoint()
            const calculations = fromCenterPointAndRadius({
                ...getRadiusValues(),
                centerPoint
            })

            const slideSaturation = (e) => {
                this.saturation = calculations.calculateSaturationFromMouseEvent({
                  clientX: centerPoint.x,
                  clientY: Math.min(centerPoint.y, e.clientY)
                })
                const event = new CustomEvent("input", { bubbles: true })
                this.dispatchEvent(event)
            }
            initDrag(slideSaturation)
        }

        const initWheelDrag = (clientCoordinates) => {
            const centerPoint = getWheelCenterPoint()
            const { hue } = this
            const calculations = fromCenterPointAndRadius({
                ...getRadiusValues(),
                centerPoint
            })

            const getAngle = (e) => {
                const delta_x =  e.clientX - centerPoint.x
                const delta_y = centerPoint.y - e.clientY
                const theta_radians = Math.atan2(delta_y, delta_x)
                return theta_radians * -180/Math.PI 
            }

            const initDeg = getAngle(clientCoordinates)
            const uiMode = this.uiMode

            if((uiMode || "").trim() === "mobile") {
                const rotateWheel = (e) => {
                    const deg = getAngle(e) 
                    const newHue = Math.round(deg - initDeg + hue + 360) % 360
                    this.hue = newHue
                    const event = new CustomEvent("input", { bubbles: true })
                    this.dispatchEvent(event)    
                }
                initDrag(rotateWheel)
                
            } else {
                const rotateSlider = (e) => {
                    const deg = getAngle(e) 
                    const newHue = Math.round(-deg + 360 * 2 - 90) % 360
                    this.hue = newHue
                    this.saturation = calculations.calculateSaturationFromMouseEvent(e)
                    const event = new CustomEvent("input", { bubbles: true })
                    this.dispatchEvent(event)              
                }

                initDrag(rotateSlider)
            }
        }

        wheel.addEventListener("pointerdown", (event)  => {
            event.preventDefault()
            event.stopPropagation()
            initWheelDrag(event)
        })

        slider.addEventListener("pointerdown", (event) => {
            event.preventDefault()
            event.stopPropagation()
            initSliderDrag()
        })

        reflectSaturation(reflectHue(this))
      })
    }

    static get observedAttributes(){
        return ["saturation", "hue", "lightness", "value"]
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if(oldValue === newValue) return 
        switch(name){
          case "saturation": return reflectSaturation(this)
          case "hue": return reflectHue(this)
          case "lightness": return reflectLightness(this)
          case "value": return reflectValue(this)
        }
      }

  get uiMode(){
    const computedStyle = getComputedStyle(this.shadowRoot.querySelector('.container'))
    const uiMode = cleanPropertyValue(computedStyle.getPropertyValue("--ui-mode"));
    switch(uiMode){
      case 'desktop':
      case 'mobile':
        return uiMode
    }
    return cleanPropertyValue(computedStyle.getPropertyValue("--default-ui-mode"))

  }

  get hue(){
    const asInt = parseInt(this.getAttribute("hue"))
    return isNaN(asInt) ? 0 : asInt
  }

  set hue(hue){
    this.setAttribute("hue", hue)
  }

  get saturation(){
    const asInt = parseInt(this.getAttribute("saturation"))
    return isNaN(asInt) ? 0 : asInt
  }

  set saturation(saturation){
    this.setAttribute("saturation", saturation)
  }

  get value(){
    const asInt = parseInt(this.getAttribute("value"))
    return isNaN(asInt) ? 100 : asInt
  }

  set value(value){
      this.setAttribute("value", value)
  }

  get lightness(){
    const asInt = parseInt(this.getAttribute("lightness"))
    return isNaN(asInt) ? 50 : asInt
  }

  set lightness(lightness){
    this.setAttribute("lightness", lightness)
  }
}

const getContainer = element => element.shadowRoot.querySelector('.container')
const setContainerProperty = (element, property, value) => {
  getContainer(element)?.style.setProperty(property, value)
  return element
}

function reflectHsl(element){
  const container = getContainer(element)
  if(!container){ return }
  const setHSLMode = element.hasAttribute("lightness") && !element.hasAttribute("value")
  container.classList.toggle("container--hsl", setHSLMode)
}

const reflectHue = element => setContainerProperty(element, "--hue", element.hue)
const reflectSaturation = element => setContainerProperty(element, "--saturation", element.saturation)
const reflectLightness = element => (reflectHsl(element), setContainerProperty(element, "--lightness", element.lightness))
const reflectValue = element => (reflectHsl(element), setContainerProperty(element, "--value", element.value))

  
const elementName = url.searchParams.get('named')
if(elementName){
    if (customElements.get(elementName) != null){
        console.error(`A custom element with name "${elementName}" already exists`)
    } else {
        customElements.define(elementName, ColorWheelElement)
    }
}
  