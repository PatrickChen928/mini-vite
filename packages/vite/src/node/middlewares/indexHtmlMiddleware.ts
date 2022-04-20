import type { IncomingMessage, ServerResponse } from 'http'
import * as path from 'path'
import * as fs from 'fs'
import { send } from '../send'

function transforHtml(html: string) {
  const headRE = /([\t]*)<\/head>/i
  return html.replace(headRE, (match, p1) => {
    return (
      p1 + `\n<script type="module" src="/@vite/client"></script>\n` + match
    )
  })
}

export function indexHtmlMiddleware(root: string) {
  return async function (req: IncomingMessage, res: ServerResponse) {
    const url = req.url
    if (url?.endsWith('.html')) {
      const filename = path.join(root, url.slice(1))
      if (fs.existsSync(filename)) {
        let html = fs.readFileSync(filename, 'utf-8')
        html = transforHtml(html)
        send(req, res, html, 'html')
      }
    }
  }
}
