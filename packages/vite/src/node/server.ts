import connect from 'connect'
import http from 'http'
import chokidar from 'chokidar'
import * as path from 'path'
import * as fs from 'fs'
import history from 'connect-history-api-fallback'
import sirv from 'sirv'
import { indexHtmlMiddle } from './indexHtmlMiddle'

function resolveConfig(inlineConfig = {}) {
  console.log(process.cwd())
  return {
    root: process.cwd(),
    watch: {} as any,
    ...inlineConfig
  }
}

export interface ViteDevServer {
  listen: () => any
  httpServer: http.Server
  close: () => any
}

export async function createServer(inlineConfig = {}): Promise<ViteDevServer> {
  const config = resolveConfig(inlineConfig)

  const root = config.root
  console.log(root)

  const middlewares = connect()

  const httpServer = http.createServer(middlewares)
  const { ignored = [], watchOptions = {} } = config.watch
  const watcher = chokidar.watch(path.resolve(root), {
    ignored: [
      '**/node_modules/**',
      '**/.git/**',
      ...(Array.isArray(ignored) ? ignored : [ignored])
    ],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    disableGlobbing: true,
    ...watchOptions
  })
  watcher.on('change', (file) => {
    console.log('change', file)
  })

  watcher.on('add', (file) => {
    console.log('add', file)
  })

  watcher.on('unlink', (file) => {
    console.log('unlink', file)
  })
  const server = {
    httpServer,
    close: async () => {
      await watcher.close()
      httpServer.close()
    },
    listen() {
      return startServer(server, 3000)
    }
  }
  const exitProcess = async () => {
    await server.close()
  }
  process.on('SIGTERM', exitProcess)

  middlewares.use(function (req, _res, next) {
    console.log(req.url)
    next()
  })

  // 处理静态资源
  middlewares.use(
    sirv(undefined, {
      dev: true,
      etag: true,
      extensions: [],
      setHeaders(res, pathname) {
        if (/\.[tj]sx?$/.test(pathname)) {
          res.setHeader('Content-Type', 'application/javascript')
        }
      }
    })
  )

  // 代理请求
  middlewares.use(
    history({
      rewrites: [
        {
          from: /\/$/,
          to({ parsedUrl }: any) {
            console.log(parsedUrl.pathname)
            const rewritten =
              decodeURIComponent(parsedUrl.pathname) + 'index.html'
            if (fs.existsSync(path.resolve(root, rewritten))) {
              return rewritten
            } else {
              return '/index.html'
            }
          }
        }
      ]
    }) as any
  )

  // 匹配html
  middlewares.use(indexHtmlMiddle(root))

  // 没有匹配到就返回404
  middlewares.use(function (_req, res) {
    res.statusCode = 404
    res.end('Page 404')
  })
  let isOptimized = false
  const listen = httpServer.listen.bind(httpServer)
  httpServer.listen = async function (port: number, ...args: any[]) {
    try {
      if (!isOptimized) {
        // TODO: 预构建优化
        isOptimized = true
      }
    } catch (e) {
      console.log(e)
    }
    return listen(port, ...args)
  } as any

  return server
}

function startServer(server: ViteDevServer, port: number) {
  const httpServer = server.httpServer
  return new Promise((resolve) => {
    httpServer.listen(port, () => {
      resolve(port)
    })
  })
}
