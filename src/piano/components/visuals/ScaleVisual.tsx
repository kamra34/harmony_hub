import { useState, useEffect } from 'react'
import { playPianoNote, preloadSamples } from '@piano/services/pianoSounds'

// ── Data ─────────────────────────────────────────────────────────────────────

interface ScaleDef {
  name: string
  notes: string[]
  fingers: { rh: number[]; lh: number[] }
  pattern: string      // W/H pattern
  keySignature: string
  description: string
}

const SCALES: ScaleDef[] = [
  {
    name: 'C Major', notes: ['C4','D4','E4','F4','G4','A4','B4','C5'],
    fingers: { rh: [1,2,3,1,2,3,4,5], lh: [5,4,3,2,1,3,2,1] },
    pattern: 'W-W-H-W-W-W-H', keySignature: 'No sharps/flats',
    description: 'The foundation of all scales. All white keys. Every other major scale is built by applying the same W-W-H-W-W-W-H pattern from a different starting note.',
  },
  {
    name: 'G Major', notes: ['G4','A4','B4','C5','D5','E5','F#5','G5'],
    fingers: { rh: [1,2,3,1,2,3,4,5], lh: [5,4,3,2,1,3,2,1] },
    pattern: 'W-W-H-W-W-W-H', keySignature: '1 sharp (F#)',
    description: 'One sharp: F#. The F must be sharped to maintain the major scale pattern. G major is the first key most students learn after C.',
  },
  {
    name: 'F Major', notes: ['F4','G4','A4','Bb4','C5','D5','E5','F5'],
    fingers: { rh: [1,2,3,4,1,2,3,4], lh: [5,4,3,2,1,3,2,1] },
    pattern: 'W-W-H-W-W-W-H', keySignature: '1 flat (Bb)',
    description: 'One flat: Bb. The B must be flatted to maintain the pattern. Note the different RH fingering — thumb crosses under to finger 4.',
  },
  {
    name: 'D Minor (natural)', notes: ['D4','E4','F4','G4','A4','Bb4','C5','D5'],
    fingers: { rh: [1,2,3,1,2,3,4,5], lh: [5,4,3,2,1,3,2,1] },
    pattern: 'W-H-W-W-H-W-W', keySignature: '1 flat (Bb)',
    description: 'The relative minor of F major — same key signature, different starting note. The natural minor pattern is W-H-W-W-H-W-W. Sounds darker, more emotional.',
  },
  {
    name: 'D Harmonic Minor', notes: ['D4','E4','F4','G4','A4','Bb4','C#5','D5'],
    fingers: { rh: [1,2,3,1,2,3,4,5], lh: [5,4,3,2,1,3,2,1] },
    pattern: 'W-H-W-W-H-A2-H', keySignature: '1 flat + raised 7th',
    description: 'Natural minor with a raised 7th note (C becomes C#). Creates an exotic, Middle Eastern sound due to the augmented 2nd interval between Bb and C#.',
  },
  {
    name: 'A Minor (natural)', notes: ['A4','B4','C5','D5','E5','F5','G5','A5'],
    fingers: { rh: [1,2,3,1,2,3,4,5], lh: [5,4,3,2,1,3,2,1] },
    pattern: 'W-H-W-W-H-W-W', keySignature: 'No sharps/flats',
    description: 'The relative minor of C major — all white keys, but starting on A. The simplest minor scale to play.',
  },
]

// ── Keyboard helpers ─────────────────────────────────────────────────────────

const WHITE_W = 28, WHITE_H = 90, BLACK_W = 18, BLACK_H = 56, GAP = 1
const WHITE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const BLACK_OFFSETS: Record<string, number> = { C: 0.65, D: 0.65, F: 0.65, G: 0.65, A: 0.65 }

interface KeyDef { note: string; x: number; isBlack: boolean }

function buildKeys(startOctave: number, octaves: number): KeyDef[] {
  const keys: KeyDef[] = []
  let x = 0
  for (let oct = startOctave; oct < startOctave + octaves; oct++) {
    for (const wn of WHITE_NOTES) {
      keys.push({ note: `${wn}${oct}`, x, isBlack: false })
      if (BLACK_OFFSETS[wn] !== undefined) {
        keys.push({ note: `${wn}#${oct}`, x: x + WHITE_W * BLACK_OFFSETS[wn], isBlack: true })
      }
      x += WHITE_W + GAP
    }
  }
  keys.push({ note: `C${startOctave + octaves}`, x, isBlack: false })
  return keys
}

function normalise(n: string): string { return n.replace('b', 'b').replace('#', '#') }

// ── Component ────────────────────────────────────────────────────────────────

export default function ScaleVisual() {
  const [selected, setSelected] = useState<ScaleDef>(SCALES[0])
  const [playingIdx, setPlayingIdx] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hand, setHand] = useState<'rh' | 'lh'>('rh')

  const accent = '#a78bfa'

  useEffect(() => {
    const allNotes = SCALES.flatMap((s) => s.notes)
    preloadSamples([...new Set(allNotes)])
  }, [])

  function handlePlayScale() {
    if (isPlaying) return
    setIsPlaying(true)
    setPlayingIdx(0)
    const bpm = 100
    const beatMs = (60 / bpm) * 1000

    selected.notes.forEach((note, i) => {
      setTimeout(() => {
        playPianoNote(note, 0.6)
        setPlayingIdx(i)
      }, i * beatMs)
    })

    setTimeout(() => {
      setIsPlaying(false)
      setPlayingIdx(-1)
    }, selected.notes.length * beatMs)
  }

  // Determine keyboard range
  const noteOctaves = selected.notes.map((n) => parseInt(n.replace(/[^0-9]/g, '')))
  const minOct = Math.min(...noteOctaves)
  const maxOct = Math.max(...noteOctaves)
  const keys = buildKeys(minOct, maxOct - minOct + 1)
  const whites = keys.filter((k) => !k.isBlack)
  const blacks = keys.filter((k) => k.isBlack)
  const totalW = whites.length * (WHITE_W + GAP) - GAP
  const svgW = totalW + 4
  const svgH = WHITE_H + 24

  const scaleSet = new Set(selected.notes.map(normalise))
  const activeNote = playingIdx >= 0 ? normalise(selected.notes[playingIdx]) : null
  const fingers = hand === 'rh' ? selected.fingers.rh : selected.fingers.lh

  return (
    <div className="my-6 rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: '#0d1117' }}>
      <div className="px-5 pt-4 pb-2 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: accent }}>Scales</span>
        <div className="flex gap-1">
          {(['rh', 'lh'] as const).map((h) => (
            <button key={h} onClick={() => setHand(h)}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              style={{ background: hand === h ? `${accent}20` : 'transparent', color: hand === h ? accent : '#6b7280', border: hand === h ? `1px solid ${accent}40` : '1px solid transparent' }}>
              {h === 'rh' ? 'Right Hand' : 'Left Hand'}
            </button>
          ))}
        </div>
      </div>

      {/* Scale selector */}
      <div className="px-5 pb-3 flex flex-wrap gap-1.5">
        {SCALES.map((s) => (
          <button key={s.name} onClick={() => { setSelected(s); setPlayingIdx(-1) }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
            style={{ background: selected.name === s.name ? `${accent}20` : '#161b22', border: `1px solid ${selected.name === s.name ? `${accent}50` : '#1e2433'}`, color: selected.name === s.name ? accent : '#6b7280' }}>
            {s.name}
          </button>
        ))}
      </div>

      {/* Keyboard */}
      <div className="px-4 pb-2 overflow-x-auto">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="mx-auto" style={{ maxWidth: `${svgW}px`, width: '100%', height: 'auto' }}>
          <g transform="translate(2, 2)">
            {whites.map((k) => {
              const inScale = scaleSet.has(normalise(k.note))
              const isActive = normalise(k.note) === activeNote
              const scaleIdx = selected.notes.findIndex((n) => normalise(n) === normalise(k.note))
              const finger = scaleIdx >= 0 ? fingers[scaleIdx] : undefined
              return (
                <g key={k.note}>
                  <rect x={k.x} y={0} width={WHITE_W} height={WHITE_H} rx={2}
                    fill={isActive ? accent : inScale ? `${accent}25` : '#f0f0f0'}
                    stroke={inScale ? accent : '#999'} strokeWidth={inScale ? 1.2 : 0.5}
                    style={{ transition: 'fill 0.08s' }} />
                  {inScale && <circle cx={k.x + WHITE_W / 2} cy={WHITE_H - 18} r={4} fill={accent} opacity={isActive ? 1 : 0.7} />}
                  {finger != null && (
                    <text x={k.x + WHITE_W / 2} y={WHITE_H + 14} textAnchor="middle" fill={accent} fontSize={11} fontWeight={700} fontFamily="system-ui">{finger}</text>
                  )}
                </g>
              )
            })}
            {blacks.map((k) => {
              const inScale = scaleSet.has(normalise(k.note))
              const isActive = normalise(k.note) === activeNote
              return (
                <g key={k.note}>
                  <rect x={k.x} y={0} width={BLACK_W} height={BLACK_H} rx={2}
                    fill={isActive ? accent : inScale ? `${accent}bb` : '#1a1a1a'}
                    stroke={inScale ? accent : '#000'} strokeWidth={inScale ? 1.2 : 0.5}
                    style={{ transition: 'fill 0.08s' }} />
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {/* Note sequence + play */}
      <div className="px-5 pb-3 flex items-center gap-3">
        <button onClick={handlePlayScale} disabled={isPlaying}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer disabled:opacity-40"
          style={{ background: `${accent}18`, border: `1px solid ${accent}40`, color: '#e2e8f0' }}>
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16"><path d="M4 2l10 6-10 6V2z" /></svg>
          {isPlaying ? 'Playing...' : 'Play Scale'}
        </button>
        <div className="flex gap-1 flex-1 overflow-x-auto">
          {selected.notes.map((n, i) => (
            <div key={i} className="px-2 py-1 rounded text-[11px] font-mono transition-all"
              style={{ background: i === playingIdx ? `${accent}30` : '#161b22', color: i === playingIdx ? accent : '#6b7280', border: `1px solid ${i === playingIdx ? accent : 'transparent'}` }}>
              {n.replace(/\d/, '')}
              <span className="text-[9px] ml-0.5" style={{ color: accent }}>{fingers[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mx-5 mb-4 px-4 py-3 rounded-xl border border-white/[0.06]" style={{ background: '#161b22' }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold" style={{ color: accent }}>{selected.name}</span>
          <span className="text-[10px] text-[#6b7280] font-mono">{selected.pattern}</span>
        </div>
        <p className="text-xs text-[#94a3b8] leading-relaxed">{selected.description}</p>
        <div className="mt-1.5 text-[11px] text-[#6b7280]">
          Key signature: <span className="text-[#94a3b8]">{selected.keySignature}</span>
        </div>
      </div>
    </div>
  )
}
