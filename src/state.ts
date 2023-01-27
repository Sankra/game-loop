import { worldHeight, worldWidth } from './context'

export const entities: any[] = []
export const playerSize = 32
export const player = {
  rect: {
    x: (worldWidth - playerSize) / 2,
    y: (worldHeight - playerSize) / 2,
    width: playerSize,
    height: playerSize,
    color: 'red',
  },
}

export const powerUp = {
  circle: {
    x: 0,
    y: 0,
    r: playerSize / 2,
    color: 'yellow',
    power: 3
  }
}

export const gameState = {
  isRunning: true,
}

export const scoreBoard = {
  text: {
    x: 10,
    y: 32,
    text: 'Score: 0',
    color: 'white',
  },
  score: 0,
}
