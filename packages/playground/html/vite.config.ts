function testPlugin() {
  return {
    name: 'vite:test-plugin',
    resolveId() {
      console.log('test-plugin resolveId....')
      return null
    },
    async transform(code: string) {
      console.log('test-plugin transform....')
      return code
    }
  }
}

export default {
  mode: 'development',
  plugins: [testPlugin()]
}
