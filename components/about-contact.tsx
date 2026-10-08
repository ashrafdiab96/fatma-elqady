'use client'

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight, Copy } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { thumb, type MediaKey } from '@/lib/media'
import { pieceCount, workHref, works, type WorkSlug } from '@/lib/projects'
import { asset, behance, email, linkedin } from '@/lib/site'
import { MaskLines, Reveal, SectionLabel, ease } from './primitives'

const disciplines: { label: string; work: WorkSlug; art: MediaKey }[] = [
  { label: 'Social & campaigns', work: 'social-media', art: 'xpark-zero-x-astronaut' },
  { label: 'Mascot design', work: 'sahl-mascot', art: 'sahl-budz-final' },
  { label: 'Picture books', work: 'picture-book', art: 'marzouk-spread-1' },
  { label: 'Illustration', work: 'illustration', art: 'portrait-chess' },
  { label: 'Visual development', work: 'visual-development', art: 'bg-temple' },
]

/** A short positioning statement straight after the hero. */
export function IntroSection() {
  return (
    <section id="intro" className="intro-section page-section" aria-labelledby="intro-title">
      <SectionLabel index="01" label="Introduction" right="Cairo, Egypt" />
      <div className="intro-layout">
        <Reveal>
          <h2 id="intro-title" className="intro-statement">
            Senior graphic designer and illustrator. I design <em>campaigns, social content</em> and brand characters — and illustrate the stories in between.
          </h2>
        </Reveal>
        <Reveal className="intro-clients" delay={0.1}>
          <p className="eyebrow-muted">Worked with</p>
          <ul>
            <li>Sahl</li>
            <li>Transsion / Xpark × Infinix</li>
            <li>Win Win Agency</li>
            <li>Google &amp; YouTube <span>via TechyTypes Egypt</span></li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

export function AboutSection() {
  return (
    <section id="about" className="about-section page-section" aria-labelledby="about-title">
      <SectionLabel index="04" label="About Fatma" right="Based in Cairo" />
      <div className="about-layout">
        <div className="about-left">
          <MaskLines as="h2" id="about-title" className="about-display" lines={['Design that', <em key="v">tells a story.</em>]} />
          <img className="about-signature" src={asset('/signature.png')} alt="" width={212} height={170} loading="lazy" />
        </div>
        <div className="about-copy">
          <Reveal>
            <p className="lead">Fatma Elqady is a senior graphic designer and illustrator based in Cairo, creating social campaigns, advertising visuals, brand characters and picture books.</p>
            <p>Her practice is grounded in curiosity: finding the character in a frame, the rhythm in a layout and the detail that makes an image stay with you. Hand-drawing and cartooning sit underneath everything — which is why her commercial work so often comes with a character attached. Motion and video editing are a growing part of the toolkit.</p>
          </Reveal>
          <Reveal className="about-facts" delay={0.1}>
            <span>Experience</span>
            <p>Sahl — Illustrator &amp; Graphic Designer<br />Win Win Agency — Illustrator &amp; Graphic Designer<br />Transsion / Xpark — Graphic Designer<br />TechyTypes Egypt — Google &amp; YouTube illustration works</p>
            <span>Tools</span>
            <p>Photoshop · Illustrator · InDesign · Premiere · After Effects · Moho · Cinema 4D</p>
          </Reveal>
        </div>
      </div>
      <DisciplineIndex />
    </section>
  )
}

function DisciplineIndex() {
  const list = useRef<HTMLUListElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 26 })
  const sy = useSpring(y, { stiffness: 220, damping: 26 })

  const onMove = (event: React.PointerEvent) => {
    const rect = list.current?.getBoundingClientRect()
    if (!rect) return
    const nextX = event.clientX - rect.left
    const nextY = event.clientY - rect.top
    x.set(nextX)
    y.set(nextY)
    // While hidden, snap the preview to the cursor so it does not fly in from the corner.
    if (hovered === null) { sx.jump(nextX); sy.jump(nextY) }
  }

  return (
    <div className="discipline-index">
      <p className="eyebrow-muted">What I do</p>
      <ul ref={list} onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
        {disciplines.map((item, index) => {
          const work = works.find((entry) => entry.slug === item.work)
          const count = work ? pieceCount(work) : 0
          return (
            <li key={item.label}>
              <Link href={workHref(item.work)} onPointerEnter={(event) => event.pointerType !== 'touch' && setHovered(index)} onFocus={() => setHovered(null)} data-cursor="See work">
                <span className="discipline-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="discipline-label">{item.label}</span>
                <span className="discipline-count">{count} pieces</span>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </li>
          )
        })}
        <AnimatePresence>
          {hovered !== null && (
            <motion.li
              aria-hidden="true"
              className="discipline-preview"
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.35, ease }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img key={disciplines[hovered].art} src={thumb(disciplines[hovered].art)} alt="" initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease }} />
              </AnimatePresence>
            </motion.li>
          )}
        </AnimatePresence>
      </ul>
    </div>
  )
}

export function ContactSection() {
  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }
  return (
    <section id="contact" className="contact-section page-gutter" aria-labelledby="contact-title">
      <SectionLabel index="05" label="Start a conversation" right="Cairo, Egypt" />
      <div className="contact-content">
        <MaskLines as="h2" id="contact-title" lines={['Have a project', <>in <em>mind?</em></>]} />
        <a className="contact-email" href={`mailto:${email}`} data-cursor="Write">
          <span>{email.split('@')[0]}<wbr />@{email.split('@')[1]}</span> <ArrowUpRight aria-hidden="true" />
        </a>
        <div className="contact-actions">
          <button type="button" onClick={copyEmail} aria-live="polite"><Copy aria-hidden="true" /> {copied ? 'Email copied' : 'Copy email'}</button>
          <a href={behance} target="_blank" rel="noreferrer">Behance <ArrowUpRight aria-hidden="true" /></a>
          <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight aria-hidden="true" /></a>
        </div>
      </div>
      <div className="contact-footer">
        <span>© {new Date().getFullYear()} Fatma Elqady</span>
        <span>Senior Graphic Designer &amp; Illustrator</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </section>
  )
}
