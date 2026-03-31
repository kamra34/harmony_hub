/**
 * Mobile AudioContext unlock utility.
 *
 * iOS WebKit (used by ALL iOS browsers including Chrome) requires:
 * 1. AudioContext.resume() called during a user gesture
 * 2. A buffer source .start() called during a user gesture
 *
 * This module plays a silent buffer immediately when an AudioContext is
 * registered, so it works even if registration happens inside a gesture handler.
 */

/**
 * Unlock a single AudioContext by resuming it and playing a silent buffer.
 * Call this during a user gesture (click/touchstart/touchend handler).
 */
export function unlockAudioContext(ctx: AudioContext): void {
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  // iOS requires playing a real buffer source to fully unlock
  try {
    const buf = ctx.createBuffer(1, 1, 22050)
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.connect(ctx.destination)
    src.start(0)
  } catch {}
}

/**
 * Register and immediately unlock an AudioContext.
 * Designed to be called from ctx() factory functions during user gestures.
 */
export function registerAudioContext(ctx: AudioContext): void {
  unlockAudioContext(ctx)
}
