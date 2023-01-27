import { createLoop } from './loops'
import './style.css'
import { setup } from './systems'

setup()

createLoop({
  targetFps: 120,
  targetUps: 120,
})()
