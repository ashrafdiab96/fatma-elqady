import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { WorkPage } from '@/components/work-page'
import { getWork, works } from '@/lib/projects'

export const dynamicParams = false

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const work = getWork((await params).slug)
  if (!work) return {}
  const title = `${work.title} — Fatma Elqady`
  return { title, description: work.intro, openGraph: { title, description: work.intro } }
}

export default async function Page({ params }: Props) {
  const work = getWork((await params).slug)
  if (!work) notFound()
  return <WorkPage work={work} />
}
