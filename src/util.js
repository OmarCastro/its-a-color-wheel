/**
 * Calls customElements.define without breaking flow if an error happens
 * @param {string} name - Name for the new custom element. Must be a valid custom element name.
 * @param {CustomElementConstructor} constructor - Name for the new custom element. Must be a valid custom element name.
 */
export function registerElement (name, constructor) {
  try {
    customElements.define(name, constructor)
  } catch (error) {
    console.error(error)
  }
}
