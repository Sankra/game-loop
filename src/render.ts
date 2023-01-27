import { context, worldHeight, worldWidth } from './context'
import { measureFps } from './diagnostics'
import { entities } from './state'

function drawRect(rect: Rect) {
  context.fillStyle = rect.color
  context.fillRect(rect.x, rect.y, rect.width, rect.height)
}

function drawText(text: TextObj) {
  context.fillStyle = text.color
  context.font = '24px Arial'
  context.fillText(text.text, text.x, text.y)
}


function drawCircle(circle: Circle) {
  let c = new Path2D(); 
  c.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);
  context.fillStyle = circle.color
  context.fill(c); 
}

let lastRender = 0

export function render() {
  const now = performance.now()
  const elapsed = now - lastRender
  lastRender = now
  const fps = measureFps(elapsed)

  context.clearRect(0, 0, worldWidth, worldHeight)

  for (const entity of entities) {
    if (entity.rect) {
      drawRect(entity.rect)
    }
    
    if (entity.text) {
      drawText(entity.text)
    }

    if (entity.circle) {
      drawCircle(entity.circle)
    }
  }
  drawText({
    x: 10,
    y: worldHeight - 20,
    text: `FPS: ${fps.toFixed(0)}`,
    color: 'white',
  })
}
