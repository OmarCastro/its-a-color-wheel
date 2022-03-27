import {shadowDomCustomCssVariableObserver, cleanPropertyValue} from './observe-css-var.feature.js'

const url = new URL(import.meta.url)

let loadTemplate = () => {
    const cssPromise = fetch(new URL("./color-wheel.element.css", url)).then(response => response.text())
    const htmlPromise = fetch(new URL("./color-wheel.element.html", url)).then(response => response.text())
    const templatePromise = Promise.all([cssPromise, htmlPromise]).then(([css, html]) => {
      const templateElement = document.createElement("template")
      templateElement.innerHTML = `${css ? `<style>${css}</style>` : ''}${html}`
      return templateElement
    })
    loadTemplate = () => templatePromise
    return templatePromise
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
      this.attachShadow({ mode: 'open' })
      loadTemplate().then((template) => {
        this.shadowRoot.append(document.importNode(template.content, true))
        const container = this.shadowRoot.querySelector('.container')
        const wheel = this.shadowRoot.querySelector('.color-wheel')
        const slider = this.shadowRoot.querySelector('.slider')
        const wheelStyle = window.getComputedStyle(wheel)
        
        uiModeObserver.observe(this)
        defaultUiModeObserver.observe(this)
        updateContainerClass(this)

        const getWheelCenterPoint = () => {
            const pointerBox = container.getBoundingClientRect();
            const centerPoint = wheelStyle.transformOrigin;
            const centers = centerPoint.split(" ");
            const centerY = pointerBox.top + parseInt(centers[1]);
            const centerX = pointerBox.left + parseInt(centers[0]);
            return { x: centerX, y: centerY }
        }

        const getRadiusValues = () => {
            const innerRadiusPerc = parseInt(wheelStyle.getPropertyValue("--inner-radius"))
            const radius = parseInt(wheelStyle.width) / 2
            return { innerRadiusPerc, radius }
        }

        const initDrag = (callback) => {
            const defaultPrevented = e => { e.preventDefault(); e.stopPropagation(); callback(e) } 
            globalThis.addEventListener("pointermove", defaultPrevented, {capture: true})
            globalThis.addEventListener("pointerup", () => globalThis.removeEventListener("pointermove", defaultPrevented, {capture: true}),  { once: true, capture: true })
        }

        const fromCenterPointAndRadius = ({ centerPoint, innerRadiusPerc, radius }) => ({
            calculateDistanceFromMouseEvent(event) {
                return arithmetric.calculateDistanceBetween2Point(centerPoint,  { x: event.clientX, y: event.clientY })
            },
            calculateSaturationFromMouseEvent(event) {
                const r = this.calculateDistanceFromMouseEvent(event)
                const rperc = Math.min(100, Math.max(0, r * 100 / radius))
                console.log(JSON.stringify({r, rperc, radius, centerPoint, x: event.clientX, y: event.clientY}))
                return Math.round(Math.min(100, Math.max(0, (rperc - innerRadiusPerc) * 100 / (100 - innerRadiusPerc))))
            }
        })

        const initSliderDrag = () => {
            const calculations = fromCenterPointAndRadius({
                ...getRadiusValues(),
                centerPoint: getWheelCenterPoint()
            })

            const slideSaturation = (e) => {
                this.saturation = calculations.calculateSaturationFromMouseEvent(e)
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
                const { innerRadiusPerc, radius } = getRadiusValues()
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
        return ["saturation", "hue"]
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if(oldValue === newValue) return 
        switch(name){
          case "saturation": return reflectSaturation(this)
          case "hue": return reflectHue(this)
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

  }

  function isLoaded(element){
    return element.shadowRoot.children.length > 0
  }

  function reflectHue(element){
    if( isLoaded(element) ){
        element.shadowRoot.querySelector('.container').style.setProperty("--hue", element.hue)
    }
    return element
  }


  function reflectSaturation(element){
    if( isLoaded(element) ){
        const { saturation } = element
        element.shadowRoot.querySelector('.slider').value = saturation
        element.shadowRoot.querySelector('.container').style.setProperty("--saturation", saturation)    
    }
    return element
}

const arithmetric = {
    calculateDistanceBetween2Point: ({x: x1, y: y1}, {x: x2, y: y2}) => Math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
}
  
const elementName = url.searchParams.get('named')
if(elementName){
    if (customElements.get(elementName) != null){
        console.error(`A custom element with name "${elementName}" already exists`)
    } else {
        customElements.define(elementName, ColorWheelElement)
    }
}
  