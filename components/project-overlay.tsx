'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Media } from '@/lib/media'
import { projects, type Project } from '@/lib/projects'
import { ArtImage, ease } from './primitives'

/** Groups images into rows: wide pieces get a full row, upright pieces pair up. */
function rows(images: Media[]) {
  const out: Media[][] = []
  let pending: Media | null = null
  for (const image of images) {
    if (image.ratio > 1.25) {
      if (pending) { out.push([pending]); pending = null }
      out.push([image])
    } else if (pending) {
      out.push([pending, image])
      pending = null
    } else {
      pending = image
    }
  }
  if (pending) out.push([pending])
  return out
}

export function ProjectOverlay({ project, onClose, onNavigate }: { project: Project; onClose: () => void; onNavigate: (slug: string) => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const index = projects.indexOf(project)
  const next = projects[(index + 1) % projects.length]
  const previous = projects[(index - 1 + projects.length) % projects.length]

  useEffect(() => {
    const returnFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow; returnFocus?.focus?.({ preventScroll: true }) }
  }, [])

  useEffect(() => {
    panel.current?.scrollTo({ top: 0 })
    closeButton.current?.focus({ preventScroll: true })
  }, [project.slug])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNavigate(next.slug)
      if (event.key === 'ArrowLeft') onNavigate(previous.slug)
      if (event.key === 'Tab' && panel.current) {
        const focusable = panel.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next.slug, previous.slug, onClose, onNavigate])

  return (
    <motion.div
      ref={panel}
      className="project-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      style={{ '--tone': project.tone } as React.CSSProperties}
      initial={reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="overlay-bar">
        <span>{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
        <div className="overlay-controls">
          <button type="button" onClick={() => onNavigate(previous.slug)} aria-label={`Previous project: ${previous.title}`}><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => onNavigate(next.slug)} aria-label={`Next project: ${next.title}`}><ArrowRight aria-hidden="true" /></button>
          <button ref={closeButton} type="button" className="overlay-close" onClick={onClose} aria-label="Close project"><X aria-hidden="true" /></button>
        </div>
      </div>

      <motion.div key={project.slug} className="overlay-inner" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.25 }}>
        <header className="overlay-header">
          <p className="overlay-category"><span className="tone-dot" />{project.category}{project.context ? ` · ${project.context}` : ''}</p>
          <h2 id="project-title">{project.title}</h2>
          <p className="overlay-description">{project.description}</p>
        </header>

        <div className="overlay-gallery">
          {rows(project.images).map((row, rowIndex) => (
            <div key={row[0].key} className={`overlay-row ${row.length === 2 ? 'is-pair' : row[0].ratio > 1.25 ? 'is-wide' : 'is-single'}`}>
              {row.map((image, imageIndex) => (
                <motion.figure
                  key={image.key}
                  style={{ aspectRatio: `${image.width} / ${image.height}`, '--r': image.ratio } as React.CSSProperties}
                  initial={reduce ? false : { opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, root: panel, margin: '-40px' }}
                  transition={{ duration: 0.9, ease, delay: imageIndex * 0.1 }}
                >
                  <ArtImage
                    image={image}
                    alt={`${project.title}, artwork ${project.images.indexOf(image) + 1} of ${project.images.length}`}
                    eager={rowIndex === 0}
                    sizes={row.length === 2 ? '(min-width: 900px) 46vw, 94vw' : '(min-width: 900px) 90vw, 94vw'}
                  />
                </motion.figure>
              ))}
            </div>
          ))}
        </div>

        <button type="button" className="overlay-next" onClick={() => onNavigate(next.slug)} style={{ '--tone': next.tone } as React.CSSProperties} data-cursor="Next">
          <span className="eyebrow">Next project</span>
          <span className="overlay-next-title">{next.title} <ArrowRight aria-hidden="true" /></span>
          <ArtImage image={next.cover} alt="" sizes="30vw" className="overlay-next-thumb" />
        </button>
      </motion.div>
    </motion.div>
  )
}
