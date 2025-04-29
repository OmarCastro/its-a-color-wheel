import { test } from '../test-utils/unit/test.ts'
import { registerElement, registerCSSProperties } from './util.js'

test('registerElement - Given an error is thrown from the custom element registry, it does not stop execution', async ({ step, expect }) => {
  const oldCustomElements = globalThis.customElements
  const oldConsole = globalThis.console
  globalThis.customElements = {
    define: () => { throw new Error('error') }
  }
  globalThis.console = {
    error: () => {}
  }

  await expect(() => registerElement()).not.toThrowError()

  globalThis.customElements = oldCustomElements
  globalThis.console = oldConsole
})

test('registerCSSProperties - Given an DOMException is thrown, ignore it, due to the CSS being already registered', async ({ expect }) => {
  const oldCSS = globalThis.CSS
  globalThis.CSS = {
    registerProperty: () => { throw new DOMException('error') }
  }

  await expect(() => registerCSSProperties()).not.toThrowError()

  globalThis.CSS = oldCSS
})

test('registerCSSProperties - Given an error other than DOMException is thrown, propagate it', async ({ expect }) => {
  const oldCSS = globalThis.CSS
  globalThis.CSS = {
    registerProperty: () => { throw new SyntaxError('error') }
  }

  await expect(() => registerCSSProperties()).toThrowError()

  globalThis.CSS = oldCSS
})
