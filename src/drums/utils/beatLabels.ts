/**
 * Returns the counting label for a given step index based on subdivision.
 *
 * subdivisions=1 (quarter):    1   2   3   4
 * subdivisions=2 (eighth):     1 + 2 + 3 + 4 +
 * subdivisions=3 (triplet):    1 t t 2 t t 3 t t 4 t t
 * subdivisions=4 (sixteenth):  1 e + a 2 e + a 3 e + a 4 e + a
 */

const OFFBEAT_LABELS: Record<number, string[]> = {
  1: [],                    // quarter — no offbeats
  2: ['+'],                 // eighth
  3: ['t', 't'],            // triplet
  4: ['e', '+', 'a'],       // sixteenth
}

export function subdivisionLabel(stepIndex: number, subdivisions: number): string {
  const posInBeat = stepIndex % subdivisions
  if (posInBeat === 0) {
    return String(Math.floor(stepIndex / subdivisions) + 1)
  }
  const labels = OFFBEAT_LABELS[subdivisions]
  if (labels) return labels[posInBeat - 1] ?? '·'
  return '·'
}

export function isDownbeat(stepIndex: number, subdivisions: number): boolean {
  return stepIndex % subdivisions === 0
}
