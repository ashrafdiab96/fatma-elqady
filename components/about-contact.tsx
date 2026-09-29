'use client'

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight, Copy } from 'lucide-react'
import { useRef, useState } from 'react'
import { thumb, type MediaKey } from '@/lib/media'
import { projects, type CategoryFilter } from '@/lib/projects'
import { MaskLines, Marquee, Reveal, SectionLabel, ease } from './primitives'

const disciplines: { label: string; filter: CategoryFilter; art: MediaKey }[] = [
  { label: 'Picture books', filter: 'Picture Books', art: 'marzouk-spread-1' },
  { label: 'Illustration', filter: 'Illustration', art: 'landscape-dunes' },
  { label: 'Character design', filter: 'Character Design', art: 'mermaid-clean' },
  { label: 'Visual development', filter: 'Storyboards / Concept Art', art: 'bg-temple' },
  { label: 'Campaigns', filter: 'Campaigns', art: 'xpark-zero-x-dress' },
  { label: 'Graphic design', filter: 'Graphic Design', art: 'ad-banque-misr' },
]

export function AboutSection({ onPickDiscipline }: { onPickDiscipline: (filter: CategoryFilter) => void }) {
  return (
    <section id="about" className="about-section page-section" aria-labelledby="about-title">
      <SectionLabel index="04" label="About Fatma" right="Based in Cairo" />
      <div className="about-layout">
        <div className="about-left">
          <MaskLines as="h2" id="about-title" className="about-display" lines={['I make', <em key="v">visual</em>, <em key="w">worlds.</em>]} />
          <img className="about-signature" src="/signature.png" alt="" width={212} height={170} loading="lazy" />
        </div>
        <div className="about-copy">
          <Reveal>
            <p className="lead">Fatma Elqady is a graphic designer, illustrator and motion designer working across hand-drawing, cartooning, traditional animation, visual development and brand communication.</p>
            <p>Her practice is grounded in curiosity: finding the character in a frame, the rhythm in a layout and the detail that makes an image stay with you.</p>
          </Reveal>
          <Reveal className="about-facts" delay={0.1}>
            <span>Experience</span>
            <p>Sahl — Illustrator &amp; Graphic Designer<br />Win Win Agency — Illustrator &amp; Graphic Designer<br />Transsion / Xpark — Graphic Designer<br />TechyTypes Egypt — Google &amp; YouTube illustration works</p>
            <span>Tools</span>
            <p>Photoshop · Illustrator · InDesign · Premiere · After Effects · Moho · Cinema 4D</p>
          </Reveal>
        </div>
      </div>
      <DisciplineIndex onPick={onPickDiscipline} />
    </section>
  )
}

function DisciplineIndex({ onPick }: { onPick: (filter: CategoryFilter) => void }) {
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
      <p className="eyebrow">What I do — pick one to filter the work</p>
      <ul ref={list} onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
        {disciplines.map((item, index) => {
          const count = projects.filter((project) => project.category === item.filter).length
          return (
            <li key={item.label}>
              <button type="button" onClick={() => onPick(item.filter)} onPointerEnter={(event) => event.pointerType !== 'touch' && setHovered(index)} onFocus={() => setHovered(null)} data-cursor="See work">
                <span className="discipline-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="discipline-label">{item.label}</span>
                <span className="discipline-count">{count} {count === 1 ? 'project' : 'projects'}</span>
                <ArrowUpRight aria-hidden="true" />
              </button>
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
      await navigator.clipboard.writeText('fatmaelkady@gmail.com')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = 'mailto:fatmaelkady@gmail.com'
    }
  }
  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <Marquee className="contact-marquee" items={['Say hello', 'Picture books', 'Characters', 'Campaigns', 'Motion']} />
      <div className="page-gutter contact-inner">
        <SectionLabel index="05" label="Start a conversation" right="Cairo, Egypt" />
        <div className="contact-content">
          <MaskLines as="h2" id="contact-title" lines={['Have a story', <>in <em>mind?</em></>]} />
          <a className="contact-email" href="mailto:fatmaelkady@gmail.com" data-cursor="Write">
            <span>fatmaelkady<wbr />@gmail.com</span> <ArrowUpRight aria-hidden="true" />
          </a>
          <div className="contact-actions">
            <button type="button" onClick={copyEmail} aria-live="polite"><Copy aria-hidden="true" /> {copied ? 'Email copied' : 'Copy email'}</button>
            <a href="https://www.behance.net/fatmaelkad8fc" target="_blank" rel="noreferrer">Behance <ArrowUpRight aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/in/fatmaelqady/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight aria-hidden="true" /></a>
          </div>
        </div>
        <div className="contact-footer">
          <span>© {new Date().getFullYear()} Fatma Elqady</span>
          <span>Made with curiosity</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </section>
  )
}
