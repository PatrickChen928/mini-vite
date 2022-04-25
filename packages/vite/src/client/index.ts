const socket = new WebSocket('ws://localhost:24678/')

const sheetsMap = new Map()

socket.addEventListener('message', async ({ data }) => {
  handleMessage(JSON.parse(data))
})

async function fetchUpdate(update: any) {
  await import(update.file + '?t=' + update.timestamp)
}

function handleMessage(payload: any) {
  switch (payload.type) {
    case 'full-reload':
      location.reload()
      break
    case 'update':
      payload.updates.forEach((update: any) => {
        if (update.type === 'js-update') {
          fetchUpdate(update)
        } else {
          // TODO
        }
      })
      break
  }
}

export function updateStyle(id: string, css: string) {
  let style = sheetsMap.get(id)
  if (!style) {
    style = new CSSStyleSheet()
    style.replaceSync(css)
    // @ts-expect-error: using experimental API
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, style]
  } else {
    style.replaceSync(css)
  }
}
