const KEYBOARD_KEYS = {
  w: 87,
  a: 65,
  s: 83,
  d: 68,
}

document.addEventListener('keydown', e => {
  switch (e.keyCode) {
    case KEYBOARD_KEYS.w:
      player.moving.up = true
      break
    case KEYBOARD_KEYS.a:
      player.moving.left = true
      break
    case KEYBOARD_KEYS.s:
      player.moving.down = true
      break
    case KEYBOARD_KEYS.d:
      player.moving.right = true
      break
    default:
      break
  }
})
document.addEventListener('keyup', e => {
  switch (e.keyCode) {
    case KEYBOARD_KEYS.w:
      player.moving.up = false
      break
    case KEYBOARD_KEYS.a:
      player.moving.left = false
      break
    case KEYBOARD_KEYS.s:
      player.moving.down = false
      break
    case KEYBOARD_KEYS.d:
      player.moving.right = false
      break
    default:
      break
  }
})
