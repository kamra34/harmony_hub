/**
 * Renders drum notation using OpenSheetMusicDisplay (OSMD).
 * Converts PatternData → MusicXML → OSMD rendering.
 * Custom cursor overlay for playback highlighting.
 */

import { useRef, useEffect, useCallback, useState, useImperativeHandle, forwardRef } from 'react'
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay'
import { PatternData } from '@drums/types/curriculum'
import { patternToMusicXml } from '@drums/services/drumMusicXml'

export interface OsmdNotationHandle {
  cursorShow: () => void
  cursorNext: () => void
  cursorReset: () => void
  cursorHide: () => void
}

interface Props {
  pattern: PatternData
  beatsPerBar?: number
  title?: string
  width?: number
}

const OsmdNotation = forwardRef<OsmdNotationHandle, Props>(
  ({ pattern, beatsPerBar, title, width }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const notePositionsRef = useRef<{ x: number; y: number; staffH: number }[]>([])
  const cursorIdxRef = useRef(-1)
  const [error, setError] = useState<string | null>(null)

  // Build a map of note X/Y positions from OSMD's graphical data
  function buildNotePositions() {
    const osmd = osmdRef.current
    if (!osmd?.GraphicSheet) return

    const positions: { x: number; y: number; staffH: number }[] = []

    try {
      for (const musicSystem of osmd.GraphicSheet.MusicPages[0]?.MusicSystems ?? []) {
        for (const staffLine of musicSystem.StaffLines) {
          const staffY = staffLine.PositionAndShape.AbsolutePosition.y * 10 // OSMD units to px
          const staffH = staffLine.PositionAndShape.Size.height * 10

          for (const measure of staffLine.Measures) {
            for (const entry of measure.staffEntries) {
              const x = entry.PositionAndShape.AbsolutePosition.x * 10
              const y = staffY
              positions.push({ x, y, staffH })
            }
          }
        }
      }
    } catch {}

    notePositionsRef.current = positions
  }

  function updateCursorPosition(idx: number) {
    const cursor = cursorRef.current
    if (!cursor) return

    const pos = notePositionsRef.current[idx]
    if (!pos) {
      cursor.style.display = 'none'
      return
    }

    cursor.style.display = 'block'
    cursor.style.left = `${pos.x - 10}px`
    cursor.style.top = `${pos.y - 8}px`
    cursor.style.height = `${pos.staffH + 16}px`
  }

  useImperativeHandle(ref, () => ({
    cursorShow: () => {
      cursorIdxRef.current = 0
      updateCursorPosition(0)
    },
    cursorNext: () => {
      cursorIdxRef.current++
      updateCursorPosition(cursorIdxRef.current)
    },
    cursorReset: () => {
      cursorIdxRef.current = 0
      updateCursorPosition(0)
    },
    cursorHide: () => {
      cursorIdxRef.current = -1
      if (cursorRef.current) cursorRef.current.style.display = 'none'
    },
  }), [])

  const render = useCallback(async () => {
    if (!containerRef.current) return

    try {
      setError(null)
      const xml = patternToMusicXml(pattern, beatsPerBar, title)

      if (!osmdRef.current) {
        const osmd = new OpenSheetMusicDisplay(containerRef.current, {
          autoResize: false,
          backend: 'svg',
          drawTitle: false,
          drawSubtitle: false,
          drawComposer: false,
          drawLyricist: false,
          drawPartNames: false,
          drawPartAbbreviations: false,
          drawCredits: false,
          drawMetronomeMarks: false,
          percussionOneLineCutoff: 0,
        })

        osmd.EngravingRules.FlatBeams = true
        osmd.EngravingRules.FlatBeamOffset = 20
        osmd.EngravingRules.FlatBeamOffsetPerBeam = 10
        osmd.EngravingRules.StretchLastSystemLine = true
        osmd.EngravingRules.NewSystemAtXMLNewSystemAttribute = true
        osmd.EngravingRules.SystemLeftMargin = 4

        osmdRef.current = osmd
      }

      await osmdRef.current.load(xml)
      osmdRef.current.render()

      // Build note position map for our custom cursor
      buildNotePositions()

      if (containerRef.current) centerSvg(containerRef.current)
    } catch (err) {
      console.warn('OSMD render error:', err)
      setError('Notation render failed')
    }
  }, [pattern, beatsPerBar, title])

  useEffect(() => { render() }, [render])

  useEffect(() => {
    if (osmdRef.current && width) {
      try {
        osmdRef.current.render()
        buildNotePositions()
        if (containerRef.current) centerSvg(containerRef.current)
      } catch {}
    }
  }, [width])

  if (error) {
    return <div className="text-xs text-[#4b5563] italic p-4">{error}</div>
  }

  return (
    <div
      className="osmd-notation-container"
      style={{
        minHeight: 80,
        background: '#ffffff',
        borderRadius: 8,
        padding: '12px 8px',
        position: 'relative',
      }}
    >
      <div ref={containerRef} />
      {/* Custom cursor — glowing highlight band */}
      <div
        ref={cursorRef}
        style={{
          display: 'none',
          position: 'absolute',
          width: 20,
          background: 'linear-gradient(90deg, rgba(245,158,11,0.0) 0%, rgba(245,158,11,0.25) 30%, rgba(245,158,11,0.35) 50%, rgba(245,158,11,0.25) 70%, rgba(245,158,11,0.0) 100%)',
          borderRadius: 4,
          pointerEvents: 'none',
          zIndex: 10,
          transition: 'left 0.06s ease-out, top 0.06s ease-out',
          boxShadow: '0 0 12px 2px rgba(245,158,11,0.15)',
        }}
      />
    </div>
  )
})

OsmdNotation.displayName = 'OsmdNotation'
export default OsmdNotation

/** Center the rendered notation if it's narrower than the container */
function centerSvg(container: HTMLElement) {
  const svg = container.querySelector('svg')
  if (!svg) return

  const bbox = svg.getBBox()
  if (!bbox || bbox.width <= 0) return

  const svgW = svg.clientWidth || svg.getBoundingClientRect().width
  const contentRight = bbox.x + bbox.width
  const unusedSpace = svgW - contentRight

  if (unusedSpace > svgW * 0.15) {
    const offset = Math.floor(unusedSpace / 2)
    const vb = svg.getAttribute('viewBox')
    if (vb) {
      const parts = vb.split(/\s+/)
      if (parts.length === 4) {
        const newX = parseFloat(parts[0]) - offset
        svg.setAttribute('viewBox', `${newX} ${parts[1]} ${parts[2]} ${parts[3]}`)
      }
    }
  }
}
