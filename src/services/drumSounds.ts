/**
 * Drum kit sound library using real acoustic samples (VCSL, CC0).
 * Samples are loaded once and cached as AudioBuffers for low-latency playback.
 */

import { DrumPad } from '../types/midi'
import { HitValue } from '../types/curriculum'

// ── AudioContext singleton ──────────────────────────────────────────────────

let _ctx: AudioContext | null = null
function ctx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext()
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

// ── Sample loader & cache ───────────────────────────────────────────────────

const SAMPLE_BASE = '/audio/drum-samples/'

const SAMPLE_FILES: Record<string, string> = {
  kick:         'kick.wav',
  snare:        'snare.wav',
  snareRim:     'snare-rim.wav',
  hihatClosed:  'hihat-closed.wav',
  hihatOpen:    'hihat-open.wav',
  hihatPedal:   'hihat-pedal.wav',
  crash:        'crash.wav',
  ride:         'ride.wav',
  rideBell:     'ride-bell.wav',
  tom1:         'tom1.wav',
  tom2:         'tom2.wav',
  floorTom:     'floor-tom.wav',
}

const _bufferCache: Map<string, AudioBuffer> = new Map()
let _loadingPromise: Promise<void> | null = null

async function loadSample(name: string, file: string): Promise<void> {
  try {
    const response = await fetch(SAMPLE_BASE + file)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const arrayBuf = await response.arrayBuffer()
    const audioBuffer = await ctx().decodeAudioData(arrayBuf)
    _bufferCache.set(name, audioBuffer)
  } catch (err) {
    console.warn(`Failed to load drum sample "${name}":`, err)
  }
}

/** Preload all samples. Safe to call multiple times. */
export async function loadDrumSamples(): Promise<void> {
  if (_loadingPromise) return _loadingPromise
  _loadingPromise = Promise.all(
    Object.entries(SAMPLE_FILES).map(([name, file]) => loadSample(name, file))
  ).then(() => {
    console.log(`Drum samples loaded: ${_bufferCache.size}/${Object.keys(SAMPLE_FILES).length}`)
  })
  return _loadingPromise
}

// ── Sample playback ─────────────────────────────────────────────────────────

function playSample(name: string, vol: number): void {
  const buffer = _bufferCache.get(name)
  if (!buffer) {
    // Trigger lazy load if not loaded yet
    loadDrumSamples()
    return
  }
  const c = ctx()
  const source = c.createBufferSource()
  source.buffer = buffer
  const gain = c.createGain()
  gain.gain.value = vol
  source.connect(gain)
  gain.connect(c.destination)
  source.start()
}

// ── Individual drum sound exports ───────────────────────────────────────────

export function playKickSound(vol = 0.7): void { playSample('kick', vol) }
export function playSnareSound(vol = 0.6): void { playSample('snare', vol) }
export function playHiHatClosedSound(vol = 0.35): void { playSample('hihatClosed', vol) }
export function playHiHatOpenSound(vol = 0.35): void { playSample('hihatOpen', vol) }
export function playHiHatPedalSound(vol = 0.15): void { playSample('hihatPedal', vol) }
export function playCrashSound(vol = 0.5): void { playSample('crash', vol) }
export function playRideSound(vol = 0.35): void { playSample('ride', vol) }
export function playTom1Sound(vol = 0.45): void { playSample('tom1', vol) }
export function playTom2Sound(vol = 0.45): void { playSample('tom2', vol) }
export function playFloorTomSound(vol = 0.5): void { playSample('floorTom', vol) }

// ── DrumPad → sound mapping ─────────────────────────────────────────────────

const PAD_SOUND: Record<string, (vol: number) => void> = {
  [DrumPad.Kick]: playKickSound,
  [DrumPad.Snare]: playSnareSound,
  [DrumPad.SnareRim]: (v) => playSample('snareRim', v),
  [DrumPad.HiHatClosed]: playHiHatClosedSound,
  [DrumPad.HiHatOpen]: playHiHatOpenSound,
  [DrumPad.HiHatPedal]: playHiHatPedalSound,
  [DrumPad.CrashCymbal]: playCrashSound,
  [DrumPad.RideCymbal]: playRideSound,
  [DrumPad.RideBell]: (v) => playSample('rideBell', v),
  [DrumPad.Tom1]: playTom1Sound,
  [DrumPad.Tom2]: playTom2Sound,
  [DrumPad.FloorTom]: playFloorTomSound,
}

/** Play the correct sound for a given DrumPad */
export function playPadSound(pad: DrumPad, hitValue: HitValue = 1): void {
  const fn = PAD_SOUND[pad]
  if (!fn) return
  const vol = hitValue === 2 ? 1.0 : hitValue === 3 ? 0.15 : 0.6
  fn(vol)
}

// ── Built-in metronome click (synced with pattern playback) ─────────────────

let _clickEnabled = false
let _clickVolume = 0.5

/** Enable/disable metronome click during pattern playback */
export function setClickEnabled(enabled: boolean): void { _clickEnabled = enabled }
export function getClickEnabled(): boolean { return _clickEnabled }

/** Set click volume (0-1) relative to drum sounds */
export function setClickVolume(vol: number): void { _clickVolume = Math.max(0, Math.min(1, vol)) }
export function getClickVolume(): number { return _clickVolume }

function playClick(accent: boolean): void {
  const c = ctx()
  const now = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain)
  gain.connect(c.destination)
  osc.type = 'triangle'
  osc.frequency.value = accent ? 1400 : 900
  const vol = _clickVolume * (accent ? 0.7 : 0.4)
  gain.gain.setValueAtTime(vol, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
  osc.start(now)
  osc.stop(now + 0.05)
}

// ── Pattern playback engine ─────────────────────────────────────────────────

let _playbackTimers: ReturnType<typeof setTimeout>[] = []
let _isPlaying = false
let _stepCallback: ((step: number) => void) | null = null

export function isPatternPlaying(): boolean { return _isPlaying }

export function stopPatternPlayback(): void {
  _isPlaying = false
  _playbackTimers.forEach(t => clearTimeout(t))
  _playbackTimers = []
  _stepCallback = null
}

/**
 * Play a PatternData with correct sounds at the given BPM.
 * Calls onStep(slotIndex) for each subdivision to drive visual highlighting.
 * Calls onFinish() when done.
 * If click is enabled, plays a synced metronome click on each beat.
 */
export function playPattern(
  pattern: import('../types/curriculum').PatternData,
  bpm: number,
  bars: number = 1,
  onStep?: (step: number) => void,
  onFinish?: () => void,
): void {
  // Ensure samples are loaded before playing
  loadDrumSamples()

  stopPatternPlayback()
  _isPlaying = true
  _stepCallback = onStep ?? null

  const { beats, subdivisions, tracks } = pattern
  const totalSlots = beats * subdivisions
  const msPerSlot = (60000 / bpm) / subdivisions
  const totalSteps = totalSlots * bars

  for (let step = 0; step < totalSteps; step++) {
    const delay = step * msPerSlot
    const slotIdx = step % totalSlots

    _playbackTimers.push(setTimeout(() => {
      if (!_isPlaying) return
      _stepCallback?.(slotIdx)

      // Metronome click on beat boundaries
      if (_clickEnabled && slotIdx % subdivisions === 0) {
        const beatIdx = slotIdx / subdivisions
        playClick(beatIdx === 0)
      }

      // Play all notes at this slot
      for (const [pad, values] of Object.entries(tracks) as [DrumPad, HitValue[]][]) {
        const hv = values[slotIdx]
        if (hv > 0) playPadSound(pad, hv)
      }
    }, delay))
  }

  // Finish callback
  _playbackTimers.push(setTimeout(() => {
    if (!_isPlaying) return
    _isPlaying = false
    _stepCallback = null
    onFinish?.()
  }, totalSteps * msPerSlot + 50))
}
