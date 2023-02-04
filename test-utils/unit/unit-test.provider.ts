

export interface TestAPI {
    expect: any
    step(description: string, step: () => Promise<any>): any
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

        importStr = 'https://deno.land/x/expect/mod.ts';
        const { expect } = await importModule(importStr);
        setTestAdapter(({description, test}) => {
            globalThis.Deno.test(`${description}`, async (t) => {
                await test({
                    step: t.step,
                    expect
                });
            }) 
            
        })
        return
    }
    if (globalThis.window == undefined) {

        // init unit tests for Playwright


        importStr = '@playwright/test';
        const { test, expect } = await importModule(importStr);
    
        setTestAdapter(({description, test: t}) => {

            test(description, async () => {
                await t({
                    step: test.step,
                    expect
                });
            }) 
        })
    
    } else {
        
        // init unit tests to be run in browser

        const { expect } = await import('expect');

        
        setTestAdapter(({description, test: t}) => {
            console.log("-"+description)

            return t({

                step: async (description, test) => {
                    console.log("--"+description)
                    await test()
                },
                expect
            });
        })
    }
}

await fn()
