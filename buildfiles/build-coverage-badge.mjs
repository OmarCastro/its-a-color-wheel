import { makeBadge } from 'badge-maker'
import json from '../build/docs/coverage/coverage-summary.json' assert {type: "json"}

const format = {
  label: 'coverage',
  message: `${json.total.lines.pct}%`,
  color: badgeColor(json.total.lines.pct),
}

function badgeColor(pct){
  if(pct > 90){ return 'green' }
  if(pct > 70){ return 'yellowgreen' }
  if(pct > 50){ return 'yellow' }
  if(pct > 30){ return 'orange' }
  return 'red'
}

const svg = makeBadge(format)

const fs = await import('fs')

const projectPath = new URL('../',import.meta.url).pathname;
fs.writeFileSync(`${projectPath}/build/docs/coverage-badge.svg`, svg);

