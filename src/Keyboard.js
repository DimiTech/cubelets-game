const KEYBOARD_KEYS = {
  w: 87,
  a: 65,
  s: 83,
  d: 68,

  up: 38,
  left: 37,
  down: 40,
  right: 39,

  k: 75,
  h: 72,
  j: 74,
  l: 76,
}

export function setupEventListeners(player) {
  document.addEventListener('keydown', e => {
    switch (e.keyCode) {
      case KEYBOARD_KEYS.w:
      case KEYBOARD_KEYS.up:
      case KEYBOARD_KEYS.k:
        player.moving.up = true
        break
      case KEYBOARD_KEYS.a:
      case KEYBOARD_KEYS.left:
      case KEYBOARD_KEYS.h:
        player.moving.left = true
        break
      case KEYBOARD_KEYS.s:
      case KEYBOARD_KEYS.down:
      case KEYBOARD_KEYS.j:
        player.moving.down = true
        break
      case KEYBOARD_KEYS.d:
      case KEYBOARD_KEYS.right:
      case KEYBOARD_KEYS.l:
        player.moving.right = true
        break
      default:
        break
    }
  })
  document.addEventListener('keyup', e => {
    switch (e.keyCode) {
      case KEYBOARD_KEYS.w:
      case KEYBOARD_KEYS.up:
      case KEYBOARD_KEYS.k:
        player.moving.up = false
        break
      case KEYBOARD_KEYS.a:
      case KEYBOARD_KEYS.left:
      case KEYBOARD_KEYS.h:
        player.moving.left = false
        break
      case KEYBOARD_KEYS.s:
      case KEYBOARD_KEYS.down:
      case KEYBOARD_KEYS.j:
        player.moving.down = false
        break
      case KEYBOARD_KEYS.d:
      case KEYBOARD_KEYS.right:
      case KEYBOARD_KEYS.l:
        player.moving.right = false
        break
      default:
        break
    }
  })
}
