import { canvas, context } from './Canvas.js'

const FPS_ARR = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let FPS

function calculateFrameRate(lastFrameTime, frameElapsedTime) {
  if (!lastFrameTime) {
    FPS = 0
  } else {
    FPS_ARR.unshift(1000 / frameElapsedTime)
    FPS_ARR.pop()
    FPS = FPS_ARR.reduce((sum, current) => (sum += current), 0) / FPS_ARR.length
  }
}

function drawFPS() {
  context.beginPath()
  context.fillStyle = 'white'
  context.font = '10px Monospace'
  context.fillText(`FPS: ${(FPS && FPS.toFixed(2)) || 'unknown'}`, 10, canvas.height - 10)
  context.stroke()
}

export { calculateFrameRate, drawFPS }
