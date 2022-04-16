document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('pre code').forEach((el) => {
        const html = el.innerHTML
        const lines = html.split("\n")
        const minSpaces = lines.filter(line => line.trim() !== "").reduce((acc, line) => Math.min(line.search(/\S|$/), acc), Infinity)
        el.innerHTML = lines.map(line => line.substring(minSpaces)).join("\n").trim()
      });
});

document.body.addEventListener("input", (event) => {
  const componentName = event.target.closest(".component-name-edit")
  if(componentName == null){ return }
  const newText = componentName.textContent
  document.body.querySelectorAll(".component-name-ref").forEach(ref => ref.textContent = newText)
})




const exampleCode =  (strings, ...expr) => {
  let statement = strings[0]

  for(let i = 0; i < expr.length; i++){
      statement += expr[i].replace(/</g, "&lt")
      .replaceAll("{{elementName}}", '<span class="component-name-ref">color-wheel</span>')
      .replaceAll("{{mobile:ui-mode}}", '<span contenteditable="true" class="ui-mode-ref">mobile</span>')
      statement += strings[i+1]
  }

  return statement
}

document.body.querySelectorAll("script.html-example").forEach(element => {
  element.outerHTML = exampleCode`<pre><code class="language-markup">${element.innerHTML}</code></pre>`
})

document.body.querySelectorAll("script.css-example").forEach(element => {
  element.outerHTML = exampleCode`<pre><code class="language-css">${element.innerHTML}</code></pre>`
})
            