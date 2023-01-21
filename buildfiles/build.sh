
# build doumentation
deno bundle --config tsconfig.json doc-src/doc.ts > docs/doc.js
cp doc-src/doc.css docs/doc.css
rm -r docs/src
cp -r src docs/src
