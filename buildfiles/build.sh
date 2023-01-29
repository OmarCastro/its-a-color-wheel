#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR"/..

# clean
rm -rf build

# build doumentation
mkdir -p build/docs

npx esbuild docs/doc.ts --bundle --minify --sourcemap --outfile=build/docs/doc.min.js --format=esm --target=es2020
npx esbuild src/color-wheel.element.js --bundle --outfile=build/docs/color-wheel.element.js \
    --format=esm --target=es2020 --loader:.element.html=text --loader:.element.css=text
npx esbuild src/color-wheel.element.js --bundle --minify --sourcemap --outfile=build/docs/color-wheel.element.min.js \
    --format=esm --target=es2020 --loader:.element.html=text --loader:.element.css=text
npx esbuild docs/doc.css --bundle --minify --sourcemap --outfile=build/docs/doc.css
node buildfiles/build-html.mjs