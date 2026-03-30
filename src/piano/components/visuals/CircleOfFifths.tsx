import { useState } from 'react'

// ── Data ─────────────────────────────────────────────────────────────────────

interface KeyInfo {
  major: string
  minor: string
  sharps: number
  flats: number
  signature: string
  primaryChords: string
}

const KEYS: KeyInfo[] = [
  { major: 'C', minor: 'Am', sharps: 0, flats: 0, signature: 'None', primaryChords: 'C — F — G7' },
  { major: 'G', minor: 'Em', sharps: 1, flats: 0, signature: 'F#', primaryChords: 'G — C — D7' },
  { major: 'D', minor: 'Bm', sharps: 2, flats: 0, signature: 'F# C#', primaryChords: 'D — G — A7' },
  { major: 'A', minor: 'F#m', sharps: 3, flats: 0, signature: 'F# C# G#', primaryChords: 'A — D — E7' },
  { major: 'E', minor: 'C#m', sharps: 4, flats: 0, signature: 'F# C# G# D#', primaryChords: 'E — A — B7' },
  { major: 'B', minor: 'G#m', sharps: 5, flats: 0, signature: 'F# C# G# D# A#', primaryChords: 'B — E — F#7' },
  { major: 'Gb/F#', minor: 'Ebm/D#m', sharps: 6, flats: 6, signature: '6#/6b', primaryChords: 'Gb — Cb — Db7' },
  { major: 'Db', minor: 'Bbm', sharps: 0, flats: 5, signature: 'Bb Eb Ab Db Gb', primaryChords: 'Db — Gb — Ab7' },
  { major: 'Ab', minor: 'Fm', sharps: 0, flats: 4, signature: 'Bb Eb Ab Db', primaryChords: 'Ab — Db — Eb7' },
  { major: 'Eb', minor: 'Cm', sharps: 0, flats: 3, signature: 'Bb Eb Ab', primaryChords: 'Eb — Ab — Bb7' },
  { major: 'Bb', minor: 'Gm', sharps: 0, flats: 2, signature: 'Bb Eb', primaryChords: 'Bb — Eb — F7' },
  { major: 'F', minor: 'Dm', sharps: 0, flats: 1, signature: 'Bb', primaryChords: 'F — Bb — C7' },
]

// ── Component ────────────────────────────────────────────────────────────────

export default function CircleOfFifths() {
  const [selected, setSelected] = useState(0)
  const accent = '#a78bfa'

  const cx = 170, cy = 170, r = 140, innerR = 95

  return (
    <div className="my-6 rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: '#0d1117' }}>
      <div className="px-5 pt-4 pb-2">
        <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: accent }}>
          Circle of Fifths
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-4 px-5 pb-5">
        {/* Circle SVG */}
        <div className="flex-shrink-0">
          <svg viewBox="0 0 340 340" className="w-full" style={{ maxWidth: 320, height: 'auto' }}>
            {/* Outer ring background */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e2433" strokeWidth="1" />
            <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="#1e2433" strokeWidth="1" />

            {KEYS.map((k, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const majorX = cx + r * Math.cos(angle)
              const majorY = cy + r * Math.sin(angle)
              const minorX = cx + innerR * Math.cos(angle)
              const minorY = cy + innerR * Math.sin(angle)
              const isActive = i === selected

              return (
                <g key={i} onClick={() => setSelected(i)} style={{ cursor: 'pointer' }}>
                  {/* Major key (outer) */}
                  <circle cx={majorX} cy={majorY} r={18}
                    fill={isActive ? `${accent}30` : '#161b22'}
                    stroke={isActive ? accent : '#374151'}
                    strokeWidth={isActive ? 2 : 0.8}
                  />
                  <text x={majorX} y={majorY + 4.5} textAnchor="middle"
                    fill={isActive ? accent : '#e2e8f0'}
                    fontSize={k.major.length > 2 ? 8 : 12} fontWeight={700} fontFamily="system-ui">
                    {k.major}
                  </text>

                  {/* Minor key (inner) */}
                  <circle cx={minorX} cy={minorY} r={14}
                    fill={isActive ? `${accent}15` : '#0d1117'}
                    stroke={isActive ? `${accent}60` : '#2d3748'}
                    strokeWidth={isActive ? 1.5 : 0.5}
                  />
                  <text x={minorX} y={minorY + 3.5} textAnchor="middle"
                    fill={isActive ? `${accent}cc` : '#6b7280'}
                    fontSize={k.minor.length > 3 ? 7 : 9} fontWeight={500} fontFamily="system-ui">
                    {k.minor}
                  </text>

                  {/* Connecting line */}
                  <line x1={majorX} y1={majorY} x2={minorX} y2={minorY}
                    stroke={isActive ? `${accent}40` : '#1e2433'} strokeWidth={0.5} />
                </g>
              )
            })}

            {/* Center labels */}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="#4b5563" fontSize="8" fontFamily="system-ui">Major</text>
            <text x={cx} y={cy + 6} textAnchor="middle" fill="#374151" fontSize="7" fontFamily="system-ui">(outer)</text>
            <text x={cx} y={cy + 18} textAnchor="middle" fill="#374151" fontSize="7" fontFamily="system-ui">Minor (inner)</text>
          </svg>
        </div>

        {/* Info panel */}
        <div className="flex-1 min-w-0">
          <div className="px-4 py-3 rounded-xl border border-white/[0.06] mb-3" style={{ background: '#161b22' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl font-bold" style={{ color: accent }}>{KEYS[selected].major}</span>
              <span className="text-sm text-white font-semibold">Major</span>
              <span className="text-[#4b5563] mx-1">/</span>
              <span className="text-base font-semibold" style={{ color: `${accent}aa` }}>{KEYS[selected].minor}</span>
              <span className="text-sm text-[#6b7280]">minor</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280] w-24 flex-shrink-0">Key signature:</span>
                <span className="text-[#94a3b8] font-mono">{KEYS[selected].signature}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280] w-24 flex-shrink-0">Sharps/Flats:</span>
                <span className="text-[#94a3b8]">
                  {KEYS[selected].sharps > 0 ? `${KEYS[selected].sharps} sharp${KEYS[selected].sharps > 1 ? 's' : ''}` : ''}
                  {KEYS[selected].flats > 0 ? `${KEYS[selected].flats} flat${KEYS[selected].flats > 1 ? 's' : ''}` : ''}
                  {KEYS[selected].sharps === 0 && KEYS[selected].flats === 0 ? 'None' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280] w-24 flex-shrink-0">Primary chords:</span>
                <span className="text-[#94a3b8] font-mono">{KEYS[selected].primaryChords}</span>
              </div>
            </div>
          </div>

          {/* How to read it */}
          <div className="px-4 py-3 rounded-xl border border-white/[0.06]" style={{ background: '#161b22' }}>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#6b7280] mb-2">How to read the circle</div>
            <ul className="space-y-1.5 text-xs text-[#94a3b8]">
              <li className="flex gap-2"><span style={{ color: accent }}>+</span> Moving clockwise adds one sharp</li>
              <li className="flex gap-2"><span style={{ color: accent }}>+</span> Moving counter-clockwise adds one flat</li>
              <li className="flex gap-2"><span style={{ color: accent }}>+</span> Inner ring = relative minor (same key signature)</li>
              <li className="flex gap-2"><span style={{ color: accent }}>+</span> Adjacent keys are closely related — easy to modulate between them</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
