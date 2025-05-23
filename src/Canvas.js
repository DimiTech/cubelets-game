import CONFIG from './Config.js'

import { isMobile } from './MobileUtilities.js'

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

if (isMobile()) {
  // Use full screen size
  const width = window.innerWidth
  const height = window.innerHeight

  canvas.width = width
  canvas.height = height

  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
} else {
  // Use fixed config size for desktop
  canvas.width = CONFIG.CANVAS_WIDTH
  canvas.height = CONFIG.CANVAS_HEIGHT

  canvas.style.width = CONFIG.CANVAS_WIDTH + 'px'
  canvas.style.height = CONFIG.CANVAS_HEIGHT + 'px'
}

export { canvas, context }
