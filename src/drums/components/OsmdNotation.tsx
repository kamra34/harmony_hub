/**
 * Renders drum notation using OpenSheetMusicDisplay (OSMD).
 * Converts PatternData → MusicXML → OSMD rendering.
 */

import { useRef, useEffect, useCallback, useState } from 'react'
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay'
import { PatternData } from '@drums/types/curriculum'
import { patternToMusicXml } from '@drums/services/drumMusicXml'

interface Props {
  pattern: PatternData
  beatsPerBar?: number
  title?: string
  width?: number
}

export default function OsmdNotation({ pattern, beatsPerBar, title, width }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null)
  const [error, setError] = useState<string | null>(null)

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
          // Always use 5-line staff for percussion — never collapse to 1 line
          percussionOneLineCutoff: 0,
        })

        // Flat beams for drum notation
        osmd.EngravingRules.FlatBeams = true
        osmd.EngravingRules.FlatBeamOffset = 20
        osmd.EngravingRules.FlatBeamOffsetPerBeam = 10

        // Don't stretch the last system line to full width
        osmd.EngravingRules.StretchLastSystemLine = false

        // Respect system breaks from MusicXML (<print new-system="yes"/>)
        osmd.EngravingRules.NewSystemAtXMLNewSystemAttribute = true

        osmdRef.current = osmd
      }

      await osmdRef.current.load(xml)
      osmdRef.current.render()

      // Center the SVG if it doesn't fill the container
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
        if (containerRef.current) centerSvg(containerRef.current)
      } catch {}
    }
  }, [width])

  if (error) {
    return <div className="text-xs text-[#4b5563] italic p-4">{error}</div>
  }

  return (
    <div
      ref={containerRef}
      className="osmd-notation-container"
      style={{
        minHeight: 80,
        background: '#ffffff',
        borderRadius: 8,
        padding: '12px 8px',
      }}
    />
  )
}

/** Center the rendered notation if it's narrower than the container */
function centerSvg(container: HTMLElement) {
  const svg = container.querySelector('svg')
  if (!svg) return

  // OSMD sets the SVG width to the full container.
  // We need to find the actual content bounds inside the SVG.
  const bbox = svg.getBBox()
  if (!bbox || bbox.width <= 0) return

  const svgW = svg.clientWidth || svg.getBoundingClientRect().width
  const contentRight = bbox.x + bbox.width
  const unusedSpace = svgW - contentRight

  // If more than 15% of the SVG is empty on the right, the content is short — center it
  if (unusedSpace > svgW * 0.15) {
    const offset = Math.floor(unusedSpace / 2)
    // Shift all content right by adjusting the viewBox
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
