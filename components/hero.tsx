'use client'

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { media, thumb } from '@/lib/media'
import { heroArtwork, getProject } from '@/lib/projects'
import { MaskLines, ease } from './primitives'

type Slot = { x: number; y: number; w: number; depth: number; rotate: number; mobile?: { x: number; y: number; w: number } | null }

// Positions are percentages of the hero; widths are in vw. Pieces sit around the name rather than on top of the calls to action.
const slots: Slot[] = [
  { x: 4, y: 12, w: 12, depth: 0.7, rotate: -4, mobile: { x: 4, y: 13, w: 34 } },
  { x: 33, y: 15, w: 10, depth: 0.35, rotate: 5, mobile: null },
  { x: 55, y: 13, w: 14, depth: 1, rotate: 3, mobile: { x: 58, y: 12, w: 38 } },
  { x: 82, y: 40, w: 13, depth: 0.5, rotate: -3, mobile: null },
  { x: 63, y: 61, w: 15, depth: 0.85, rotate: 2, mobile: { x: 54, y: 34, w: 40 } },
  { x: 29, y: 70, w: 11, depth: 0.55, rotate: 6, mobile: { x: 8, y: 36, w: 30 } },
]

type TrailItem = { id: number; x: number; y: number; index: number; rotate: number }

export function Hero({ onOpen }: { onOpen: (slug: string) => void }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [trail, setTrail] = useState<TrailItem[]>([])
  const [cycle, setCycle] = useState(0)
  const [touch, setTouch] = useState(false)
  const last = useRef({ x: -999, y: -999 })
  const counter = useRef(0)

  // Cursor parallax, smoothed with a spring.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 })
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 })

  // Scroll-out choreography.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const nameOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15])
  const spread = useTransform(scrollYProgress, [0, 1], [0, -260])

  useEffect(() => {
    setTouch(window.matchMedia('(hover: none), (pointer: coarse)').matches)
    // Warm the cache so trail images never flash in empty.
    const id = window.setTimeout(() => heroArtwork.forEach(({ key }) => { const img = new Image(); img.src = thumb(key) }), 1200)
    return () => window.clearTimeout(id)
  }, [])

  // The collage slowly swaps artwork, one slot at a time, so the wall feels alive even without a cursor.
  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setCycle((value) => value + 1), 2600)
    return () => window.clearInterval(id)
  }, [reduce])

  const spawn = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    counter.current += 1
    const item: TrailItem = { id: counter.current, x: clientX - rect.left, y: clientY - rect.top, index: counter.current % heroArtwork.length, rotate: ((counter.current * 37) % 16) - 8 }
    setTrail((items) => [...items.slice(-6), item])
    window.setTimeout(() => setTrail((items) => items.filter((entry) => entry.id !== item.id)), 950)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
    const dx = event.clientX - last.current.x
    const dy = event.clientY - last.current.y
    if (dx * dx + dy * dy < 105 * 105) return
    last.current = { x: event.clientX, y: event.clientY }
    spawn(event.clientX, event.clientY)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== 'touch') return
    if ((event.target as HTMLElement).closest('a, button')) return
    spawn(event.clientX, event.clientY)
  }

  return (
    <section
      ref={ref}
      id="top"
      className="hero"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerLeave={() => { px.set(0); py.set(0) }}
      aria-labelledby="hero-title"
    >
      <motion.div className="hero-collage" style={{ y: reduce ? 0 : spread }}>
        {slots.map((slot, index) => (
          <CollageSlot key={index} slot={slot} index={index} cycle={cycle} sx={sx} sy={sy} reduce={!!reduce} onOpen={onOpen} />
        ))}
      </motion.div>

      <div className="hero-trail" aria-hidden="true">
        <AnimatePresence>
          {trail.map((item) => {
            const art = media(heroArtwork[item.index].key)
            const width = art.ratio > 1.2 ? 250 : art.ratio < 0.85 ? 150 : 190
            return (
              <motion.img
                key={item.id}
                src={thumb(art.key)}
                alt=""
                className="trail-img"
                style={{ left: item.x, top: item.y, width, aspectRatio: `${art.width} / ${art.height}` }}
                initial={{ opacity: 0, scale: 0.4, rotate: item.rotate * 2 }}
                animate={{ opacity: 1, scale: 1, rotate: item.rotate }}
                exit={{ opacity: 0, scale: 0.85, filter: 'blur(6px)', transition: { duration: 0.45 } }}
                transition={{ duration: 0.5, ease }}
              />
            )
          })}
        </AnimatePresence>
      </div>

      <div className="hero-top">
        <span className="micro-mark">FE<span> / </span>01</span>
        <span>Cairo, Egypt</span>
        <span>Graphic design · Illustration · Motion</span>
      </div>

      <motion.div className="hero-copy" style={{ y: reduce ? 0 : nameY, opacity: nameOpacity }}>
        <motion.p className="hero-kicker" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.6 }}>
          Visual storyteller<br />building worlds with feeling.
        </motion.p>
        <MaskLines as="h1" id="hero-title" immediate delay={0.1} className="hero-title" lines={[<span key="a">FATMA</span>, <em key="b" className="hero-serif">Elqady</em>]} />
        <motion.img
          src="/signature.png"
          alt="Fatma Elqady’s signature"
          className="hero-signature"
          width={212}
          height={170}
          initial={reduce ? false : { clipPath: 'inset(0 0 0 100%)', opacity: 0 }}
          animate={{ clipPath: 'inset(0 0 0 0%)', opacity: 1 }}
          transition={{ duration: 1.6, ease, delay: 0.9 }}
        />
      </motion.div>

      <div className="hero-bottom">
        <span>Portfolio / 2024—25</span>
        <a className="hero-scroll" href="#featured" aria-label="Scroll to featured work">
          Scroll to explore <ArrowDown aria-hidden="true" />
        </a>
        <span className="hero-hint">{touch ? 'Tap the canvas' : 'Move through the canvas'}</span>
      </div>
    </section>
  )
}

function CollageSlot({ slot, index, cycle, sx, sy, reduce, onOpen }: { slot: Slot; index: number; cycle: number; sx: MotionValue<number>; sy: MotionValue<number>; reduce: boolean; onOpen: (slug: string) => void }) {
  const x = useTransform(sx, (value) => value * slot.depth * -70)
  const y = useTransform(sy, (value) => value * slot.depth * -50)
  // Each slot advances on its own turn: slot i changes when cycle % slots === i.
  const turns = Math.floor((cycle + slots.length - 1 - index) / slots.length)
  const art = heroArtwork[(index + turns * slots.length) % heroArtwork.length]
  const image = media(art.key)
  const title = getProject(art.slug)?.title ?? 'artwork'
  const style = {
    '--x': `${slot.x}%`, '--y': `${slot.y}%`, '--w': `${slot.w}vw`,
    '--mx': `${slot.mobile?.x ?? 0}%`, '--my': `${slot.mobile?.y ?? 0}%`, '--mw': `${slot.mobile?.w ?? 0}vw`,
  } as React.CSSProperties

  return (
    <motion.div className={`collage-slot ${slot.mobile ? '' : 'desktop-only'}`} style={{ ...style, x: reduce ? 0 : x, y: reduce ? 0 : y }}>
      <motion.button
        type="button"
        className="collage-piece"
        onClick={() => onOpen(art.slug)}
        data-cursor="Open"
        aria-label={`Open ${title}`}
        initial={reduce ? false : { opacity: 0, scale: 0.8, rotate: slot.rotate * 2 }}
        animate={{ opacity: 1, scale: 1, rotate: slot.rotate }}
        transition={{ duration: 1.1, ease, delay: 0.35 + index * 0.08 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={art.key}
            src={thumb(art.key)}
            alt=""
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease }}
          />
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}
