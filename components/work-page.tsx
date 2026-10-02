'use client'

import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { nextWork, pieceCount, workHref, works, type Project, type Work } from '@/lib/projects'
import { ContactSection } from './about-contact'
import { BookFeature } from './book-feature'
import { EditorialGallery, JustifiedGallery, LightboxProvider } from './gallery'
import { MascotCase } from './mascot-case'
import { MaskLines, Reveal } from './primitives'
import { ProcessCompare } from './process-compare'
import { WorkCover } from './work-cover'

const pad = (value: number) => String(value).padStart(2, '0')

export function WorkPage({ work }: { work: Work }) {
  const index = works.findIndex((entry) => entry.slug === work.slug)
  return (
    <LightboxProvider>
      <main id="content" className="case" style={{ '--case-index': index } as React.CSSProperties}>
        <CaseHeader work={work} index={index} />
        {work.slug === 'sahl-mascot' ? (
          <MascotCase />
        ) : (
          <>
            {work.slug === 'picture-book' && <BookFeature />}
            <div className="case-groups page-gutter">
              {work.groups.map((group, groupIndex) => (
                <CaseGroup key={group.slug} group={group} index={groupIndex} total={work.groups.length} />
              ))}
            </div>
          </>
        )}
        <NextWork work={work} />
      </main>
      <ContactSection />
    </LightboxProvider>
  )
}

function CaseHeader({ work, index }: { work: Work; index: number }) {
  return (
    <header id="top" className="case-head page-gutter">
      <p className="case-crumb">
        <Link href="/#work">Fatma Elqady <span>/</span> Selected work</Link>
        <span>{pad(index + 1)} / {pad(works.length)}</span>
      </p>
      <MaskLines as="h1" immediate className="case-title" lines={[work.title]} />
      <div className="case-intro-row">
        <Reveal className="case-intro"><p>{work.intro}</p></Reveal>
        <Reveal delay={0.1}>
          <dl className="case-meta">
            {work.meta.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
            <div>
              <dt>Pieces</dt>
              <dd>{pieceCount(work)}</dd>
            </div>
          </dl>
        </Reveal>
      </div>
      <Reveal className="case-cover-wrap" delay={0.15}>
        <WorkCover images={work.cover} frame={2.2} mobileFrame={work.cover.length > 1 ? 1.5 : 1.25} sizes="(min-width: 900px) 40vw, 60vw" eager className="case-cover" />
      </Reveal>
      <ul className="case-tags" aria-label="Disciplines">
        {work.tags.map((tag) => <li key={tag}>{tag}</li>)}
      </ul>
    </header>
  )
}

function CaseGroup({ group, index, total }: { group: Project; index: number; total: number }) {
  const portrait = group.images.every((image) => image.ratio < 1.3)
  return (
    <section className="case-group" aria-labelledby={`group-${group.slug}`}>
      <div className="case-group-head">
        <span className="case-group-index">{pad(index + 1)} / {pad(total)}</span>
        <div>
          <h2 id={`group-${group.slug}`}>{group.title}</h2>
          {group.context && <p className="case-group-context">{group.context}</p>}
        </div>
        <div className="case-group-copy">
          <p>{group.description}</p>
          <p className="case-group-count">{group.images.length} {group.images.length === 1 ? 'piece' : 'pieces'}</p>
          {group.related && (
            <Link className="text-link" href={workHref(group.related.work)} data-cursor="Open">
              {group.related.label} <ArrowUpRight aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
      {group.slug === 'music-stage' ? (
        <div className="case-compare">
          <ProcessCompare />
          <p className="case-compare-note">Drag across the piece to compare the flat vector version with the final grain-and-gradient render.</p>
        </div>
      ) : group.sequences ? (
        <EditorialGallery sequences={group.sequences} images={group.images} title={group.title} />
      ) : (
        <JustifiedGallery images={group.images} title={group.title} row={portrait ? 340 : 280} mobileRow={portrait ? 190 : 140} />
      )}
    </section>
  )
}

function NextWork({ work }: { work: Work }) {
  const next = nextWork(work.slug)
  return (
    <nav className="next-work page-gutter" aria-label="Next work">
      <Link href={workHref(next.slug)} className="next-work-link" data-cursor="Next">
        <span className="eyebrow">Next — {next.discipline}</span>
        <span className="next-work-title">{next.title} <ArrowRight aria-hidden="true" /></span>
        <WorkCover images={next.cover} frame={1.6} sizes="30vw" className="next-work-cover" />
      </Link>
      <Link href="/#work" className="text-link">All work <ArrowUpRight aria-hidden="true" /></Link>
    </nav>
  )
}
