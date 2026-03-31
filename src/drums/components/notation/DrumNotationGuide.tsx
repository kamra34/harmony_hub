/**
 * Drum Notation Cheatsheet — full-page interactive popup.
 */

import { useState } from 'react'
import { createPortal } from 'react-dom'

// ── Data ────────────────────────────────────────────────────────────────────

interface DrumInfo {
  id: string
  name: string
  shortName: string   // short label for staff diagram
  staffPos: string
  notehead: string
  color: string
  emoji: string
  // Exact SVG y position on the staff (staff lines at y=40,56,72,88,104 — spacing 16px)
  svgY: number
  ledgerY?: number    // y of extra ledger line if needed
  description: string
}

// Staff geometry: lines at y = 40, 56, 72, 88, 104 (spacing = 16)
// Spaces are midpoints: 48, 64, 80, 96
// Above staff: space at 32, ledger line at 24, space at 16
// Below staff: space at 112, ledger line at 120
const L5 = 40, L4 = 56, L3 = 72, L2 = 88, L1 = 104 // lines top to bottom
const S5 = 32   // space above top line
const S4 = 48   // between L5 and L4
const S3 = 64   // between L4 and L3
const S2 = 80   // between L3 and L2
const S1 = 96   // between L2 and L1
const BELOW = 112 // space below bottom line

const DRUMS: DrumInfo[] = [
  { id: 'crash',    name: 'Crash Cymbal',    shortName: 'Crash',   staffPos: 'Ledger line above staff', notehead: '✕ cross',  color: '#94a3b8', emoji: '💥', svgY: 24,    ledgerY: 24, description: 'Loud accent cymbal for crashes, section entries, and fill endings' },
  { id: 'hihat-c',  name: 'Hi-Hat (closed)', shortName: 'HH +',   staffPos: 'Space above top line',    notehead: '✕ with +', color: '#4ade80', emoji: '🔒', svgY: S5,    description: 'Closed hi-hat — tight crisp "tss" — main timekeeping cymbal' },
  { id: 'hihat-o',  name: 'Hi-Hat (open)',   shortName: 'HH ○',   staffPos: 'Space above top line',    notehead: '✕ with ○', color: '#22d3ee', emoji: '🔓', svgY: S5,    description: 'Open hi-hat — washy sustain "tshhh" — lift foot off pedal' },
  { id: 'ride',     name: 'Ride Cymbal',     shortName: 'Ride',    staffPos: 'ON top line (line 5)',    notehead: '✕ cross',  color: '#a1a1aa', emoji: '🔔', svgY: L5,    description: 'Ride cymbal — clear "ping" for steady timekeeping' },
  { id: 'tom1',     name: 'High Tom',        shortName: 'Tom 1',  staffPos: 'Space between L5 & L4',   notehead: '● filled', color: '#fb923c', emoji: '🥁', svgY: S4,    description: 'Highest-pitched rack tom — first in descending fills' },
  { id: 'tom2',     name: 'Mid Tom',         shortName: 'Tom 2',  staffPos: 'ON 4th line',             notehead: '● filled', color: '#a78bfa', emoji: '🥁', svgY: L4,    description: 'Mid-pitched rack tom — middle of descending fills' },
  { id: 'snare',    name: 'Snare Drum',      shortName: 'Snare',  staffPos: 'Space between L4 & L3',   notehead: '● filled', color: '#60a5fa', emoji: '🪘', svgY: S3,    description: 'The backbeat drum — almost always on beats 2 and 4' },
  { id: 'floortom', name: 'Floor Tom',       shortName: 'Floor',  staffPos: 'Space between L3 & L2',   notehead: '● filled', color: '#f472b6', emoji: '🥁', svgY: S2,    description: 'Deepest tom — last stop in a descending fill' },
  { id: 'kick',     name: 'Bass Drum',       shortName: 'Kick',   staffPos: 'Space between L2 & L1',   notehead: '● filled', color: '#fbbf24', emoji: '🦶', svgY: S1,    description: 'Right foot pedal — the deepest, most powerful sound' },
  { id: 'hhpedal',  name: 'Hi-Hat Pedal',    shortName: 'HH Foot', staffPos: 'Below bottom line',      notehead: '✕ cross',  color: '#34d399', emoji: '🦶', svgY: BELOW, description: 'Left foot closes hi-hat without a stick — soft "chick"' },
]

interface NoteValueInfo { name: string; symbol: string; beats: string; counting: string }
const NOTE_VALUES: NoteValueInfo[] = [
  { name: 'Whole Note',     symbol: '𝅝',  beats: '4 beats',   counting: '1 — 2 — 3 — 4' },
  { name: 'Half Note',      symbol: '𝅗𝅥',  beats: '2 beats',   counting: '1 — 2' },
  { name: 'Quarter Note',   symbol: '♩',  beats: '1 beat',    counting: '1' },
  { name: 'Eighth Note',    symbol: '♪',  beats: '½ beat',    counting: '1 +' },
  { name: 'Sixteenth Note', symbol: '𝅘𝅥𝅯',  beats: '¼ beat',    counting: '1 e + a' },
  { name: 'Triplet',        symbol: '♪³', beats: '⅓ beat',    counting: '1 t t' },
]

const ARTICULATIONS = [
  { name: 'Normal Hit',  symbol: '●', desc: 'Standard strike — default volume', color: '#e2e8f0' },
  { name: 'Accent  >',   symbol: '>', desc: 'Hit harder — louder than surrounding notes', color: '#fbbf24' },
  { name: 'Ghost Note',  symbol: '(●)', desc: 'Very soft — barely audible, adds groove texture', color: '#6b7280' },
  { name: 'Open Hi-Hat', symbol: '○', desc: 'Circle above note — lift foot off hi-hat pedal', color: '#22d3ee' },
  { name: 'Closed Hi-Hat', symbol: '+', desc: 'Plus above note — press foot on hi-hat pedal', color: '#4ade80' },
  { name: 'Cymbal',      symbol: '✕', desc: 'X-shaped notehead — all cymbals use this shape', color: '#94a3b8' },
  { name: 'Drum',        symbol: '●', desc: 'Filled oval notehead — all drums use this shape', color: '#60a5fa' },
]

// ── Component ───────────────────────────────────────────────────────────────

interface Props { open: boolean; onClose: () => void }

export default function DrumNotationGuide({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'kit' | 'notes' | 'marks'>('kit')
  const [hoveredDrum, setHoveredDrum] = useState<string | null>(null)

  if (!open) return null

  const tabs = [
    { id: 'kit' as const, label: 'Kit & Staff', icon: '🥁' },
    { id: 'notes' as const, label: 'Note Values', icon: '♪' },
    { id: 'marks' as const, label: 'Articulations', icon: '>' },
  ]

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-6" onClick={onClose}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-5xl mx-4 rounded-3xl border border-white/[0.06] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(10,12,20,0.98) 0%, rgba(15,18,30,0.98) 100%)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Drum Notation Guide</h2>
            <p className="text-sm text-[#6b7280] mt-1">Everything you need to read drum sheet music</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#6b7280] hover:text-white flex items-center justify-center cursor-pointer transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 px-6 pt-5 pb-3">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-[#6b7280] hover:text-white bg-white/[0.02] border border-transparent hover:border-white/[0.06]'
              }`}>
              <span className="text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          {activeTab === 'kit' && <KitStaffTab hovered={hoveredDrum} onHover={setHoveredDrum} />}
          {activeTab === 'notes' && <NoteValuesTab />}
          {activeTab === 'marks' && <ArticulationsTab />}
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Tab 1: Kit & Staff ──────────────────────────────────────────────────────

function KitStaffTab({ hovered, onHover }: { hovered: string | null; onHover: (id: string | null) => void }) {
  const active = hovered ? DRUMS.find(d => d.id === hovered) : null

  return (
    <div className="space-y-5">
      {/* Two-column: Kit pieces list + Staff diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Left: Drum kit pieces as clickable cards */}
        <div className="rounded-2xl border border-white/[0.04] p-5" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <div className="text-xs font-semibold text-[#4b5563] uppercase tracking-widest mb-4">Drum Kit Pieces</div>
          <div className="grid grid-cols-2 gap-2">
            {DRUMS.map(d => {
              const isActive = hovered === d.id
              return (
                <div
                  key={d.id}
                  className={`rounded-xl border p-3 cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'border-amber-500/30 bg-amber-500/[0.08] scale-[1.02]'
                      : 'border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04]'
                  }`}
                  onMouseEnter={() => onHover(d.id)}
                  onMouseLeave={() => onHover(null)}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{d.emoji}</span>
                    <div className="min-w-0">
                      <div className={`text-sm font-semibold truncate transition-colors ${isActive ? 'text-white' : 'text-[#c8d0da]'}`}>
                        {d.name}
                      </div>
                      <div className="text-[10px] mt-0.5" style={{ color: isActive ? d.color : '#4b5563' }}>
                        {d.staffPos}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Staff position diagram */}
        <div className="rounded-2xl border border-white/[0.04] p-5" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <div className="text-xs font-semibold text-[#4b5563] uppercase tracking-widest mb-4">Staff Positions</div>
          <svg viewBox="0 0 340 155" className="w-full" style={{ maxHeight: 420 }}>
            {/* Five staff lines — y = 40, 56, 72, 88, 104 */}
            {[L5, L4, L3, L2, L1].map(y => (
              <line key={y} x1="10" y1={y} x2="330" y2={y} stroke="#4b5563" strokeWidth="0.7" />
            ))}

            {/* Percussion clef */}
            <rect x="14" y={L5 + 6} width="5" height={L1 - L5 - 12} fill="#94a3b8" rx="1" />
            <rect x="21" y={L5 + 6} width="5" height={L1 - L5 - 12} fill="#94a3b8" rx="1" />

            {/* Each instrument */}
            {DRUMS.map((d, i) => {
              const x = 50 + i * 28
              const y = d.svgY
              const isActive = hovered === d.id
              const noteR = isActive ? 6 : 5

              return (
                <g key={d.id} className="cursor-pointer"
                  onMouseEnter={() => onHover(d.id)} onMouseLeave={() => onHover(null)}>

                  {/* Large invisible hit area */}
                  <rect x={x - 14} y={y - 20} width={28} height={40} fill="transparent" />

                  {/* Glow background */}
                  {isActive && <circle cx={x} cy={y} r={14} fill={d.color} opacity={0.12} />}

                  {/* Ledger line if needed */}
                  {d.ledgerY !== undefined && (
                    <line x1={x - 9} y1={d.ledgerY} x2={x + 9} y2={d.ledgerY} stroke="#6b7280" strokeWidth="0.7" />
                  )}

                  {/* Notehead */}
                  {d.notehead.includes('●') ? (
                    // Filled oval for drums
                    <ellipse cx={x} cy={y} rx={noteR} ry={noteR * 0.65}
                      fill={isActive ? d.color : '#c8d0da'}
                      transform={`rotate(-20 ${x} ${y})`} />
                  ) : (
                    // X notehead for cymbals
                    <>
                      <line x1={x - noteR + 1} y1={y - noteR + 1} x2={x + noteR - 1} y2={y + noteR - 1}
                        stroke={isActive ? d.color : '#c8d0da'} strokeWidth={isActive ? 2 : 1.5} />
                      <line x1={x + noteR - 1} y1={y - noteR + 1} x2={x - noteR + 1} y2={y + noteR - 1}
                        stroke={isActive ? d.color : '#c8d0da'} strokeWidth={isActive ? 2 : 1.5} />
                    </>
                  )}

                  {/* Marker: + or ○ above */}
                  {d.notehead.includes('+') && (
                    <text x={x} y={y - 10} textAnchor="middle" fontSize="10"
                      fill={isActive ? d.color : '#94a3b8'} fontWeight="bold">+</text>
                  )}
                  {d.notehead.includes('○') && (
                    <text x={x} y={y - 10} textAnchor="middle" fontSize="10"
                      fill={isActive ? d.color : '#94a3b8'}>○</text>
                  )}

                  {/* Stem */}
                  <line x1={x + noteR} y1={y} x2={x + noteR} y2={y - 22}
                    stroke={isActive ? d.color : '#94a3b8'} strokeWidth="0.8" />

                  {/* Label */}
                  <text x={x} y={140} textAnchor="middle"
                    fontSize={isActive ? 7.5 : 6.5}
                    fill={isActive ? d.color : '#94a3b8'}
                    fontWeight={isActive ? 'bold' : 'normal'}>
                    {d.shortName}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Info panel */}
      <div className="rounded-2xl border border-white/[0.04] p-5 min-h-[70px]" style={{ background: 'rgba(0,0,0,0.25)' }}>
        {active ? (
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl"
              style={{ backgroundColor: active.color + '15', border: `1px solid ${active.color}25` }}>
              {active.emoji}
            </div>
            <div>
              <div className="text-lg font-bold text-white">{active.name}</div>
              <div className="text-sm mt-1">
                <span className="text-[#6b7280]">Staff: </span>
                <span style={{ color: active.color }} className="font-medium">{active.staffPos}</span>
                <span className="text-[#374151] mx-2">|</span>
                <span className="text-[#6b7280]">Notehead: </span>
                <span style={{ color: active.color }} className="font-medium">{active.notehead}</span>
              </div>
              <div className="text-sm text-[#94a3b8] mt-1">{active.description}</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-[#4b5563] text-center py-3">
            Hover over any instrument on the kit or the staff to see its notation details
          </div>
        )}
      </div>
    </div>
  )
}

// ── Tab 2: Note Values ──────────────────────────────────────────────────────

function NoteValuesTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {NOTE_VALUES.map(nv => (
          <div key={nv.name} className="rounded-2xl border border-white/[0.04] p-5" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl text-white">{nv.symbol}</span>
              <div>
                <div className="text-base font-semibold text-white">{nv.name}</div>
                <div className="text-sm text-amber-400">{nv.beats}</div>
              </div>
            </div>
            <div className="text-sm text-[#6b7280]">
              Count: <span className="text-white font-mono text-base">{nv.counting}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/[0.04] p-5" style={{ background: 'rgba(0,0,0,0.25)' }}>
        <div className="text-xs font-semibold text-[#4b5563] uppercase tracking-widest mb-3">Beaming</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-[#94a3b8]">
          <div><span className="text-white font-medium">Single beam ═</span><br/>Connects eighth notes within a beat</div>
          <div><span className="text-white font-medium">Double beam ≡</span><br/>Connects sixteenth notes within a beat</div>
          <div><span className="text-white font-medium">Flag ♪</span><br/>Appears on isolated notes (no neighbor to beam to)</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.04] p-5" style={{ background: 'rgba(0,0,0,0.25)' }}>
        <div className="text-xs font-semibold text-[#4b5563] uppercase tracking-widest mb-3">How to Count</div>
        <div className="space-y-3 text-sm">
          {[
            ['1 — 2 — 3 — 4', 'Quarter notes (one per beat)'],
            ['1 + 2 + 3 + 4 +', 'Eighth notes (two per beat)'],
            ['1 e + a 2 e + a ...', 'Sixteenth notes (four per beat)'],
            ['1 t t 2 t t 3 t t ...', 'Triplets (three per beat)'],
          ].map(([count, desc]) => (
            <div key={count} className="flex items-center gap-4">
              <span className="text-amber-400 font-mono text-base w-52 flex-shrink-0">{count}</span>
              <span className="text-[#6b7280]">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Tab 3: Articulations ────────────────────────────────────────────────────

function ArticulationsTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ARTICULATIONS.map(a => (
          <div key={a.name} className="rounded-2xl border border-white/[0.04] p-5 flex items-start gap-4" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl font-bold"
              style={{ backgroundColor: a.color + '15', color: a.color, border: `1px solid ${a.color}25` }}>
              {a.symbol}
            </div>
            <div>
              <div className="text-base font-semibold text-white">{a.name}</div>
              <div className="text-sm text-[#6b7280] mt-1">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/[0.04] p-5" style={{ background: 'rgba(0,0,0,0.25)' }}>
        <div className="text-xs font-semibold text-[#4b5563] uppercase tracking-widest mb-3">Rests</div>
        <div className="text-sm text-[#94a3b8]">
          Rests mean <span className="text-white font-medium">silence</span> — don't play anything.
          Each rest type matches a note value: whole rest (4 beats), half rest (2 beats),
          quarter rest (1 beat), eighth rest (½ beat). Count through the rests — they're part of the rhythm.
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.04] p-5" style={{ background: 'rgba(0,0,0,0.25)' }}>
        <div className="text-xs font-semibold text-[#4b5563] uppercase tracking-widest mb-3">Staff & Bar Lines</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#94a3b8]">
          <div><span className="text-white font-medium">5 staff lines</span> — all drum instruments are placed on or between these lines. Cymbals use X noteheads, drums use oval noteheads.</div>
          <div><span className="text-white font-medium">Bar lines</span> — vertical lines dividing music into measures. Double bar line = end of section or piece.</div>
          <div><span className="text-white font-medium">Time signature</span> — two numbers at the start (e.g., 4/4). Top = beats per measure, bottom = which note gets one beat.</div>
          <div><span className="text-white font-medium">Percussion clef</span> — two vertical bars at staff start, indicating a percussion (unpitched) part.</div>
        </div>
      </div>
    </div>
  )
}
