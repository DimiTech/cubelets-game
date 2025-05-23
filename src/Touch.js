export function setupTouchListeners(canvas, player) {
  const activeTouches = {
    left: false,
    right: false,
  }

  canvas.addEventListener(
    'touchstart',
    e => {
      e.preventDefault()
      updateTouches(e.touches)
      updatePlayerMovement()
    },
    { passive: false }
  )

  canvas.addEventListener(
    'touchend',
    e => {
      e.preventDefault()

      // Reset both flags and recalculate from remaining touches
      activeTouches.left = false
      activeTouches.right = false

      updateTouches(e.touches)

      updatePlayerMovement()
    },
    { passive: false }
  )

  function updatePlayerMovement() {
    player.moving.left = activeTouches.left && !activeTouches.right
    player.moving.right = activeTouches.right && !activeTouches.left
  }

  function updateTouches(touches) {
    for (let touch of touches) {
      if (touch.clientX < window.innerWidth / 2) {
        activeTouches.left = true
      } else {
        activeTouches.right = true
      }
    }
  }

  // Prevents unnecessary HTML document selection / zooming
  canvas.addEventListener(
    'touchmove',
    e => {
      e.preventDefault()
    },
    { passive: false }
  )
}
