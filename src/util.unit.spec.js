import { test, expect } from '#unit-test'
import { registerElement, registerCSSProperties } from './util.js'

test('registerElement - Given an error is thrown from the custom element registry, it does not stop execution', async ({ console }) => {
  const oldCustomElements = globalThis.customElements
  globalThis.customElements = {
    define: () => { throw new Error('error') },
  }
  console.doNotLog()

  await expect(() => registerElement()).not.toThrow()

  globalThis.customElements = oldCustomElements
})

test('registerCSSProperties - Given an DOMException is thrown, ignore it, due to the CSS being already registered', async ({}) => {
  const oldCSS = globalThis.CSS
  globalThis.CSS = {
    registerProperty: () => { throw new DOMException('error') },
  }

  await expect(() => registerCSSProperties()).not.toThrow()

  globalThis.CSS = oldCSS
})

test('registerCSSProperties - Given an error other than DOMException is thrown, propagate it', async ({}) => {
  const oldCSS = globalThis.CSS
  globalThis.CSS = {
    registerProperty: () => { throw new SyntaxError('error') },
  }

  await expect(() => registerCSSProperties()).toThrow(SyntaxError)

  globalThis.CSS = oldCSS
})
