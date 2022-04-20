import { getContent } from './content'

function render() {
  const box = document.getElementById('app')
  box.innerHTML = getContent()
}

render()
