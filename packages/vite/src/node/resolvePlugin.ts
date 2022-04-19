import path from 'path'

export function resolvePlugin(config: any) {
  const root = config.root
  return {
    name: 'vite:resolve',
    async resolveId(id: string) {
      // TODO: isOptimizedDepUrl 替换预构建的url
      if (id.indexOf('.vite/deps') > -1) {
        return path.resolve(root, id.slice(1))
      }
    }
  }
}
