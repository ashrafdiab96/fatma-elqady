'use client'

import { useInView, useReducedMotion } from 'framer-motion'
import { Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { featuredMotion, supportingMotion, type MotionPiece } from '@/lib/motion'
import { MaskLines, Reveal, SectionLabel } from './primitives'

const format = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
const pad = (value: number) => String(value).padStart(2, '0')
const count = 1 + supportingMotion.length

export function MotionSection() {
  return (
    <section id="motion" className="motion-section page-section" aria-labelledby="motion-title">
      <SectionLabel index="03" label="Motion" right="Selected motion work" />
      <div className="motion-layout">
        <div className="motion-heading">
          <MaskLines as="h2" id="motion-title" lines={['Stories', <>that <em>move.</em></>]} />
          <p className="motion-copy">A selection of motion and video work exploring animated social content, visual storytelling and digital communication.</p>
          <p className="motion-caption">Motion design · Video<br />{pad(count)} pieces</p>
        </div>
        <Reveal className="motion-player">
          <MotionFigure piece={featuredMotion} index={0} />
        </Reveal>
      </div>
      <div className="motion-pair">
        {supportingMotion.map((piece, index) => (
          <Reveal key={piece.key} className="motion-pair-item" delay={index * 0.08} style={{ '--r': piece.ratio } as CSSProperties}>
            <MotionFigure piece={piece} index={index + 1} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function MotionFigure({ piece, index }: { piece: MotionPiece; index: number }) {
  return (
    <figure className="motion-figure">
      <VideoPlayer piece={piece} />
      <figcaption>
        <span>{pad(index + 1)}</span>
        <span>{piece.title}</span>
        <span>{piece.label}</span>
      </figcaption>
    </figure>
  )
}

/**
 * Plays muted while it is on screen and pauses when it leaves, so only what the visitor is looking at
 * downloads or decodes. Nothing is fetched until then (preload="none"); a poster frame holds the space.
 */
function VideoPlayer({ piece }: { piece: MotionPiece }) {
  const wrap = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(wrap, { margin: '-20% 0px -20% 0px' })
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [time, setTime] = useState({ current: 0, duration: 0 })
  const userPaused = useRef(false)

  // Autoplay silently while on screen (unless the visitor paused it or prefers reduced motion).
  useEffect(() => {
    const element = video.current
    if (!element) return
    if (inView && !reduce && !userPaused.current) element.play().catch(() => undefined)
    if (!inView && !element.paused) element.pause()
  }, [inView, reduce])

  const toggle = () => {
    const element = video.current
    if (!element) return
    if (element.paused) { userPaused.current = false; element.play().catch(() => undefined) }
    else { userPaused.current = true; element.pause() }
  }

  const toggleMute = () => {
    if (!video.current) return
    video.current.muted = !video.current.muted
    setMuted(video.current.muted)
  }

  const fullscreen = () => {
    const element = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (!element) return
    if (element.requestFullscreen) element.requestFullscreen().catch(() => undefined)
    else element.webkitEnterFullscreen?.()
  }

  const progress = time.duration ? (time.current / time.duration) * 100 : 0

  return (
    <div ref={wrap} className={`video-player ${playing ? 'is-playing' : ''}`} style={{ '--r': piece.ratio } as CSSProperties}>
      <video
        ref={video}
        src={piece.src}
        poster={piece.poster}
        width={piece.width}
        height={piece.height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={`${piece.title} — ${piece.label}`}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(event) => setTime({ current: 0, duration: event.currentTarget.duration })}
        onTimeUpdate={(event) => setTime({ current: event.currentTarget.currentTime, duration: event.currentTarget.duration || 0 })}
      />
      <button type="button" className="video-big-play" onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'} tabIndex={-1} data-cursor={playing ? 'Pause' : 'Play'}>
        <Play aria-hidden="true" />
      </button>
      <div className="video-controls">
        <button type="button" onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'}>{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}</button>
        {time.duration > 0 && <span className="video-time">{format(time.current)}</span>}
        <div className="video-scrub" style={{ '--progress': `${progress}%` } as CSSProperties}>
          <input
            type="range"
            min={0}
            max={time.duration || 0}
            step={0.1}
            value={time.current}
            onChange={(event) => { if (video.current) video.current.currentTime = Number(event.target.value) }}
            aria-label="Seek video"
          />
        </div>
        {time.duration > 0 && <span className="video-time">{format(time.duration)}</span>}
        <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute video' : 'Mute video'}>{muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}</button>
        <button type="button" onClick={fullscreen} aria-label="Play video fullscreen"><Maximize2 aria-hidden="true" /></button>
      </div>
    </div>
  )
}
