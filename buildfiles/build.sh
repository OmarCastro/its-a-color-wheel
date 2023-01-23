#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR"/..

# clean
rm -rf build

# build doumentation
mkdir -p build/docs
deno bundle --config deno.jsonc docs/doc.ts > build/docs/doc.js
cp docs/doc.css build/docs/doc.css
cp docs/index.html build/docs/index.html
cp -r src build/docs/src