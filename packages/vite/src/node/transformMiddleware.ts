import type { NextHandleFunction } from 'connect'
import type { PluginContainer } from './pluginContainer'
import { send } from './send'

const IgnoredList = ['/', '/favicon.ico']

export function transformMiddleware(
  container: PluginContainer
): NextHandleFunction {
  async function transformRequest(
    url: string
  ): Promise<{ code: string; type: string } | null> {
    const result = await container.resolveId(url)
    if (!result) {
      return null
    }
    const code = (await container.load(result.id)) as string
    return {
      code: code,
      type: /\.(css|less|sass|scss)(&|\?)/.test(result.id) ? 'css' : 'js'
    }
  }
  return async (req, res, next) => {
    if (req.method !== 'GET' || IgnoredList.indexOf(req.url!) > -1) {
      next()
      return
    }
    const result = await transformRequest(req.url!)
    if (result) {
      send(req, res, result.code, result.type)
      return
    }
    next()
  }
}
