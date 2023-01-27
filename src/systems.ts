import { worldHeight, worldWidth } from './context'
import { pressedKeys } from './input'
import { entities, gameState, player, powerUp, scoreBoard } from './state'
import { getRandomColor } from './utils'

export function setup() {
  entities.length = 0
  player.rect.x = (worldWidth - player.rect.width) / 2
  player.rect.y = (worldHeight - player.rect.height) / 2
  scoreBoard.score = 0
  entities.push(player)
  let [x, y] = getRandomPosition()
  powerUp.circle.x = x
  powerUp.circle.y = y
  entities.push(powerUp)
  entities.push(scoreBoard)
  pressedKeys.clear()
  gameState.isRunning = true
}

export function checkCollisions() {
  // Check if the player is colliding with any cubes
  for (const entity of entities) {
    if (entity.rect && entity !== player) {
      if (
        player.rect.x < entity.rect.x + entity.rect.width &&
        player.rect.x + player.rect.width > entity.rect.x &&
        player.rect.y < entity.rect.y + entity.rect.height &&
        player.rect.y + player.rect.height > entity.rect.y
      ) {
        // Collision detected!
        gameState.isRunning = false
        entities.push({
          text: {
            x: 50,
            y: worldHeight / 2,
            text: `Game over! Your score is ${Math.floor(
              scoreBoard.score
            )}. Press Space to restart.`,
            color: 'white',
          },
        })
      }
    } else if (entity.circle) {
      if (checkCollision(entity.circle, player.rect)) {
        scoreBoard.score += powerUp.circle.power * 100
        let [x, y] = getRandomPosition()
        powerUp.circle.x = x
        powerUp.circle.y = y
        player.rect.width = player.rect.width - powerUp.circle.power
        player.rect.height = player.rect.height - powerUp.circle.power
      }
    }
  }
}

function checkCollision(circle: Circle, rect: Rect) {
  // Closest point on rect to circle
  let closestX = clamp(circle.x, rect.x, rect.x + rect.width);
  let closestY = clamp(circle.y, rect.y, rect.y + rect.height);

  // Calculate distance between circle center and closest point
  let distanceX = circle.x - closestX;
  let distanceY = circle.y - closestY;
  let distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // Check if the distance is less than the circle's radius
  return distanceSquared < circle.r * circle.r;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(val, max));
}

export function incrementScore() {
  // Increment score while the player is alive
  scoreBoard.score += 1
  scoreBoard.text.text = `Score: ${Math.floor(scoreBoard.score)}`
}

export function moveCubes() {
  for (const entity of entities) {
    if (entity.velocity) {
      entity.rect.x += entity.velocity.x
      entity.rect.y += entity.velocity.y
    }
  }
}

let lastSpawn = 0

export function spawnCubes() {
  const now = performance.now()
  const timeSinceLastSpawn = now - lastSpawn
  if (timeSinceLastSpawn > 1000) {
    lastSpawn = now
    const cubeSize = 32
    // Make sure the cube doesn't spawn too close to the player
    let [x, y] = getRandomPosition()
    const cube = {
      velocity: {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
      },
      rect: {
        x,
        y,
        width: cubeSize,
        height: cubeSize,
        color: getRandomColor(),
      },
    }

    entities.push(cube)
  }
}

function getRandomPosition() {
  let x = Math.random() * worldWidth
  let y = Math.random() * worldHeight
  while (
    Math.abs(x - player.rect.x) < 100 &&
    Math.abs(y - player.rect.y) < 100
  ) {
    x = Math.random() * worldWidth
    y = Math.random() * worldHeight
  }
  return [x, y]
}

export function wrapEntities() {
  for (const entity of entities) {
    if (entity.rect) {
      if (entity.rect.x > worldWidth) {
        entity.rect.x = 0
      }
      if (entity.rect.x < 0) {
        entity.rect.x = worldWidth
      }
      if (entity.rect.y > worldHeight) {
        entity.rect.y = 0
      }
      if (entity.rect.y < 0) {
        entity.rect.y = worldHeight
      }
    }
  }
}

export function movePlayer() {
  const moveSpeed = 5
  if (pressedKeys.has('ArrowLeft') || pressedKeys.has('a')) {
    player.rect.x -= moveSpeed
  }
  if (pressedKeys.has('ArrowRight') || pressedKeys.has('d')) {
    player.rect.x += moveSpeed
  }
  if (pressedKeys.has('ArrowUp') || pressedKeys.has('w')) {
    player.rect.y -= moveSpeed
  }
  if (pressedKeys.has('ArrowDown') || pressedKeys.has('s')) {
    player.rect.y += moveSpeed
  }
}
