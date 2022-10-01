let lastFrameTime
let frameElapsedTime

const FPS_ARR = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
let FPS

function restart() {
  lastFrameTime = null
  for (let i = 0; i < FPS_ARR.length; ++i) {
    FPS_ARR[i] = 0
  }
}

function calculateFrameRate() {
  if (!lastFrameTime) {
    lastFrameTime = performance.now()
    FPS = 0
  } else {
    const now = performance.now()
    frameElapsedTime = (now - lastFrameTime)

    FPS_ARR.unshift(1000 / frameElapsedTime)
    FPS_ARR.pop()
    FPS = FPS_ARR.reduce((sum, current) => sum += current, 0) / FPS_ARR.length

    lastFrameTime = now
  }
}

function drawFPS(context) {
  context.beginPath()
    context.font = '10px Monospace'
    context.fillText(`FPS: ${FPS && FPS.toFixed(2) || 'unknown'}`, 10, CONFIG.CANVAS_HEIGHT - 10)
  context.stroke()
}
