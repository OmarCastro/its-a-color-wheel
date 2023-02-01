import { getTestAdapter, Test, TestAPI } from "./unit-test.provider.ts";

const testsToExecute = [] as Readonly<Test>[];
let adaptedtests = [] as any[];

export function test(description: string, test: (t: TestAPI) => any){
    const data = Object.freeze({description, test})
    testsToExecute.push(data)
    adaptedtests.push(getTestAdapter()(data))

}

export function getCurrentTests(){
    return testsToExecute.slice()
}


