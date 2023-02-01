
export interface AssertDefinition {
    given: string
    should: string
    actual: any
    expected: any
}

export interface TestAPI {
    assert(assert:AssertDefinition): void | Promise<void>
}

export interface Test {
    description: string,
    test: (t: TestAPI) => any
}

type Adapter =  (test: Readonly<Test>) => any


let adapter: Adapter;

function setTestAdapter(newadapter: Adapter){
    adapter = newadapter
} 

export function getTestAdapter(){
    return adapter
} 
// thee 2 lines are to prevent esbuild to bundle the await imports
const importModule = (str: string) => import(str) 
let importStr: string;
const fn = async () => {
    if(globalThis.Deno != undefined){

        // init unit tests for deno

        importStr = 'https://deno.land/std@0.174.0/testing/asserts.ts';
        const { assertEquals } = await importModule(importStr);
        setTestAdapter(({description, test: t}) => {
            return t({
                assert: ({given, should, actual, expected}) => {
                    globalThis.Deno.test(`${description} : Given ${given}, should ${should}`, () => assertEquals(actual, expected)) 
                }
            });
        })
        return
    }
    if (globalThis.window == undefined) {

        // init unit tests for Playwright


        importStr = '@playwright/test';
        const { test, expect } = await importModule(importStr);
    
        setTestAdapter(({description, test: t}) => {
            return t({
                assert: ({given, should, actual, expected}) => {
                    test(`${description} : Given ${given}, should ${should}`, () => expect(actual).toStrictEqual(expected)) 
                }
            });
        })
    
    } else {
        
        // init unit tests to be run in browser
        
        setTestAdapter(({description, test: t}) => {
            return t({
                assert: ({given, should, actual, expected}) => {
                    console.log(`${description} : Given ${given}, should ${should}: %o, %o, TODO test`,actual, expected)
                }
            });
        })
    }
}

await fn()
