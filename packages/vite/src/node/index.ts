import { cac } from 'cac'
import colors from 'picocolors'

const cli = cac()

cli
  .command('[root]', 'start dev server')
  .alias('dev')
  .alias('serve')
  .action(async () => {
    const { createServer } = await import('./server')
    const server = await createServer({
      mode: 'development'
    })

    const port = await server.listen()
    console.log()
    console.log(`>Local: ${colors.cyan(`http://localhost:${port}/`)}`)
    console.log()
  })

cli
  .command('build [root]', 'build for production')
  .alias('dev')
  .alias('serve')
  .action(async () => {
    const { startBuild } = await import('./build')
    await startBuild({
      mode: 'production'
    })
  })

cli.help()

cli.parse()
