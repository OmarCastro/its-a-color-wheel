
import { test as base } from '@playwright/test'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
        
await mkdir("coverage/ui/tmp", {recursive: true})

        
export const test = base.extend({
    page: async ({ browserName, page }, use) => {
        if(browserName !== 'chromium'){
            return await use(page);
        }

        await page.coverage.startJSCoverage();
        await use(page);
        const jsCoverage = await page.coverage.stopJSCoverage();

        const coverage = jsCoverage.map(entry => {
        const url = new URL(entry.url)
        const scriptPath = `file://${process.cwd()+url.pathname}`
        return {
            ...entry,
            url: scriptPath
        }
        });
                
        for (const entry of coverage) {
            const filetoWrite = join(process.cwd(),`coverage/ui/tmp/coverage-ui-${Date.now()}-${entry.scriptId}.json`)
            const fileContent = JSON.stringify({result: [entry]})
            await writeFile(filetoWrite, fileContent)
        }
    },
});

export { expect } from '@playwright/test';