import { media, type Media, type MediaKey } from './media'

export type MascotSet = { title: string; note?: string; images: Media[] }

export type MascotChapter = {
  id: string
  index: string
  title: string
  copy: string
  sets: MascotSet[]
  /** How the chapter lays out its artwork. */
  layout: 'strip' | 'feature' | 'sheet' | 'grid'
}

const set = (title: string, keys: MediaKey[], note?: string): MascotSet => ({ title, note, images: keys.map(media) })

/**
 * The design journey, ordered by the evidence in the files: loose pencil → animal tests under the working
 * name “Sahleko” → the helmet idea → colour and treatment passes → the final robot and its model sheet.
 */
export const mascotChapters: MascotChapter[] = [
  {
    id: 'exploration',
    index: '01',
    title: 'Early Exploration',
    copy: 'Early sketches exploring the mascot’s silhouette, personality, proportions and visual language. A curious, bespectacled kid came first; under the working name “Sahleko”, animal personalities followed — a monkey, a rabbit and a fennec fox. Every version already wears Sahl’s lightning bolt.',
    layout: 'strip',
    sets: [
      set('Human directions', ['sahl-sketch-human-1', 'sahl-sketch-human-2', 'sahl-sketch-human-4', 'sahl-sketch-human-3', 'sahl-sketch-human-5'], 'Glasses, curls and a bolt pendant'),
      set('Animal directions — “Sahleko”', ['sahl-sketch-monkey', 'sahl-sketch-rabbit', 'sahl-sketch-fennec', 'sahl-fennec-colour'], 'The fennec fox was taken to a first colour pass'),
    ],
  },
  {
    id: 'development',
    index: '02',
    title: 'Character Development',
    copy: 'The direction moves to space: a helmeted character with the bolt as its crest. Sketches refine proportions, posture and expression — closed visor, chin guard, open grin — and test a retro-TV head as an alternative.',
    layout: 'strip',
    sets: [
      set('The helmet', ['sahl-helmet-sketch-1', 'sahl-helmet-sketch-2', 'sahl-helmet-sketch-3'], 'Visor and expression studies'),
      set('Alternative head', ['sahl-tv-sketch-1', 'sahl-tv-sketch-2', 'sahl-tv-sketch-3'], 'A retro-TV variation on the same pose'),
    ],
  },
  {
    id: 'direction',
    index: '03',
    title: 'Visual Direction',
    copy: 'Exploring visual variations before establishing the final character direction: what sits behind the visor, how far the palette stretches, and how the character reads in a neon, after-dark treatment.',
    layout: 'grid',
    sets: [
      set('Face & visor', ['sahl-helmet-visor', 'sahl-helmet-laugh-1', 'sahl-helmet-laugh-2', 'sahl-helmet-face', 'sahl-helmet-blue']),
      set('Palette tests', ['sahl-palette-grey', 'sahl-palette-blue', 'sahl-palette-white-blue', 'sahl-palette-orange', 'sahl-palette-teal', 'sahl-palette-white'], 'Helmet colour against the brand blue and orange'),
      set('Neon treatment', ['sahl-neon-1', 'sahl-neon-2', 'sahl-neon-3', 'sahl-neon-4', 'sahl-neon-5', 'sahl-neon-6']),
    ],
  },
  {
    id: 'final',
    index: '04',
    title: 'Final Mascot',
    copy: 'The final character brings the selected personality and visual language into one cohesive mascot: a friendly robot in Sahl blue, with a screen-like visor, headphones and the bolt at its core — simple enough to pose, dress up and animate across a whole campaign.',
    layout: 'feature',
    sets: [set('Budz', ['sahl-budz-final'])],
  },
  {
    id: 'model-sheet',
    index: '05',
    title: 'Model Sheet',
    copy: 'A consistent model sheet defining the mascot from multiple angles — front, three-quarter, side and back — so anyone drawing Budz later keeps him on-model.',
    layout: 'sheet',
    sets: [set('Turnaround', ['sahl-model-sheet'])],
  },
]

/** Profile printed on the launch post (translated from the Arabic). */
export const budzProfile = [
  { label: 'Name', value: 'Budz' },
  { label: 'Species', value: 'Space being' },
  { label: 'Born', value: '2999' },
  { label: 'Home planet', value: 'Sahl' },
]

/** The character at work in Sahl’s social feed — kept apart from the development story. */
export const mascotApplications: MascotSet[] = [
  set(
    'Launch & service series',
    ['sahl-post-budz-id', 'sahl-post-electricity', 'sahl-post-app', 'sahl-post-internet', 'sahl-post-gas-water', 'sahl-post-university', 'sahl-story-electricity'],
    'The ID-card launch post, one pose and prop per bill type, and a 9:16 story adaptation',
  ),
]

export const mascotPieceCount = new Set([...mascotChapters.flatMap((chapter) => chapter.sets), ...mascotApplications].flatMap((group) => group.images.map((image) => image.key))).size
