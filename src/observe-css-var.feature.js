
/** @type {WeakMap<HTMLElement, CachedObserverOption[]>} */
const observerOptionsMap = new WeakMap();

const trimQuotesRegex = /^["'](.+(?=["']$))["']$/
export const cleanPropertyValue = propValue => {
    if(typeof propValue !== "string"){
        return ""
    }
    const trimmed = propValue.trim();
    return trimmed.replace(trimQuotesRegex, '$1');

}

const resizeObserver = new ResizeObserver(entries => {
    const targets = new Set(entries.map(entry => entry.target))
    for (const target of targets) {
        const host = target.getRootNode().host
        const options = observerOptionsMap.get(host);
        options.forEach(option => {
            const computedStyle = getComputedStyle(host)
            const newValue = cleanPropertyValue(computedStyle.getPropertyValue(option.customPropertyName))
            if(option.currentPropertyValue !== newValue){
                const callbackOptions = {
                    target: host,
                    previousValue: option.currentPropertyValue,
                    value: newValue
                }
                option.currentPropertyValue = newValue
                option.executeCallback(callbackOptions)
            }
        })
    }
});


const templateCache = {}

const createTemplate = (name) => {
    if(!templateCache[name]){
        const template = document.createElement("template")
        template.innerHTML = `<style class="css-watch-observer__${name}">
        .css-watch-observer__${name}--target {
            font-size: 1rem;
            display: inline-block;
            visibility: hidden;
            position: absolute;
            z-index: -10000;
            pointer-events: none
        }
    
        .css-watch-observer__${name}--target::before {
            content: var(${name})
        }            
        </style>
        <span class="css-watch-observer__${name} css-watch-observer__${name}--target"></span>
        `
        templateCache[name] = template 
    }

    return templateCache[name]
}

/**
 * 
 * @param {string} name 
 * @param {function} callback 
 * @returns {Observer}
 */
export function shadowDomCustomCssVariableObserver(name, callback){
    const template = createTemplate(name)
    return {
        observe: (element) => {
            const observerOptions = observerOptionsMap.get(element) || []
            const observerOptionsWithName = observerOptions.filter(option => option.customPropertyName === name)

            if(observerOptionsWithName.length <= 0){
                element.shadowRoot.append(document.importNode(template.content, true))
                const elementToObserve = element.shadowRoot.querySelector(`.css-watch-observer__${name}--target`)
                resizeObserver.observe(elementToObserve)    
            }

            observerOptionsMap.set(element, [...observerOptions, {
                currentPropertyValue: cleanPropertyValue(getComputedStyle(element).getPropertyValue(name)),
                executeCallback: callback,
                customPropertyName: name
            }])
        },

        unobserve: (element) => {
            const observerOptions = observerOptionsMap.get(element) || []
            const newObserverOptions = observerOptions.filter(option => option.executeCallback !== callback || option.customPropertyName !== name )
            const newObserverOptionsWithName = newObserverOptions.filter(option => option.customPropertyName === name)
            if(newObserverOptionsWithName.length <= 0){
                const elementToObserve = element.shadowRoot.querySelector(`.css-watch-observer__${name}--target`)
                resizeObserver.unobserve(elementToObserve)
                element.shadowRoot.querySelectorAll(`.css-watch-observer__${name}`).forEach(el => el.remove())
            }
            observerOptionsMap.set(element, newObserverOptions)
        }
    }


}

/** 
 * @typedef {object} ObserverOption 
 * @property {string[]} acceptValues
 * @property {function} executeCallback
 * @property {string} currentPropertyValue
 * @property {string} customPropertyName
 * 
 * @typedef {object} Observer
 * @property {(element: HTMLElement) => void} observe
 * @property {(element: HTMLElement) => void} unobserve
 * */
