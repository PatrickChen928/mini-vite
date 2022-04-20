function transformCss(id: string, css: string) {
  return `
    import { updateStyle as __vite__updateStyle } from '/@vite/client'
    const __vite__id = ${JSON.stringify(id)}
    const __vite__css = ${JSON.stringify(css)}
    __vite__updateStyle(__vite__id, __vite__css)
  `
}

export function cssPlugin(_root: string) {
  return {
    name: 'vite:css',
    async transform(code: string, id: string) {
      if (/\.css$/.test(id)) {
        return transformCss(id, code)
      }
      return null
    }
  }
}
