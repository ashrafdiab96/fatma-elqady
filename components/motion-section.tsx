'use client'

import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getProject, motionVideo } from '@/lib/projects'
import { ArtImage, MaskLines, Reveal, SectionLabel, ease } from './primitives'

const format = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

export function MotionSection({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <section id="motion" className="motion-section page-section" aria-labelledby="motion-title">
      <SectionLabel index="03" label="Motion / animation" right="Moving image" />
      <div className="motion-layout">
        <div className="motion-heading">
          <MaskLines as="h2" id="motion-title" lines={['Stories', <>that <em>move.</em></>]} />
          <p>Selected motion study<br />Fatma Elqady / 07v02</p>
        </div>
        <Reveal className="motion-player">
          <VideoPlayer />
        </Reveal>
        <FrameSequence onOpen={onOpen} />
      </div>
    </section>
  )
}

function VideoPlayer() {
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
    <div ref={wrap} className={`video-player ${playing ? 'is-playing' : ''}`}>
      <video
        ref={video}
        src={`${motionVideo}#t=0.1`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Fatma Elqady motion design video"
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
        <span className="video-time">{format(time.current)}</span>
        <div className="video-scrub" style={{ '--progress': `${progress}%` } as React.CSSProperties}>
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
        <span className="video-time">{format(time.duration)}</span>
        <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute video' : 'Mute video'}>{muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}</button>
        <button type="button" onClick={fullscreen} aria-label="Play video fullscreen"><Maximize2 aria-hidden="true" /></button>
      </div>
    </div>
  )
}

const sequence = getProject('accessorize-summer')!

function FrameSequence({ onOpen }: { onOpen: (slug: string) => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { margin: '-15% 0px' })
  const [frame, setFrame] = useState(0)
  const [hovered, setHovered] = useState(false)
  const frames = sequence.images.filter((image) => image.ratio < 1.2)

  useEffect(() => {
    if (!inView || reduce || hovered) return
    const id = window.setInterval(() => setFrame((value) => (value + 1) % frames.length), 1700)
    return () => window.clearInterval(id)
  }, [inView, reduce, hovered, frames.length])

  return (
    <div className="frame-sequence">
      <button
        ref={ref}
        type="button"
        className="frame-stage"
        onClick={() => onOpen(sequence.slug)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        aria-label={`Open ${sequence.title}`}
        data-cursor="Open"
      >
        <AnimatePresence initial={false}>
          <motion.div key={frames[frame].key} className="frame-image" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease }}>
            <ArtImage image={frames[frame]} alt="" sizes="(min-width: 900px) 26vw, 80vw" />
          </motion.div>
        </AnimatePresence>
      </button>
      <div className="frame-meta">
        <span className="eyebrow">Social sequence · {String(frame + 1).padStart(2, '0')}/{String(frames.length).padStart(2, '0')}</span>
        <p>{sequence.title}</p>
        <div className="frame-ticks" aria-hidden="true">
          {frames.map((image, index) => <span key={image.key} className={index === frame ? 'is-active' : ''} />)}
        </div>
        <button type="button" className="text-link" onClick={() => onOpen(sequence.slug)}>
          View set <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
