'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { media } from '@/lib/media'
import { bookSpreads, getProject } from '@/lib/projects'
import { ArtImage, MaskLines, SectionLabel } from './primitives'

const book = getProject('marzouk-family')!

export function BookFeature({ onOpen }: { onOpen: (slug: string) => void }) {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [pinned, setPinned] = useState(false)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)')
    const measure = () => {
      const enabled = query.matches && !reduce
      setPinned(enabled)
      setDistance(enabled && track.current ? Math.max(0, track.current.scrollWidth - window.innerWidth) : 0)
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (track.current) observer.observe(track.current)
    query.addEventListener('change', measure)
    window.addEventListener('resize', measure)
    return () => { observer.disconnect(); query.removeEventListener('change', measure); window.removeEventListener('resize', measure) }
  }, [reduce])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const x = useTransform(smooth, (value) => (pinned ? -value * distance : 0))
  const progress = useTransform(smooth, [0, 1], ['0%', '100%'])

  return (
    <section
      ref={section}
      id="featured"
      className={`book-feature ${pinned ? 'is-pinned' : ''}`}
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
      aria-labelledby="book-title"
    >
      <div className="book-sticky">
        <div className="book-head page-gutter">
          <SectionLabel index="01" label="Featured — picture book" right={pinned ? 'Scroll to turn the pages' : 'Swipe the spreads'} />
        </div>
        <motion.div ref={track} className="book-track" style={{ x }}>
          <div className="book-intro">
            <p className="book-arabic" lang="ar" dir="rtl">عائلة مرزوق في المصيف</p>
            <MaskLines as="h2" id="book-title" className="book-title" lines={['The Marzouk', <>Family <em>on holiday</em></>]} />
            <p className="book-description">{book.description}</p>
            <button type="button" className="pill-button" onClick={() => onOpen(book.slug)} data-cursor="Open">
              Open the book <ArrowUpRight aria-hidden="true" />
            </button>
          </div>
          {bookSpreads.map((spread, index) => {
            const image = media(spread.key)
            return (
              <figure className="book-spread" key={spread.key} style={{ '--ratio': image.ratio } as React.CSSProperties}>
                <button type="button" className="book-spread-frame" onClick={() => onOpen(book.slug)} data-cursor="View" aria-label={`Open picture book — ${spread.caption}`}>
                  <ArtImage image={image} alt={`The Marzouk Family on Holiday — ${spread.caption}`} sizes="(min-width: 900px) 110vh, 88vw" />
                </button>
                <figcaption>
                  <span>{String(index).padStart(2, '0')}</span>
                  {spread.caption}
                </figcaption>
              </figure>
            )
          })}
          <div className="book-outro">
            <ArtImage image={media('marzouk-mockup-portrait')} alt="Printed cover mockup of The Marzouk Family on Holiday" sizes="(min-width: 900px) 40vw, 80vw" />
            <button type="button" className="pill-button" onClick={() => onOpen(book.slug)} data-cursor="Open">
              Cover, spreads &amp; print mockups <ArrowUpRight aria-hidden="true" />
            </button>
          </div>
        </motion.div>
        {pinned && (
          <div className="book-progress page-gutter" aria-hidden="true">
            <motion.span style={{ width: progress }} />
          </div>
        )}
      </div>
    </section>
  )
}
