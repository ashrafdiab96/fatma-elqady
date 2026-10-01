'use client'

import { useEffect, useRef, useState } from 'react'
import { budzProfile, mascotApplications, mascotChapters, type MascotChapter, type MascotSet } from '@/lib/mascot'
import { JustifiedGallery, useLightbox } from './gallery'
import { ArtImage, Reveal } from './primitives'

const steps = [...mascotChapters.map(({ id, index, title }) => ({ id, index, title })), { id: 'application', index: '06', title: 'In Application' }]

export function MascotCase() {
  const [active, setActive] = useState(steps[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    )
    steps.forEach(({ id }) => { const element = document.getElementById(id); if (element) observer.observe(element) })
    return () => observer.disconnect()
  }, [])

  // On narrow screens the steps scroll sideways; keep the current one in view.
  const list = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const current = list.current?.querySelector<HTMLElement>('[aria-current]')
    if (list.current && current) list.current.scrollTo({ left: current.offsetLeft - 16, behavior: 'smooth' })
  }, [active])

  return (
    <div className="mascot">
      <nav className="journey" aria-label="Design journey">
        <ol ref={list}>
          {steps.map((step) => (
            <li key={step.id}>
              <a href={`#${step.id}`} aria-current={active === step.id ? 'step' : undefined}>
                <span>{step.index}</span>{step.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {mascotChapters.map((chapter) => <Chapter key={chapter.id} chapter={chapter} />)}

      <section id="application" className="mascot-chapter is-application page-gutter" aria-labelledby="application-title">
        <ChapterHead index="06" id="application-title" title="Mascot in Application" copy="From model sheet to feed: Budz fronts Sahl’s social content — introduced with his own ID card, then given a pose and a prop for every bill the app can pay, and adapted for stories." />
        {mascotApplications.map((group) => <SetBlock key={group.title} group={group} row={420} mobileRow={240} />)}
      </section>
    </div>
  )
}

function ChapterHead({ index, id, title, copy }: { index: string; id: string; title: string; copy: string }) {
  return (
    <div className="chapter-head">
      <span className="chapter-index">{index}</span>
      <h2 id={id}>{title}</h2>
      <Reveal className="chapter-copy"><p>{copy}</p></Reveal>
    </div>
  )
}

function SetBlock({ group, row, mobileRow }: { group: MascotSet; row: number; mobileRow: number }) {
  return (
    <div className="mascot-set">
      <p className="mascot-set-label">
        <span>{group.title}</span>
        {group.note && <span>{group.note}</span>}
      </p>
      <JustifiedGallery images={group.images} title={`Budz — ${group.title}`} row={row} mobileRow={mobileRow} sizes="(min-width: 900px) 20vw, 33vw" />
    </div>
  )
}

function Chapter({ chapter }: { chapter: MascotChapter }) {
  const open = useLightbox()
  const head = <ChapterHead index={chapter.index} id={`${chapter.id}-title`} title={chapter.title} copy={chapter.copy} />

  if (chapter.layout === 'feature') {
    const image = chapter.sets[0].images[0]
    return (
      <section id={chapter.id} className="mascot-chapter is-final page-gutter" aria-labelledby={`${chapter.id}-title`}>
        <div className="final-layout">
          <button type="button" className="final-art" onClick={() => open([image], 0, 'Budz — final mascot')} data-cursor="View" aria-label="View the final mascot full screen">
            <ArtImage image={image} alt="Budz, Sahl’s final mascot: a blue robot with a grey screen visor, headphones and the lightning bolt on its chest" sizes="(min-width: 900px) 45vw, 90vw" />
          </button>
          <div className="final-copy">
            {head}
            <dl className="final-profile" aria-label="Character profile">
              {budzProfile.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="final-profile-note">Profile as printed on the launch post.</p>
          </div>
        </div>
      </section>
    )
  }

  if (chapter.layout === 'sheet') {
    const image = chapter.sets[0].images[0]
    return (
      <section id={chapter.id} className="mascot-chapter is-sheet page-gutter" aria-labelledby={`${chapter.id}-title`}>
        {head}
        <figure className="sheet">
          <button type="button" onClick={() => open([image], 0, 'Budz — model sheet')} data-cursor="View" aria-label="View the model sheet full screen">
            <ArtImage image={image} alt="Budz model sheet: front, three-quarter, side and back views" sizes="(min-width: 900px) 90vw, 100vw" />
          </button>
          <figcaption>
            <span>Front</span><span>Three-quarter</span><span>Side</span><span>Back</span>
          </figcaption>
        </figure>
      </section>
    )
  }

  return (
    <section id={chapter.id} className={`mascot-chapter is-${chapter.layout} page-gutter`} aria-labelledby={`${chapter.id}-title`}>
      {head}
      {chapter.sets.map((group) => <SetBlock key={group.title} group={group} row={chapter.layout === 'strip' ? 400 : 360} mobileRow={chapter.layout === 'strip' ? 230 : 210} />)}
    </section>
  )
}
