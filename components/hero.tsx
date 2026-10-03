'use client'

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { media, thumb, type MediaKey } from '@/lib/media'
import { heroArtwork, trailArtwork, workHref, type HeroArt } from '@/lib/projects'
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

type TrailPiece = { id: number; key: MediaKey; x: number; y: number; rotate: number }

/** Cursor travel (px) between trail pieces, how long each stays, and how many can be on screen. */
const TRAIL_STEP = 90
const TRAIL_LIFE = 1100
const TRAIL_MAX = 10
/** Share of trail pieces drawn from the focus brands. */
const TRAIL_FOCUS = 0.75

const shuffle = <T,>(items: readonly T[]) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const preload = (keys: MediaKey[]) => keys.forEach((key) => { const img = new Image(); img.src = thumb(key) })

/** Deals items from a shuffled deck, reshuffling when it runs out and skipping anything in `avoid`. */
function draw<T>(deck: T[], source: readonly T[], avoid: (item: T) => boolean) {
  for (let tries = 0; tries < source.length * 2; tries += 1) {
    if (!deck.length) deck.push(...shuffle(source))
    const item = deck.pop()!
    if (!avoid(item)) return item
  }
  return deck.pop() ?? source[0]
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  // The wall is dealt on the client so every visit gets a different mix.
  const [wall, setWall] = useState<HeroArt[] | null>(null)
  const wallRef = useRef<HeroArt[]>([])
  const wallDeck = useRef<HeroArt[]>([])
  const [trail, setTrail] = useState<TrailPiece[]>([])
  const trailDecks = useRef({ focus: [] as MediaKey[], rest: [] as MediaKey[] })
  const trailRecent = useRef<MediaKey[]>([])
  const lastSpawn = useRef<{ x: number; y: number } | null>(null)
  const trailId = useRef(0)
  const timers = useRef(new Set<number>())

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
    const onWall = (art: HeroArt) => wallRef.current.some((shown) => shown.key === art.key)
    if (!wallRef.current.length) {
      wallRef.current = slots.map(() => draw(wallDeck.current, heroArtwork, onWall))
      setWall(wallRef.current)
    }
    if (reduce) return
    const warm = window.setTimeout(() => {
      preload(wallDeck.current.slice(-slots.length).map((art) => art.key))
      preload([...trailArtwork.focus.slice(0, 4), ...trailArtwork.rest.slice(0, 2)])
    }, 1500)
    let tick = 0
    const id = window.setInterval(() => {
      const slot = tick++ % slots.length
      const next = draw(wallDeck.current, heroArtwork, onWall)
      wallRef.current = wallRef.current.map((art, index) => (index === slot ? next : art))
      setWall(wallRef.current)
      preload(wallDeck.current.slice(-1).map((art) => art.key))
    }, 3400)
    const pending = timers.current
    return () => { window.clearTimeout(warm); window.clearInterval(id); pending.forEach(window.clearTimeout); pending.clear() }
  }, [reduce])

  // A trail of work follows the cursor — mostly the focus brands, never what is already on the wall.
  const spawnTrail = (x: number, y: number) => {
    const avoid = (key: MediaKey) => trailRecent.current.includes(key) || wallRef.current.some((art) => art.key === key)
    const pool = Math.random() < TRAIL_FOCUS ? 'focus' : 'rest'
    const deck = trailDecks.current[pool]
    const key = draw(deck, trailArtwork[pool], avoid)
    trailRecent.current = [...trailRecent.current.slice(-(TRAIL_MAX - 1)), key]
    preload(deck.slice(-2))
    const id = trailId.current++
    setTrail((pieces) => [...pieces.slice(-(TRAIL_MAX - 1)), { id, key, x, y, rotate: Math.random() * 10 - 5 }])
    const timer = window.setTimeout(() => {
      timers.current.delete(timer)
      setTrail((pieces) => pieces.filter((piece) => piece.id !== id))
    }, TRAIL_LIFE)
    timers.current.add(timer)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    px.set(x / rect.width - 0.5)
    py.set(y / rect.height - 0.5)
    const last = lastSpawn.current
    if (!last || Math.hypot(x - last.x, y - last.y) > TRAIL_STEP) {
      lastSpawn.current = { x, y }
      if (last) spawnTrail(x, y)
    }
  }

  return (
    <section ref={ref} id="top" className="hero" onPointerMove={onPointerMove} onPointerLeave={() => { px.set(0); py.set(0); lastSpawn.current = null }} aria-labelledby="hero-title">
      <motion.div className="hero-collage" style={{ y: reduce ? 0 : spread }}>
        {wall && slots.map((slot, index) => (
          <CollageSlot key={index} slot={slot} index={index} art={wall[index]} sx={sx} sy={sy} reduce={!!reduce} />
        ))}
      </motion.div>

      <div className="hero-trail" aria-hidden="true">
        <AnimatePresence>
          {trail.map((piece) => {
            const image = media(piece.key)
            return (
              <motion.img
                key={piece.id}
                src={thumb(piece.key)}
                alt=""
                className="trail-piece"
                style={{ left: piece.x, top: piece.y, rotate: piece.rotate, aspectRatio: `${image.width} / ${image.height}` }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.45, ease }}
              />
            )
          })}
        </AnimatePresence>
      </div>

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
        <span className="hero-hint">Move around for more work</span>
      </div>
    </section>
  )
}

function CollageSlot({ slot, index, art, sx, sy, reduce }: { slot: Slot; index: number; art: HeroArt; sx: MotionValue<number>; sy: MotionValue<number>; reduce: boolean }) {
  const x = useTransform(sx, (value) => value * slot.depth * -60)
  const y = useTransform(sy, (value) => value * slot.depth * -40)
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
