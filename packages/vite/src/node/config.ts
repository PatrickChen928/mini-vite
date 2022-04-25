import * as path from 'path'
import * as fs from 'fs'
import { build } from 'esbuild'
import { getPlugins } from './plugins'
import type { Plugin } from 'rollup'

export interface ViteConfig {
  root?: string
  input?: string
  plugins?: Plugin[]
  mode?: 'development' | 'production'
  isProduction?: boolean
}

export async function resolveConfig(
  inlineConfig: ViteConfig
): Promise<ViteConfig> {
  const root = process.cwd()
  const userConfig = await loadConfigFromFile(root)
  const isProduction = inlineConfig.mode === 'production'
  inlineConfig = Object.assign(userConfig, inlineConfig)
  const resolved: ViteConfig = {
    root,
    isProduction,
    ...inlineConfig
  }

  resolved.plugins = [
    ...(inlineConfig.plugins || []),
    ...getPlugins(!isProduction, resolved)
  ]

  return resolved
}

const dynamicImport = new Function('file', 'return import(file)')

async function loadConfigFromFile(root: string) {
  const resolvedPath = path.resolve(root, 'vite.config.ts')
  if (!fs.existsSync(resolvedPath)) {
    return {}
  }
  const fileUrl = require('url').pathToFileURL(resolvedPath + '.mjs')
  const code = await bundleConfigFile(resolvedPath)
  fs.writeFileSync(resolvedPath + '.mjs', code)
  const userConfig = (await dynamicImport(fileUrl + '?t=' + Date.now())).default
  fs.unlinkSync(resolvedPath + '.mjs')
  return userConfig
}

async function bundleConfigFile(fileName: string) {
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [fileName],
    outfile: 'out.js',
    write: false,
    platform: 'node',
    bundle: true,
    format: 'esm'
  })

  const { text } = result.outputFiles[0]
  return text
}
