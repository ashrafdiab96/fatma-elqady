'use client'

import { AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getProject, type CategoryFilter } from '@/lib/projects'
import { AboutSection, ContactSection } from './about-contact'
import { BookFeature } from './book-feature'
import { Hero } from './hero'
import { MotionSection } from './motion-section'
import { Marquee } from './primitives'
import { ProjectOverlay } from './project-overlay'
import { WorkGallery } from './work-gallery'

const PREFIX = '#project/'

export function HomePage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [filter, setFilter] = useState<CategoryFilter>('All')
  const pushed = useRef(false)

  // Keep the open project in the URL so it can be shared, and so Back closes it.
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash
      const slug = hash.startsWith(PREFIX) ? decodeURIComponent(hash.slice(PREFIX.length)) : null
      setActiveSlug(slug && getProject(slug) ? slug : null)
      if (!slug) pushed.current = false
    }
    sync()
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync) }
  }, [])

  const open = useCallback((slug: string) => {
    window.history.pushState(null, '', `${PREFIX}${slug}`)
    pushed.current = true
    setActiveSlug(slug)
  }, [])

  const navigate = useCallback((slug: string) => {
    window.history.replaceState(null, '', `${PREFIX}${slug}`)
    setActiveSlug(slug)
  }, [])

  const close = useCallback(() => {
    if (pushed.current) {
      window.history.back()
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      setActiveSlug(null)
    }
  }, [])

  const pickDiscipline = (next: CategoryFilter) => {
    setFilter(next)
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }

  const active = activeSlug ? getProject(activeSlug) : undefined

  return (
    <main>
      <Hero onOpen={open} />
      <Marquee className="discipline-marquee" items={['Illustration', 'Picture books', 'Character design', 'Visual development', 'Campaigns', 'Motion']} />
      <BookFeature onOpen={open} />
      <WorkGallery filter={filter} setFilter={setFilter} onOpen={open} />
      <MotionSection onOpen={open} />
      <AboutSection onPickDiscipline={pickDiscipline} />
      <ContactSection />
      <AnimatePresence>{active && <ProjectOverlay key="overlay" project={active} onClose={close} onNavigate={navigate} />}</AnimatePresence>
    </main>
  )
}
