import { mascotPieceCount } from './mascot'
import { media, type Media, type MediaKey } from './media'

/** A single body of work — one client set, series or study. Shown as a group inside a work category. */
export type Project = {
  slug: string
  title: string
  description: string
  context?: string
  images: Media[]
  /** Another work page that tells more of this story. */
  related?: { work: WorkSlug; label: string }
}

type ProjectInput = Omit<Project, 'images'> & { images: MediaKey[] }

const define = ({ images, ...project }: ProjectInput): Project => ({ ...project, images: images.map(media) })

export const projects = {
  sahlSocial: define({
    slug: 'sahl',
    title: 'Sahl',
    context: 'Bill-payment app · Social content',
    related: { work: 'sahl-mascot', label: 'How Budz was designed' },
    description:
      'Always-on social content for Sahl, an Egyptian bill-payment app. Each service — electricity, internet, gas and water, university fees, mobile recharge — gets a post in bold Arabic type on Sahl’s signature blue, most of them fronted by the brand’s mascot, Budz.',
    images: [
      'sahl-post-budz-id',
      'sahl-post-electricity',
      'sahl-post-app',
      'sahl-post-internet',
      'sahl-post-gas-water',
      'sahl-post-university',
      'sahl-story-electricity',
      'sahl-post-orange',
    ],
  }),
  xpark: define({
    slug: 'xpark-infinix',
    title: 'Xpark × Infinix',
    context: 'Transsion / Xpark · Product launch posts',
    description: 'Social product posts for Infinix smartphones — Zero X Pro, Note 11, Note 10 and Hot 11 — each built around a scene breaking out of the device screen.',
    images: ['xpark-zero-x-astronaut', 'xpark-zero-x-dress', 'xpark-note-11', 'xpark-note-10', 'xpark-hot-11'],
  }),
  advertising: define({
    slug: 'advertising-visuals',
    title: 'Advertising Key Visuals',
    context: 'Banque Misr · Almarai · Jira Market',
    description: 'Photo-composited social and print visuals for banking, dairy and grocery-delivery brands.',
    images: ['ad-banque-misr', 'ad-almarai', 'ad-jira-market'],
  }),
  marzouk: define({
    slug: 'marzouk-family',
    title: 'The Marzouk Family on Holiday',
    context: 'Arabic picture book · Cover & spreads',
    description:
      'Cover and interior spreads for عائلة مرزوق في المصيف, an Arabic children’s picture book. The Marzouk family’s trip to Baltim beach — watermelon, a runaway slipper, a rescue at sea and a quiet talk at sunset — painted with warmth and slapstick.',
    images: [
      'marzouk-cover',
      'marzouk-spread-1',
      'marzouk-spread-2',
      'marzouk-spread-3',
      'marzouk-spread-4',
      'marzouk-spread-5',
      'marzouk-cover-portrait',
      'marzouk-mockup-cover',
      'marzouk-mockup-open-1',
      'marzouk-mockup-open-2',
      'marzouk-mockup-portrait',
    ],
  }),
  marzoukPrint: define({
    slug: 'marzouk-print',
    title: 'Cover & print mockups',
    context: 'The Marzouk Family on Holiday',
    description: 'The portrait cover and the book in print.',
    images: ['marzouk-cover-portrait', 'marzouk-mockup-cover', 'marzouk-mockup-portrait', 'marzouk-mockup-open-1', 'marzouk-mockup-open-2'],
  }),
  characterStudies: define({
    slug: 'character-studies',
    title: 'Character Studies',
    description: 'Personalities built from shape and posture — from a sneaker-wearing jam jar to flat vector figures and painted fashion characters.',
    images: ['character-jam', 'character-drink', 'character-circle', 'character-flare', 'character-locs'],
  }),
  mermaid: define({
    slug: 'egyptian-mermaid',
    title: 'Egyptian Mermaid',
    description: 'A Pharaonic mermaid — cobra crown, broad collar and pleated gold belt — painted with loose, feathered brushwork over a hieroglyph wall.',
    images: ['mermaid', 'mermaid-clean'],
  }),
  portraits: define({
    slug: 'painted-portraits',
    title: 'Portrait Studies',
    description: 'Digital portrait studies moving between painterly rendering and flat vector shapes.',
    images: ['portrait-koi', 'portrait-chess', 'portrait-flowers'],
  }),
  googleYoutube: define({
    slug: 'google-youtube',
    title: 'Google & YouTube Illustration',
    context: 'TechyTypes Egypt · 2020–2021',
    description: 'Illustration work developed with the TechyTypes Egypt marketing and design team for Google and YouTube.',
    images: ['balcony', 'narrative-mexico'],
  }),
  narrative: define({
    slug: 'character-narrative',
    title: 'Character & Narrative',
    description: 'Character-led worlds with warmth, wit and a strong sense of place.',
    images: ['narrative-bedroom', 'narrative-purple'],
  }),
  musicStage: define({
    slug: 'music-stage',
    title: 'Music Stage',
    description: 'One composition in two finishes: crisp flat vector shapes, then reworked with grain and soft gradients.',
    images: ['music-textured', 'music-flat'],
  }),
  landscapes: define({
    slug: 'atmospheric-landscapes',
    title: 'Atmospheric Landscapes',
    description: 'Painterly studies of rivers, fields, forests and coastlines, built from light, atmosphere and expressive brushwork.',
    images: ['landscape-marsh', 'landscape-forest', 'landscape-hills', 'landscape-dunes'],
  }),
  scenes: define({
    slug: 'scene-studies',
    title: 'Scene Studies',
    description: 'Standalone scenes exploring different finishes — a textured summer beach painting and a pixel-art film study.',
    images: ['scene-beach', 'scene-pixel'],
  }),
  backgrounds: define({
    slug: 'background-art',
    title: 'Background Art',
    description: 'Environment design and background painting for imagined worlds — light, depth and atmosphere that leave room for characters.',
    images: ['bg-temple', 'bg-interior'],
  }),
  storyboards: define({
    slug: 'storyboards-concepts',
    title: 'Storyboards & Composition Studies',
    description: 'Composition and mood studies — mostly in black and white — exploring space, tension and visual narrative.',
    images: ['story-spooky', 'bg-lighthouse', 'bg-room'],
  }),
}

export type WorkSlug = 'social-media' | 'sahl-mascot' | 'picture-book' | 'illustration' | 'visual-development'

/** A top-level category of work — one card on the homepage, one page under /work/. */
export type Work = {
  slug: WorkSlug
  title: string
  discipline: string
  /** One line for the homepage card. */
  summary: string
  /** Page introduction. */
  intro: string
  meta: { label: string; value: string }[]
  tags: string[]
  /** One to three pieces composed into the card and page cover. */
  cover: Media[]
  groups: Project[]
}

const covers = (...keys: MediaKey[]) => keys.map(media)

/** Ordered by priority: commercial graphic design first, then character design, then illustration. */
export const works: Work[] = [
  {
    slug: 'social-media',
    title: 'Social Media & Campaigns',
    discipline: 'Graphic design',
    summary: 'Campaigns, product launches and always-on content for fintech, tech, banking and FMCG brands.',
    intro: 'Social media design, campaign visuals and advertising key visuals — built for the feed, in Arabic and English.',
    meta: [
      { label: 'Clients', value: 'Sahl · Xpark × Infinix · Banque Misr · Almarai · Jira Market' },
      { label: 'Discipline', value: 'Social media & advertising design' },
      { label: 'Role', value: 'Graphic designer' },
    ],
    tags: ['Social media design', 'Campaign visuals', 'Product launch posts', 'Mascot-led content', 'Arabic typography', 'Photo compositing', 'Ad creatives'],
    cover: covers('sahl-post-app', 'xpark-zero-x-astronaut', 'ad-banque-misr'),
    groups: [projects.sahlSocial, projects.xpark, projects.advertising],
  },
  {
    slug: 'sahl-mascot',
    title: 'Budz — Sahl’s Mascot',
    discipline: 'Character & mascot design',
    summary: 'From the first sketch to a model sheet and a social campaign: designing the mascot for a bill-payment app.',
    intro: 'Budz is the mascot for Sahl, an Egyptian bill-payment app. This is the journey from first sketches to a production-ready character — and into the brand’s social feed.',
    meta: [
      { label: 'Client', value: 'Sahl' },
      { label: 'Discipline', value: 'Character & mascot design' },
      { label: 'Deliverables', value: 'Exploration sketches · Character development · Model sheet · Social applications' },
    ],
    tags: ['Mascot design', 'Character development', 'Model sheet', 'Brand character', 'Social applications'],
    cover: covers('sahl-sketch-fennec', 'sahl-palette-blue', 'sahl-budz-final'),
    groups: [],
  },
  {
    slug: 'picture-book',
    title: 'The Marzouk Family on Holiday',
    discipline: 'Picture book illustration',
    summary: 'Cover, interior spreads and print for an Arabic children’s picture book.',
    intro: projects.marzouk.description,
    meta: [
      { label: 'Format', value: 'Arabic children’s picture book' },
      { label: 'Discipline', value: 'Picture book illustration' },
      { label: 'Deliverables', value: 'Cover · Interior spreads · Print mockups' },
    ],
    tags: ['Picture book', 'Children’s illustration', 'Sequential storytelling', 'Cover design'],
    cover: covers('marzouk-cover'),
    groups: [projects.marzoukPrint],
  },
  {
    slug: 'illustration',
    title: 'Illustration',
    discipline: 'Illustration',
    summary: 'Characters, portraits, landscapes and narrative scenes — painterly and flat.',
    intro: 'Character studies, portraits, landscapes and narrative scenes — from loose painterly brushwork to clean flat vector, including work for Google and YouTube.',
    meta: [
      { label: 'Discipline', value: 'Digital illustration' },
      { label: 'Selected client', value: 'Google & YouTube, via TechyTypes Egypt' },
      { label: 'Range', value: 'Painterly · Flat vector · Textured · Pixel art' },
    ],
    tags: ['Character design', 'Portraits', 'Landscapes', 'Editorial scenes', 'Vector illustration'],
    cover: covers('portrait-chess', 'mermaid', 'character-jam'),
    groups: [
      projects.characterStudies,
      projects.mermaid,
      projects.portraits,
      projects.googleYoutube,
      projects.narrative,
      projects.musicStage,
      projects.landscapes,
      projects.scenes,
    ],
  },
  {
    slug: 'visual-development',
    title: 'Visual Development',
    discipline: 'Background art & storyboards',
    summary: 'Environment design, background painting and composition studies.',
    intro: 'Background art and visual development for imagined worlds, and the composition studies behind them.',
    meta: [
      { label: 'Discipline', value: 'Background art · Visual development' },
      { label: 'Focus', value: 'Space, light and staging for story' },
    ],
    tags: ['Background art', 'Environment design', 'Storyboards', 'Composition studies'],
    cover: covers('bg-temple'),
    groups: [projects.backgrounds, projects.storyboards],
  },
]

export function getWork(slug: string) {
  return works.find((work) => work.slug === slug)
}

export function nextWork(slug: WorkSlug) {
  const index = works.findIndex((work) => work.slug === slug)
  return works[(index + 1) % works.length]
}

export const workHref = (slug: WorkSlug) => `/work/${slug}/`

/** Every piece shown on a work page, in display order. */
export const pieceCount = (work: Work) => (work.slug === 'sahl-mascot' ? mascotPieceCount : new Set(work.groups.flatMap((group) => group.images.map((image) => image.key))).size + (work.slug === 'picture-book' ? bookSpreads.length : 0))


/** Old overlay links (#project/<slug>) now resolve to the page that holds that work. */
export const legacyRoutes: Record<string, WorkSlug> = {
  'marzouk-family': 'picture-book',
  'egyptian-mermaid': 'illustration',
  'xpark-infinix': 'social-media',
  'atmospheric-landscapes': 'illustration',
  'character-narrative': 'illustration',
  'character-studies': 'illustration',
  'background-art': 'visual-development',
  'painted-portraits': 'illustration',
  'google-youtube': 'illustration',
  'music-stage': 'illustration',
  'advertising-visuals': 'social-media',
  'storyboards-concepts': 'visual-development',
  'scene-studies': 'illustration',
  'mexico-bedroom': 'illustration',
}

export const motionVideo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fatma%20elqady_07v02-qXeuJyJxqdrqqvDSmihOg9rz1MvUPw.mp4'

/** Picture book spreads with a short English gloss of the Arabic text printed on each page. */
export const bookSpreads: { key: MediaKey; caption: string }[] = [
  { key: 'marzouk-cover', caption: 'Cover — the family van, loaded to the sky, on the road to Baltim.' },
  { key: 'marzouk-spread-1', caption: 'Arrival: Marzouk and his wife settle in to eat, Ziko heads straight for the sea.' },
  { key: 'marzouk-spread-2', caption: 'The waves carry off Ziko’s slipper — and he goes after it.' },
  { key: 'marzouk-spread-3', caption: 'Marzouk grabs his goggles and dives in to save his son.' },
  { key: 'marzouk-spread-4', caption: 'Panic on the beach as Mum clears the water from Ziko.' },
  { key: 'marzouk-spread-5', caption: 'At sunset, a quiet word: next time, ask a grown-up for help.' },
]

/**
 * Commercial graphic-design pieces only — these populate the hero, so the first impression is
 * Fatma as a senior graphic designer. Illustration lives in its own category.
 */
export const heroArtwork: { key: MediaKey; work: WorkSlug; label: string }[] = [
  { key: 'sahl-post-app', work: 'social-media', label: 'Sahl social campaign' },
  { key: 'xpark-zero-x-astronaut', work: 'social-media', label: 'Xpark × Infinix launch' },
  { key: 'ad-banque-misr', work: 'social-media', label: 'Banque Misr key visual' },
  { key: 'sahl-post-orange', work: 'social-media', label: 'Sahl social campaign' },
  { key: 'xpark-note-11', work: 'social-media', label: 'Xpark × Infinix launch' },
  { key: 'ad-almarai', work: 'social-media', label: 'Almarai key visual' },
  { key: 'sahl-post-electricity', work: 'social-media', label: 'Sahl social campaign' },
  { key: 'xpark-hot-11', work: 'social-media', label: 'Xpark × Infinix launch' },
  { key: 'sahl-post-university', work: 'social-media', label: 'Sahl social campaign' },
  { key: 'xpark-zero-x-dress', work: 'social-media', label: 'Xpark × Infinix launch' },
]
