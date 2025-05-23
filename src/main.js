import { canvas, context } from './Canvas.js'

import { calculateFrameRate, drawFPS } from './FrameRate.js'
import { setupEventListeners } from './Keyboard.js'
import { setupTouchListeners } from './Touch.js'
import SFX from './SFX.js'

// ----------------------------------------------------------------------------
// Time
// ----------------------------------------------------------------------------

const TIME = {
  // Milliseconds
  previousTimestamp: undefined,
  frameElapsedTime: undefined,

  renderTimestamp() {
    context.beginPath()
    context.fillStyle = 'white'
    context.font = '12px Monospace'
    const seconds = Math.floor(this.previousTimestamp / 1000)
    context.fillText(this.formatTime(seconds), canvas.width - 70, 20)
    context.stroke()
  },

  formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':')
  },
}

// ----------------------------------------------------------------------------
// Player
// ----------------------------------------------------------------------------

const player = {
  x: canvas.width / 2,
  y: canvas.height - canvas.height / 8,
  width: 50,
  height: 10,
  moving: {
    up: false,
    right: false,
    down: false,
    left: false,
  },
  speed: 0.4,
}

player.update = function () {
  if (this.moving.up) {
    this.y -= Math.round(this.speed * TIME.frameElapsedTime)
  }
  if (this.moving.right) {
    this.x += Math.round(this.speed * TIME.frameElapsedTime)
  }
  if (this.moving.down) {
    this.y += Math.round(this.speed * TIME.frameElapsedTime)
  }
  if (this.moving.left) {
    this.x -= Math.round(this.speed * TIME.frameElapsedTime)
  }
}

player.render = function () {
  context.beginPath()
  context.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
  context.fillStyle = 'mediumspringgreen'
  context.shadowColor = 'mediumspringgreen'
  context.shadowBlur = 20
  context.fill()
}

// ----------------------------------------------------------------------------
// Cubelets
// ----------------------------------------------------------------------------

const CubeletOverlord = {
  cubelets: [],

  renderCubelets() {
    context.fillStyle = 'mediumspringgreen'
    context.shadowColor = 'mediumspringgreen'
    context.shadowBlur = 20

    for (let cubelet of this.cubelets) {
      context.beginPath()
      context.rect(
        cubelet.x - cubelet.width / 2,
        cubelet.y - cubelet.height / 2,
        cubelet.width,
        cubelet.height
      )
      context.fill()
    }

    context.shadowColor = null
    context.shadowBlur = 0
  },

  updateCubelets() {
    for (let cubelet of this.cubelets) {
      cubelet.y += Math.round(cubelet.speed * TIME.frameElapsedTime)
      cubelet.x += cubelet.xDrift * TIME.frameElapsedTime

      if (cubelet.collidesWithPlayer()) {
        Score.add()
        SFX.playBloop()
        this.removeCubelet(cubelet)
        return
      }

      if (cubelet.y > canvas.height) {
        this.removeCubelet(cubelet)
      }
    }
  },

  removeCubelet(cubelet) {
    this.cubelets.splice(
      this.cubelets.findIndex(c => c === cubelet),
      1
    )
  },
}

const CubeletFactory = {
  maxCubes: 10,

  cooldown: 0,

  spawn() {
    if (this.cooldown <= 0 && CubeletOverlord.cubelets.length < this.maxCubes) {
      CubeletOverlord.cubelets.push(new Cubelet())
      this.cooldown = Math.random() * 500
    }
    this.cooldown -= TIME.frameElapsedTime
  },
}

function Cubelet() {
  const sideLength = Math.random() * 5 + 6
  this.width = sideLength
  this.height = sideLength

  this.x = Math.random() * canvas.width
  this.y = -this.height

  this.speed = Math.random() * 0.2 + 0.2

  this.xDrift = Math.random() * 0.08 - 0.04

  this.collidesWithPlayer = function () {
    return (
      this.y + this.height / 2 > player.y - player.height / 2 && // Bottom of this > Top of player
      this.y - this.height / 2 < player.y + player.height / 2 && // Top of this < Bottom of player
      this.x + this.width / 2 > player.x - player.width / 2 && // Right of this > Left of player
      this.x - this.width / 2 < player.x + player.width / 2 // Left of this < Right of player
    )
  }
}

// ----------------------------------------------------------------------------
// Score
// ----------------------------------------------------------------------------

const Score = {
  count: 0,

  add() {
    ++this.count
  },

  render() {
    context.beginPath()
    context.fillStyle = 'mediumspringgreen'
    context.font = '14px Monospace'
    context.fillText(`Cubes Collected: ${this.count}`, 10, 20)
    context.stroke()
  },
}

// ----------------------------------------------------------------------------
// Event Listeners
// ----------------------------------------------------------------------------

setupEventListeners(player)
setupTouchListeners(canvas, player)

// ----------------------------------------------------------------------------
// Game State
// ----------------------------------------------------------------------------

const GameState = {
  MENU: 'menu',
  PLAYING: 'playing',
}

const GameStateManager = {
  currentState: null,

  changeState(newState) {
    // 🔥 Destroy current scene
    if (this.currentState === GameState.MENU) {
      MenuScene.destroy()
    } else if (this.currentState === GameState.PLAYING) {
      GameScene.destroy()
    }

    // 🎬 Switch to new state
    this.currentState = newState

    // 🚀 Create new scene
    if (this.currentState === GameState.MENU) {
      MenuScene.create()
    } else if (this.currentState === GameState.PLAYING) {
      GameScene.create()
    }
  },

  update() {
    if (this.currentState === GameState.MENU) {
      MenuScene.update()
    } else if (this.currentState === GameState.PLAYING) {
      GameScene.update()
    }
  },

  render(ctx) {
    if (this.currentState === GameState.MENU) {
      MenuScene.render(ctx)
    } else if (this.currentState === GameState.PLAYING) {
      GameScene.render(ctx)
    }
  },
}

const MenuScene = {
  _handleInput: null,
  _blinkTimer: 0,
  _visible: true,

  create() {
    this._handleInput = () => {
      SFX.playBloop()
      GameStateManager.changeState(GameState.PLAYING)
    }

    canvas.addEventListener('click', this._handleInput)
    canvas.addEventListener('touchstart', this._handleInput, { passive: false })

    this._blinkTimer = 0
    this._visible = true
  },

  destroy() {
    canvas.removeEventListener('click', this._handleInput)
    canvas.removeEventListener('touchstart', this._handleInput)
    this._handleInput = null
  },

  update() {
    this._blinkTimer += TIME.frameElapsedTime
    if (this._blinkTimer >= 500) {
      // toggle every 500 ms
      this._visible = !this._visible
      this._blinkTimer = 0
    }
  },

  render() {
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    if (this._visible) {
      const size = 60 // triangle height
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      context.fillStyle = 'mediumspringgreen'
      context.beginPath()
      context.moveTo(centerX - size / 2, centerY - size / 2) // left-top corner
      context.lineTo(centerX - size / 2, centerY + size / 2) // left-bottom corner
      context.lineTo(centerX + size / 2, centerY) // right-middle point
      context.closePath()
      context.fill()
    }
  },
}

const GameScene = {
  create() {
    // TODO: Implement
  },

  destroy() {
    // TODO: Implement
  },
  update() {
    player.update()
    CubeletFactory.spawn()
    CubeletOverlord.updateCubelets()
  },
  render() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'black'
    context.rect(0, 0, canvas.width, canvas.height)
    context.fill()
    player.render()
    CubeletOverlord.renderCubelets()
    Score.render()
    TIME.renderTimestamp()
    drawFPS()
  },
}

// ----------------------------------------------------------------------------
// Game Loop
// ----------------------------------------------------------------------------

function gameLoopStep() {
  GameStateManager.update()
  GameStateManager.render()
}

function gameLoop(timestamp) {
  if (TIME.previousTimestamp === undefined) {
    TIME.previousTimestamp = timestamp
  }
  TIME.frameElapsedTime = timestamp - TIME.previousTimestamp

  gameLoopStep(TIME.frameElapsedTime)
  calculateFrameRate(TIME.previousTimestamp, TIME.frameElapsedTime)

  TIME.previousTimestamp = timestamp
  window.requestAnimationFrame(gameLoop)
}

GameStateManager.changeState(GameState.MENU)

window.requestAnimationFrame(gameLoop)
