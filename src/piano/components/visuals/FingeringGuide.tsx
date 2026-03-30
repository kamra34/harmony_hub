import { useState } from 'react'

// ── Data ─────────────────────────────────────────────────────────────────────

interface FingeringPattern {
  name: string
  category: 'scale' | 'chord' | 'technique'
  description: string
  rh: { notes: string; fingers: string }
  lh: { notes: string; fingers: string }
  tips: string[]
}

const PATTERNS: FingeringPattern[] = [
  {
    name: 'C Major Scale',
    category: 'scale',
    description: 'The standard one-octave major scale fingering. This exact pattern works for C, D, E, G, and A major.',
    rh: { notes: 'C D E F G A B C', fingers: '1 2 3 1 2 3 4 5' },
    lh: { notes: 'C D E F G A B C', fingers: '5 4 3 2 1 3 2 1' },
    tips: [
      'Thumb crosses under fingers 3→1 (RH going up)',
      'Finger 3 crosses over thumb 1→3 (RH going down)',
      'Keep thumb close to the keys during crossover — no flying thumb',
      'The crossover should be smooth — no bump or hesitation',
    ],
  },
  {
    name: 'F Major Scale',
    category: 'scale',
    description: 'Unique RH fingering — the thumb crosses to finger 4 instead of 3, because Bb falls on finger 4.',
    rh: { notes: 'F G A Bb C D E F', fingers: '1 2 3 4 1 2 3 4' },
    lh: { notes: 'F G A Bb C D E F', fingers: '5 4 3 2 1 3 2 1' },
    tips: [
      'RH: thumb crosses under to finger 4 on Bb (not 1 on C like other scales)',
      'LH: standard fingering — same as C major shifted',
      'Practice the RH thumb-under to finger 4 separately 10 times',
    ],
  },
  {
    name: 'Thumb-Under Technique',
    category: 'technique',
    description: 'The fundamental technique for playing scales smoothly beyond 5 notes. The thumb tucks under fingers 2-3 (or 3-4) to reach the next note.',
    rh: { notes: 'E F (thumb passes under)', fingers: '3 1 ...' },
    lh: { notes: 'F E (thumb passes under)', fingers: '1 3 ...' },
    tips: [
      'Start slowly — the thumb should slide sideways, not jump',
      'Keep the hand level — no wrist dipping during the cross',
      'The thumb should already be moving toward its target key BEFORE it needs to play',
      'Practice: play E-F-E-F (RH fingers 3-1-3-1) 20 times until seamless',
    ],
  },
  {
    name: 'Chord Fingering (Root Position)',
    category: 'chord',
    description: 'Standard fingering for three-note chords in root position. Works for all major and minor triads.',
    rh: { notes: 'Root — 3rd — 5th', fingers: '1    3    5' },
    lh: { notes: 'Root — 3rd — 5th', fingers: '5    3    1' },
    tips: [
      'Always 1-3-5 for RH, 5-3-1 for LH in root position',
      'Keep fingers curved — flat fingers cannot control chord volume',
      'Press all three notes simultaneously — no rolling',
      'For 7th chords (4 notes): RH uses 1-2-3-5, LH uses 5-3-2-1',
    ],
  },
  {
    name: 'Chord Inversions',
    category: 'chord',
    description: 'When the root is not the lowest note, the fingering changes.',
    rh: { notes: '1st inv: 1-2-5 | 2nd inv: 1-3-5', fingers: 'E-G-C: 1-2-5 | G-C-E: 1-3-5' },
    lh: { notes: '1st inv: 5-3-1 | 2nd inv: 5-2-1', fingers: 'E-G-C: 5-3-1 | G-C-E: 5-2-1' },
    tips: [
      '1st inversion RH: 1-2-5 (finger 2 on the 3rd, wider stretch to 5)',
      '2nd inversion RH: 1-3-5 (same as root position)',
      'Inversions keep the hand close to the same area — less jumping',
    ],
  },
]

// ── Component ────────────────────────────────────────────────────────────────

type Cat = 'all' | 'scale' | 'chord' | 'technique'

export default function FingeringGuide() {
  const [cat, setCat] = useState<Cat>('all')
  const [selected, setSelected] = useState<FingeringPattern>(PATTERNS[0])
  const [hand, setHand] = useState<'rh' | 'lh'>('rh')

  const accent = '#a78bfa'
  const filtered = cat === 'all' ? PATTERNS : PATTERNS.filter((p) => p.category === cat)

  return (
    <div className="my-6 rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: '#0d1117' }}>
      <div className="px-5 pt-4 pb-2 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: accent }}>
          Fingering Patterns
        </span>
        <div className="flex gap-1">
          {(['all', 'scale', 'chord', 'technique'] as Cat[]).map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer capitalize"
              style={{ background: cat === c ? `${accent}20` : 'transparent', color: cat === c ? accent : '#6b7280', border: cat === c ? `1px solid ${accent}40` : '1px solid transparent' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4 flex flex-col md:flex-row gap-3">
        {/* Pattern list */}
        <div className="md:w-48 flex-shrink-0 space-y-1">
          {filtered.map((p) => (
            <button key={p.name} onClick={() => setSelected(p)}
              className="w-full text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
              style={{ background: selected.name === p.name ? `${accent}15` : 'transparent', border: `1px solid ${selected.name === p.name ? `${accent}30` : 'transparent'}`, color: selected.name === p.name ? '#e2e8f0' : '#6b7280' }}>
              <div className="font-medium">{p.name}</div>
              <div className="text-[10px] capitalize" style={{ color: `${accent}80` }}>{p.category}</div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="flex-1">
          <p className="text-xs text-[#94a3b8] leading-relaxed mb-3">{selected.description}</p>

          {/* Hand toggle */}
          <div className="flex gap-1 mb-3">
            {(['rh', 'lh'] as const).map((h) => (
              <button key={h} onClick={() => setHand(h)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                style={{ background: hand === h ? `${accent}20` : '#161b22', color: hand === h ? accent : '#6b7280', border: `1px solid ${hand === h ? `${accent}40` : '#1e2433'}` }}>
                {h === 'rh' ? 'Right Hand' : 'Left Hand'}
              </button>
            ))}
          </div>

          {/* Notes + fingers */}
          <div className="px-4 py-3 rounded-xl border border-white/[0.06] mb-3" style={{ background: '#161b22' }}>
            <div className="text-[10px] uppercase tracking-wider text-[#6b7280] mb-1.5">Notes</div>
            <div className="text-sm text-white font-mono mb-2">
              {hand === 'rh' ? selected.rh.notes : selected.lh.notes}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[#6b7280] mb-1.5">Fingers</div>
            <div className="text-sm font-mono" style={{ color: accent }}>
              {hand === 'rh' ? selected.rh.fingers : selected.lh.fingers}
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-1">
            {selected.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#94a3b8]">
                <span className="text-[10px] mt-0.5" style={{ color: accent }}>+</span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
