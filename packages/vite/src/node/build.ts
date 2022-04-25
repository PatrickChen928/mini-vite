import * as path from 'path'
import * as fs from 'fs/promises'
import parse from 'node-html-parser'
import { rollup } from 'rollup'
import { getPlugins } from './plugins'
import type { ViteConfig } from './config'

const root = process.cwd()
const dist = path.resolve(root, './dist')

export async function startBuild(_config: ViteConfig) {
  const plugins = getPlugins(false)

  await fs.rm(dist, { recursive: true, force: true })
  await fs.mkdir(dist)

  const indexHtmlPath = path.resolve(root, './index.html')
  const disIndexHtmlPath = path.resolve(dist, './index.html')

  await processHtml(indexHtmlPath, disIndexHtmlPath, async (src: string) => {
    const bundle = await rollup({
      input: path.resolve(root, src),
      plugins
    })
    const { output } = await bundle.write({
      dir: dist,
      format: 'es',
      entryFileNames: 'assets/[name].[hash].js',
      chunkFileNames: 'assets/[name].[hash].js'
    })
    await bundle.close()
    return `/${output[0].fileName}`
  })
}

async function processHtml(
  htmlPath: string,
  distHtmlPath: string,
  cb: (path: string) => Promise<string>
) {
  const htmlContent = await fs.readFile(htmlPath, 'utf-8')
  const doc = parse(htmlContent)

  const scriptTag = doc.querySelector('script')
  if (scriptTag) {
    const src = scriptTag.getAttribute('src')
    if (src) {
      const newSrc = await cb(src)
      scriptTag.setAttribute('src', newSrc)
      scriptTag.removeAttribute('type')
    }
  }
  await fs.writeFile(distHtmlPath, doc.toString(), 'utf-8')
}
