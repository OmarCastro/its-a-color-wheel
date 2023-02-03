#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR"/..

# clean
rm -rf build


# build dist
mkdir -p build/dist

npx esbuild src/color-wheel.element.js --bundle --sourcemap --outfile=build/dist/color-wheel.element.js --format=esm --target=es2020 --loader:.element.html=text --loader:.element.css=text
npx esbuild src/color-wheel.element.js --bundle --minify --sourcemap --outfile=build/dist/color-wheel.element.min.js --format=esm --target=es2020 --loader:.element.html=text --loader:.element.css=text


# build doumentation
mkdir -p build/docs

npx esbuild docs/doc.ts --bundle --minify --sourcemap --outfile=build/docs/doc.min.js --format=esm --target=es2020
npx esbuild docs/doc.css --bundle --minify --sourcemap --outfile=build/docs/doc.css
cp build/dist/* build/docs

# build test-page
node buildfiles/build-html.mjs test-page.html

# run tests
npx c8 -c '.c8rc' --reporter=json-summary --reporter=lcov playwright test
node buildfiles/build-coverage-badge.mjs

# build html
node buildfiles/build-html.mjs index.html
