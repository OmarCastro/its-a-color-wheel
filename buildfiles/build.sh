
# build doumentation
deno bundle --config tsconfig.json doc-src/doc.ts > docs/doc.js
cp doc-src/doc.css docs/doc.css
cp src/* docs
