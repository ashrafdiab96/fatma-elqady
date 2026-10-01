'use client'

import { useState } from 'react'
import { media } from '@/lib/media'
import { ArtImage } from './primitives'

/** Music Stage: drag across one composition to compare the flat vector and textured finishes. */
export function ProcessCompare() {
  const [position, setPosition] = useState(52)
  const textured = media('music-textured')
  const flat = media('music-flat')
  return (
    <div className="process-frame" style={{ '--pos': `${position}%`, aspectRatio: `${textured.width} / ${textured.height}` } as React.CSSProperties}>
      <ArtImage image={textured} alt="Music Stage, final textured version" sizes="(min-width: 900px) 80vw, 94vw" />
      <div className="process-flat">
        <ArtImage image={flat} alt="Music Stage, flat vector version" sizes="(min-width: 900px) 80vw, 94vw" />
      </div>
      <span className="process-tag is-left" aria-hidden="true">Flat</span>
      <span className="process-tag is-right" aria-hidden="true">Textured</span>
      <span className="process-handle" aria-hidden="true" />
      <input type="range" min={0} max={100} value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label="Compare flat and textured versions" />
    </div>
  )
}
