import { useRef, useCallback } from 'react'
import { useGlobalMetronomeStore } from '../../stores/useGlobalMetronomeStore'
import {
  startGlobalMetronome,
  stopGlobalMetronome,
  updateGlobalMetronomeBpm,
  updateGlobalMetronomeVolume,
} from '../../services/globalMetronome'

const TIME_SIGS: [number, number][] = [[2, 4], [3, 4], [4, 4], [5, 4], [6, 8], [7, 8]]

interface Props { open: boolean; onClose: () => void }

export default function GlobalMetronomePopup({ open, onClose }: Props) {
  const store = useGlobalMetronomeStore()
  const tapTimesRef = useRef<number[]>([])
  const panelRef = useRef<HTMLDivElement>(null)

  const toggle = useCallback(() => {
    if (store.isPlaying) {
      stopGlobalMetronome()
      store.setPlaying(false)
    } else {
      startGlobalMetronome(store.bpm, store.beatsPerMeasure, store.volume, store.accentFirst, (beat) => store.setCurrentBeat(beat))
      store.setPlaying(true)
    }
  }, [store.bpm, store.beatsPerMeasure, store.volume, store.accentFirst, store.isPlaying])

  function handleBpm(v: number) { store.setBpm(v); if (store.isPlaying) updateGlobalMetronomeBpm(v) }
  function handleVolume(v: number) { store.setVolume(v); updateGlobalMetronomeVolume(v) }

  function handleTimeSig(beats: number, value: number) {
    const wasPlaying = store.isPlaying
    if (wasPlaying) { stopGlobalMetronome(); store.setPlaying(false) }
    store.setTimeSignature(beats, value)
    if (wasPlaying) setTimeout(() => { startGlobalMetronome(store.bpm, beats, store.volume, store.accentFirst, (beat) => store.setCurrentBeat(beat)); store.setPlaying(true) }, 50)
  }

  function handleTap() {
    const now = Date.now(), taps = tapTimesRef.current
    taps.push(now)
    while (taps.length > 6) taps.shift()
    if (taps.length >= 2) {
      const intervals: number[] = []
      for (let i = 1; i < taps.length; i++) intervals.push(taps[i] - taps[i - 1])
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const bpm = Math.round(60000 / avg)
      if (bpm >= 30 && bpm <= 300) handleBpm(bpm)
    }
    setTimeout(() => { if (taps.length && Date.now() - taps[taps.length - 1] > 2000) taps.length = 0 }, 2100)
  }

  if (!open) return null

  const n = store.beatsPerMeasure
  const beats = Array.from({ length: n }, (_, i) => i)
  const R = 125
  const playing = store.isPlaying
  const cur = store.currentBeat

  // Beat angle helper: beat i → angle in degrees (0 = top)
  function beatDeg(i: number) { return (i / n) * 360 }

  // SVG arc from startDeg to endDeg (clockwise, 0 = top/12 o'clock)
  function arcPath(startDeg: number, endDeg: number, r: number) {
    const toRad = (d: number) => (d - 90) * Math.PI / 180
    const x1 = Math.cos(toRad(startDeg)) * r, y1 = Math.sin(toRad(startDeg)) * r
    const x2 = Math.cos(toRad(endDeg)) * r, y2 = Math.sin(toRad(endDeg)) * r
    const sweep = endDeg - startDeg
    const large = sweep > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  // Progress arc: from beat 0 to the current beat's position
  // When cur=0 → highlight just the segment leading to beat 0 (full circle flash briefly)
  // When cur=1 → arc from beat 0 to beat 1
  // etc.
  const arcEnd = playing && cur >= 0 ? beatDeg(cur) : 0
  // For beat 0, show a tiny arc so the first beat still gets a visual
  const showArc = playing && cur >= 0
  const arcStartDeg = 0
  // If cur is 0, draw nearly nothing (just the dot glows). Otherwise draw from 0 to current beat.
  const arcEndDeg = cur === 0 ? 0.1 : arcEnd

  return (
    <div
      className="fixed z-[100]"
      style={{ top: 0, left: 0, width: '100vw', height: '100vh' }}
      onClick={(e) => { if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose() }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div className="w-full h-full flex items-center justify-center">
        <div ref={panelRef} className="relative" style={{ width: 380, height: 460 }}>

          {/* ═══ Glass shell ═══ */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: 44,
              background: 'linear-gradient(150deg, rgba(16,19,30,0.96) 0%, rgba(8,10,16,0.98) 100%)',
              border: '1px solid rgba(255,255,255,0.04)',
              boxShadow: `0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.02) inset${playing ? ', 0 0 120px -20px rgba(245,158,11,0.07)' : ''}`,
            }}
          />

          {/* ═══ SVG ring + beats + pendulum ═══ */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 24, width: 320, height: 280 }}>
            <svg viewBox="-160 -140 320 280" className="w-full h-full">

              {/* Dim background ring */}
              <circle cx="0" cy="0" r={R} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />

              {/* Progress arc — from beat 0 to current beat */}
              {showArc && cur > 0 && (
                <path
                  d={arcPath(arcStartDeg, arcEndDeg, R)}
                  fill="none"
                  stroke="url(#metArcGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Full ring flash on beat 0 (last beat just played = full measure) */}
              {showArc && cur === 0 && (
                <circle cx="0" cy="0" r={R} fill="none" stroke="rgba(245,158,11,0.12)" strokeWidth="3" />
              )}

              {/* Individual beat-to-beat segments that light up */}
              {playing && cur > 0 && beats.slice(0, cur).map(i => {
                const segStart = beatDeg(i)
                const segEnd = beatDeg(i + 1)
                return (
                  <path
                    key={`seg-${i}`}
                    d={arcPath(segStart, segEnd, R)}
                    fill="none"
                    stroke="rgba(245,158,11,0.08)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                )
              })}

              <defs>
                <linearGradient id="metArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              {/* Beat dots */}
              {beats.map(i => {
                const a = (i / n) * Math.PI * 2 - Math.PI / 2
                const cx = Math.cos(a) * R
                const cy = Math.sin(a) * R
                const isActive = playing && cur === i
                const isPlayed = playing && cur > i // already played in this measure
                const isAccent = i === 0 && store.accentFirst

                return (
                  <g key={i}>
                    {/* Soft glow behind active dot */}
                    {isActive && (
                      <circle cx={cx} cy={cy} r={18}
                        fill={isAccent ? 'rgba(245,158,11,0.1)' : 'rgba(148,163,184,0.06)'}
                      />
                    )}
                    {/* Dot */}
                    <circle cx={cx} cy={cy}
                      r={isActive ? 7 : 5.5}
                      fill={
                        isActive
                          ? isAccent ? '#f59e0b' : '#94a3b8'
                          : isPlayed
                            ? isAccent ? 'rgba(245,158,11,0.35)' : 'rgba(148,163,184,0.2)'
                            : isAccent ? 'rgba(245,158,11,0.12)' : 'rgba(148,163,184,0.06)'
                      }
                      style={{ transition: 'fill 0.06s, r 0.06s' }}
                    />
                    {/* Beat number */}
                    <text x={cx} y={cy + 20} textAnchor="middle"
                      fill={isActive ? (isAccent ? '#f59e0b' : '#94a3b8') : isPlayed ? '#374151' : '#1e2433'}
                      fontSize="9" fontFamily="monospace"
                    >
                      {i + 1}
                    </text>
                  </g>
                )
              })}

              {/* Pendulum hand */}
              {playing && cur >= 0 && (() => {
                const a = (cur / n) * Math.PI * 2 - Math.PI / 2
                const lx = Math.cos(a) * (R - 26)
                const ly = Math.sin(a) * (R - 26)
                return (
                  <line x1="0" y1="0" x2={lx} y2={ly}
                    stroke="rgba(245,158,11,0.12)" strokeWidth="1.5" strokeLinecap="round"
                    style={{ transition: 'x2 0.08s, y2 0.08s' }}
                  />
                )
              })()}

              {/* Center pivot */}
              <circle cx="0" cy="0" r="3.5"
                fill={playing ? '#f59e0b' : 'rgba(255,255,255,0.05)'}
                style={{ transition: 'fill 0.2s' }}
              />
            </svg>

            {/* BPM overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <button onClick={handleTap} className="pointer-events-auto cursor-pointer select-none group" title="Tap to set tempo">
                <div className="text-5xl font-black tabular-nums text-white/90 group-active:text-amber-400 transition-colors leading-none" style={{ letterSpacing: '-2px' }}>
                  {store.bpm}
                </div>
              </button>
              <div className="text-[11px] text-[#3d4d5d] font-mono mt-1">{n}/{store.beatValue}</div>
              <div className="text-[8px] text-[#252d3a] uppercase tracking-[0.2em] mt-1.5">tap</div>
            </div>
          </div>

          {/* ═══ Controls ═══ */}
          <div className="absolute bottom-0 left-0 right-0 px-7 pb-6 space-y-3" style={{ zIndex: 5 }}>

            {/* BPM slider */}
            <div className="flex items-center gap-3">
              <button onClick={() => handleBpm(store.bpm - 1)} className="w-7 h-7 rounded-full bg-white/[0.03] border border-white/[0.05] text-[#4b5563] hover:text-white flex items-center justify-center cursor-pointer text-xs transition-colors">-</button>
              <input type="range" min={30} max={300} value={store.bpm}
                onChange={e => handleBpm(Number(e.target.value))}
                className="flex-1 accent-amber-500 h-[3px] cursor-pointer"
              />
              <button onClick={() => handleBpm(store.bpm + 1)} className="w-7 h-7 rounded-full bg-white/[0.03] border border-white/[0.05] text-[#4b5563] hover:text-white flex items-center justify-center cursor-pointer text-xs transition-colors">+</button>
            </div>

            {/* Time sig + Accent */}
            <div className="flex items-center gap-1.5 justify-center">
              {TIME_SIGS.map(([b, v]) => (
                <button
                  key={`${b}/${v}`}
                  onClick={() => handleTimeSig(b, v)}
                  className={`text-[10px] px-2 py-1 rounded-lg border font-mono cursor-pointer transition-colors ${
                    store.beatsPerMeasure === b && store.beatValue === v
                      ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                      : 'border-white/[0.03] text-[#374151] hover:text-[#6b7280]'
                  }`}
                >
                  {b}/{v}
                </button>
              ))}
              <div className="w-2" />
              <button
                onClick={() => store.setAccentFirst(!store.accentFirst)}
                className={`text-[9px] px-2 py-1 rounded-lg border cursor-pointer transition-colors ${
                  store.accentFirst ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' : 'border-white/[0.03] text-[#374151]'
                }`}
              >
                ACC
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2.5">
              <svg className="w-3 h-3 text-[#2d3748] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <input type="range" min={0} max={1} step={0.05} value={store.volume}
                onChange={e => handleVolume(Number(e.target.value))}
                className="flex-1 accent-amber-500 h-[2px] cursor-pointer"
              />
              <span className="text-[9px] text-[#374151] font-mono w-5 text-right tabular-nums">{Math.round(store.volume * 100)}</span>
            </div>

            {/* Play/Stop */}
            <button
              onClick={toggle}
              className="w-full cursor-pointer transition-all"
              style={{
                padding: '12px 0',
                borderRadius: 22,
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: '0.5px',
                background: playing
                  ? 'rgba(255,255,255,0.03)'
                  : 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                border: playing ? '1px solid rgba(255,255,255,0.06)' : 'none',
                color: playing ? '#6b7280' : '#fff',
                boxShadow: playing ? 'none' : '0 6px 28px -6px rgba(245,158,11,0.4)',
              }}
            >
              {playing ? '■  Stop' : '▶  Start'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
