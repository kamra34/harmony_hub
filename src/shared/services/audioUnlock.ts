/**
 * Mobile AudioContext unlock utility.
 *
 * iOS Safari and Android Chrome require AudioContext.resume() to be called
 * during a user gesture (touchstart/touchend/click). This module:
 * 1. Tracks all AudioContexts created across the app
 * 2. Resumes them all on first user interaction
 * 3. Plays a silent buffer to fully unlock iOS audio
 */

const contexts: Set<AudioContext> = new Set()

/** Register an AudioContext so it gets unlocked on user gesture */
export function registerAudioContext(ctx: AudioContext): void {
  contexts.add(ctx)
}

/** Call from a user gesture handler to unlock all registered AudioContexts */
export function unlockAudio(): void {
  for (const ctx of contexts) {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
      // iOS requires playing a silent buffer to fully unlock
      try {
        const buf = ctx.createBuffer(1, 1, 22050)
        const src = ctx.createBufferSource()
        src.buffer = buf
        src.connect(ctx.destination)
        src.start(0)
      } catch {}
    }
  }
}
