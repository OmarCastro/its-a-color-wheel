
# build doumentation
deno bundle --config deno.jsonc doc-src/doc.ts > docs/doc.js
cp doc-src/doc.css docs/doc.css
rm -r docs/src
cp -r src docs/src
