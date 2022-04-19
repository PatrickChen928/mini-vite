import getEtag from 'etag'
import type { IncomingMessage, ServerResponse } from 'http'
import * as path from 'path'
import * as fs from 'fs'

const alias: Record<string, string | undefined> = {
  js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json'
}

function send(
  req: IncomingMessage,
  res: ServerResponse,
  content: string | Buffer,
  type: string
) {
  const etag = getEtag(content, { weak: true })
  const cacheControl = 'max-age=36000'

  if (req.headers['if-none-match'] === etag) {
    console.log('cache get...')
    res.statusCode = 304
    res.end()
    return
  }

  res.setHeader('Content-Type', alias[type] || type)
  res.setHeader('Cache-Control', cacheControl)
  res.setHeader('Etag', etag)

  res.statusCode = 200
  res.end(content)
  return
}

function transforHtml(html: string) {
  const headRE = /([\t]*)<\/head>/i
  return html.replace(headRE, (match, p1) => {
    return (
      p1 + `\n<script type="module" src="/@vite/client"></script>\n` + match
    )
  })
}

export function indexHtmlMiddle(root: string) {
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
