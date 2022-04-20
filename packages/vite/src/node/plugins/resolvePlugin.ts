import * as path from 'path'
import * as fs from 'fs/promises'

const extensions = ['', '.ts', '.js']

async function fileIsExist(filename: string) {
  try {
    const stat = await fs.stat(filename)
    if (stat.isFile()) {
      return true
    }
  } catch (e) {}
  return false
}

export function resolvePlugin(root: string) {
  return {
    name: 'vite:resolve',
    async resolveId(id: string) {
      for (const ext of extensions) {
        const filename = path.resolve(root, `.${id}${ext}`)
        if (await fileIsExist(filename)) {
          return filename
        }
      }

      // TODO: isOptimizedDepUrl 替换预构建的url
      if (id.indexOf('.vite/deps') > -1) {
        return path.resolve(root, id.slice(1))
      }

      // vite使用的是alias， 这里简单处理直接判断
      console.log(id, 'resolveId')
      if (id === '/@vite/client') {
        return require.resolve('vite/dist/client/index.mjs')
      }
      return null
    },
    async load(id: string) {
      try {
        return await fs.readFile(id, 'utf-8')
      } catch (e) {
        console.log(id + ' not exist')
      }
      return ''
    }
  }
}
