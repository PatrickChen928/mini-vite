import * as connect from 'connect'
import * as http from 'http'

const app = connect()

http.createServer(app).listen(3000, () => {
  console.log('listen on http://127.0.0.1:3000')
})

export function createServer() {
  const config = {
    root: process.cwd()
  }
}
