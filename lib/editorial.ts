import { media, type Media, type MediaKey } from './media'

/**
 * An art-directed gallery: rows are authored, not flowed. A cell is a single piece, a feature (the piece
 * that stays full width on phones) or a stack of smaller rows beside it. Every piece keeps its own
 * proportions — each row is solved for one shared height and written as CSS calc() widths, so the layout
 * needs no measuring and reserves its space before any image loads.
 */
export type EditorialCell = MediaKey | { feature: MediaKey } | { stack: MediaKey[][] }

export type EditorialSequenceInput = { label?: string; note?: string; rows: EditorialCell[][] }

export type PlacedPiece = { image: Media; index: number; width: string; mobileWidth: string; sizes: string }

export type PlacedCell = { kind: 'piece'; piece: PlacedPiece } | { kind: 'stack'; width: string; rows: PlacedPiece[][] }

export type EditorialSequence = { label?: string; note?: string; rows: PlacedCell[][] }

/** Gaps in px — must match .edit-row / .edit-stack in globals.css. */
const GAP = 14
const MOBILE_GAP = 8
/** Phone lines close once their pieces add up to this aspect ratio (two 4:5 posts, or three stories). */
const LINE = 1.4
/** A short last line is sized as if it held this much, so a lone piece is centred rather than blown up. */
const MIN_LINE = 1.2
/** Gallery width as a share of the viewport (the page gutter is 3vw a side). */
const VIEW = 0.94

const calc = (percent: number, px: number) => `calc(${+percent.toFixed(4)}% ${px < 0 ? '-' : '+'} ${Math.abs(+px.toFixed(2))}px)`
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

type Flat = { key: MediaKey; feature: boolean; share: number }

/**
 * Lays out authored sequences. `share` is each piece's fraction of the gallery width on desktop and drives
 * `sizes`, so the browser fetches the 640px export for small pieces and the large one only for features.
 */
export function composeSequences(input: EditorialSequenceInput[]) {
  const images: Media[] = []
  const place = (key: MediaKey, width: string, share: number): PlacedPiece => {
    const image = media(key)
    images.push(image)
    return { image, index: images.length - 1, width, mobileWidth: '100%', sizes: `${Math.ceil(share * VIEW * 100)}vw` }
  }

  const sequences: EditorialSequence[] = input.map(({ label, note, rows }) => ({
    label,
    note,
    rows: rows.map((row) => {
      // Each cell's width is linear in the row height h: width = a·h + b.
      const lines = row.map((cell) => {
        if (typeof cell === 'string' || 'feature' in cell) {
          const key = typeof cell === 'string' ? cell : cell.feature
          return { a: media(key).ratio, b: 0 }
        }
        const ratios = cell.stack.map((line) => sum(line.map((key) => media(key).ratio)))
        const a = 1 / sum(ratios.map((ratio) => 1 / ratio))
        const b = a * (GAP * sum(cell.stack.map((line, index) => (line.length - 1) / ratios[index])) - GAP * (cell.stack.length - 1))
        return { a, b }
      })
      const A = sum(lines.map((line) => line.a))
      const C = GAP * (row.length - 1) + sum(lines.map((line) => line.b))

      const flat: Flat[] = []
      const placed = row.map((cell, index): PlacedCell => {
        const { a, b } = lines[index]
        const width = calc((100 * a) / A, b - (a * C) / A)
        const share = a / A
        if (typeof cell === 'string' || 'feature' in cell) {
          const key = typeof cell === 'string' ? cell : cell.feature
          flat.push({ key, feature: typeof cell !== 'string', share })
          return { kind: 'piece', piece: place(key, width, share) }
        }
        return {
          kind: 'stack',
          width,
          rows: cell.stack.map((line) => {
            const total = sum(line.map((key) => media(key).ratio))
            return line.map((key) => {
              const part = media(key).ratio / total
              flat.push({ key, feature: false, share: share * part })
              return place(key, calc(100 * part, -GAP * (line.length - 1) * part), share * part)
            })
          }),
        }
      })

      // Phones: features run full width, everything else pairs up (stories go three to a line).
      const pieces = placed.flatMap((cell) => (cell.kind === 'piece' ? [cell.piece] : cell.rows.flat()))
      let start = 0
      while (start < flat.length) {
        let end = start + 1
        if (!flat[start].feature) {
          let total = media(flat[start].key).ratio
          while (end < flat.length && !flat[end].feature && total < LINE) total += media(flat[end++].key).ratio
        }
        const group = pieces.slice(start, end)
        const total = Math.max(sum(group.map((piece) => piece.image.ratio)), flat[start].feature ? 0 : MIN_LINE)
        for (const piece of group) {
          const part = piece.image.ratio / total
          // Half a pixel of slack so sub-pixel rounding never pushes a line onto two.
          piece.mobileWidth = calc(100 * part, -MOBILE_GAP * (group.length - 1) * part - 0.5)
          const share = flat[start + group.indexOf(piece)].share
          piece.sizes = `(max-width: 700px) ${Math.ceil(part * 100)}vw, ${Math.ceil(share * VIEW * 100)}vw`
        }
        start = end
      }
      return placed
    }),
  }))

  return { sequences, images }
}
