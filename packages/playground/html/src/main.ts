import { getContent } from './content.ts'

function render() {
  const box = document.getElementById('app')
  box.innerHTML = getContent()
}

render()
