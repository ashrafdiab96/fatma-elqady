'use client'

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { media, thumb } from '@/lib/media'
import { heroArtwork, workHref } from '@/lib/projects'
import { asset } from '@/lib/site'
import { MaskLines, ease } from './primitives'

type Slot = { x: number; y: number; w: number; depth: number; mobile?: { x: number; y: number; w: number } | null }

// Positions are percentages of the hero; widths are in vw. Kept to the edges of the name so it stays legible.
const slots: Slot[] = [
  { x: 3, y: 17, w: 11, depth: 0.7, mobile: { x: 5, y: 14, w: 30 } },
  { x: 39, y: 18, w: 9, depth: 0.35, mobile: null },
  { x: 60, y: 19, w: 12, depth: 1, mobile: { x: 63, y: 13, w: 32 } },
  { x: 84, y: 46, w: 11, depth: 0.5, mobile: null },
  { x: 66, y: 64, w: 12, depth: 0.85, mobile: { x: 36, y: 26, w: 26 } },
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [cycle, setCycle] = useState(0)

  // Cursor parallax, smoothed with a spring.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 })
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 })

  // Scroll-out choreography.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const nameOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15])
  const spread = useTransform(scrollYProgress, [0, 1], [0, -200])

  // The wall slowly swaps work, one slot at a time, so it feels alive without demanding attention.
  useEffect(() => {
    if (reduce) return
    const warm = window.setTimeout(() => heroArtwork.forEach(({ key }) => { const img = new Image(); img.src = thumb(key) }), 1500)
    const id = window.setInterval(() => setCycle((value) => value + 1), 3400)
    return () => { window.clearTimeout(warm); window.clearInterval(id) }
  }, [reduce])

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <section ref={ref} id="top" className="hero" onPointerMove={onPointerMove} onPointerLeave={() => { px.set(0); py.set(0) }} aria-labelledby="hero-title">
      <motion.div className="hero-collage" style={{ y: reduce ? 0 : spread }}>
        {slots.map((slot, index) => (
          <CollageSlot key={index} slot={slot} index={index} cycle={cycle} sx={sx} sy={sy} reduce={!!reduce} />
        ))}
      </motion.div>

      <div className="hero-top">
        <span className="micro-mark">FE<span> / </span>01</span>
        <span>Senior Graphic Designer &amp; Illustrator</span>
        <span>Cairo, Egypt</span>
      </div>

      <motion.div className="hero-copy" style={{ y: reduce ? 0 : nameY, opacity: nameOpacity }}>
        <motion.p className="hero-kicker" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.6 }}>
          Campaigns, social and brand characters — and the illustrated stories in between.
        </motion.p>
        <MaskLines as="h1" id="hero-title" immediate delay={0.1} className="hero-title" lines={[<span key="a">FATMA</span>, <em key="b" className="hero-serif">Elqady</em>]} />
        <motion.img
          src={asset('/signature.png')}
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
        <span>Graphic design · Illustration · Motion</span>
        <a className="hero-scroll" href="#intro" aria-label="Scroll to introduction">
          Scroll <ArrowDown aria-hidden="true" />
        </a>
        <span className="hero-hint">Social &amp; campaign work shown</span>
      </div>
    </section>
  )
}

function CollageSlot({ slot, index, cycle, sx, sy, reduce }: { slot: Slot; index: number; cycle: number; sx: MotionValue<number>; sy: MotionValue<number>; reduce: boolean }) {
  const x = useTransform(sx, (value) => value * slot.depth * -60)
  const y = useTransform(sy, (value) => value * slot.depth * -40)
  // Each slot advances on its own turn: slot i changes when cycle % slots === i.
  const turns = Math.floor((cycle + slots.length - 1 - index) / slots.length)
  const art = heroArtwork[(index + turns * slots.length) % heroArtwork.length]
  const image = media(art.key)
  const style = {
    '--x': `${slot.x}%`, '--y': `${slot.y}%`, '--w': `${slot.w}vw`,
    '--mx': `${slot.mobile?.x ?? 0}%`, '--my': `${slot.mobile?.y ?? 0}%`, '--mw': `${slot.mobile?.w ?? 0}vw`,
  } as React.CSSProperties

  return (
    <motion.div className={`collage-slot ${slot.mobile ? '' : 'desktop-only'}`} style={{ ...style, x: reduce ? 0 : x, y: reduce ? 0 : y }}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease, delay: 0.35 + index * 0.08 }}
      >
        <Link href={workHref(art.work)} className="collage-piece" data-cursor="Open" aria-label={`${art.label} — open Social Media & Campaigns`}>
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
          <span className="collage-label" aria-hidden="true">{art.label}</span>
        </Link>
      </motion.div>
    </motion.div>
  )
}
