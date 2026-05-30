const originalConsole = globalThis.console

/**
 * Setup fetch mock fixture
 */
export function setup () {
  const mockConsole = buildCustomConsole()
  globalThis.console = mockConsole.console
  return mockConsole.testApi
}

/**
 * teardown fetch mock fixture
 */
export function teardown () {
  globalThis.console = originalConsole
}

function buildCustomConsole(){
  let doNotLogFlag = false
  const entries = Object.entries(originalConsole)
  const customConsole = {
    console: /** @type {typeof console} */(Object.fromEntries(entries.map(([key, val]) => {
      if(typeof val === "function"){
        return [key, (...args) => {
          if(doNotLogFlag) { return }
          return originalConsole[key](args)
        }]
      }
      return [key, val]
    }))),
    testApi: {
      doNotLog(){ doNotLogFlag = true }
    }

  }
  return customConsole
}

