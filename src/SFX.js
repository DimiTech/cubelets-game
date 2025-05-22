function playBloop() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  const oscillator = audioCtx.createOscillator()
  oscillator.type = 'sine' // Sine wave
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime) // Frequency in Hz (A4)

  const gainNode = audioCtx.createGain()
  gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime) // Low volume

  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.start()
  oscillator.stop(audioCtx.currentTime + 0.05) // Play for 0.1 seconds
}

export default { playBloop }
