import { DrumPad } from '@drums/types/midi'
import { HitValue, PatternData } from '@drums/types/curriculum'
import { createPattern } from './patterns'

// ═══════════════════════════════════════════════════════════════════════════
//  PRACTICE LIBRARY — Genre beats, reading exercises, fills, rudiments
// ═══════════════════════════════════════════════════════════════════════════

// Re-export placeHits for use here (it's not exported from patterns.ts)
function hits(length: number, indices: number[], value: HitValue = 1): HitValue[] {
  const arr: HitValue[] = Array(length).fill(0)
  for (const i of indices) if (i < length) arr[i] = value
  return arr
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PracticeItem {
  id: string
  title: string
  description: string
  category: PracticeCategory
  difficulty: number     // 1-10
  bpm: number
  timeSignature: [number, number]
  bars: number
  patternData: PatternData
  tags: string[]
}

export type PracticeCategory =
  | 'reading'
  | 'rock'
  | 'pop'
  | 'funk'
  | 'jazz'
  | 'latin'
  | 'metal'
  | 'fills'
  | 'rudiments'

export interface RudimentDef {
  id: string
  name: string
  sticking: string
  category: 'rolls' | 'diddles' | 'flams' | 'drags'
  description: string
  patternData: PatternData
  startBpm: number
  difficulty: number
}

// ─── Notation Reading Exercises (progressive difficulty) ────────────────────

export const READING_EXERCISES: PracticeItem[] = [
  // Level 1: Whole and half notes
  {
    id: 'read-01',
    title: 'Whole Notes on Snare',
    description: 'One hit per bar. Focus on reading the whole note symbol and waiting the full 4 beats.',
    category: 'reading',
    difficulty: 1,
    bpm: 80,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 1, {
      [DrumPad.Snare]: hits(4, [0]),
    }),
    tags: ['whole-notes', 'beginner'],
  },
  {
    id: 'read-02',
    title: 'Half Notes on Snare',
    description: 'Two hits per bar — on beats 1 and 3. Read the half note symbols.',
    category: 'reading',
    difficulty: 1,
    bpm: 80,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.Snare]: hits(8, [0, 4]),
    }),
    tags: ['half-notes', 'beginner'],
  },
  // Level 2: Quarter notes
  {
    id: 'read-03',
    title: 'Quarter Notes — Snare',
    description: 'Four hits per bar, one on each beat. The foundational rhythm.',
    category: 'reading',
    difficulty: 2,
    bpm: 90,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 1, {
      [DrumPad.Snare]: hits(4, [0, 1, 2, 3]),
    }),
    tags: ['quarter-notes', 'beginner'],
  },
  {
    id: 'read-04',
    title: 'Quarter Notes — Kick + Snare',
    description: 'Kick on 1,3 and snare on 2,4. Read two voices simultaneously.',
    category: 'reading',
    difficulty: 2,
    bpm: 85,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 1, {
      [DrumPad.Kick]: hits(4, [0, 2]),
      [DrumPad.Snare]: hits(4, [1, 3]),
    }),
    tags: ['quarter-notes', 'two-voice', 'beginner'],
  },
  // Level 3: Quarter notes with rests
  {
    id: 'read-05',
    title: 'Quarter Notes with Rests',
    description: 'Snare on beats 1, 2, 4 — beat 3 is a quarter rest. Count through the silence!',
    category: 'reading',
    difficulty: 3,
    bpm: 85,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 1, {
      [DrumPad.Snare]: hits(4, [0, 1, 3]),
    }),
    tags: ['quarter-notes', 'rests', 'beginner'],
  },
  // Level 4: Eighth notes
  {
    id: 'read-06',
    title: 'Eighth Notes — Hi-Hat',
    description: 'Steady eighth notes on the hi-hat. Read the beamed groups.',
    category: 'reading',
    difficulty: 3,
    bpm: 90,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.HiHatClosed]: hits(8, [0, 1, 2, 3, 4, 5, 6, 7]),
    }),
    tags: ['eighth-notes', 'hi-hat', 'beginner'],
  },
  {
    id: 'read-07',
    title: 'Eighth Notes with Rests',
    description: 'Eighth notes on beats, rests on the "ands." Read the eighth rests.',
    category: 'reading',
    difficulty: 4,
    bpm: 85,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.Snare]: hits(8, [0, 2, 4, 6]),  // only downbeats
    }),
    tags: ['eighth-notes', 'rests', 'intermediate'],
  },
  // Level 5: Eighth notes — two voices
  {
    id: 'read-08',
    title: 'Reading a Basic Beat',
    description: 'HH eighths + snare 2,4 + kick 1,3. Read three voices on the staff simultaneously.',
    category: 'reading',
    difficulty: 5,
    bpm: 90,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.HiHatClosed]: hits(8, [0, 1, 2, 3, 4, 5, 6, 7]),
      [DrumPad.Snare]: hits(8, [2, 6]),
      [DrumPad.Kick]: hits(8, [0, 4]),
    }),
    tags: ['eighth-notes', 'three-voice', 'intermediate'],
  },
  // Level 6: Sixteenth notes
  {
    id: 'read-09',
    title: '16th Notes — Snare',
    description: 'Full sixteenth notes on snare. Read the double-beamed groups.',
    category: 'reading',
    difficulty: 6,
    bpm: 70,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: hits(16, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]),
    }),
    tags: ['sixteenth-notes', 'intermediate'],
  },
  {
    id: 'read-10',
    title: 'Sixteenth Note Patterns',
    description: 'Mixed sixteenth patterns — "1 e + a" on beat 1, quarter on 2, eighths on 3-4.',
    category: 'reading',
    difficulty: 7,
    bpm: 75,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: hits(16, [0, 1, 2, 3, 4, 8, 10, 12, 14]),
    }),
    tags: ['sixteenth-notes', 'mixed', 'intermediate'],
  },
  // Level 7: Accents and ghost notes
  {
    id: 'read-11',
    title: 'Accents on Snare',
    description: 'Sixteenth notes with accents on beats 2 and 4. Read the ">" marks.',
    category: 'reading',
    difficulty: 6,
    bpm: 85,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [1,1,2,1,1,1,2,1, 1,1,2,1,1,1,2,1] as HitValue[],
    }),
    tags: ['accents', 'dynamics', 'intermediate'],
  },
  {
    id: 'read-12',
    title: 'Ghost Notes + Accents',
    description: 'Accented backbeats with ghost notes between. The foundation of funk drumming.',
    category: 'reading',
    difficulty: 7,
    bpm: 80,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.Snare]: [3,3,2,3, 3,3,2,3] as HitValue[],
      [DrumPad.Kick]: hits(8, [0, 3, 4]),
      [DrumPad.HiHatClosed]: hits(8, [0, 1, 2, 3, 4, 5, 6, 7]),
    }),
    tags: ['ghost-notes', 'accents', 'funk', 'intermediate'],
  },
  // Level 8: Multi-bar reading
  {
    id: 'read-13',
    title: '3-Bar Phrase — Kick Snare Variation',
    description: '3 bars: bar 1 kick on 1+3, bar 2 kick on 1+and-of-2+3, bar 3 adds a fill on beat 4.',
    category: 'reading',
    difficulty: 5,
    bpm: 90,
    timeSignature: [4, 4],
    bars: 3,
    patternData: createPattern(12, 2, {
      // 3 bars × 4 beats × 2 sub = 24 slots
      [DrumPad.HiHatClosed]: (() => { const a: HitValue[] = []; for (let i = 0; i < 24; i++) a.push(1); return a })(),
      [DrumPad.Snare]: hits(24, [2,6, 10,14, 18,20,21,22,23]),
      [DrumPad.Kick]: hits(24, [0,4, 8,11,12, 16,20]),
    }),
    tags: ['multi-bar', '3-bar', 'intermediate'],
  },
  {
    id: 'read-14',
    title: '4-Bar Verse — Rock',
    description: '4 bars: standard rock groove with kick variation on bars 2 and 4, crash on bar 1.',
    category: 'reading',
    difficulty: 5,
    bpm: 100,
    timeSignature: [4, 4],
    bars: 4,
    patternData: createPattern(16, 2, {
      // 4 bars × 4 beats × 2 sub = 32 slots
      [DrumPad.HiHatClosed]: (() => { const a: HitValue[] = []; for (let i = 0; i < 32; i++) a.push(1); return a })(),
      [DrumPad.Snare]: hits(32, [2,6, 10,14, 18,22, 26,30]),
      [DrumPad.Kick]: hits(32, [0,4, 8,11,12, 16,20, 24,27,28]),
      [DrumPad.CrashCymbal]: hits(32, [0]),
    }),
    tags: ['multi-bar', '4-bar', 'rock', 'intermediate'],
  },
  {
    id: 'read-15',
    title: '8-Bar Section — Verse + Fill',
    description: '8 bars: 6 bars of groove, bar 7 adds open hi-hat, bar 8 is a tom fill into crash.',
    category: 'reading',
    difficulty: 7,
    bpm: 95,
    timeSignature: [4, 4],
    bars: 8,
    patternData: (() => {
      // 8 bars × 4 beats × 2 sub = 64 slots
      const S = 8
      const hh: HitValue[] = Array(64).fill(1)
      const ho: HitValue[] = Array(64).fill(0)
      const sn: HitValue[] = Array(64).fill(0)
      const kk: HitValue[] = Array(64).fill(0)
      const cr: HitValue[] = Array(64).fill(0)
      const t1: HitValue[] = Array(64).fill(0)
      const ft: HitValue[] = Array(64).fill(0)

      // Bars 1-6: basic groove
      for (let bar = 0; bar < 6; bar++) {
        const o = bar * S
        sn[o+2] = 1; sn[o+6] = 1
        kk[o] = 1; kk[o+4] = 1
        if (bar % 2 === 1) kk[o+3] = 1 // kick variation every other bar
      }
      cr[0] = 1 // crash on bar 1

      // Bar 7: open hi-hat on and-of-4
      const o7 = 6 * S
      sn[o7+2] = 1; sn[o7+6] = 1
      kk[o7] = 1; kk[o7+3] = 1; kk[o7+4] = 1
      hh[o7+7] = 0; ho[o7+7] = 1

      // Bar 8: tom fill
      const o8 = 7 * S
      hh[o8] = 0; hh[o8+1] = 0; hh[o8+2] = 0; hh[o8+3] = 0
      hh[o8+4] = 0; hh[o8+5] = 0; hh[o8+6] = 0; hh[o8+7] = 0
      sn[o8] = 1; sn[o8+1] = 1
      t1[o8+2] = 1; t1[o8+3] = 1
      ft[o8+4] = 1; ft[o8+5] = 1; ft[o8+6] = 1
      cr[o8+7] = 1; kk[o8+7] = 1

      return createPattern(32, 2, {
        [DrumPad.HiHatClosed]: hh,
        [DrumPad.HiHatOpen]: ho,
        [DrumPad.Snare]: sn,
        [DrumPad.Kick]: kk,
        [DrumPad.CrashCymbal]: cr,
        [DrumPad.Tom1]: t1,
        [DrumPad.FloorTom]: ft,
      })
    })(),
    tags: ['multi-bar', '8-bar', 'fill', 'advanced'],
  },
  {
    id: 'read-16',
    title: '2-Bar Call & Response',
    description: '2 bars: bar 1 is HH + kick groove, bar 2 answers with snare hits on every beat.',
    category: 'reading',
    difficulty: 3,
    bpm: 90,
    timeSignature: [4, 4],
    bars: 2,
    patternData: createPattern(8, 2, {
      // Bar 1: HH eighths + kick on 1,3  |  Bar 2: snare on every beat, no HH
      [DrumPad.HiHatClosed]: hits(16, [0,1,2,3,4,5,6,7]),
      [DrumPad.Kick]: hits(16, [0, 4]),
      [DrumPad.Snare]: hits(16, [10, 12, 14, 15]),
    }),
    tags: ['multi-bar', '2-bar', 'beginner'],
  },
  {
    id: 'read-17',
    title: '5-Bar Groove — Changing Feel',
    description: '5 bars: bars 1-2 HH eighths, bar 3 switches to ride, bar 4 opens HH, bar 5 crash + fill.',
    category: 'reading',
    difficulty: 6,
    bpm: 95,
    timeSignature: [4, 4],
    bars: 5,
    patternData: (() => {
      // 5 bars × 4 beats × 2 sub = 40 slots
      const S = 8
      const hh: HitValue[] = Array(40).fill(0)
      const rd: HitValue[] = Array(40).fill(0)
      const ho: HitValue[] = Array(40).fill(0)
      const sn: HitValue[] = Array(40).fill(0)
      const kk: HitValue[] = Array(40).fill(0)
      const cr: HitValue[] = Array(40).fill(0)
      const t1: HitValue[] = Array(40).fill(0)
      const ft: HitValue[] = Array(40).fill(0)

      // Bars 1-2: HH eighths + basic groove
      for (let bar = 0; bar < 2; bar++) {
        const o = bar * S
        for (let i = 0; i < 8; i++) hh[o+i] = 1
        sn[o+2] = 1; sn[o+6] = 1
        kk[o] = 1; kk[o+4] = 1
      }

      // Bar 3: switch to ride
      for (let i = 0; i < 8; i++) rd[2*S+i] = 1
      sn[2*S+2] = 1; sn[2*S+6] = 1
      kk[2*S] = 1; kk[2*S+3] = 1; kk[2*S+4] = 1

      // Bar 4: open HH on ands
      for (let i = 0; i < 8; i++) hh[3*S+i] = 1
      hh[3*S+3] = 0; ho[3*S+3] = 1
      hh[3*S+7] = 0; ho[3*S+7] = 1
      sn[3*S+2] = 1; sn[3*S+6] = 1
      kk[3*S] = 1; kk[3*S+4] = 1

      // Bar 5: crash + tom fill
      cr[4*S] = 1; kk[4*S] = 1
      sn[4*S+2] = 1; sn[4*S+3] = 1
      t1[4*S+4] = 1; t1[4*S+5] = 1
      ft[4*S+6] = 1; ft[4*S+7] = 1

      return createPattern(20, 2, {
        [DrumPad.HiHatClosed]: hh,
        [DrumPad.HiHatOpen]: ho,
        [DrumPad.RideCymbal]: rd,
        [DrumPad.Snare]: sn,
        [DrumPad.Kick]: kk,
        [DrumPad.CrashCymbal]: cr,
        [DrumPad.Tom1]: t1,
        [DrumPad.FloorTom]: ft,
      })
    })(),
    tags: ['multi-bar', '5-bar', 'intermediate'],
  },
  {
    id: 'read-18',
    title: '6-Bar Phrase — Groove into Fill',
    description: '6 bars: 4 bars groove with kick variations, bar 5 builds tension, bar 6 is a full tom fill.',
    category: 'reading',
    difficulty: 6,
    bpm: 100,
    timeSignature: [4, 4],
    bars: 6,
    patternData: (() => {
      // 6 bars × 4 beats × 2 sub = 48 slots
      const S = 8
      const hh: HitValue[] = Array(48).fill(0)
      const sn: HitValue[] = Array(48).fill(0)
      const kk: HitValue[] = Array(48).fill(0)
      const cr: HitValue[] = Array(48).fill(0)
      const t1: HitValue[] = Array(48).fill(0)
      const t2: HitValue[] = Array(48).fill(0)
      const ft: HitValue[] = Array(48).fill(0)

      // Bar 1: crash + basic groove
      cr[0] = 1
      for (let i = 0; i < 8; i++) hh[i] = 1
      sn[2] = 1; sn[6] = 1; kk[0] = 1; kk[4] = 1

      // Bar 2: kick variation (add and-of-2)
      for (let i = 0; i < 8; i++) hh[S+i] = 1
      sn[S+2] = 1; sn[S+6] = 1; kk[S] = 1; kk[S+3] = 1; kk[S+4] = 1

      // Bar 3: same as bar 1
      for (let i = 0; i < 8; i++) hh[2*S+i] = 1
      sn[2*S+2] = 1; sn[2*S+6] = 1; kk[2*S] = 1; kk[2*S+4] = 1

      // Bar 4: kick variation (add and-of-4)
      for (let i = 0; i < 8; i++) hh[3*S+i] = 1
      sn[3*S+2] = 1; sn[3*S+6] = 1; kk[3*S] = 1; kk[3*S+4] = 1; kk[3*S+7] = 1

      // Bar 5: build — snare on every eighth note beat 3-4
      for (let i = 0; i < 8; i++) hh[4*S+i] = 1
      sn[4*S+2] = 1; sn[4*S+4] = 1; sn[4*S+5] = 1; sn[4*S+6] = 1; sn[4*S+7] = 1
      kk[4*S] = 1

      // Bar 6: tom fill (no HH)
      sn[5*S] = 1; sn[5*S+1] = 1
      t1[5*S+2] = 1; t1[5*S+3] = 1
      t2[5*S+4] = 1; t2[5*S+5] = 1
      ft[5*S+6] = 1
      cr[5*S+7] = 1; kk[5*S+7] = 1

      return createPattern(24, 2, {
        [DrumPad.HiHatClosed]: hh,
        [DrumPad.Snare]: sn,
        [DrumPad.Kick]: kk,
        [DrumPad.CrashCymbal]: cr,
        [DrumPad.Tom1]: t1,
        [DrumPad.Tom2]: t2,
        [DrumPad.FloorTom]: ft,
      })
    })(),
    tags: ['multi-bar', '6-bar', 'intermediate'],
  },
]

// ─── Genre Beats Library ────────────────────────────────────────────────────

export const GENRE_BEATS: PracticeItem[] = [
  // ── Rock ──
  {
    id: 'rock-01',
    title: 'Basic Rock Beat',
    description: 'The classic rock groove — hi-hat eighths, snare 2+4, kick 1+3. The #1 beat in music.',
    category: 'rock',
    difficulty: 3,
    bpm: 100,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.HiHatClosed]: hits(8, [0,1,2,3,4,5,6,7]),
      [DrumPad.Snare]: hits(8, [2, 6]),
      [DrumPad.Kick]: hits(8, [0, 4]),
    }),
    tags: ['rock', 'essential'],
  },
  {
    id: 'rock-02',
    title: 'Rock Beat — Kick Variation',
    description: 'Rock beat with kick on 1, "and" of 2, and 3. Adds forward momentum.',
    category: 'rock',
    difficulty: 4,
    bpm: 100,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.HiHatClosed]: hits(8, [0,1,2,3,4,5,6,7]),
      [DrumPad.Snare]: hits(8, [2, 6]),
      [DrumPad.Kick]: hits(8, [0, 3, 4]),
    }),
    tags: ['rock', 'kick-variation'],
  },
  {
    id: 'rock-03',
    title: 'Driving Rock',
    description: 'Quarter notes on the ride, snare 2+4, busy kick pattern. Think AC/DC.',
    category: 'rock',
    difficulty: 5,
    bpm: 110,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.RideCymbal]: hits(8, [0,2,4,6]),
      [DrumPad.Snare]: hits(8, [2, 6]),
      [DrumPad.Kick]: hits(8, [0, 1, 4, 5]),
    }),
    tags: ['rock', 'ride', 'driving'],
  },
  // ── Pop ──
  {
    id: 'pop-01',
    title: 'Four-on-the-Floor',
    description: 'Kick on every beat, hi-hat eighths, snare 2+4. The disco/pop staple.',
    category: 'pop',
    difficulty: 3,
    bpm: 110,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.HiHatClosed]: hits(8, [0,1,2,3,4,5,6,7]),
      [DrumPad.Snare]: hits(8, [2, 6]),
      [DrumPad.Kick]: hits(8, [0, 2, 4, 6]),
    }),
    tags: ['pop', 'four-on-floor', 'essential'],
  },
  {
    id: 'pop-02',
    title: 'Syncopated Pop',
    description: 'Pop beat with syncopated kick — "and" of 4 pushes into the next bar.',
    category: 'pop',
    difficulty: 5,
    bpm: 100,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.HiHatClosed]: hits(8, [0,1,2,3,4,5,6,7]),
      [DrumPad.Snare]: hits(8, [2, 6]),
      [DrumPad.Kick]: hits(8, [0, 4, 7]),
    }),
    tags: ['pop', 'syncopation'],
  },
  // ── Funk ──
  {
    id: 'funk-01',
    title: 'Basic Funk',
    description: 'Syncopated kick with hi-hat sixteenths. The groove starts here.',
    category: 'funk',
    difficulty: 5,
    bpm: 90,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.HiHatClosed]: hits(16, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]),
      [DrumPad.Snare]: hits(16, [4, 12]),
      [DrumPad.Kick]: hits(16, [0, 3, 6, 8, 11]),
    }),
    tags: ['funk', 'sixteenths'],
  },
  {
    id: 'funk-02',
    title: 'Ghost Note Funk',
    description: 'Ghost notes between backbeats — the James Brown feel. Snare dynamics are everything.',
    category: 'funk',
    difficulty: 7,
    bpm: 85,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.HiHatClosed]: hits(8, [0,1,2,3,4,5,6,7]),
      [DrumPad.Snare]: [3,3,2,3, 3,3,2,3] as HitValue[],
      [DrumPad.Kick]: hits(8, [0, 3, 4, 7]),
    }),
    tags: ['funk', 'ghost-notes', 'dynamics'],
  },
  // ── Jazz ──
  {
    id: 'jazz-01',
    title: 'Swing Ride Pattern',
    description: 'Quarter notes on the ride with the jazz "spang-a-lang" feel. Kick feathers on all 4.',
    category: 'jazz',
    difficulty: 5,
    bpm: 130,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 1, {
      [DrumPad.RideCymbal]: hits(4, [0, 1, 2, 3]),
      [DrumPad.Kick]: [3, 3, 3, 3] as HitValue[],
    }),
    tags: ['jazz', 'ride', 'swing'],
  },
  {
    id: 'jazz-02',
    title: 'Jazz Beat with Hi-Hat Foot',
    description: 'Ride pattern + hi-hat foot on 2 and 4 + snare comping. Classic jazz timekeeping.',
    category: 'jazz',
    difficulty: 6,
    bpm: 120,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.RideCymbal]: hits(8, [0, 2, 4, 6]),
      [DrumPad.HiHatPedal]: hits(8, [2, 6]),
      [DrumPad.Snare]: hits(8, [3, 7]),
    }),
    tags: ['jazz', 'hi-hat-foot', 'comping'],
  },
  // ── Latin ──
  {
    id: 'latin-01',
    title: 'Bossa Nova',
    description: 'The classic bossa nova pattern — cross-stick on snare, bass drum pattern, hi-hat foot.',
    category: 'latin',
    difficulty: 6,
    bpm: 120,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.HiHatClosed]: hits(16, [0,2,4,6,8,10,12,14]),
      [DrumPad.Snare]: hits(16, [6, 12]),
      [DrumPad.Kick]: hits(16, [0, 3, 8, 11]),
    }),
    tags: ['latin', 'bossa-nova'],
  },
  // ── Metal ──
  {
    id: 'metal-01',
    title: 'Metal — Straight Eighths',
    description: 'Aggressive eighth notes on the ride, fast kick pattern. Thrash territory.',
    category: 'metal',
    difficulty: 6,
    bpm: 140,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.RideCymbal]: hits(8, [0,1,2,3,4,5,6,7]),
      [DrumPad.Snare]: hits(8, [2, 6]),
      [DrumPad.Kick]: hits(8, [0, 1, 4, 5]),
    }),
    tags: ['metal', 'fast'],
  },
  {
    id: 'metal-02',
    title: 'Double Kick Intro',
    description: 'Steady sixteenth notes on kick with half-time snare and crash. Building double bass chops.',
    category: 'metal',
    difficulty: 8,
    bpm: 100,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.CrashCymbal]: hits(16, [0]),
      [DrumPad.HiHatClosed]: hits(16, [4, 8, 12]),
      [DrumPad.Snare]: hits(16, [8]),
      [DrumPad.Kick]: hits(16, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]),
    }),
    tags: ['metal', 'double-kick'],
  },
]

// ─── Fill Challenges ─────────────────────────────────────────────────────────

export const FILL_CHALLENGES: PracticeItem[] = [
  {
    id: 'fill-01',
    title: 'One-Beat Snare Fill',
    description: 'Groove with a fill on beat 4: four sixteenths on snare.',
    category: 'fills',
    difficulty: 3,
    bpm: 90,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.HiHatClosed]: hits(16, [0,2,4,6,8,10,12,14]),
      [DrumPad.Snare]: hits(16, [4, 12, 13, 14, 15]),  // backbeats + fill on beat 4
      [DrumPad.Kick]: hits(16, [0, 8]),
    }),
    tags: ['fill', 'one-beat', 'beginner'],
  },
  {
    id: 'fill-02',
    title: 'Two-Beat Tom Fill',
    description: 'Groove on beats 1-2, fill on beats 3-4: descending toms.',
    category: 'fills',
    difficulty: 4,
    bpm: 90,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.HiHatClosed]: hits(16, [0,2,4,6]),
      [DrumPad.Snare]: hits(16, [4]),
      [DrumPad.Kick]: hits(16, [0]),
      [DrumPad.Tom1]: hits(16, [8, 9]),
      [DrumPad.Tom2]: hits(16, [10, 11]),
      [DrumPad.FloorTom]: hits(16, [12, 13, 14, 15]),
    }),
    tags: ['fill', 'two-beat', 'toms'],
  },
  {
    id: 'fill-03',
    title: 'Full-Bar Fill — Singles',
    description: 'One full bar fill: single strokes descending across all toms and snare.',
    category: 'fills',
    difficulty: 5,
    bpm: 85,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: hits(16, [0, 1, 2, 3]),
      [DrumPad.Tom1]: hits(16, [4, 5, 6, 7]),
      [DrumPad.Tom2]: hits(16, [8, 9]),
      [DrumPad.FloorTom]: hits(16, [10, 11, 12, 13, 14, 15]),
    }),
    tags: ['fill', 'full-bar', 'toms', 'intermediate'],
  },
  {
    id: 'fill-04',
    title: 'Accented Fill',
    description: 'Full bar: accented notes on beats, ghost notes between. Dynamic fill.',
    category: 'fills',
    difficulty: 6,
    bpm: 80,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [2,3,3,3,2,3,3,3, 0,0,0,0,0,0,0,0] as HitValue[],
      [DrumPad.Tom1]: [0,0,0,0,0,0,0,0, 2,3,3,3,0,0,0,0] as HitValue[],
      [DrumPad.FloorTom]: [0,0,0,0,0,0,0,0, 0,0,0,0,2,3,2,1] as HitValue[],
    }),
    tags: ['fill', 'accents', 'dynamics', 'intermediate'],
  },
  {
    id: 'fill-05',
    title: 'Triplet Fill',
    description: 'Eighth-note triplets across snare and toms. The classic Bonham fill.',
    category: 'fills',
    difficulty: 5,
    bpm: 95,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 3, {
      [DrumPad.Snare]: hits(12, [0, 1, 2]),
      [DrumPad.Tom1]: hits(12, [3, 4, 5]),
      [DrumPad.Tom2]: hits(12, [6, 7, 8]),
      [DrumPad.FloorTom]: hits(12, [9, 10, 11]),
    }),
    tags: ['fill', 'triplets', 'toms', 'intermediate'],
  },
  {
    id: 'fill-06',
    title: 'Linear Fill — Hands & Feet',
    description: 'No two limbs hit together. Kick weaves between snare and toms for a funky fill.',
    category: 'fills',
    difficulty: 6,
    bpm: 85,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: hits(16, [0, 2, 4, 8, 10]),
      [DrumPad.Kick]: hits(16, [1, 5, 9, 13]),
      [DrumPad.Tom1]: hits(16, [6, 14]),
      [DrumPad.FloorTom]: hits(16, [3, 7, 11, 15]),
    }),
    tags: ['fill', 'linear', 'kick', 'intermediate'],
  },
  {
    id: 'fill-07',
    title: 'Paradiddle Fill',
    description: 'RLRR LRLL sticking around the kit. Moves from snare to toms using paradiddle pattern.',
    category: 'fills',
    difficulty: 6,
    bpm: 80,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [2,1,0,0, 0,0,2,1, 0,0,0,0, 0,0,0,0] as HitValue[],
      [DrumPad.Tom1]: [0,0,1,1, 0,0,0,0, 2,1,0,0, 0,0,0,0] as HitValue[],
      [DrumPad.Tom2]: [0,0,0,0, 1,1,0,0, 0,0,1,1, 0,0,0,0] as HitValue[],
      [DrumPad.FloorTom]: [0,0,0,0, 0,0,0,0, 0,0,0,0, 2,1,1,1] as HitValue[],
    }),
    tags: ['fill', 'paradiddle', 'intermediate'],
  },
  {
    id: 'fill-08',
    title: 'Crash Punctuation Fill',
    description: 'Sixteenths on snare building up, ending with crash + kick on the "1" of next bar.',
    category: 'fills',
    difficulty: 4,
    bpm: 100,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: hits(16, [8, 9, 10, 11, 12, 13, 14, 15]),
      [DrumPad.HiHatClosed]: hits(16, [0, 2, 4, 6]),
      [DrumPad.Kick]: hits(16, [0, 4]),
      [DrumPad.CrashCymbal]: hits(16, [0]),
    }),
    tags: ['fill', 'crash', 'snare-roll', 'beginner'],
  },
  {
    id: 'fill-09',
    title: 'Syncopated Kick Fill',
    description: 'Offbeat kicks with snare accents. Used in funk and gospel drumming.',
    category: 'fills',
    difficulty: 7,
    bpm: 85,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [2,0,1,0, 2,0,1,0, 2,0,1,0, 2,0,0,0] as HitValue[],
      [DrumPad.Kick]: hits(16, [1, 3, 5, 7, 9, 11, 14, 15]),
    }),
    tags: ['fill', 'syncopated', 'kick', 'advanced'],
  },
  {
    id: 'fill-10',
    title: 'Flam Fill',
    description: 'Flam accents descending through toms. Fat, powerful sound.',
    category: 'fills',
    difficulty: 7,
    bpm: 75,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [2,0,0,0, 2,0,0,0, 0,0,0,0, 0,0,0,0] as HitValue[],
      [DrumPad.Tom1]: [0,0,0,0, 0,0,0,0, 2,0,0,0, 0,0,0,0] as HitValue[],
      [DrumPad.Tom2]: [0,0,0,0, 0,0,0,0, 0,0,0,0, 2,0,0,0] as HitValue[],
      [DrumPad.FloorTom]: [0,0,1,1, 0,0,1,1, 0,0,1,1, 0,0,1,1] as HitValue[],
    }),
    tags: ['fill', 'flams', 'toms', 'advanced'],
  },
  {
    id: 'fill-11',
    title: 'Double Stroke Fill',
    description: 'RRLL doubles descending snare → toms → floor. Speed builder.',
    category: 'fills',
    difficulty: 8,
    bpm: 80,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: hits(16, [0, 1, 2, 3]),
      [DrumPad.Tom1]: hits(16, [4, 5, 6, 7]),
      [DrumPad.Tom2]: hits(16, [8, 9, 10, 11]),
      [DrumPad.FloorTom]: hits(16, [12, 13]),
      [DrumPad.CrashCymbal]: hits(16, [14]),
      [DrumPad.Kick]: hits(16, [14, 15]),
    }),
    tags: ['fill', 'doubles', 'speed', 'advanced'],
  },
  {
    id: 'fill-12',
    title: 'Half-Bar Groove + Fill',
    description: 'Two beats of groove, two beats of fill. Practice smooth groove-to-fill transitions.',
    category: 'fills',
    difficulty: 3,
    bpm: 95,
    timeSignature: [4, 4],
    bars: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.HiHatClosed]: hits(8, [0, 1, 2, 3]),
      [DrumPad.Snare]: hits(8, [2, 4, 5, 6, 7]),
      [DrumPad.Kick]: hits(8, [0]),
    }),
    tags: ['fill', 'half-bar', 'beginner'],
  },
]

// ─── Rudiments (PAS 40) — first 13 most essential ──────────────────────────

export const RUDIMENTS_LIBRARY: RudimentDef[] = [
  {
    id: 'rud-01', name: 'Single Stroke Roll', sticking: 'R L R L R L R L',
    category: 'rolls', description: 'The most fundamental rudiment. Alternate hands evenly.',
    startBpm: 70, difficulty: 1,
    patternData: createPattern(4, 2, {
      [DrumPad.Snare]: hits(8, [0,1,2,3,4,5,6,7]),
    }),
  },
  {
    id: 'rud-02', name: 'Single Stroke Four', sticking: 'R L R L (repeat)',
    category: 'rolls', description: 'Four alternating strokes, grouped in fours.',
    startBpm: 70, difficulty: 2,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: hits(16, [0,1,2,3,  8,9,10,11]),
    }),
  },
  {
    id: 'rud-03', name: 'Double Stroke Roll', sticking: 'R R L L R R L L',
    category: 'rolls', description: 'Two hits per hand. Control the bounce.',
    startBpm: 60, difficulty: 3,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: hits(16, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]),
    }),
  },
  {
    id: 'rud-04', name: 'Buzz Roll', sticking: 'Rz Lz Rz Lz',
    category: 'rolls', description: 'Press into the head and let the stick buzz. Sustained sound.',
    startBpm: 60, difficulty: 4,
    patternData: createPattern(4, 2, {
      [DrumPad.Snare]: hits(8, [0,1,2,3,4,5,6,7]),
    }),
  },
  {
    id: 'rud-05', name: 'Single Paradiddle', sticking: 'R L R R  L R L L',
    category: 'diddles', description: 'The paradiddle — accent the first note. Used to switch leading hands.',
    startBpm: 65, difficulty: 4,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [2,1,1,1,  2,1,1,1,  2,1,1,1,  2,1,1,1] as HitValue[],
    }),
  },
  {
    id: 'rud-06', name: 'Double Paradiddle', sticking: 'R L R L R R  L R L R L L',
    category: 'diddles', description: 'Extended paradiddle — 6 notes per group with the diddle at the end.',
    startBpm: 60, difficulty: 5,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [2,1,1,1,1,1,  2,1,1,1,1,1,  0,0,0,0] as HitValue[],
    }),
  },
  {
    id: 'rud-07', name: 'Flam', sticking: 'lR rL lR rL',
    category: 'flams', description: 'Grace note before the main stroke. Fatter sound.',
    startBpm: 70, difficulty: 3,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [2,0,0,0,  2,0,0,0,  2,0,0,0,  2,0,0,0] as HitValue[],
    }),
  },
  {
    id: 'rud-08', name: 'Flam Accent', sticking: 'lR L R  rL R L',
    category: 'flams', description: 'Flam followed by two taps. A great triplet-based rudiment.',
    startBpm: 60, difficulty: 5,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [2,1,1,  2,1,1,  2,1,1,  2,1,1,  0,0,0,0] as HitValue[],
    }),
  },
  {
    id: 'rud-09', name: 'Flam Tap', sticking: 'lR R  rL L',
    category: 'flams', description: 'Flam + tap. Each hand plays flam then double.',
    startBpm: 60, difficulty: 5,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [2,1,  2,1,  2,1,  2,1,  2,1,  2,1,  2,1,  2,1] as HitValue[],
    }),
  },
  {
    id: 'rud-10', name: 'Drag (Single Drag Tap)', sticking: 'llR L  rrL R',
    category: 'drags', description: 'Two grace notes before the main stroke, then a tap.',
    startBpm: 60, difficulty: 4,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [2,0,1,0,  2,0,1,0,  2,0,1,0,  2,0,1,0] as HitValue[],
    }),
  },
  {
    id: 'rud-11', name: 'Five Stroke Roll', sticking: 'R R L L R',
    category: 'rolls', description: 'Five strokes ending with an accent. Compact roll.',
    startBpm: 65, difficulty: 5,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [1,1,1,1,2,0,0,0, 1,1,1,1,2,0,0,0] as HitValue[],
    }),
  },
  {
    id: 'rud-12', name: 'Seven Stroke Roll', sticking: 'R R L L R R L',
    category: 'rolls', description: 'Seven strokes — longer sustained roll.',
    startBpm: 60, difficulty: 6,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [1,1,1,1,1,1,2,0, 1,1,1,1,1,1,2,0] as HitValue[],
    }),
  },
  {
    id: 'rud-13', name: 'Paradiddle-diddle', sticking: 'R L R R L L',
    category: 'diddles', description: 'Single stroke + double strokes. Common in 6/8 feels.',
    startBpm: 60, difficulty: 6,
    patternData: createPattern(4, 4, {
      [DrumPad.Snare]: [2,1,1,1,1,1,  2,1,1,1,1,1,  0,0,0,0] as HitValue[],
    }),
  },
]

// ─── Aggregate all practice items ───────────────────────────────────────────

export function getAllPracticeItems(): PracticeItem[] {
  return [
    ...READING_EXERCISES,
    ...GENRE_BEATS,
    ...FILL_CHALLENGES,
  ]
}

export function getPracticeItemById(id: string): PracticeItem | undefined {
  return getAllPracticeItems().find(p => p.id === id)
}

export function getRudimentById(id: string): RudimentDef | undefined {
  return RUDIMENTS_LIBRARY.find(r => r.id === id)
}
