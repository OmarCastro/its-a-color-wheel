document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('pre code').forEach((el) => {
        const html = el.innerHTML
        const lines = html.split("\n")
        const minSpaces = lines.filter(line => line.trim() !== "").reduce((acc, line) => Math.min(line.search(/\S|$/), acc), Infinity)
        el.innerHTML = lines.map(line => line.substring(minSpaces)).join("\n").trim()
      });
});


const reactElementNameChange = (event: Event) => {
  const componentName = (event.target as HTMLElement).closest(".component-name-edit") as HTMLElement
  if(componentName == null){ return false }
  const newText = componentName.textContent
  document.body.querySelectorAll(".component-name-ref").forEach(ref => ref.textContent = newText)
  return true
}


const reactUIModeChange = (event: Event) => {
  const uiMode = (event.target as HTMLElement).closest(".example .ui-mode-edit") as HTMLElement
  if(uiMode == null){ return false }
  const uiModeText = uiMode.textContent
  const example = uiMode.closest(".example")
  example?.querySelectorAll<HTMLElement>("color-wheel").forEach(ref => ref.style.setProperty("--ui-mode", `"${uiModeText}"`))
  return true
}


const reactInnerRadiusChange = (event: Event) => {
  const innerRadius = (event.target as HTMLElement).closest(".example .inner-radius-edit")  as HTMLElement
  if(innerRadius == null){ return false }
  const innerRadiusText = innerRadius.textContent
  const example = innerRadius.closest(".example")
  example?.querySelectorAll<HTMLElement>("color-wheel").forEach(ref => ref.style.setProperty("--color-wheel--inner-radius", `${innerRadiusText}%`))
  return true
}

const reactLightnessChange = (event: Event) => {
  const lightness = (event.target as HTMLElement).closest(".example .lightness-edit")as HTMLElement
  if(lightness == null){ return false }
  const lightnessText = lightness.textContent
  const example = lightness.closest(".example")
  example?.querySelectorAll<HTMLElement>("color-wheel").forEach(ref => ref.setAttribute("lightness", lightnessText?? ""))
  return true
}

const reactValueChange = (event: Event) => {
  const value = (event.target as HTMLElement).closest(".example .value-edit")as HTMLElement
  if(value == null){ return false }
  const valueText = value.textContent
  const example = value.closest(".example")
  example?.querySelectorAll<HTMLElement>("color-wheel").forEach(ref => ref.setAttribute("value", valueText ?? ""))
  return true
}


document.body.addEventListener("input", (event) => {
  reactElementNameChange(event) || reactUIModeChange(event) || reactLightnessChange(event) || reactValueChange(event) || reactInnerRadiusChange(event)
})
