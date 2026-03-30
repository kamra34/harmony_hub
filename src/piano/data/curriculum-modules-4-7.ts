import type { Module, Lesson, Exercise } from '../types/curriculum'

// ═══════════════════════════════════════════════════════════════════════════════
// Modules 4-7: Scales, Chords, Expression, Early Intermediate
// Based on Alfred's Basic Adult Piano Course Levels 2-3
// ═══════════════════════════════════════════════════════════════════════════════

// ── Module 4: Scales & Key Signatures ────────────────────────────────────────

const MODULE_4_LESSONS: Lesson[] = [
  { id: 'p4-l1', moduleId: 'piano-4', title: 'C Major Scale: Hands Separate', order: 0, completed: false, content: [
    { type: 'text', content: `A **scale** is the foundation of virtually all melodies, harmonies, and exercises. The C major scale — **C D E F G A B C** — spans one full octave using all white keys.\n\n## Right Hand Fingering\n\nThe standard RH fingering for one octave:\n\n**1 — 2 — 3 — 1 — 2 — 3 — 4 — 5**\n\nThe critical moment is the **thumb-under** between E (finger 3) and F (finger 1). Your thumb tucks smoothly beneath your hand to reach F while finger 3 is still holding E.\n\n## Left Hand Fingering\n\n**5 — 4 — 3 — 2 — 1 — 3 — 2 — 1**\n\nThe LH crossover happens between G (finger 1) and A (finger 3). Finger 3 crosses over the thumb.\n\n## Practice Method\n\n1. RH alone: ascending slowly (C to C), then descending\n2. LH alone: ascending, then descending\n3. Each hand 10 times before moving on\n4. Start at 60 BPM — increase only when flawless\n\n> The thumb-under is the most important technical skill for scales. If it bumps or hesitates, practice JUST the crossover (E-F-G, F-E-D) 20 times.` },
    { type: 'quiz', question: 'In the RH C major scale, the thumb crosses under after which finger?', options: ['Finger 2', 'Finger 3', 'Finger 4', 'Finger 5'], correctIndex: 1, explanation: 'The thumb (1) crosses under finger 3 between E and F.' },
  ]},
  { id: 'p4-l2', moduleId: 'piano-4', title: 'C Major Scale: Hands Together', order: 1, completed: false, content: [
    { type: 'text', content: `Playing scales hands together is one of the great challenges. The fingers do NOT move in mirror — each hand has its own fingering, and the thumb-unders happen at different points.\n\n## The Coordination Challenge\n\n| Note | C | D | E | F | G | A | B | C |\n| ---- | - | - | - | - | - | - | - | - |\n| RH | 1 | 2 | 3 | **1** | 2 | 3 | 4 | 5 |\n| LH | 5 | 4 | 3 | 2 | **1** | **3** | 2 | 1 |\n\nRH thumb-under at **F**, LH crossover at **A**. They do NOT coincide.\n\n## Practice Strategy\n\n1. Play hands separately until automatic\n2. Play hands together at **half speed** — one note at a time\n3. Pause on each note to check: are both hands on the correct finger?\n4. Gradually remove the pauses\n5. Speed up only when zero hesitation remains` },
    { type: 'quiz', question: 'Do the RH and LH thumb-unders happen at the same note?', options: ['Yes, both at F', 'Yes, both at G', 'No, they happen at different notes', 'Scales do not have thumb-unders'], correctIndex: 2, explanation: 'RH thumb-under is at F, LH crossover is at A. This offset makes hands-together scales challenging.' },
  ]},
  { id: 'p4-l3', moduleId: 'piano-4', title: 'G Major Scale and Key Signature', order: 2, completed: false, content: [
    { type: 'text', content: `## G Major Scale\n\n**G — A — B — C — D — E — F# — G**\n\nThe **F must be sharped** to maintain the major scale pattern (W-W-H-W-W-W-H).\n\n## Key Signature: 1 Sharp (F#)\n\nEvery F is played as F# throughout the piece unless cancelled by a natural sign.\n\n## Fingering\n\nSame as C major: RH 1-2-3-1-2-3-4-5, LH 5-4-3-2-1-3-2-1\n\n## The Order of Sharps: F-C-G-D-A-E-B\n\nMnemonic: **F**ather **C**harles **G**oes **D**own **A**nd **E**nds **B**attle\n\nG major = 1 sharp (F#). D major = 2 (F#, C#). A major = 3 (F#, C#, G#). And so on.` },
    { type: 'quiz', question: 'What note is sharped in G major?', options: ['C', 'D', 'F', 'G'], correctIndex: 2, explanation: 'G major has one sharp: F#.' },
  ]},
  { id: 'p4-l4', moduleId: 'piano-4', title: 'F Major Scale and Key Signature', order: 3, completed: false, content: [
    { type: 'text', content: `## F Major Scale\n\n**F — G — A — Bb — C — D — E — F**\n\nThe **B must be flatted** to maintain the half-step between notes 3 and 4.\n\n## Key Signature: 1 Flat (Bb)\n\n## Special RH Fingering\n\nF major has a different RH fingering: **1 — 2 — 3 — 4 — 1 — 2 — 3 — 4**\n\nThumb-under happens after finger 4 on Bb (not finger 3 as usual), because Bb falls naturally under finger 4.\n\nLH fingering is standard: 5-4-3-2-1-3-2-1\n\n## The Order of Flats: B-E-A-D-G-C-F\n\nMnemonic: **B**attle **E**nds **A**nd **D**own **G**oes **C**harles' **F**ather\n\n(Reverse of the sharps order!)` },
    { type: 'quiz', question: 'Why does F major have different RH fingering?', options: ['It uses only black keys', 'Bb falls naturally under finger 4', 'It has no thumb-under', 'It is played with the left hand'], correctIndex: 1, explanation: 'Because Bb is a black key that sits higher, it falls naturally under finger 4.' },
  ]},
  { id: 'p4-l5', moduleId: 'piano-4', title: 'Scale Fingering Patterns', order: 4, completed: false, content: [
    { type: 'text', content: `## Two Major Scale Fingering Groups\n\n### Group 1: Standard (C, D, E, G, A major)\nRH: **1-2-3 | 1-2-3-4-5** — thumb-under after finger 3\n\n### Group 2: Modified (F, Bb major)\nRH: **1-2-3-4 | 1-2-3-4** — thumb-under after finger 4\n\n## The Thumb-Under Rule\n\n**The thumb never plays a black key in a scale.** If the next note after a natural thumb-under point is black, extend one more finger.\n\n## Practice All Three Scales\n\nPlay each 4 times ascending and descending:\n1. C major (standard, all white)\n2. G major (standard, one black)\n3. F major (modified, one black)` },
    { type: 'quiz', question: 'What is the rule about the thumb in scales?', options: ['Thumb always plays first', 'Thumb never plays a black key', 'Thumb plays every other note', 'Thumb only plays C'], correctIndex: 1, explanation: 'The thumb never plays a black key in standard scale fingering.' },
  ]},
  { id: 'p4-l6', moduleId: 'piano-4', title: 'D Minor: Natural and Harmonic', order: 5, completed: false, content: [
    { type: 'text', content: `## D Natural Minor\n\n**D — E — F — G — A — Bb — C — D** (pattern: W-H-W-W-H-W-W)\n\nRelative minor of F major — same key signature (1 flat: Bb).\n\n## D Harmonic Minor\n\n**D — E — F — G — A — Bb — C# — D**\n\nRaises the 7th note (C→C#). Creates an exotic augmented 2nd between Bb and C#.\n\n## Why Two Versions?\n\n- **Natural**: smoother melodies, folk-like sound\n- **Harmonic**: stronger pull to tonic, used in harmony (V chord needs the raised 7th)` },
    { type: 'quiz', question: 'What differs between natural and harmonic minor?', options: ['Different starting notes', 'Harmonic raises the 7th', 'Natural uses only black keys', 'They sound identical'], correctIndex: 1, explanation: 'Harmonic minor raises the 7th note by a half step.' },
  ]},
  { id: 'p4-l7', moduleId: 'piano-4', title: 'D Melodic Minor Scale', order: 6, completed: false, content: [
    { type: 'text', content: `## D Melodic Minor\n\n**Ascending**: D-E-F-G-A-**B**-**C#**-D (raises 6th AND 7th)\n**Descending**: D-C-Bb-A-G-F-E-D (reverts to natural minor)\n\nUnique: different notes going up vs. down!\n\n## Three Minor Scales Summary\n\n| Scale | 6th | 7th | Character |\n| ----- | --- | --- | --------- |\n| Natural | Bb | C | Pure minor |\n| Harmonic | Bb | C# | Exotic |\n| Melodic up | B | C# | Smooth ascending |\n| Melodic down | Bb | C | Same as natural |` },
    { type: 'quiz', question: 'What is unique about melodic minor?', options: ['No black keys', 'Sounds major', 'Different notes ascending vs descending', 'Starts on black key'], correctIndex: 2, explanation: 'Melodic minor raises 6th and 7th going up, reverts to natural minor going down.' },
  ]},
  { id: 'p4-l8', moduleId: 'piano-4', title: 'Introduction to the Circle of Fifths', order: 7, completed: false, content: [
    { type: 'text', content: `The **Circle of Fifths** is the master map of all keys.\n\n## How It Works\n\n- **12 major keys** in a circle\n- **Clockwise**: each key is a fifth higher, adds one sharp\n- **Counter-clockwise**: adds one flat\n- **Inner ring**: relative minor keys\n\n## The Pattern\n\nClockwise: C(0) → G(1#) → D(2#) → A(3#) → E(4#) → B(5#)\nCounter-clockwise: C(0) → F(1b) → Bb(2b) → Eb(3b) → Ab(4b) → Db(5b)\n\n## Why It Matters\n\n1. Instantly know sharps/flats for any key\n2. Common progressions use adjacent keys\n3. Songs that change key move to neighbors on the circle\n4. Relative minor is directly inside each major key` },
    { type: 'quiz', question: 'Moving clockwise on the Circle of Fifths does what?', options: ['Adds one flat', 'Removes accidentals', 'Adds one sharp', 'Changes to minor'], correctIndex: 2, explanation: 'Moving clockwise adds one sharp each step.' },
  ]},
]

const MODULE_4_EXERCISES: Exercise[] = [
  { id: 'p4-e1', moduleId: 'piano-4', title: 'C Major Scale (1 octave)', description: 'Play ascending and descending, hands separate. 4 reps each hand.', order: 0, exerciseType: 'scale', difficulty: 3, handsRequired: 'right', keySignature: 'C', targetBpm: 72 },
  { id: 'p4-e2', moduleId: 'piano-4', title: 'C Major Hands Together', description: 'Very slowly. Focus on independent thumb crossings.', order: 1, exerciseType: 'scale', difficulty: 4, handsRequired: 'both', keySignature: 'C', targetBpm: 56 },
  { id: 'p4-e3', moduleId: 'piano-4', title: 'G Major Scale', description: 'With correct F# in both hands.', order: 2, exerciseType: 'scale', difficulty: 3, handsRequired: 'right', keySignature: 'G', targetBpm: 66 },
  { id: 'p4-e4', moduleId: 'piano-4', title: 'F Major Scale', description: 'Modified RH fingering (1-2-3-4-1-2-3-4).', order: 3, exerciseType: 'scale', difficulty: 3, handsRequired: 'right', keySignature: 'F', targetBpm: 66 },
  { id: 'p4-e5', moduleId: 'piano-4', title: 'D Natural Minor', description: 'One octave, hands separate.', order: 4, exerciseType: 'scale', difficulty: 3, handsRequired: 'right', keySignature: 'Dm' },
  { id: 'p4-e6', moduleId: 'piano-4', title: 'D Harmonic Minor', description: 'Feel the exotic augmented 2nd between Bb and C#.', order: 5, exerciseType: 'scale', difficulty: 3, handsRequired: 'right', keySignature: 'Dm' },
  { id: 'p4-e7', moduleId: 'piano-4', title: 'Thumb-Under Drill', description: 'RH: E-F-G-F-E (3-1-2-1-3) 20 times. Smooth, no bump.', order: 6, exerciseType: 'technique', difficulty: 2, handsRequired: 'right', targetBpm: 60 },
  { id: 'p4-e8', moduleId: 'piano-4', title: 'Key Signature ID', description: 'Name the key for: 1#, 2#, 1b, 2b, 3b.', order: 7, exerciseType: 'sight-reading', difficulty: 3, handsRequired: 'right' },
]

// ── Module 5: Chords & Harmony ──────────────────────────────────────────────

const MODULE_5_LESSONS: Lesson[] = [
  { id: 'p5-l1', moduleId: 'piano-5', title: 'Primary Chords in C (I, IV, V7)', order: 0, completed: false, content: [
    { type: 'text', content: `## The Three Chords That Rule Music\n\n| Roman | Chord | Notes | Function |\n| ----- | ----- | ----- | -------- |\n| **I** | C | C-E-G | **Tonic** — home |\n| **IV** | F | F-A-C | **Subdominant** — departure |\n| **V7** | G7 | G-B-D-F | **Dominant** — tension, resolves to I |\n\n## The I-IV-V7-I Progression\n\nPlay: **C → F → G7 → C**\n\nCountless songs use only these three chords: "Twist and Shout," "La Bamba," "Wild Thing," and thousands more.\n\nPractice with LH block chords, 4 beats each.` },
    { type: 'quiz', question: 'What is the function of V7?', options: ['Rest', 'Departure', 'Tension that resolves to I', 'No function'], correctIndex: 2, explanation: 'V7 creates maximum tension that pulls back to I.' },
  ]},
  { id: 'p5-l2', moduleId: 'piano-5', title: 'Primary Chords in G and F', order: 1, completed: false, content: [
    { type: 'text', content: `The I-IV-V7 pattern works in every key.\n\n## G Major: G — C — D7 — G\n\n## F Major: F — Bb — C7 — F\n\n## The Universal Pattern\n\nIn ANY major key:\n- **I** = chord on 1st scale note\n- **IV** = chord on 4th scale note\n- **V7** = chord on 5th note + 7th\n\nOnce you know a scale, you know its primary chords.` },
    { type: 'quiz', question: 'In G major, what is V7?', options: ['G7', 'C7', 'D7', 'F7'], correctIndex: 2, explanation: 'V is the 5th note of G major = D, so V7 = D7.' },
  ]},
  { id: 'p5-l3', moduleId: 'piano-5', title: 'Chord Inversions', order: 2, completed: false, content: [
    { type: 'text', content: `## Why Inversions?\n\nKeep your hand close to the same area instead of jumping.\n\n## C Major Three Ways\n\n| Position | Notes | Bottom note |\n| -------- | ----- | ----------- |\n| Root | C-E-G | C |\n| 1st inversion | E-G-C | E |\n| 2nd inversion | G-C-E | G |\n\n## Practical Use: Smooth Voice Leading\n\nInstead of C root → F root (big jump), use:\nC root (C-E-G) → F 2nd inv (C-F-A) — the C stays, only two notes move!\n\n## Fingering\n- Root: 1-3-5\n- 1st inv: 1-2-5\n- 2nd inv: 1-3-5` },
    { type: 'quiz', question: 'What is a chord inversion?', options: ['Playing backwards', 'Changing which note is on bottom', 'Different key', 'Adding notes'], correctIndex: 1, explanation: 'An inversion changes which note is lowest.' },
  ]},
  { id: 'p5-l4', moduleId: 'piano-5', title: 'Broken Chords: Alberti Bass', order: 3, completed: false, content: [
    { type: 'text', content: `## The Alberti Bass\n\nThe most famous broken chord pattern: **Bottom — Top — Middle — Top**\n\nFor C major: **C — G — E — G** (LH fingers: 5-1-3-1)\n\nAppears in Mozart, Haydn, Beethoven, and countless others.\n\n## Other Patterns\n\n| Pattern | Example |\n| ------- | ------- |\n| Ascending arpeggio | C-E-G-C |\n| Alberti bass | C-G-E-G |\n| Waltz | C — E-G — E-G |\n\nPractice: Alberti bass through C-F-G7-C progression.` },
    { type: 'quiz', question: 'What is the Alberti bass pattern?', options: ['All at once', 'Bottom-Top-Middle-Top', 'Ascending scale', 'Random'], correctIndex: 1, explanation: 'Bottom-Top-Middle-Top, creating a gentle rocking accompaniment.' },
  ]},
  { id: 'p5-l5', moduleId: 'piano-5', title: 'Common Chord Progressions', order: 4, completed: false, content: [
    { type: 'text', content: `## Beyond I-IV-V\n\n### The Pop Progression: I-V-vi-IV\nIn C: **C — G — Am — F**\n\nAppears in "Let It Be," "No Woman No Cry," "Someone Like You."\n\n### The Jazz Progression: ii-V-I\nIn C: **Dm — G7 — C**\n\n### The 50s Progression: I-vi-IV-V\nIn C: **C — Am — F — G**\n\n## Practice Each\n\nPlay as LH block chords, 4 beats each. Repeat 4 times. Feel the emotional journey of each progression.` },
    { type: 'quiz', question: 'What is the most common pop progression?', options: ['I-IV-V-I', 'I-V-vi-IV', 'ii-V-I', 'I-ii-iii-IV'], correctIndex: 1, explanation: 'I-V-vi-IV appears in a massive number of hit songs.' },
  ]},
  { id: 'p5-l6', moduleId: 'piano-5', title: 'Accompaniment Patterns', order: 5, completed: false, content: [
    { type: 'text', content: `## LH Patterns + RH Melody\n\n## Pattern 1: Block Chords\nFull chord on beat 1, hold. Best for slow songs.\n\n## Pattern 2: Bass + Chord\nBeat 1: root alone. Beat 3: upper chord notes.\n\n## Pattern 3: Alberti Bass\nBroken chord as eighth notes. For Classical style.\n\n## Pattern 4: Arpeggiated\nChord notes ascending. For ballads.\n\n## Assignment\nPick a melody (Ode to Joy). Add LH block chords first, then try other patterns.` },
    { type: 'quiz', question: 'In bass + chord pattern, what plays on beat 1?', options: ['Full chord', 'Root note alone', 'Rest', 'Melody'], correctIndex: 1, explanation: 'Beat 1 plays just the root. Beat 3 plays the upper chord notes.' },
  ]},
  { id: 'p5-l7', moduleId: 'piano-5', title: 'Lead Sheet Reading', order: 6, completed: false, content: [
    { type: 'text', content: `## What Is a Lead Sheet?\n\nShows only melody + chord symbols. You create the accompaniment.\n\n## Common Chord Symbols\n\n| Symbol | Meaning |\n| ------ | ------- |\n| C | C major |\n| Cm | C minor |\n| C7 | Dominant 7th |\n| Cmaj7 | Major 7th |\n| Cm7 | Minor 7th |\n\n## How to Use\n1. RH plays written melody\n2. LH plays chords in any pattern you choose\n3. YOU decide the accompaniment style` },
    { type: 'quiz', question: 'What does a lead sheet show?', options: ['Full arrangement', 'Only left hand', 'Melody with chord symbols', 'Only rhythm'], correctIndex: 2, explanation: 'A lead sheet gives melody and chord symbols — you create the accompaniment.' },
  ]},
  { id: 'p5-l8', moduleId: 'piano-5', title: 'Chords + Melody Together', order: 7, completed: false, content: [
    { type: 'text', content: `## Your First Complete Piece\n\n"When the Saints Go Marching In" — Key of C, Chords: C, F, G7\n\n**RH Melody** (C Position):\nLine 1: C-E-F-G (hold) | C-E-F-G (hold)\nLine 2: C-E-F-G-E-C-E-D (hold)\nLine 3: E-E-D-C (hold) | C-E-G-G-F (hold)\nLine 4: E-F-G-E-C-D-C (hold)\n\n**LH**: Block chords (C, F, G7) changing where harmony shifts.\n\n## Learning Order\n1. RH melody alone until fluent\n2. LH chords alone\n3. Combine very slowly\n4. Speed up gradually\n\nCongratulations — you are playing a real song with melody AND harmony!` },
    { type: 'quiz', question: 'What is the best order for learning melody + chords?', options: ['Both together from start', 'LH first', 'Each hand alone, then combine slowly', 'Just read through quickly'], correctIndex: 2, explanation: 'Learn each hand separately, then combine slowly.' },
  ]},
]

const MODULE_5_EXERCISES: Exercise[] = [
  { id: 'p5-e1', moduleId: 'piano-5', title: 'I-IV-V7-I in C', description: 'C-F-G7-C, 4 beats each.', order: 0, exerciseType: 'chord-progression', difficulty: 3, handsRequired: 'left', keySignature: 'C', targetBpm: 60 },
  { id: 'p5-e2', moduleId: 'piano-5', title: 'I-IV-V7-I in G', description: 'G-C-D7-G, 4 beats each.', order: 1, exerciseType: 'chord-progression', difficulty: 3, handsRequired: 'left', keySignature: 'G', targetBpm: 60 },
  { id: 'p5-e3', moduleId: 'piano-5', title: 'I-IV-V7-I in F', description: 'F-Bb-C7-F, 4 beats each.', order: 2, exerciseType: 'chord-progression', difficulty: 3, handsRequired: 'left', keySignature: 'F', targetBpm: 60 },
  { id: 'p5-e4', moduleId: 'piano-5', title: 'Inversions Drill', description: 'C major root, 1st, 2nd inversion. Then F and G.', order: 3, exerciseType: 'chord-progression', difficulty: 3, handsRequired: 'right' },
  { id: 'p5-e5', moduleId: 'piano-5', title: 'Alberti Bass Pattern', description: 'Alberti bass through I-IV-V7-I in C.', order: 4, exerciseType: 'technique', difficulty: 4, handsRequired: 'left', targetBpm: 72 },
  { id: 'p5-e6', moduleId: 'piano-5', title: 'Pop Progression', description: 'C-G-Am-F as block chords, then bass+chord.', order: 5, exerciseType: 'chord-progression', difficulty: 3, handsRequired: 'both', keySignature: 'C', targetBpm: 72 },
  { id: 'p5-e7', moduleId: 'piano-5', title: 'When the Saints', description: 'Full arrangement: RH melody, LH chords.', order: 6, exerciseType: 'melody', difficulty: 5, handsRequired: 'both', keySignature: 'C', targetBpm: 80 },
]

// ── Module 6: Expression & Musicality ───────────────────────────────────────

const MODULE_6_LESSONS: Lesson[] = [
  { id: 'p6-l1', moduleId: 'piano-6', title: 'Tempo Markings', order: 0, completed: false, content: [
    { type: 'text', content: `## Common Tempos (slowest to fastest)\n\n| Marking | Meaning | BPM |\n| ------- | ------- | --- |\n| **Largo** | Very slow | 40-60 |\n| **Adagio** | Slow, expressive | 60-76 |\n| **Andante** | Walking pace | 76-108 |\n| **Moderato** | Moderate | 108-120 |\n| **Allegro** | Fast, lively | 120-156 |\n| **Vivace** | Very fast | 156-176 |\n| **Presto** | Extremely fast | 176-200 |\n\n## Tempo Changes\n\n- **accelerando** — gradually speed up\n- **ritardando** — gradually slow down\n- **a tempo** — return to original tempo\n- **rubato** — freely flexible tempo\n\n> A piece played accurately slower always sounds better than rushed with mistakes.` },
    { type: 'quiz', question: 'What does Andante mean?', options: ['Very fast', 'Walking pace', 'Extremely slow', 'Moderately loud'], correctIndex: 1, explanation: 'Andante = walking pace, around 76-108 BPM.' },
  ]},
  { id: 'p6-l2', moduleId: 'piano-6', title: 'Staccato and Legato', order: 1, completed: false, content: [
    { type: 'text', content: `## Legato (connected)\nSlur over notes. Each note flows into the next. Default playing style.\n\n## Staccato (detached)\nDot above/below note. Release quickly — about half the written duration. Bouncy, crisp.\n\n## Staccato Technique\n- Hand "bounces" off key — wrist acts like a spring\n- Firm fingers, loose wrist\n- Motion should feel effortless\n\n## Practice\nPlay C major scale: first all legato, then all staccato, then alternating.` },
    { type: 'quiz', question: 'How is staccato marked?', options: ['Line above note', 'Dot above/below note', 'Curved line', 'Accent (>)'], correctIndex: 1, explanation: 'Staccato = small dot above or below the notehead.' },
  ]},
  { id: 'p6-l3', moduleId: 'piano-6', title: 'Accents and Articulation', order: 2, completed: false, content: [
    { type: 'text', content: `## Accent (>)\nPlay louder than surrounding notes. Momentary emphasis.\n\n## Tenuto (—)\nHold for full value. Opposite of staccato.\n\n## Marcato (^)\nStrong accent — more force than regular accent.\n\n## Combining Articulations\n- Staccato + accent: short but loud\n- Tenuto + accent: held and loud\n\nArticulation makes piano sound alive rather than mechanical.` },
    { type: 'quiz', question: 'What does tenuto mean?', options: ['Play short', 'Play loud', 'Hold full value', 'Play faster'], correctIndex: 2, explanation: 'Tenuto = hold for complete duration.' },
  ]},
  { id: 'p6-l4', moduleId: 'piano-6', title: 'Phrasing and Musical Sentences', order: 3, completed: false, content: [
    { type: 'text', content: `Music has **phrases** — musical thoughts, typically 4-8 measures.\n\n## Breathing Between Phrases\nLift hands slightly at phrase endings — like taking a breath.\n\n## Question and Answer\nMany pieces have phrase pairs:\n- **Antecedent**: ends unresolved\n- **Consequent**: ends resolved\n\n## Phrase Shaping\nMost phrases follow an arc: build to middle peak, taper off. Like natural speech.` },
    { type: 'quiz', question: 'What is the typical phrase shape?', options: ['Completely flat', 'Start loud, end loud', 'Build to peak, taper off', 'Random'], correctIndex: 2, explanation: 'Phrases naturally build to a peak then taper, like speech.' },
  ]},
  { id: 'p6-l5', moduleId: 'piano-6', title: 'Crescendo and Diminuendo', order: 4, completed: false, content: [
    { type: 'text', content: `## Crescendo (<): gradually louder\n## Diminuendo (>): gradually softer\n\nHairpin length matters — short = quick change, long = very gradual.\n\n## Practice: Dynamic Wave\nC major scale ascending: pp → ff\nDescending: ff → pp\n\nShould feel like a smooth wave, not stepped.` },
    { type: 'quiz', question: 'What does a crescendo hairpin look like?', options: ['> (closes)', '< (opens)', 'Dot', 'Curve'], correctIndex: 1, explanation: 'Crescendo opens to the right ( < ).' },
  ]},
  { id: 'p6-l6', moduleId: 'piano-6', title: 'Fermata and Ritardando', order: 5, completed: false, content: [
    { type: 'text', content: `## Fermata 𝄐\nHold longer than written. How much? Your artistic choice — typically 1.5-2x.\n\n## Ritardando (rit.)\nGradually slow down. Usually at endings.\n\n## A Tempo\nReturn to original speed after rit.\n\n## Practice\nPlay descending scale, rit. on last 3 notes, fermata on final note. Feel the satisfying conclusion.` },
    { type: 'quiz', question: 'What does a fermata mean?', options: ['Play louder', 'Play faster', 'Hold longer than written', 'Skip the note'], correctIndex: 2, explanation: 'Fermata = hold the note longer. The exact length is your artistic choice.' },
  ]},
  { id: 'p6-l7', moduleId: 'piano-6', title: 'Pedaling for Expression', order: 6, completed: false, content: [
    { type: 'text', content: `## Pedal Changes Follow Harmony\nChange pedal when chord changes. Holding through changes = mud.\n\n## Pedal Depth\n- Full: maximum sustain\n- Half: some sustain, less blur\n- Flutter: rapid shallow pumping\n\n## When NOT to Pedal\n- Staccato passages\n- Fast scale runs with changing harmonies\n- Passages marked "senza pedale"\n\nThe best pedaling is invisible — the listener feels warmth, not blur.` },
    { type: 'quiz', question: 'When should you change the pedal?', options: ['Every beat', 'When chord changes', 'Only at the end', 'Never'], correctIndex: 1, explanation: 'Change pedal with harmony changes to avoid blurring.' },
  ]},
  { id: 'p6-l8', moduleId: 'piano-6', title: 'Performance Preparation', order: 7, completed: false, content: [
    { type: 'text', content: `## The 5-Step Process\n\n1. **Analysis**: key, time sig, sections, hard spots\n2. **Hands separate**: correct fingering, 50% tempo\n3. **Hands together**: one phrase at a time, 50% tempo\n4. **Musical shaping**: dynamics, phrasing, pedal\n5. **Performance**: play through without stopping 3 times\n\n## The "3 Times" Rule\nIf you cannot play a passage correctly 3 times in a row, it is not learned — it is lucky. Go slower.` },
    { type: 'quiz', question: 'If you cannot play a passage 3 times correctly in a row?', options: ['Skip it', 'Play faster', 'Slow down until you can', 'Practice different piece'], correctIndex: 2, explanation: 'Slow down until 3 consecutive perfect repetitions. One correct attempt may be luck.' },
  ]},
]

const MODULE_6_EXERCISES: Exercise[] = [
  { id: 'p6-e1', moduleId: 'piano-6', title: 'Articulation Etude', description: 'C-D-E-F-G: legato, staccato, then alternating.', order: 0, exerciseType: 'technique', difficulty: 3, handsRequired: 'right', targetBpm: 80 },
  { id: 'p6-e2', moduleId: 'piano-6', title: 'Dynamic Wave', description: 'C major scale pp→ff ascending, ff→pp descending.', order: 1, exerciseType: 'technique', difficulty: 3, handsRequired: 'right', targetBpm: 66 },
  { id: 'p6-e3', moduleId: 'piano-6', title: 'Phrasing Exercise', description: 'Ode to Joy in 2-bar phrases with lifts between.', order: 2, exerciseType: 'melody', difficulty: 3, handsRequired: 'right', keySignature: 'C', targetBpm: 80 },
  { id: 'p6-e4', moduleId: 'piano-6', title: 'Expressive Pedaling', description: 'C-F-G7-C with legato pedal changes. No blur.', order: 3, exerciseType: 'technique', difficulty: 4, handsRequired: 'both' },
  { id: 'p6-e5', moduleId: 'piano-6', title: 'Performance Piece', description: 'Any previous melody with dynamics, phrasing, pedal. Perform 3x without stopping.', order: 4, exerciseType: 'melody', difficulty: 4, handsRequired: 'both', keySignature: 'C', targetBpm: 80 },
]

// ── Module 7: Early Intermediate Foundations ─────────────────────────────────

const MODULE_7_LESSONS: Lesson[] = [
  { id: 'p7-l1', moduleId: 'piano-7', title: 'A Minor Scale and Relative Minor', order: 0, completed: false, content: [
    { type: 'text', content: `## A Minor — All White Keys\n\n**A — B — C — D — E — F — G — A**\n\nRelative minor of C major — same key signature (no sharps/flats), different starting note.\n\n## Finding Any Relative Minor\nThe relative minor starts on the **6th note** of the major scale. Or count 3 half steps down.\n\n## Three Forms\n\n| Form | 6th | 7th |\n| ---- | --- | --- |\n| Natural | F | G |\n| Harmonic | F | G# |\n| Melodic up | F# | G# |` },
    { type: 'quiz', question: 'Relative minor of C major?', options: ['C minor', 'D minor', 'E minor', 'A minor'], correctIndex: 3, explanation: 'A minor starts on the 6th note of C major.' },
  ]},
  { id: 'p7-l2', moduleId: 'piano-7', title: 'Sixteenth Notes', order: 1, completed: false, content: [
    { type: 'text', content: `## Sixteenth Note 𝅘𝅥𝅯\n\nFour per beat. Two flags or two beams.\n\n## Counting: "1 e & a 2 e & a 3 e & a 4 e & a"\n\n## Common Patterns\n| Pattern | Counting |\n| ------- | -------- |\n| 4 sixteenths | 1-e-&-a |\n| Eighth + 2 sixteenths | 1-&-a |\n| Dotted eighth + sixteenth | 1---a |\n\nMust be **perfectly even**. Slow down until mathematically equal.` },
    { type: 'quiz', question: 'How many sixteenths per beat?', options: ['2', '3', '4', '8'], correctIndex: 2, explanation: 'Four sixteenth notes = one beat.' },
  ]},
  { id: 'p7-l3', moduleId: 'piano-7', title: 'Syncopation', order: 2, completed: false, content: [
    { type: 'text', content: `## Emphasis on Off-Beats\n\nNormal: **STRONG** weak STRONG weak\nSyncopated: strong **STRONG** strong **STRONG** (accents on &)\n\n## Common Patterns\n- Anticipated beat: play on & of 4 instead of 1\n- Tied off-beat: play on 1, sustain through 2\n- Eighth-quarter-eighth: classic pop syncopation\n\nClap syncopated rhythms before playing them.` },
    { type: 'quiz', question: 'What is syncopation?', options: ['Playing in time', 'Emphasis on off-beats', 'Playing fast', 'Using pedal'], correctIndex: 1, explanation: 'Syncopation = emphasis on off-beats, creating rhythmic surprise.' },
  ]},
  { id: 'p7-l4', moduleId: 'piano-7', title: 'The ii-V-I Progression', order: 3, completed: false, content: [
    { type: 'text', content: `## The Foundation of Jazz\n\nIn C: **Dm — G7 — C**\n\n| Chord | Function |\n| ----- | -------- |\n| Dm (ii) | Pre-dominant — sets up V |\n| G7 (V7) | Dominant — maximum tension |\n| C (I) | Tonic — resolution |\n\n## In Other Keys\n- G: Am — D7 — G\n- F: Gm — C7 — F\n\nPractice in all three keys with inversions for smooth voice leading.` },
    { type: 'quiz', question: 'ii-V-I in C major?', options: ['C-F-G', 'Am-D7-G', 'Dm-G7-C', 'Em-A7-D'], correctIndex: 2, explanation: 'ii=Dm, V7=G7, I=C.' },
  ]},
  { id: 'p7-l5', moduleId: 'piano-7', title: 'Seventh Chord Voicings', order: 4, completed: false, content: [
    { type: 'text', content: `## Beyond Triads\n\n| Type | Formula | Example | Sound |\n| ---- | ------- | ------- | ----- |\n| Major 7th | 1-3-5-7 | Cmaj7 | Dreamy |\n| Dominant 7th | 1-3-5-b7 | C7 | Bluesy |\n| Minor 7th | 1-b3-5-b7 | Cm7 | Smooth |\n\n## Upgrade Your Progressions\nInstead of C-F-G-C, try Cmaj7-Fmaj7-G7-Cmaj7.\n\nSame progression, much more sophisticated sound.` },
    { type: 'quiz', question: 'Difference between Cmaj7 and C7?', options: ['Same chord', 'Cmaj7 has B, C7 has Bb', 'C7 has more notes', 'Cmaj7 is minor'], correctIndex: 1, explanation: 'Cmaj7 has natural 7th (B), C7 has flatted 7th (Bb). Huge sound difference.' },
  ]},
  { id: 'p7-l6', moduleId: 'piano-7', title: 'Sight-Reading Strategies', order: 5, completed: false, content: [
    { type: 'text', content: `## 30-Second Preview\n1. Key signature\n2. Time signature\n3. Tempo\n4. Hardest spots\n5. Dynamics\n\n## Golden Rules\n1. **Never stop** — skip notes rather than stopping\n2. **Look ahead** — eyes 1-2 beats ahead of fingers\n3. **Simplify** — play root notes if LH is too hard\n4. **Steady tempo** — slow enough to maintain\n5. **Read patterns** — see "scale" not individual notes\n\nPractice 10 minutes daily on material below your level.` },
    { type: 'quiz', question: 'Most important sight-reading rule?', options: ['Play fast', 'Never stop', 'Only read RH', 'Memorize first'], correctIndex: 1, explanation: 'Never stop. Keeping pulse is more important than every note.' },
  ]},
  { id: 'p7-l7', moduleId: 'piano-7', title: 'Practice Planning', order: 6, completed: false, content: [
    { type: 'text', content: `## Recommended Routine (30 min)\n\n| Time | Activity |\n| ---- | -------- |\n| 5 min | Warm-up: scales |\n| 5 min | Technique: exercises |\n| 15 min | Repertoire |\n| 5 min | Sight-reading |\n\n## Key Principles\n1. Practice the **hard parts**, not easy parts\n2. **Slow practice** = fast learning\n3. **Short sessions, more often** (20 min × 2 > 40 min × 1)\n4. Use a **metronome**\n5. **Record yourself** weekly` },
    { type: 'quiz', question: 'Where to spend most practice time?', options: ['Pieces you know', 'Hardest parts', 'Sight-reading', 'Scales only'], correctIndex: 1, explanation: '80% of time on the 20% that is difficult.' },
  ]},
  { id: 'p7-l8', moduleId: 'piano-7', title: 'Next Steps and Technique Builders', order: 7, completed: false, content: [
    { type: 'text', content: `## Congratulations!\n\nYou have completed the full beginner-to-early-intermediate curriculum. You now have:\n\n- Note reading in both clefs\n- Two hand positions with shifting\n- Scales in C, G, F major and D, A minor\n- Chords and progressions (I-IV-V, I-V-vi-IV, ii-V-I)\n- Hands-together playing\n- Musical expression (dynamics, articulation, phrasing, pedal)\n- Sight-reading fundamentals\n\n## Recommended Next Pieces\n- Bach: Minuet in G\n- Beethoven: Fur Elise (simplified)\n- Clementi: Sonatina Op. 36 No. 1\n- Burgmuller: 25 Progressive Studies Op. 100\n\n## Method Books to Continue\n- **Alfred's Level 2-3**\n- **Faber's Book 2**\n- **Hanon: The Virtuoso Pianist**\n- **Czerny: Op. 599**\n\nConsistency is key. 15-20 minutes daily beats hours on weekends.` },
    { type: 'quiz', question: 'Most important factor for improvement?', options: ['Expensive piano', 'Long weekend sessions', 'Consistent daily practice', 'Only playing known pieces'], correctIndex: 2, explanation: 'Consistent daily practice — even 15 minutes — builds skills most effectively.' },
  ]},
]

const MODULE_7_EXERCISES: Exercise[] = [
  { id: 'p7-e1', moduleId: 'piano-7', title: 'A Minor (3 forms)', description: 'Natural, harmonic, melodic — hands separate.', order: 0, exerciseType: 'scale', difficulty: 3, handsRequired: 'right', keySignature: 'Am', targetBpm: 66 },
  { id: 'p7-e2', moduleId: 'piano-7', title: 'Sixteenth Note Etude', description: 'C-D-E-F as steady sixteenths at 60 BPM.', order: 1, exerciseType: 'technique', difficulty: 3, handsRequired: 'right', targetBpm: 60 },
  { id: 'p7-e3', moduleId: 'piano-7', title: 'Syncopation Exercise', description: 'Clap eighth-quarter-eighth, then play on piano.', order: 2, exerciseType: 'technique', difficulty: 3, handsRequired: 'right', targetBpm: 80 },
  { id: 'p7-e4', moduleId: 'piano-7', title: 'ii-V-I in Three Keys', description: 'Dm-G7-C, Am-D7-G, Gm-C7-F. 4 beats each.', order: 3, exerciseType: 'chord-progression', difficulty: 4, handsRequired: 'both', targetBpm: 60 },
  { id: 'p7-e5', moduleId: 'piano-7', title: 'Sight-Reading Challenge', description: 'Preview 30 seconds, play through without stopping.', order: 4, exerciseType: 'sight-reading', difficulty: 4, handsRequired: 'both' },
  { id: 'p7-e6', moduleId: 'piano-7', title: 'Comprehensive Review', description: 'C scale, G scale, I-IV-V7-I, one melody with dynamics and pedal.', order: 5, exerciseType: 'technique', difficulty: 4, handsRequired: 'both', keySignature: 'C', targetBpm: 80 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Module Definitions
// ═══════════════════════════════════════════════════════════════════════════════

export const MODULES_4_7: Module[] = [
  {
    id: 'piano-4', name: 'Scales & Key Signatures',
    description: 'C, G, F major scales, D minor scales, scale fingering, thumb-under technique, and the Circle of Fifths.',
    order: 4, lessons: MODULE_4_LESSONS, exercises: MODULE_4_EXERCISES,
    unlockRequirements: { requiredModuleComplete: 'piano-3' },
  },
  {
    id: 'piano-5', name: 'Chords & Harmony',
    description: 'Primary chords in three keys, inversions, Alberti bass, common progressions, accompaniment patterns, and lead sheets.',
    order: 5, lessons: MODULE_5_LESSONS, exercises: MODULE_5_EXERCISES,
    unlockRequirements: { requiredModuleComplete: 'piano-4' },
  },
  {
    id: 'piano-6', name: 'Expression & Musicality',
    description: 'Tempo markings, staccato, legato, accents, phrasing, crescendo, diminuendo, pedaling, and performance prep.',
    order: 6, lessons: MODULE_6_LESSONS, exercises: MODULE_6_EXERCISES,
    unlockRequirements: { requiredModuleComplete: 'piano-5' },
  },
  {
    id: 'piano-7', name: 'Early Intermediate Foundations',
    description: 'A minor, sixteenth notes, syncopation, ii-V-I, seventh chords, sight-reading, practice planning, and next steps.',
    order: 7, lessons: MODULE_7_LESSONS, exercises: MODULE_7_EXERCISES,
    unlockRequirements: { requiredModuleComplete: 'piano-6' },
  },
]
