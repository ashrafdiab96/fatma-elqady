import type { CSSProperties } from 'react'
import type { Media } from '@/lib/media'
import { ArtImage } from './primitives'

/**
 * Lays one to three pieces side by side inside a frame of a given aspect ratio, at their natural
 * proportions — artwork is never cropped. A single piece close to the frame's shape fills it instead.
 * Sizes are percentages, computed for the desktop and mobile frame shapes separately.
 */
function fit(images: Media[], frame: number) {
  const total = images.reduce((sum, image) => sum + image.ratio, 0)
  const gaps = (images.length - 1) * 0.03 * frame
  const height = Math.min(0.8, (0.84 * frame - gaps) / total)
  return images.map((image) => ({ w: ((image.ratio * height) / frame) * 100, h: height * 100 }))
}

/** A strip runs every piece at one fixed height and lets the row overflow the frame on both sides. */
function strip(images: Media[], frame: number, height = 0.66) {
  return images.map((image) => ({ w: ((image.ratio * height) / frame) * 100, h: height * 100 }))
}

export function WorkCover({ images, frame, mobileFrame = frame, sizes, eager = false, isStrip = false, className = '' }: { images: Media[]; frame: number; mobileFrame?: number; sizes: string; eager?: boolean; isStrip?: boolean; className?: string }) {
  const single = !isStrip && images.length === 1 && Math.abs(images[0].ratio - frame) / frame < 0.25
  const desktop = isStrip ? strip(images, frame) : fit(images, frame)
  const mobile = isStrip ? strip(images, mobileFrame) : fit(images, mobileFrame)

  return (
    <div className={`work-cover ${single ? 'is-fill' : ''} ${isStrip ? 'is-strip' : ''} ${className}`} style={{ '--frame': frame, '--frame-m': mobileFrame } as CSSProperties}>
      {images.map((image, index) => (
        <span
          key={image.key}
          className="work-cover-piece"
          style={{ '--w': `${desktop[index].w}%`, '--h': `${desktop[index].h}%`, '--wm': `${mobile[index].w}%`, '--hm': `${mobile[index].h}%`, '--i': index } as CSSProperties}
        >
          <ArtImage image={image} alt="" sizes={sizes} eager={eager} />
        </span>
      ))}
    </div>
  )
}
