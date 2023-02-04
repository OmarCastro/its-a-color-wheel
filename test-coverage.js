import { chromium } from 'playwright';
import {createServer} from 'http-server';
import { mkdir, writeFile, rm } from 'node:fs/promises';

const port= 8080;
let server = createServer( { root: "." } );
server.listen(port);
await rm("coverage/ui/tmp", {recursive: true, force: true})

await (async() => {
  const browser = await chromium.launch({headless: false});
  const page = await browser.newPage();
  await page.coverage.startJSCoverage();
  await page.goto('http://localhost:8080/build/docs');
  await new Promise(resolve => setTimeout(resolve, 1000))
  const jsCoverage = await page.coverage.stopJSCoverage();

  const coverage = jsCoverage.map(entry => {
    const url = new URL(entry.url)
    const scriptPath = `file://${process.cwd()+url.pathname}`
    return {
      ...entry,
      url: scriptPath
    }
  });

  const reportsPromises = [];
  await mkdir("coverage/ui/tmp", {recursive: true})

  const finalCoverage = {result: []}
  for (const entry of coverage) {
    finalCoverage.result.push(entry);
    reportsPromises.push(writeFile(`coverage/ui/tmp/coverage-ui-${Date.now()}-${entry.scriptId}.json`, JSON.stringify({result: [entry]})))
  }

  reportsPromises.push(writeFile(`coverage/ui/coverage-final.json`, JSON.stringify(finalCoverage)))
  await Promise.allSettled(reportsPromises);
  await browser.close();
})();

server.close()