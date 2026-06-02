/** @import { Expect } from 'expect' */
globalThis[Symbol.for('custom-unit-test-setup')] = async function setupUnitTestsForSystems () {
  const { expect } = await import('./simple-expect.js')

  /**
   * @param {string} message - message to show on the report on skip
   */
  function SkipException (message) {
    if (!(this instanceof SkipException)) { return new SkipException(message) }
    this.message = message
  }

  async function runTests () {
    const startTestTimestamp = performance.now()
    const testAmount = unitTests.length
    let failedTestAmount = 0
    let skippedTestAmount = 0

    console.log(`[unit-test] ${testAmount} tests to run`)
    let result = '[unit-test] results: \n'

    for (const { description, test } of unitTests) {
      try {
        await test()
        result += `  [PASS] ${description}\n`
      } catch (e) {
        if (e instanceof SkipException) {
          skippedTestAmount++
          result += `  [SKIP] ${description} : ${e.message}\n`
        } else {
          console.log(e)
          failedTestAmount++
          result += `**[FAIL] ${description}\n`
        }
      }
    }
    const endTestTimestamp = performance.now()
    console.log(result)
    const skippedTestReport = skippedTestAmount <= 0 ? '' : `, ${skippedTestAmount} tests skipped`

    if (failedTestAmount <= 0) {
      console.log(`[unit-test] All tests passed${skippedTestReport}`)
    } else {
      console.log(`[unit-test] ${failedTestAmount} tests failed${skippedTestReport}`)
    }

    console.log(`[unit-test] tests took ${(endTestTimestamp - startTestTimestamp).toFixed(3)} milliseconds. ${endTestTimestamp.toFixed(3)} milliseconds since startup.`)
    process.exitCode = failedTestAmount > 0 ? 1 : 0
  }

  function scheduleUnitTestRun () {
    if (!scheduleUnitTestRun.alreadyScheduled) {
      setTimeout(runTests, 0)
      scheduleUnitTestRun.alreadyScheduled = true
    }
  }

  const notTestsFoundTimeout = setTimeout(() => {
    console.error('No tests found, aborting')
    process.exit(1)
  }, 250)

  let fixturesProto = {}

  const unitTests = []
  const test = (description, testFunction) => {
    fixturesProto = loadFixtures(fixturesProto, testFunction)
    unitTests.push({
      description,
      test: async () => {
        const fixtureObj = Object.create(fixturesProto)
        fixturesProto[cacheProp] = {}
        fixturesProto[postTestCallback] = new Set()

        fixtureObj.expect = expect
        fixtureObj.step = async (_, callback) => await callback()
        try {
          await testFunction(fixtureObj)
        } finally {
          fixturesProto[postTestCallback].forEach(callback => callback())
        }

      },
    })
    clearTimeout(notTestsFoundTimeout)
    scheduleUnitTestRun()
  }

  return { test, expect }
}

const loadersProp = Symbol("loadersProp")
const cacheProp = Symbol("cacheProp")
const postTestCallback = Symbol("postTestCallback")

const fixtureLoaderMap = {
  dom: async () => await import('./fixtures/dom.unit.fixture.js'),
  fetch: async () => await import('./fixtures/fetch.unit.fixture.js'),
  console: async () => await import('./fixtures/console.unit.fixture.js'),
  timezone: async () => await import('./fixtures/timezone.unit.fixture.js'),
  gc: async () => await import('./fixtures/garbage-collector.unit.fixture.js'),
}

function loadFixtures(fixturesObj, fn){
  const loadProps = fixturesObj[loadersProp] ?? {}
  const fixturesToLoad = extractFixtureNamesToLoad(fn)
  if(fixturesToLoad.every(name => Object.hasOwn(loadProps, name))){
    return fixturesObj
  }
  for(const name of fixturesToLoad) {
    if(Object.hasOwn(loadProps, name) || !Object.hasOwn(fixtureLoaderMap, name)){ continue }
    const start = performance.now()
    loadProps[name] = fixtureLoaderMap[name]().then(result => {
      console.log(`[unit-test] fixture "${name}" loaded in ${+(performance.now() - start).toFixed(1)}ms`)
      return result
    })
  }
  return buildFixtureProtoObject(loadProps)
}

function extractFixtureNamesToLoad(fn){
  const fnText = String(fn)
  const fistParenIndex = fnText.indexOf("(") + 1
  const functionParams = fnText.slice(fistParenIndex, fnText.indexOf(")", fistParenIndex))
  if(functionParams === "" || functionParams === "{}"){ return [] }
  const fixturesToLoad = functionParams.slice(1, -1).split(",").map(s => s.trim())
  return fixturesToLoad
}

function buildFixtureProtoObject(loadProps){
  const result = {
    [loadersProp]: loadProps
  }

  Object.entries(loadProps).forEach(([name, fixtureLoader]) => {
    fixtureLoader.then(({setup, teardown}) => {
      Object.defineProperty(result, name, {
        get(){
          this[cacheProp][name] ??= setup()
          typeof teardown === "function" && this[postTestCallback].add(teardown)
          return this[cacheProp][name]
        }
      })
    })
  })

  return result
}
