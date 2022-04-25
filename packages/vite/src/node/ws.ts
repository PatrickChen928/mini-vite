import { WebSocketServer as WebSocketServerRaw } from 'ws'

export type HMRPayload =
  | ConnectedPayload
  | UpdatePayload
  | FullReloadPayload
  | CustomPayload
  | ErrorPayload
  | PrunePayload

export interface ConnectedPayload {
  type: 'connected'
}

export interface UpdatePayload {
  type: 'update'
  updates: Update[]
}

export interface Update {
  type: 'js-update' | 'css-update'
  path: string
  acceptedPath: string
  timestamp: number
}

export interface PrunePayload {
  type: 'prune'
  paths: string[]
}

export interface FullReloadPayload {
  type: 'full-reload'
  path?: string
}

export interface CustomPayload {
  type: 'custom'
  event: string
  data?: any
}

export interface ErrorPayload {
  type: 'error'
  err: {
    [name: string]: any
    message: string
    stack: string
    id?: string
    frame?: string
    plugin?: string
    pluginCode?: string
    loc?: {
      file?: string
      line: number
      column: number
    }
  }
}

const wsServerEvents = [
  'connection',
  'error',
  'headers',
  'listening',
  'message'
]

const customListeners = new Map()

export function createWebSocketServer() {
  const wss = new WebSocketServerRaw({
    port: 24678
  })

  wss.on('connection', (socket) => {
    socket.on('message', (raw) => {
      if (!customListeners.size) return
      let parsed: any
      try {
        parsed = JSON.parse(String(raw))
      } catch {}
      if (!parsed || parsed.type !== 'custom' || !parsed.event) return
      const listeners = customListeners.get(parsed.event)
      if (!listeners?.size) return
      listeners.forEach((listener: any) => listener(parsed.data))
    })
    socket.send(JSON.stringify({ type: 'conected' }))
  })

  return {
    on(event: string, fn: () => void) {
      if (wsServerEvents.includes(event)) {
        wss.on(event, fn)
      } else {
        if (!customListeners.has(event)) {
          customListeners.set(event, new Set())
        }
        customListeners.get(event).add(fn)
      }
    },
    off(event: string, fn: () => void) {
      if (wsServerEvents.includes(event)) {
        wss.off(event, fn)
      } else {
        customListeners.get(event)?.delete(fn)
      }
    },
    send(...args: any[]) {
      let payload: HMRPayload
      if (typeof args[0] === 'string') {
        payload = {
          type: 'custom',
          event: args[0],
          data: args[1]
        }
      } else {
        payload = args[0]
      }
      const stringified = JSON.stringify(payload)
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(stringified)
        }
      })
    },
    close() {
      return new Promise<void>((resolve, reject) => {
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.terminate()
          }
        })
        wss.close((err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    }
  }
}
