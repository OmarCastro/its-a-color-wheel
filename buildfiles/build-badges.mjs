import { makeBadge } from 'badge-maker'
import { readFile, writeFile } from 'node:fs/promises'

const projectPath = new URL('../',import.meta.url).pathname;

function badgeColor(pct){
  if(pct > 80){ return '#007700' }
  if(pct > 60){ return '#777700' }
  if(pct > 40){ return '#883300' }
  if(pct > 20){ return '#aa0000' }
  return 'red'
}

async function makeBadgeForCoverages(path){
  const json = await readFile(`${path}/coverage-summary.json`).then(str => JSON.parse(str))
  const svg = makeBadge({
    label: 'coverage',
    message: `${json.total.lines.pct}%`,
    color: badgeColor(json.total.lines.pct),
    style: 'for-the-badge',
  })
  
  await writeFile(`${path}/coverage-badge.svg`, svg);
}

async function makeBadgeForTestResult(path){
  const json = await readFile(`${path}/test-results.json`).then(str => JSON.parse(str))
  const tests = (json?.suites ?? []).flatMap(suite => suite.specs)
  const passedTests = tests.filter(test => test.ok)
  const testAmount = tests.length
  const passedAmount = passedTests.length
  const passed = passedAmount == testAmount
  const svg = makeBadge({
    label: 'tests',
    message: `${passedAmount} / ${testAmount}`,
    color: passed ? '#007700' : '#aa0000',
    style: 'for-the-badge',
  })
  
  await writeFile(`${path}/test-results-badge.svg`, svg);
}

await Promise.allSettled([
  makeBadgeForCoverages(`${projectPath}/coverage/unit`),
  makeBadgeForCoverages(`${projectPath}/coverage/ui`),
  makeBadgeForCoverages(`${projectPath}/coverage/final`),
  makeBadgeForTestResult(`${projectPath}/test-results`)
])

