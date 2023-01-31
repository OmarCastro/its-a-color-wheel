// src/geometry.ts
var calculateDistanceBetween2Points = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
var CircleInfo = {
  fromRectWithPercentInnerRadius(rect, innerRadiusPerc) {
    const { x, y, width, height } = rect;
    const radius = Math.min(width, height) / 2;
    const innerRadius = innerRadiusPerc * 0.01 * radius;
    const center = { x: x + width / 2, y: y + height / 2 };
    return { innerRadiusPerc, radius, innerRadius, center };
  },
  fromRectWithInnerRadius(rect, innerRadius) {
    const { x, y, width, height } = rect;
    const radius = Math.min(width, height) / 2;
    const innerRadiusPerc = innerRadius * 100 / radius;
    const center = { x: x + width / 2, y: y + height / 2 };
    return { innerRadiusPerc, radius, innerRadius, center };
  }
};

// src/observe-css-var.feature.js
var observerOptionsMap = /* @__PURE__ */ new WeakMap();
var trimQuotesRegex = /^["'](.+(?=["']$))["']$/;
var cleanPropertyValue = (propValue) => {
  if (typeof propValue !== "string") {
    return "";
  }
  const trimmed = propValue.trim();
  return trimmed.replace(trimQuotesRegex, "$1");
};
var resizeObserver = new ResizeObserver((entries) => {
  const targets = new Set(entries.map((entry) => entry.target));
  for (const target of targets) {
    const host = target.getRootNode().host;
    const options = observerOptionsMap.get(host);
    options.forEach((option) => {
      const computedStyle = getComputedStyle(host);
      const newValue = cleanPropertyValue(computedStyle.getPropertyValue(option.customPropertyName));
      if (option.currentPropertyValue !== newValue) {
        const callbackOptions = {
          target: host,
          previousValue: option.currentPropertyValue,
          value: newValue
        };
        option.currentPropertyValue = newValue;
        option.executeCallback(callbackOptions);
      }
    });
  }
});
var templateCache = {};
var createTemplate = (name) => {
  if (!templateCache[name]) {
    const template = document.createElement("template");
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
        `;
    templateCache[name] = template;
  }
  return templateCache[name];
};
function shadowDomCustomCssVariableObserver(name, callback) {
  const template = createTemplate(name);
  return {
    observe: (element) => {
      const observerOptions = observerOptionsMap.get(element) || [];
      const observerOptionsWithName = observerOptions.filter((option) => option.customPropertyName === name);
      if (observerOptionsWithName.length <= 0) {
        element.shadowRoot.append(document.importNode(template.content, true));
        const elementToObserve = element.shadowRoot.querySelector(`.css-watch-observer__${name}--target`);
        resizeObserver.observe(elementToObserve);
      }
      observerOptionsMap.set(element, [...observerOptions, {
        currentPropertyValue: cleanPropertyValue(getComputedStyle(element).getPropertyValue(name)),
        executeCallback: callback,
        customPropertyName: name
      }]);
    },
    unobserve: (element) => {
      const observerOptions = observerOptionsMap.get(element) || [];
      const newObserverOptions = observerOptions.filter((option) => option.executeCallback !== callback || option.customPropertyName !== name);
      const newObserverOptionsWithName = newObserverOptions.filter((option) => option.customPropertyName === name);
      if (newObserverOptionsWithName.length <= 0) {
        const elementToObserve = element.shadowRoot.querySelector(`.css-watch-observer__${name}--target`);
        resizeObserver.unobserve(elementToObserve);
        element.shadowRoot.querySelectorAll(`.css-watch-observer__${name}`).forEach((el) => el.remove());
      }
      observerOptionsMap.set(element, newObserverOptions);
    }
  };
}

// src/color-wheel.element.html
var color_wheel_element_default = '<div class="container">\n    <div class="color-wheel-container">\n        <div class="inner-radius-calc"></div>\n        <div class="color-wheel"></div>\n    </div>\n    <div class="slider-container">\n        <div class="slider-container-half">\n            <div class="slider"></div>\n        </div>\n    </div>\n</div>\n';

// src/color-wheel.element.css
var color_wheel_element_default2 = ':host {\n    color-scheme: only light;\n    display: inline-flex;\n    justify-content: center;\n    align-items: center;\n    --inner-radius: var(--color-wheel--inner-radius, 60%);\n    --radius: 5cm;\n    min-height: calc(2 * var(--radius) + 2*  var(--thumb-radius) + 12px);\n    --thumb-radius: var(--color-wheel-thumb-radius-mobile, var(--color-wheel-thumb-radius, 0.6cm));\n    --hue: 0;\n    --value: 100;\n    --lightness: 50;\n    --saturation: 100;\n    --default-ui-mode: "desktop"\n}\n\n:host([rotate-wheel]) {\n    --ui-mode: "mobile"\n}\n\n/* Smartphones (portrait and landscape) ----------- */\n@media only screen and (min-device-width : 320px) and (max-device-width : 480px) {\n    :host {\n        --default-ui-mode: "mobile"\n    }\n}\n\n.container {\n    position: relative;\n    display: inline-block;\n    overflow: hidden;\n    width: 100%;\n    height: 100%;\n    box-sizing: border-box;\n    padding: calc(var(--thumb-radius) + 6px);\n}\n\n.container--desktop-ui {\n  --inner-radius: var(--color-wheel--inner-radius, 0.1%);\n  --thumb-radius: var(--color-wheel-thumb-radius-desktop, var(--color-wheel-thumb-radius, 0.5cm));\n}\n\n.color-wheel-container {\n  width: 100%;\n  height: 100%;\n  display: inline-block;\n}\n\n.color-wheel {\n  width: 100%;\n  height: 100%;\n  --l-color: calc(var(--value) * 0.5%);\n  --center-l-color: calc(var(--value) * 1%);\n  pointer-events: auto;\n  display: inline-block;\n  touch-action: none;\n  min-height: calc(2 * var(--radius));\n  min-width: calc(2 * var(--radius));\n  border-radius: 50%;\n  background: radial-gradient(circle closest-side at center, hsl(0 0% var(--center-l-color)) var(--inner-radius),  transparent 100%), conic-gradient(\n      hsl(360 100% var(--l-color)),\n      hsl(345 100% var(--l-color)),\n      hsl(330 100% var(--l-color)),\n      hsl(315 100% var(--l-color)),\n      hsl(300 100% var(--l-color)),\n      hsl(285 100% var(--l-color)),\n      hsl(270 100% var(--l-color)),\n      hsl(255 100% var(--l-color)),\n      hsl(240 100% var(--l-color)),\n      hsl(225 100% var(--l-color)),\n      hsl(210 100% var(--l-color)),\n      hsl(195 100% var(--l-color)),\n      hsl(180 100% var(--l-color)),\n      hsl(150 100% var(--l-color)),\n      hsl(135 100% var(--l-color)),\n      hsl(120 100% var(--l-color)),\n      hsl(105 100% var(--l-color)),\n      hsl(90 100% var(--l-color)),\n      hsl(60 100% var(--l-color)),\n      hsl(45 100% var(--l-color)),\n      hsl(30 100% var(--l-color)),\n      hsl(15 100% var(--l-color)),\n      hsl(0 100% var(--l-color))\n  );\n\n  /* calcs for antialiasing */\n  mask-image: radial-gradient(circle closest-side at center, transparent calc(var(--inner-radius) - 1px), white var(--inner-radius), white calc(100% - 1px), transparent 100%);\n  -webkit-mask-image: radial-gradient(circle closest-side at center, transparent calc(var(--inner-radius) - 1px), white var(--inner-radius),  white calc(100% - 1px), transparent 100%);\n  transform-origin: center;\n\n}\n\n.container--hsl .color-wheel {\n  --l-color: calc(var(--lightness) * 1%);\n  --center-l-color: calc(var(--lightness) * 1%);\n}\n\n.container--mobile-ui .color-wheel {\n  transform: rotateZ(calc(var(--hue) * 1deg));\n}\n\n.slider-container{\n  pointer-events: none;\n  position: absolute;\n  aspect-ratio: 1 / 1;\n  height: 100%;\n  max-width: calc(100% - 6px - 2 * var(--thumb-radius));\n  max-height: calc(100% - 6px - 2 * var(--thumb-radius));\n  top: 50%;\n  left: 50%;\n  min-height: calc(2 * var(--radius));\n  min-width: calc(2 * var(--radius));\n  transform: translate(-50%, -50%) rotateZ(calc(var(--hue) * -1deg - 90deg));\n\n}\n\n.slider-container-half {\n  position: absolute;\n  inset: 0 0 0 50%;\n}\n\n.slider {\n  pointer-events: none;\n  touch-action: none;\n  position: absolute;\n  top: 50%;\n  width: calc(2 * var(--thumb-radius));\n  height: calc(2 * var(--thumb-radius));\n  background: hsl(var(--hue), calc(var(--saturation) * 1%), calc((100% - var(--saturation) * 0.5%) * var(--value) / 100));\n  border: 4px solid #888;\n  border-radius: 50%;\n  cursor: pointer;\n  transform: translate(-50%, -50%);\n  left: calc(var(--inner-radius) + (1% * var(--saturation)) - ( var(--saturation) * var(--inner-radius) / 100 ));\n}\n\n.container--hsl .slider {\n  background: hsl(var(--hue), calc(var(--saturation) * 1%), calc(var(--lightness, 50) * 1%)) ;\n}\n\n.inner-radius-calc {\n  visibility: position;\n  z-index: -1;\n  height: 1px;\n  pointer-events: none;\n  touch-action: none;\n  width: var(--inner-radius);\n}\n\n\n.slider::before {\n  display: block;\n  position: absolute;\n  top: -3px;\n  bottom: -3px;\n  left: -3px;\n  right: -3px;\n  background: transparent ;\n  border-radius: 50%;\n  border: 2px solid #ffffff;\n  content: " ";\n  pointer-events: none;\n  touch-action: none;\n}\n\n\n.container--mobile-ui .slider-container{\n  transform: translate(-50%, -50%) rotate(-90deg);\n}\n\n.container--mobile-ui .slider{\n  pointer-events: auto;\n}\n';

// src/color-wheel.element.js
var loadTemplate = () => {
  const templateElement = document.createElement("template");
  templateElement.innerHTML = color_wheel_element_default;
  loadTemplate = () => templateElement;
  return templateElement;
};
var loadStyles = () => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(color_wheel_element_default2);
  loadStyles = () => sheet;
  return sheet;
};
function updateContainerClass(element) {
  const container = element.shadowRoot.querySelector(".container");
  const { uiMode } = element;
  container.classList.toggle("container--desktop-ui", uiMode === "desktop");
  container.classList.toggle("container--mobile-ui", uiMode === "mobile");
}
var uiModeObserver = shadowDomCustomCssVariableObserver("--ui-mode", ({ target }) => updateContainerClass(target));
var defaultUiModeObserver = shadowDomCustomCssVariableObserver("--default-ui-mode", ({ target }) => updateContainerClass(target));
var ColorWheelElement = class extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [loadStyles()];
    const template = loadTemplate();
    shadowRoot.append(document.importNode(template.content, true));
    const wheelContainer = shadowRoot.querySelector(".color-wheel-container");
    const innerRadiusCalc = shadowRoot.querySelector(".inner-radius-calc");
    const wheel = shadowRoot.querySelector(".color-wheel");
    const slider = shadowRoot.querySelector(".slider");
    const wheelStyle = window.getComputedStyle(wheel);
    uiModeObserver.observe(this);
    defaultUiModeObserver.observe(this);
    updateContainerClass(this);
    reflectLightness(this);
    reflectValue(this);
    const getWheelCenterPoint = () => {
      const pointerBox = wheelContainer.getBoundingClientRect();
      const centerPoint = wheelStyle.transformOrigin;
      const centers = centerPoint.split(" ");
      const centerY = pointerBox.top + parseInt(centers[1]);
      const centerX = pointerBox.left + parseInt(centers[0]);
      return { x: centerX, y: centerY };
    };
    const getRadiusValues = () => {
      const pointerBox = wheelContainer.getBoundingClientRect();
      const innerRadiusCSSValue = wheelStyle.getPropertyValue("--inner-radius").trim();
      if (/[0-9]+%/g.test(innerRadiusCSSValue)) {
        const innerRadiusPerc = parseInt(innerRadiusCSSValue);
        return CircleInfo.fromRectWithPercentInnerRadius(pointerBox, innerRadiusPerc);
      }
      const innerRadius = innerRadiusCalc.getBoundingClientRect().width;
      return CircleInfo.fromRectWithInnerRadius(pointerBox, innerRadius);
    };
    const initDrag = (callback) => {
      const defaultPrevented = (e) => {
        e.preventDefault();
        e.stopPropagation();
        callback(e);
      };
      globalThis.addEventListener("pointermove", defaultPrevented, { capture: true });
      globalThis.addEventListener("pointerup", () => {
        globalThis.removeEventListener("pointermove", defaultPrevented, { capture: true });
      }, { once: true, capture: true });
    };
    const fromCenterPointAndRadius = ({ centerPoint, innerRadiusPerc, radius }) => ({
      calculateSaturationFromMouseEvent(event) {
        const r = calculateDistanceBetween2Points(centerPoint, { x: event.clientX, y: event.clientY });
        const rperc = Math.min(100, Math.max(0, r * 100 / radius));
        return Math.round(Math.min(100, Math.max(0, (rperc - innerRadiusPerc) * 100 / (100 - innerRadiusPerc))));
      }
    });
    const initSliderDrag = () => {
      const centerPoint = getWheelCenterPoint();
      const calculations = fromCenterPointAndRadius({
        ...getRadiusValues(),
        centerPoint
      });
      const slideSaturation = (e) => {
        this.saturation = calculations.calculateSaturationFromMouseEvent({
          clientX: centerPoint.x,
          clientY: Math.min(centerPoint.y, e.clientY)
        });
        const event = new CustomEvent("input", { bubbles: true });
        this.dispatchEvent(event);
      };
      initDrag(slideSaturation);
    };
    const initWheelDrag = (clientCoordinates) => {
      const centerPoint = getWheelCenterPoint();
      const { hue } = this;
      const calculations = fromCenterPointAndRadius({
        ...getRadiusValues(),
        centerPoint
      });
      const getAngle = (e) => {
        const delta_x = e.clientX - centerPoint.x;
        const delta_y = centerPoint.y - e.clientY;
        const theta_radians = Math.atan2(delta_y, delta_x);
        return theta_radians * -180 / Math.PI;
      };
      const initDeg = getAngle(clientCoordinates);
      const uiMode = this.uiMode;
      if ((uiMode || "").trim() === "mobile") {
        const rotateWheel = (e) => {
          const deg = getAngle(e);
          const newHue = Math.round(deg - initDeg + hue + 360) % 360;
          this.hue = newHue;
          const event = new CustomEvent("input", { bubbles: true });
          this.dispatchEvent(event);
        };
        initDrag(rotateWheel);
      } else {
        const rotateSlider = (e) => {
          const deg = getAngle(e);
          const newHue = Math.round(-deg + 360 * 2 - 90) % 360;
          this.hue = newHue;
          this.saturation = calculations.calculateSaturationFromMouseEvent(e);
          const event = new CustomEvent("input", { bubbles: true });
          this.dispatchEvent(event);
        };
        initDrag(rotateSlider);
      }
    };
    wheel.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      initWheelDrag(event);
    });
    slider.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      initSliderDrag();
    });
    reflectSaturation(reflectHue(this));
  }
  static get observedAttributes() {
    return ["saturation", "hue", "lightness", "value"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue)
      return;
    switch (name) {
      case "saturation":
        return reflectSaturation(this);
      case "hue":
        return reflectHue(this);
      case "lightness":
        return reflectLightness(this);
      case "value":
        return reflectValue(this);
    }
  }
  get uiMode() {
    const computedStyle = getComputedStyle(this.shadowRoot.querySelector(".container"));
    const uiMode = cleanPropertyValue(computedStyle.getPropertyValue("--ui-mode"));
    switch (uiMode) {
      case "desktop":
      case "mobile":
        return uiMode;
    }
    return cleanPropertyValue(computedStyle.getPropertyValue("--default-ui-mode"));
  }
  get hue() {
    const asInt = parseInt(this.getAttribute("hue"));
    return isNaN(asInt) ? 0 : asInt;
  }
  set hue(hue) {
    this.setAttribute("hue", hue);
  }
  get saturation() {
    const asInt = parseInt(this.getAttribute("saturation"));
    return isNaN(asInt) ? 0 : asInt;
  }
  set saturation(saturation) {
    this.setAttribute("saturation", saturation);
  }
  get value() {
    const asInt = parseInt(this.getAttribute("value"));
    return isNaN(asInt) ? 100 : asInt;
  }
  set value(value) {
    this.setAttribute("value", value);
  }
  get lightness() {
    const asInt = parseInt(this.getAttribute("lightness"));
    return isNaN(asInt) ? 50 : asInt;
  }
  set lightness(lightness) {
    this.setAttribute("lightness", lightness);
  }
};
var getContainer = (element) => element.shadowRoot.querySelector(".container");
var setContainerProperty = (element, property, value) => {
  getContainer(element)?.style.setProperty(property, value);
  return element;
};
function reflectHsl(element) {
  const container = getContainer(element);
  if (!container) {
    return;
  }
  const setHSLMode = element.hasAttribute("lightness") && !element.hasAttribute("value");
  container.classList.toggle("container--hsl", setHSLMode);
}
var reflectHue = (element) => setContainerProperty(element, "--hue", element.hue);
var reflectSaturation = (element) => setContainerProperty(element, "--saturation", element.saturation);
var reflectLightness = (element) => (reflectHsl(element), setContainerProperty(element, "--lightness", element.lightness));
var reflectValue = (element) => (reflectHsl(element), setContainerProperty(element, "--value", element.value));
var url = new URL(import.meta.url);
var elementName = url.searchParams.get("named");
if (elementName) {
  if (customElements.get(elementName) != null) {
    console.error(`A custom element with name "${elementName}" already exists`);
  } else {
    customElements.define(elementName, ColorWheelElement);
  }
}
//# sourceMappingURL=color-wheel.element.js.map
