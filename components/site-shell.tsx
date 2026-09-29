'use client'

import { AnimatePresence, MotionConfig, motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const links = [
  { id: 'work', label: 'Work' },
  { id: 'motion', label: 'Motion' },
  { id: 'about', label: 'About' },
]

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setCurrent(entry.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ;['top', 'featured', 'work', 'motion', 'about', 'contact'].forEach((id) => { const element = document.getElementById(id); if (element) observer.observe(element) })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <MotionConfig reducedMotion="user">
    <div className="site-shell">
      <a className="skip-link" href="#work">Skip to work</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <header className="site-nav">
        <a className="wordmark" href="#top" aria-label="Fatma Elqady — back to top" onClick={() => setOpen(false)}>
          FATMA<span> / </span>ELQADY
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} aria-current={current === link.id ? 'location' : undefined}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#contact" aria-current={current === 'contact' ? 'location' : undefined}>
          Let&apos;s talk <ArrowUpRight aria-hidden="true" />
        </a>
        <button type="button" className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile navigation"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {[...links, { id: 'contact', label: 'Contact' }].map((link, index) => (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + index * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {link.label}
              </motion.a>
            ))}
            <p className="mobile-menu-foot">fatmaelkady@gmail.com · Cairo, Egypt</p>
          </motion.nav>
        )}
      </AnimatePresence>

      {children}
      <CursorLabel />
    </div>
    </MotionConfig>
  )
}

/** A small label that trails the pointer over interactive artwork ("View", "Open"…). Fine pointers only. */
function CursorLabel() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState<string | null>(null)
  const labelRef = useRef<string | null>(null)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    setEnabled(query.matches && !reduce)
  }, [reduce])

  useEffect(() => {
    if (!enabled) return
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      const next = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? null
      if (next !== labelRef.current) { labelRef.current = next; setLabel(next) }
    }
    const onLeave = () => { labelRef.current = null; setLabel(null) }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => { window.removeEventListener('pointermove', onMove); document.documentElement.removeEventListener('pointerleave', onLeave) }
  }, [enabled, x, y])

  if (!enabled) return null
  return (
    <motion.div className="cursor-label" style={{ x: sx, y: sy }} aria-hidden="true">
      <motion.span animate={{ scale: label ? 1 : 0, opacity: label ? 1 : 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
        {label ?? ''}
      </motion.span>
    </motion.div>
  )
}
