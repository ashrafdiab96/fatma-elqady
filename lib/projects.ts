import { media, type Media, type MediaKey } from './media'

export type ProjectCategory =
  | 'Picture Books'
  | 'Illustration'
  | 'Character Design'
  | 'Storyboards / Concept Art'
  | 'Campaigns'
  | 'Graphic Design'
  | 'Motion & Animation'

export type Project = {
  slug: string
  title: string
  category: ProjectCategory
  description: string
  cover: Media
  images: Media[]
  context?: string
  year?: string
  behance?: string
  /** Colour sampled from the artwork, used to tint hover states and the project overlay. */
  tone: string
}

type ProjectInput = Omit<Project, 'cover' | 'images'> & { cover?: MediaKey; images: MediaKey[] }

const define = ({ cover, images, ...project }: ProjectInput): Project => ({
  ...project,
  cover: media(cover ?? images[0]),
  images: images.map(media),
})

/** Curated exhibition order. */
export const projects: Project[] = [
  define({
    slug: 'marzouk-family',
    title: 'The Marzouk Family on Holiday',
    category: 'Picture Books',
    description:
      'Cover and interior spreads for عائلة مرزوق في المصيف, an Arabic children’s picture book. The Marzouk family’s trip to Baltim beach — watermelon, a runaway slipper, a rescue at sea and a quiet talk at sunset — painted with warmth and slapstick.',
    context: 'Arabic picture book · Cover & spreads',
    tone: '#7fc3d6',
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
  define({
    slug: 'egyptian-mermaid',
    title: 'Egyptian Mermaid',
    category: 'Character Design',
    description: 'A Pharaonic mermaid — cobra crown, broad collar and pleated gold belt — painted with loose, feathered brushwork over a hieroglyph wall.',
    tone: '#9dc3bb',
    images: ['mermaid', 'mermaid-clean'],
  }),
  define({
    slug: 'xpark-infinix',
    title: 'Xpark × Infinix',
    category: 'Campaigns',
    description: 'Social product posts for Infinix smartphones — Zero X Pro, Note 11, Note 10 and Hot 11 — each built around a scene breaking out of the device screen.',
    context: 'Transsion / Xpark',
    tone: '#2d6aa3',
    images: ['xpark-zero-x-astronaut', 'xpark-zero-x-dress', 'xpark-note-11', 'xpark-note-10', 'xpark-hot-11'],
  }),
  define({
    slug: 'atmospheric-landscapes',
    title: 'Atmospheric Landscapes',
    category: 'Illustration',
    description: 'Painterly studies of rivers, fields, forests and coastlines, built from light, atmosphere and expressive brushwork.',
    tone: '#d9a441',
    images: ['landscape-marsh', 'landscape-forest', 'landscape-hills', 'landscape-dunes'],
  }),
  define({
    slug: 'character-narrative',
    title: 'Character & Narrative',
    category: 'Illustration',
    description: 'Character-led worlds with warmth, wit and a strong sense of place.',
    tone: '#ff8fa3',
    images: ['narrative-bedroom', 'narrative-purple', 'narrative-mexico'],
  }),
  define({
    slug: 'character-studies',
    title: 'Character Studies',
    category: 'Character Design',
    description: 'Personalities built from shape and posture — from a sneaker-wearing jam jar to flat vector figures and painted fashion characters.',
    tone: '#c8173f',
    images: ['character-jam', 'character-drink', 'character-circle', 'character-flare', 'character-locs'],
  }),
  define({
    slug: 'background-art',
    title: 'Background Art / Visual Development',
    category: 'Storyboards / Concept Art',
    description: 'Environment design, background art and visual development across imagined worlds.',
    tone: '#5a6fc4',
    images: ['bg-temple', 'bg-room', 'bg-interior', 'bg-lighthouse'],
  }),
  define({
    slug: 'painted-portraits',
    title: 'Portrait Studies',
    category: 'Illustration',
    description: 'Digital portrait studies moving between painterly rendering and flat vector shapes.',
    tone: '#e8356d',
    images: ['portrait-koi', 'portrait-chess', 'portrait-flowers'],
  }),
  define({
    slug: 'google-youtube',
    title: 'Google & YouTube Illustration',
    category: 'Illustration',
    description: 'Illustration work developed with the TechyTypes Egypt marketing and design team for Google and YouTube.',
    context: 'TechyTypes Egypt · 2020–2021',
    tone: '#3d8f6a',
    images: ['balcony', 'narrative-mexico'],
  }),
  define({
    slug: 'accessorize-summer',
    title: 'Accessorize Summer Sale',
    category: 'Campaigns',
    description: 'A social set for a summer sale and new collection — soft organic shapes, botanical line art and close editorial crops of jewellery.',
    tone: '#e5389a',
    images: ['accessorize-1', 'accessorize-2', 'accessorize-3', 'accessorize-4', 'accessorize-5', 'accessorize-title'],
  }),
  define({
    slug: 'music-stage',
    title: 'Music Stage',
    category: 'Illustration',
    description: 'One composition in two finishes: crisp flat vector shapes, then reworked with grain and soft gradients.',
    tone: '#b0306e',
    images: ['music-textured', 'music-flat'],
  }),
  define({
    slug: 'advertising-visuals',
    title: 'Advertising Key Visuals',
    category: 'Graphic Design',
    description: 'Photo-composited social and print visuals for banking, dairy and grocery-delivery brands.',
    tone: '#2f8f7c',
    images: ['ad-banque-misr', 'ad-almarai', 'ad-jira-market'],
  }),
  define({
    slug: 'storyboards-concepts',
    title: 'Storyboards & Concepts',
    category: 'Storyboards / Concept Art',
    description: 'Black-and-white composition studies exploring space, tension and visual narrative.',
    tone: '#7b3fc4',
    images: ['story-spooky', 'bg-lighthouse', 'bg-room'],
  }),
  define({
    slug: 'scene-studies',
    title: 'Scene Studies',
    category: 'Illustration',
    description: 'Standalone scenes exploring different finishes — a textured summer beach painting and a pixel-art film study.',
    tone: '#e84d3d',
    images: ['scene-beach', 'scene-pixel'],
  }),
  define({
    slug: 'mexico-bedroom',
    title: 'Mexico',
    category: 'Illustration',
    description: 'A colorful narrative bedroom illustration built around culture, pattern and collected details.',
    tone: '#f2a33a',
    images: ['narrative-mexico'],
  }),
]

export const categories = ['All', 'Picture Books', 'Illustration', 'Character Design', 'Storyboards / Concept Art', 'Campaigns', 'Graphic Design', 'Motion & Animation'] as const

export type CategoryFilter = (typeof categories)[number]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
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

/** Curated, colourful pieces that populate the hero collage and cursor trail. */
export const heroArtwork: { key: MediaKey; slug: string }[] = [
  { key: 'mermaid', slug: 'egyptian-mermaid' },
  { key: 'marzouk-spread-3', slug: 'marzouk-family' },
  { key: 'character-jam', slug: 'character-studies' },
  { key: 'landscape-marsh', slug: 'atmospheric-landscapes' },
  { key: 'bg-temple', slug: 'background-art' },
  { key: 'portrait-koi', slug: 'painted-portraits' },
  { key: 'music-textured', slug: 'music-stage' },
  { key: 'narrative-bedroom', slug: 'character-narrative' },
  { key: 'xpark-zero-x-astronaut', slug: 'xpark-infinix' },
  { key: 'balcony', slug: 'google-youtube' },
  { key: 'scene-beach', slug: 'scene-studies' },
  { key: 'narrative-mexico', slug: 'mexico-bedroom' },
  { key: 'character-circle', slug: 'character-studies' },
  { key: 'landscape-dunes', slug: 'atmospheric-landscapes' },
  { key: 'narrative-purple', slug: 'character-narrative' },
  { key: 'portrait-chess', slug: 'painted-portraits' },
]
