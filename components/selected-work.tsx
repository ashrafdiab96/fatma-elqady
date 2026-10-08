'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { pieceCount, workHref, works } from '@/lib/projects'
import { MaskLines, SectionLabel, ease } from './primitives'
import { WorkCover } from './work-cover'

export function SelectedWork() {
  return (
    <section id="work" className="selected-work page-section" aria-labelledby="work-title">
      <SectionLabel index="02" label="Selected work" right={`${works.length} bodies of work`} />
      <div className="selected-head">
        <MaskLines as="h2" id="work-title" className="selected-title" lines={['Selected work']} />
        <p>Commercial graphic design first — then the characters, books and illustration behind it. Each opens into the full body of work.</p>
      </div>
      <div className="work-cards">
        {works.map((work, index) => <WorkCard key={work.slug} work={work} index={index} />)}
      </div>
    </section>
  )
}

function WorkCard({ work, index }: { work: (typeof works)[number]; index: number }) {
  const reduce = useReducedMotion()
  const wide = index === 0
  return (
    <motion.article
      className={`work-card ${wide ? 'is-wide' : ''}`}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease, delay: wide ? 0 : (index % 2) * 0.08 }}
    >
      <Link href={workHref(work.slug)} className="work-card-link" data-cursor="Open">
        <div className="work-card-meta">
          <span className="work-card-index">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>{work.title}</h3>
            <p className="work-card-discipline">{work.discipline} · {pieceCount(work)} pieces</p>
          </div>
          <ArrowUpRight aria-hidden="true" />
        </div>
        <p className="work-card-summary">{work.summary}</p>
        <WorkCover
          images={(wide && work.strip) || work.cover}
          isStrip={wide && !!work.strip}
          frame={wide ? 2.4 : 1.3}
          mobileFrame={work.cover.length > 1 ? 1.5 : 1.25}
          sizes={wide ? '(min-width: 900px) 30vw, 40vw' : '(min-width: 900px) 18vw, 40vw'}
          eager={index < 1}
          className="work-card-cover"
        />
      </Link>
    </motion.article>
  )
}
