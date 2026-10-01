'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Media } from '@/lib/media'
import { ArtImage, ease } from './primitives'

type Viewing = { images: Media[]; index: number; title: string }

const LightboxContext = createContext<(images: Media[], index: number, title: string) => void>(() => undefined)

export const useLightbox = () => useContext(LightboxContext)

/** Wraps a page so any gallery inside it can open its artwork full-screen. */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [viewing, setViewing] = useState<Viewing | null>(null)
  const open = useCallback((images: Media[], index: number, title: string) => setViewing({ images, index, title }), [])
  return (
    <LightboxContext.Provider value={open}>
      {children}
      <AnimatePresence>{viewing && <Lightbox key="lightbox" viewing={viewing} onChange={setViewing} onClose={() => setViewing(null)} />}</AnimatePresence>
    </LightboxContext.Provider>
  )
}

const GAP = 14

/**
 * Splits artwork into rows of equal height that fill the width. Each row closes at whichever break lands
 * nearest the target height, so every piece keeps its own proportions — nothing is cropped. The last row
 * never grows taller than the row above it; a gallery that fits on one row may grow a little.
 */
function justify(images: Media[], width: number, target: number) {
  const rows: { images: Media[]; height: number }[] = []
  const heightOf = (items: Media[]) => (width - GAP * (items.length - 1)) / items.reduce((sum, image) => sum + image.ratio, 0)
  let current: Media[] = []
  for (const image of images) {
    const next = [...current, image]
    const height = heightOf(next)
    if (height > target) { current = next; continue }
    if (current.length && heightOf(current) - target < target - height) {
      rows.push({ images: current, height: heightOf(current) })
      current = [image]
    } else {
      rows.push({ images: next, height })
      current = []
    }
  }
  if (current.length) rows.push({ images: current, height: Math.min(heightOf(current), rows.length ? rows[rows.length - 1].height : target * 1.3) })
  return rows
}

/** Justified rows of artwork; each piece opens full-screen. Before it can measure itself it falls back to a CSS flex layout. */
export function JustifiedGallery({ images, title, row = 300, mobileRow = 170, sizes = '(min-width: 900px) 30vw, 50vw', className = '' }: { images: Media[]; title: string; row?: number; mobileRow?: number; sizes?: string; className?: string }) {
  const open = useLightbox()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const item = (image: Media, index: number, style: CSSProperties) => (
    <motion.button
      key={image.key}
      type="button"
      className="jgrid-item"
      style={{ ...style, '--r': image.ratio } as CSSProperties}
      onClick={() => open(images, index, title)}
      aria-label={`View ${title}, ${index + 1} of ${images.length}, full screen`}
      data-cursor="View"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease, delay: (index % 4) * 0.05 }}
    >
      <ArtImage image={image} alt="" sizes={sizes} />
    </motion.button>
  )

  if (!width) {
    return (
      <div ref={ref} className={`jgrid is-fallback ${className}`} style={{ '--row': `${row}px`, '--row-m': `${mobileRow}px` } as CSSProperties}>
        {images.map((image, index) => item(image, index, {}))}
      </div>
    )
  }

  let index = 0
  return (
    <div ref={ref} className={`jgrid ${className}`}>
      {justify(images, width, width < 700 ? mobileRow : row).map((line) => (
        <div key={line.images[0].key} className="jgrid-row" style={{ height: line.height }}>
          {line.images.map((image) => item(image, index++, { width: image.ratio * line.height }))}
        </div>
      ))}
    </div>
  )
}

function Lightbox({ viewing, onChange, onClose }: { viewing: Viewing; onChange: (viewing: Viewing) => void; onClose: () => void }) {
  const { images, index, title } = viewing
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const image = images[index]
  const many = images.length > 1
  const go = useCallback((step: number) => onChange({ ...viewing, index: (index + step + images.length) % images.length }), [viewing, index, images.length, onChange])

  useEffect(() => {
    const returnFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus({ preventScroll: true })
    return () => { document.body.style.overflow = previousOverflow; returnFocus?.focus?.({ preventScroll: true }) }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (many && event.key === 'ArrowRight') go(1)
      if (many && event.key === 'ArrowLeft') go(-1)
      if (event.key === 'Tab' && dialog.current) {
        const focusable = dialog.current.querySelectorAll<HTMLElement>('button')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, many, onClose])

  // Swipe between pieces on touch screens.
  const start = useRef<number | null>(null)

  return (
    <motion.div
      ref={dialog}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — ${index + 1} of ${images.length}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onPointerDown={(event) => { start.current = event.clientX }}
      onPointerUp={(event) => {
        if (start.current === null || !many) return
        const delta = event.clientX - start.current
        start.current = null
        if (Math.abs(delta) > 60) go(delta < 0 ? 1 : -1)
      }}
    >
      <div className="lightbox-bar">
        <span>{title}{many && <> — {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</>}</span>
        <button ref={closeButton} type="button" onClick={onClose} aria-label="Close full-screen view"><X aria-hidden="true" /></button>
      </div>
      <div className="lightbox-stage" onClick={(event) => event.target === event.currentTarget && onClose()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={image.key}
            className="lightbox-image"
            style={{ aspectRatio: `${image.width} / ${image.height}`, '--r': image.ratio } as CSSProperties}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            <ArtImage image={image} alt={`${title}, ${index + 1} of ${images.length}`} sizes="92vw" eager />
          </motion.div>
        </AnimatePresence>
      </div>
      {many && (
        <div className="lightbox-nav">
          <button type="button" onClick={() => go(-1)} aria-label="Previous piece"><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => go(1)} aria-label="Next piece"><ArrowRight aria-hidden="true" /></button>
        </div>
      )}
    </motion.div>
  )
}
