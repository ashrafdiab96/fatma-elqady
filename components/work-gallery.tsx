'use client'

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Fragment, useRef, useState } from 'react'
import { media } from '@/lib/media'
import { categories, projects, type CategoryFilter, type Project } from '@/lib/projects'
import { ArtImage, MaskLines, SectionLabel, ease } from './primitives'

type Placement = { project: Project; start: number; span: number; offset: boolean; solo: boolean; depth: number }

const orientation = (project: Project) => (project.cover.ratio > 1.2 ? 'landscape' : project.cover.ratio < 0.85 ? 'portrait' : 'square')
const maxSpan = { landscape: 8, square: 6, portrait: 5 } as const

/**
 * Lays the exhibition out on a 12-column grid: alternating two-up rows with
 * contrasting widths, punctuated every third row by a single hero piece.
 * Spans respect each cover's orientation so artwork is never cropped awkwardly.
 */
function place(list: Project[]): Placement[] {
  const out: Placement[] = []
  let i = 0
  let row = 0
  while (i < list.length) {
    const a = list[i]
    const b = list[i + 1]
    if (row % 3 === 2 || !b) {
      const kind = orientation(a)
      const span = kind === 'landscape' ? 9 : kind === 'square' ? 6 : 5
      const start = row % 2 ? 13 - span - 1 : kind === 'landscape' ? 2 : 4
      out.push({ project: a, start, span, offset: false, solo: true, depth: 0.4 })
      i += 1
    } else {
      const [baseA, baseB] = row % 2 === 0 ? [7, 4] : [5, 6]
      const spanA = Math.min(baseA, maxSpan[orientation(a)])
      const spanB = Math.min(baseB, maxSpan[orientation(b)], 11 - spanA)
      out.push({ project: a, start: 1, span: spanA, offset: spanA < spanB, solo: false, depth: 0.25 })
      out.push({ project: b, start: 13 - spanB, span: spanB, offset: spanB <= spanA, solo: false, depth: 0.8 })
      i += 2
    }
    row += 1
  }
  return out
}

export function WorkGallery({ filter, setFilter, onOpen }: { filter: CategoryFilter; setFilter: (filter: CategoryFilter) => void; onOpen: (slug: string) => void }) {
  const available = categories.filter((category) => category === 'All' || projects.some((project) => project.category === category))
  const list = filter === 'All' ? projects : projects.filter((project) => project.category === filter)
  const placements = place(list)
  const showProcess = filter === 'All' || filter === 'Illustration'

  return (
    <section id="work" className="work-section page-section" aria-labelledby="work-title">
      <SectionLabel index="02" label="Selected work" right="A living archive" />
      <div className="work-head">
        <MaskLines as="h2" id="work-title" className="work-title" lines={['Selected', <>work<sup>({String(projects.length).padStart(2, '0')})</sup></>]} />
        <div className="filter-row" role="group" aria-label="Filter projects">
          {available.map((category) => {
            const count = category === 'All' ? projects.length : projects.filter((project) => project.category === category).length
            return (
              <button key={category} type="button" className={filter === category ? 'is-active' : ''} aria-pressed={filter === category} onClick={() => setFilter(category)}>
                {category}
                <sup>{count}</sup>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={filter} className="exhibition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
          {placements.map((placement, index) => (
            <Fragment key={placement.project.slug}>
              <WorkPiece placement={placement} index={projects.indexOf(placement.project)} onOpen={onOpen} eager={index < 2} />
              {showProcess && index === Math.min(4, placements.length - 1) && <ProcessCompare onOpen={onOpen} />}
            </Fragment>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

function WorkPiece({ placement, index, onOpen, eager }: { placement: Placement; index: number; onOpen: (slug: string) => void; eager: boolean }) {
  const { project, start, span, offset, solo, depth } = placement
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [70 * depth, -70 * depth])
  const style = { '--start': start, '--span': span, '--tone': project.tone, '--ratio': project.cover.ratio } as React.CSSProperties

  return (
    <motion.article
      ref={ref}
      className={`work-piece ${offset ? 'is-offset' : ''} ${solo ? 'is-solo' : ''} is-${orientation(project)}`}
      style={style}
    >
      <motion.div style={{ y: reduce ? 0 : y }}>
        <div className="work-frame">
        <span className="work-mat" aria-hidden="true" />
        <motion.button
          type="button"
          className="work-visual"
          onClick={() => onOpen(project.slug)}
          aria-label={`Open ${project.title} — ${project.category}`}
          data-cursor="View"
          initial={reduce ? false : { clipPath: 'inset(14% 8% 14% 8%)', opacity: 0 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.1, ease }}
        >
          <ArtImage image={project.cover} alt="" eager={eager} sizes={solo ? '(min-width: 900px) 75vw, 94vw' : `(min-width: 900px) ${Math.round((span / 12) * 100)}vw, 94vw`} />
          <span className="work-count" aria-hidden="true">{project.images.length} {project.images.length === 1 ? 'piece' : 'pieces'}</span>
        </motion.button>
        </div>
        <div className="work-meta">
          <span className="work-index">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>{project.title}</h3>
            <p>{project.context ?? project.category}</p>
          </div>
          <ArrowUpRight aria-hidden="true" />
        </div>
      </motion.div>
    </motion.article>
  )
}

function ProcessCompare({ onOpen }: { onOpen: (slug: string) => void }) {
  const [position, setPosition] = useState(52)
  const textured = media('music-textured')
  const flat = media('music-flat')
  return (
    <motion.aside className="process" aria-labelledby="process-title" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease }}>
      <div className="process-copy">
        <span className="eyebrow">Process · Music Stage</span>
        <h3 id="process-title">One composition, <em>two finishes.</em></h3>
        <p>Drag across the piece to compare the flat vector version with the final grain-and-gradient render.</p>
        <button type="button" className="text-link" onClick={() => onOpen('music-stage')} data-cursor="Open">
          View project <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
      <div className="process-frame" style={{ '--pos': `${position}%`, aspectRatio: `${textured.width} / ${textured.height}` } as React.CSSProperties}>
        <ArtImage image={textured} alt="Music Stage, final textured version" sizes="(min-width: 900px) 66vw, 94vw" />
        <div className="process-flat">
          <ArtImage image={flat} alt="Music Stage, flat vector version" sizes="(min-width: 900px) 66vw, 94vw" />
        </div>
        <span className="process-tag is-left" aria-hidden="true">Flat</span>
        <span className="process-tag is-right" aria-hidden="true">Textured</span>
        <span className="process-handle" aria-hidden="true" />
        <input type="range" min={0} max={100} value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label="Compare flat and textured versions" />
      </div>
    </motion.aside>
  )
}
