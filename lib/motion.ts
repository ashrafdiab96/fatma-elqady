import { asset } from './site'

/** A motion piece from /public/motion. Dimensions are the source video's, so its frame is reserved before it loads. */
export type MotionPiece = {
  key: string
  title: string
  label: string
  src: string
  poster: string
  width: number
  height: number
  ratio: number
}

const piece = (key: string, title: string, label: string, width: number, height: number): MotionPiece => ({
  key,
  title,
  label,
  src: asset(`/motion/${key}.mp4`),
  poster: asset(`/motion/posters/${key}.webp`),
  width,
  height,
  ratio: width / height,
})

/**
 * In display order: the explainer leads (the most complete piece of motion design), followed by the
 * wide screen ad and the vertical social post, shown side by side at one shared height.
 *
 * Not shown: two vertical education reels (3ashryeducreel.mp4, DOAA EDUCATION REEL_1…mp4) — 4K masters
 * of 210–330 MB, over GitHub’s 100 MB file limit. Compress them, then add them here.
 */
export const featuredMotion = piece('sahl-electricity-explainer', 'Electricity card, step by step', 'Explainer animation · Sahl', 1920, 1080)

export const supportingMotion: MotionPiece[] = [
  piece('sahl-almaza-screen', 'One tap to charge', 'Digital screen · Almaza Avenue mall', 2304, 1134),
  piece('sahl-clothesline-social', 'Recharge, pay, buy', 'Social motion · 9:16', 1440, 2564),
]
