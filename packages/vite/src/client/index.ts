export function add(num1: number, num2: number) {
  return num1 + num2
}

const sheetsMap = new Map()

export function updateStyle(id: string, css: string) {
  let style = sheetsMap.get(id)
  if (!style) {
    style = new CSSStyleSheet()
    style.replaceSync(css)
    // @ts-expect-error: using experimental API
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, style]
  } else {
    style.replaceSync(css)
  }
}
