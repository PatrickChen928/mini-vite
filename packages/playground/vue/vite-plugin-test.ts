export default function test() {
  return {
    name: 'vite:test',
    resolveId(source: string, id) {
      console.log(source, id, 'test-resolveId')
      return null
    },
    load(id: string) {
      if (id === 'virtual-module') {
        return 'export default "This is virtual!"' // source code for "virtual-module"
      }
      console.log(id, 'test-load')
      return null // other ids
    }
  }
}
