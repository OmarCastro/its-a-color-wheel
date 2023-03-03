#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR"/..

# clean
rm -rf build

# build dist & doumentation
mkdir -p build/dist build/docs

npx esbuild src/color-wheel.element.js --bundle --sourcemap --outfile=build/dist/color-wheel.element.js --format=esm --target=es2020 --loader:.element.html=text --loader:.element.css=text &
npx esbuild src/color-wheel.element.js --bundle --minify --sourcemap --outfile=build/dist/color-wheel.element.min.js --format=esm --target=es2020 --loader:.element.html=text --loader:.element.css=text &
npx esbuild docs/doc.ts --bundle --minify --sourcemap --outfile=build/docs/doc.min.js --format=esm --target=es2020 &
npx esbuild docs/doc.css --bundle --minify --sourcemap --outfile=build/docs/doc.css  &
wait

cp build/dist/* build/docs

# build test-page
node buildfiles/build-html.mjs test-page.html &

# run tests

rm -rf coverage
npx c8 -c '.c8rc' --report-dir coverage/unit --reporter json-summary --reporter json --reporter lcov playwright test

mkdir -p coverage/tmp
cp coverage/*/tmp/* coverage/tmp
mkdir -p coverage/final
mv coverage/tmp coverage/final/tmp

npx c8 --report-dir coverage/ui report -r lcov -r json-summary --include 'build/docs/color-wheel.element.min.js'
npx c8 --report-dir coverage/final report -r lcov -r json-summary --include 'src/*.ts' --include 'src/*.js' --include 'build/docs/color-wheel.element.min.js'

node buildfiles/build-coverage-badge.mjs
cp -R coverage build/docs/coverage
cp -R playwright-report build/docs/playwright-report
cp -R test-results build/docs/test-results

# build html
node buildfiles/build-html.mjs index.html
