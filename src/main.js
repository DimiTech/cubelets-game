const CONFIG = {
  CANVAS_WIDTH  : 480,
  CANVAS_HEIGHT : 320,
  SCALE : 2,
}
const canvas = document.getElementById('canvas')

canvas.width  = CONFIG.CANVAS_WIDTH
canvas.height = CONFIG.CANVAS_HEIGHT
canvas.style.width  = CONFIG.SCALE !== 1 ? (CONFIG.SCALE * CONFIG.CANVAS_WIDTH ) + 'px' : 'auto'
canvas.style.height = CONFIG.SCALE !== 1 ? (CONFIG.SCALE * CONFIG.CANVAS_HEIGHT) + 'px' : 'auto'

const context = canvas.getContext('2d')

// ----------------------------------------------------------------------------
// Player
// ----------------------------------------------------------------------------

const player = {
  x : 100,
  y : 100,
  width  : 10,
  height : 10,
  moving: {
    up    : false,
    right : false,
    down  : false,
    left  : false,
  },
  speed  : 0.1,
}

player.update = function(frameElapsedTime) {
  if (this.moving.up) {
    this.y -= Math.round(this.speed * frameElapsedTime)
  }
  if (this.moving.right) {
    this.x += Math.round(this.speed * frameElapsedTime)
  }
  if (this.moving.down) {
    this.y += Math.round(this.speed * frameElapsedTime)
  }
  if (this.moving.left) {
    this.x -= Math.round(this.speed * frameElapsedTime)
  }
}

player.render = function() {
  context.beginPath();
    context.rect(
      this.x - (this.width  / 2),
      this.y - (this.height / 2),
      this.width,
      this.height
    );
  context.fill();
}

// ----------------------------------------------------------------------------
// Game Loop
// ----------------------------------------------------------------------------

function update(frameElapsedTime) {
  player.update(frameElapsedTime)
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  player.render()
  drawFPS(context)
}

function gameLoopStep(frameElapsedTime) {
  update(frameElapsedTime)
  render()
}

let previousTimestamp
let frameElapsedTime

function gameLoop(timestamp) {
  if (previousTimestamp === undefined) {
    previousTimestamp = timestamp
  }
  frameElapsedTime = timestamp - previousTimestamp

  gameLoopStep(frameElapsedTime) // TODO: Don't pass down as argument, use a global variable instead ?
  calculateFrameRate(previousTimestamp, frameElapsedTime)

  previousTimestamp = timestamp
  window.requestAnimationFrame(gameLoop)
}
window.requestAnimationFrame(gameLoop)
