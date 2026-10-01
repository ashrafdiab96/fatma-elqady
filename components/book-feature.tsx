'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { media } from '@/lib/media'
import { bookSpreads } from '@/lib/projects'
import { useLightbox } from './gallery'
import { ArtImage, SectionLabel } from './primitives'

const spreads = bookSpreads.map((spread) => ({ ...spread, image: media(spread.key) }))

/** Spreads in reading order. On wide screens the section pins and vertical scroll turns the pages. */
export function BookFeature() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const open = useLightbox()
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
      className={`book-feature ${pinned ? 'is-pinned' : ''}`}
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
      aria-labelledby="book-spreads-title"
    >
      <div className="book-sticky">
        <div className="book-head page-gutter">
          <SectionLabel index="01" label="Cover & interior spreads" right={pinned ? 'Scroll to turn the pages' : 'Swipe the spreads'} />
        </div>
        <motion.div ref={track} className="book-track" style={{ x }}>
          <div className="book-intro">
            <p className="book-arabic" lang="ar" dir="rtl">عائلة مرزوق في المصيف</p>
            <h2 id="book-spreads-title" className="book-title">Read the book</h2>
            <p className="book-description">The cover and five spreads in reading order, each with an English gloss of the Arabic text.</p>
          </div>
          {spreads.map((spread, index) => (
            <figure className="book-spread" key={spread.key} style={{ '--ratio': spread.image.ratio } as React.CSSProperties}>
              <button
                type="button"
                className="book-spread-frame"
                onClick={() => open(spreads.map((item) => item.image), index, 'The Marzouk Family on Holiday')}
                data-cursor="View"
                aria-label={`View full screen — ${spread.caption}`}
              >
                <ArtImage image={spread.image} alt={`The Marzouk Family on Holiday — ${spread.caption}`} sizes="(min-width: 900px) 110vh, 88vw" eager={index === 0} />
              </button>
              <figcaption>
                <span>{String(index).padStart(2, '0')}</span>
                {spread.caption}
              </figcaption>
            </figure>
          ))}
          <div className="book-outro">
            <ArtImage image={media('marzouk-mockup-portrait')} alt="Printed cover mockup of The Marzouk Family on Holiday" sizes="(min-width: 900px) 30vw, 70vw" />
            <a className="text-link" href="#group-marzouk-print">
              Cover &amp; print mockups <ArrowDown aria-hidden="true" />
            </a>
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
