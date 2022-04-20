import { getContent } from './content'
import './index.css'

function render() {
  const box = document.getElementById('app')
  box.innerHTML = getContent()
}

render()
