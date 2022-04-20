import * as path from 'path'
import * as fs from 'fs/promises'

function transformCss(id: string, css: string) {
  return `
    import { updateStyle as __vite__updateStyle } from '/@vite/client'
    const __vite__id = ${JSON.stringify(id)}
    const __vite__css = ${JSON.stringify(css)}
    __vite__updateStyle(__vite__id, __vite__css)
  `
}

export function cssPlugin(root: string) {
  return {
    name: 'vite:css',
    async resolveId(id: string) {
      // 暂时只支持css
      if (/\.css$/.test(id)) {
        return path.join(root, id)
      }
      return null
    },
    async load(id: string) {
      try {
        if (/\.css$/.test(id)) {
          const css = await fs.readFile(id, 'utf-8')
          return transformCss(id, css)
        }
      } catch (e) {
        console.log(id + ' not exist')
      }
      return ''
    }
  }
}
