'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import type { Media } from '@/lib/media'

export const ease = [0.22, 1, 0.36, 1] as const

/** Responsive artwork. The wrapper reserves the aspect ratio so nothing shifts while loading. */
export function ArtImage({ image, alt, sizes, eager = false, className = '', style }: { image: Media; alt: string; sizes: string; eager?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <img
      className={className}
      style={style}
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
    />
  )
}

export function Reveal({ children, className = '', delay = 0, y = 34 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, ease, delay }}>
      {children}
    </motion.div>
  )
}

/** Big display text whose lines rise out of a mask when scrolled into view. */
export function MaskLines({ lines, id, className = '', as = 'p', delay = 0, immediate = false }: { lines: ReactNode[]; id?: string; className?: string; as?: 'p' | 'h1' | 'h2'; delay?: number; immediate?: boolean }) {
  const Tag = motion[as]
  const reduce = useReducedMotion()
  const state = immediate ? { animate: 'shown' } : { whileInView: 'shown', viewport: { once: true, margin: '-60px' } }
  return (
    <Tag id={id} className={className} initial={reduce ? false : 'hidden'} {...state}>
      {lines.map((line, index) => (
        <span className="mask-line" key={index}>
          <motion.span
            className="mask-line-inner"
            variants={{ hidden: { y: '105%' }, shown: { y: '0%' } }}
            transition={{ duration: 1, ease, delay: delay + index * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function SectionLabel({ index, label, right }: { index: string; label: string; right: string }) {
  return (
    <div className="section-label">
      <span>
        {index} — {label}
      </span>
      <span>{right}</span>
    </div>
  )
}
