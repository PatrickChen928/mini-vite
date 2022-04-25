import { init, parse as parseImports } from 'es-module-lexer'
import type { ViteConfig } from '../config'

export function importAnalysisPlugin(config: ViteConfig) {
  return {
    name: 'vite:importAnalysis',
    async transform(source: string, importer: string) {
      await init
      try {
        const imports = parseImports(source)[0]
        console.log(imports, 'importsimportsimports')
        console.log(this, 'importsimportsimports')
      } catch (e) {}
    }
  }
}
