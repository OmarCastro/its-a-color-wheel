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

/**
 * Registers CSS properties to fix Chorme "allow-discrete" transition on Chrome
 * @see https://issues.chromium.org/issues/360159391
 */
export function registerCSSProperties () {
  for (const [name, inherits] of /** @type {const} */([['--default-ui-mode', false], ['--ui-mode', true]])) {
    try {
      CSS.registerProperty({ name, inherits })
    } catch (e) {
      if (e instanceof DOMException) {
        // property registered, ignore it
      } else {
        throw e // re-throw the error
      }
    }
  }
}
