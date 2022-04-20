import getEtag from 'etag'
import type { IncomingMessage } from 'connect'
import type { ServerResponse } from 'http'

const alias: Record<string, string | undefined> = {
  js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json'
}

export function send(
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
