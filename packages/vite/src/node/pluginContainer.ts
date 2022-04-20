import type {
  Plugin,
  PartialResolvedId,
  LoadResult,
  TransformResult
} from 'rollup'
export interface PluginContainer {
  resolveId: (id: string) => Promise<PartialResolvedId | null>
  load: (id: string) => Promise<LoadResult | null>
  transform: (id: string) => Promise<TransformResult | null>
}

export function createPluginContainer(plugins: Plugin[]): PluginContainer {
  return {
    async resolveId(id: string) {
      for (const plugin of plugins) {
        if (plugin.resolveId) {
          // @ts-ignore
          const newId = await plugin.resolveId(id)
          if (newId) {
            id = typeof newId === 'string' ? newId : newId.id
            return {
              id
            }
          }
        }
      }
      return null
    },
    async load(id) {
      for (const plugin of plugins) {
        if (plugin.load) {
          // @ts-ignore
          const result = await plugin.load(id)
          if (result) {
            return result
          }
        }
      }
      return null
    },
    async transform(id) {
      for (const plugin of plugins) {
        if (plugin.transform) {
          // @ts-ignore
          const result = await plugin.transform(id)
          if (result) {
            const code = typeof result === 'string' ? result : result.code
            return { code }
          }
        }
      }
      return null
    }
  }
}
