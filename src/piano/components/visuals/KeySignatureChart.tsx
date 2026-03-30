import { useState } from 'react'

// ── Data ─────────────────────────────────────────────────────────────────────

const SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
const FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F']

interface KeySigDef {
  key: string
  type: 'sharps' | 'flats' | 'none'
  count: number
  accidentals: string[]
  mnemonic?: string
}

const KEY_SIGNATURES: KeySigDef[] = [
  { key: 'C Major / A minor', type: 'none', count: 0, accidentals: [] },
  { key: 'G Major / E minor', type: 'sharps', count: 1, accidentals: ['F#'] },
  { key: 'D Major / B minor', type: 'sharps', count: 2, accidentals: ['F#', 'C#'] },
  { key: 'A Major / F# minor', type: 'sharps', count: 3, accidentals: ['F#', 'C#', 'G#'] },
  { key: 'E Major / C# minor', type: 'sharps', count: 4, accidentals: ['F#', 'C#', 'G#', 'D#'] },
  { key: 'B Major / G# minor', type: 'sharps', count: 5, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#'] },
  { key: 'F Major / D minor', type: 'flats', count: 1, accidentals: ['Bb'] },
  { key: 'Bb Major / G minor', type: 'flats', count: 2, accidentals: ['Bb', 'Eb'] },
  { key: 'Eb Major / C minor', type: 'flats', count: 3, accidentals: ['Bb', 'Eb', 'Ab'] },
  { key: 'Ab Major / F minor', type: 'flats', count: 4, accidentals: ['Bb', 'Eb', 'Ab', 'Db'] },
  { key: 'Db Major / Bb minor', type: 'flats', count: 5, accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'] },
]

type Tab = 'sharps' | 'flats'

// ── Component ────────────────────────────────────────────────────────────────

export default function KeySignatureChart() {
  const [tab, setTab] = useState<Tab>('sharps')
  const [selected, setSelected] = useState<KeySigDef | null>(null)

  const accent = '#a78bfa'
  const sharpKeys = KEY_SIGNATURES.filter((k) => k.type === 'sharps' || k.type === 'none')
  const flatKeys = KEY_SIGNATURES.filter((k) => k.type === 'flats' || k.type === 'none')
  const displayKeys = tab === 'sharps' ? sharpKeys : flatKeys

  return (
    <div className="my-6 rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: '#0d1117' }}>
      <div className="px-5 pt-4 pb-2 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: accent }}>
          Key Signatures
        </span>
        <div className="flex gap-1">
          {(['sharps', 'flats'] as Tab[]).map((t) => (
            <button key={t} onClick={() => { setTab(t); setSelected(null) }}
              className="px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              style={{ background: tab === t ? `${accent}20` : 'transparent', color: tab === t ? accent : '#6b7280', border: tab === t ? `1px solid ${accent}40` : '1px solid transparent' }}>
              {t === 'sharps' ? 'Sharp Keys' : 'Flat Keys'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4">
        {/* Order of accidentals */}
        <div className="mb-3 px-4 py-2.5 rounded-xl border border-white/[0.06]" style={{ background: '#161b22' }}>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-[#6b7280] mb-1">
            Order of {tab === 'sharps' ? 'sharps' : 'flats'}
          </div>
          <div className="flex items-center gap-2">
            {(tab === 'sharps' ? SHARP_ORDER : FLAT_ORDER).map((note, i) => (
              <div key={note} className="flex items-center gap-1">
                <span className="text-sm font-bold font-mono" style={{ color: accent }}>{note}{tab === 'sharps' ? '#' : 'b'}</span>
                {i < 6 && <span className="text-[#2d3748]">→</span>}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#4b5563] mt-1.5">
            {tab === 'sharps'
              ? 'Mnemonic: Father Charles Goes Down And Ends Battle'
              : 'Mnemonic: Battle Ends And Down Goes Charles\' Father'}
          </p>
        </div>

        {/* Key signature list */}
        <div className="space-y-1.5">
          {displayKeys.map((ks) => {
            const isActive = selected?.key === ks.key
            return (
              <button key={ks.key} onClick={() => setSelected(isActive ? null : ks)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-left"
                style={{ background: isActive ? `${accent}12` : 'transparent', border: `1px solid ${isActive ? `${accent}30` : 'transparent'}` }}>
                {/* Count badge */}
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `${accent}15`, color: accent }}>
                  {ks.count}{tab === 'sharps' ? '#' : 'b'}
                </span>
                {/* Key name */}
                <span className="text-sm text-white font-medium flex-1">{ks.key}</span>
                {/* Accidentals */}
                <span className="text-xs text-[#6b7280] font-mono">
                  {ks.accidentals.length > 0 ? ks.accidentals.join(' ') : '—'}
                </span>
              </button>
            )
          })}
        </div>

        {/* Finding the key tip */}
        <div className="mt-3 px-4 py-3 rounded-xl border border-white/[0.06]" style={{ background: '#161b22' }}>
          <div className="text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: accent }}>Quick trick</div>
          {tab === 'sharps' ? (
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              For sharp keys: the <span className="text-white font-medium">last sharp</span> is always one half step below the key name. See F#? Go up one half step → G major. See C#? Go up → D major.
            </p>
          ) : (
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              For flat keys: the <span className="text-white font-medium">second-to-last flat</span> IS the key name. See Bb and Eb? The second-to-last is Bb → Bb major. Exception: F major (only 1 flat, just memorize it).
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
