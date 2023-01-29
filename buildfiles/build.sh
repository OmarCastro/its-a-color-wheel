#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR"/..

# clean
rm -rf build

# build doumentation
mkdir -p build/docs
deno bundle --config deno.jsonc docs/doc.ts > build/docs/doc.js
npx esbuild src/color-wheel.element.js --bundle --outfile=build/docs/color-wheel.element.js \
    --format=esm --target=es2020 --loader:.element.html=text --loader:.element.css=text
npx esbuild src/color-wheel.element.js --bundle --minify --sourcemap --outfile=build/docs/color-wheel.element.min.js \
    --format=esm --target=es2020 --loader:.element.html=text --loader:.element.css=text
npx esbuild docs/doc.css --bundle --minify --sourcemap --outfile=build/docs/doc.css
cp docs/index.html build/docs/index.html
