'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { legacyRoutes, workHref } from '@/lib/projects'
import { AboutSection, ContactSection, IntroSection } from './about-contact'
import { Hero } from './hero'
import { MotionSection } from './motion-section'
import { SelectedWork } from './selected-work'

const LEGACY_PREFIX = '#project/'

export function HomePage() {
  const router = useRouter()

  // Projects used to open in an overlay at #project/<slug>; send those shared links to the page that holds the work now.
  useEffect(() => {
    const { hash } = window.location
    if (!hash.startsWith(LEGACY_PREFIX)) return
    const work = legacyRoutes[decodeURIComponent(hash.slice(LEGACY_PREFIX.length))]
    if (work) router.replace(workHref(work))
  }, [router])

  return (
    <>
      <main id="content">
        <Hero />
        <IntroSection />
        <SelectedWork />
        <MotionSection />
        <AboutSection />
      </main>
      <ContactSection />
    </>
  )
}
