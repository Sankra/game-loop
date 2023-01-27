import { handleInput } from './input'
import { render } from './render'
import { update } from './update'

export function createLoop({
  targetUps,
  targetFps,
}: {
  targetUps: number
  targetFps: number
}) {
  let lastRender = 0
  let lastUpdate = 0
  let accumulatedTime = 0
  const updateInterval = 1000 / targetUps
  const renderInterval = 1000 / targetFps
  const tick = (now = 0) => {
    const deltaUpdate = now - lastUpdate
    const deltaRender = now - lastRender
    accumulatedTime += deltaUpdate
    handleInput()
    while (accumulatedTime >= updateInterval) {
      lastUpdate = now
      update()
      accumulatedTime -= updateInterval
    }
    if (deltaRender > renderInterval) {
      render()
      lastRender = now - (deltaRender % renderInterval)
    }
    requestAnimationFrame(tick)
  }
  return tick
}
