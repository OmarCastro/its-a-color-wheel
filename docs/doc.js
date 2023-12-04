document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('pre code').forEach((el) => {
    const html = el.innerHTML
    const lines = html.split('\n')
    const minSpaces = lines.filter(line => line.trim() !== '').reduce((acc, line) => Math.min(line.search(/\S|$/), acc), Infinity)
    el.innerHTML = lines.map(line => line.substring(minSpaces)).join('\n').trim()
  })
})

const getExampleColorWheel = childNode => childNode.closest('.example')?.querySelectorAll('color-wheel') ?? []

/**
 * @param {Event} event - received event
 * @returns {boolean} flag to return early on input listener
 */
const reactElementNameChange = (event) => {
  const componentName = (event.target).closest('.component-name-edit')
  if (componentName == null) { return false }
  const newText = componentName.textContent
  document.body.querySelectorAll('.component-name-ref').forEach(ref => { ref.textContent = newText })
  return true
}

/**
 * @param {Event} event - received event
 * @returns {boolean} flag to return early on input listener
 */
const reactUIModeChange = (event) => {
  const uiMode = (event.target).closest('.example .ui-mode-edit')
  if (uiMode == null) { return false }
  const uiModeText = uiMode.textContent
  getExampleColorWheel(uiMode).forEach(ref => ref.style.setProperty('--ui-mode', `"${uiModeText}"`))
  return true
}

/**
 * @param {Event} event - received event
 * @returns {boolean} flag to return early on input listener
 */
const reactInnerRadiusChange = (event) => {
  const innerRadius = (event.target).closest('.example .inner-radius-edit')
  if (innerRadius == null) { return false }
  const innerRadiusText = innerRadius.textContent
  getExampleColorWheel(innerRadius).forEach(ref => ref.style.setProperty('--color-wheel-inner-radius', `${innerRadiusText}%`))
  return true
}

/**
 * @param {Event} event - received event
 * @returns {boolean} flag to return early on input listener
 */
const reactLightnessChange = (event) => {
  const lightness = (event.target).closest('.example .lightness-edit')
  if (lightness == null) { return false }
  const lightnessText = lightness.textContent
  getExampleColorWheel(lightness).forEach(ref => ref.setAttribute('lightness', lightnessText ?? ''))
  return true
}

/**
 * @param {Event} event - received event
 * @returns {boolean} flag to return early on input listener
 */
const reactValueChange = (event) => {
  const value = (event.target).closest('.example .value-edit')
  if (value == null) { return false }
  const valueText = value.textContent
  getExampleColorWheel(value).forEach(ref => { ref.setAttribute('value', valueText ?? '') })
  return true
}

document.body.addEventListener('input', (event) => {
  reactElementNameChange(event) || reactUIModeChange(event) || reactLightnessChange(event) || reactValueChange(event) || reactInnerRadiusChange(event)
})
