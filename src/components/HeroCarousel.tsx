import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { heroBanners } from '../data/content'
import { ImageWithFallback } from './ImageWithFallback'

const TRANSITION_DURATION = 700
const bannerCount = heroBanners.length
const carouselSlides = [heroBanners[bannerCount - 1], ...heroBanners, heroBanners[0]]

const getLogicalIndex = (trackPosition: number) => {
  if (trackPosition === 0) return bannerCount - 1
  if (trackPosition === bannerCount + 1) return 0
  return trackPosition - 1
}

function HeroSlide({
  slide,
  active,
  logicalIndex,
}: {
  slide: (typeof heroBanners)[number]
  active: boolean
  logicalIndex: number
}) {
  return (
    <div
      className={`hero-track-slide hero-slide bg-gradient-to-br ${slide.gradient} ${active ? 'active' : ''}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${logicalIndex + 1} dari ${bannerCount}`}
      aria-hidden={!active}
      inert={!active}
    >
      <ImageWithFallback src={slide.image} alt="" className="hero-media" eager />
      <div className="hero-media-overlay" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="relative z-10 max-w-[610px] px-6 pb-20 pt-11 sm:px-10 sm:pt-14 md:px-20 lg:px-14 lg:pt-[60px]">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.16em] text-white backdrop-blur">{slide.eyebrow}</span>
        <h2 className="mt-5 max-w-[590px] text-[28px] font-extrabold leading-[1.1] tracking-[-0.045em] text-white sm:text-[36px] lg:text-[43px]">{slide.title}</h2>
        <p className="mt-4 max-w-[510px] text-sm leading-6 text-white/90 sm:text-[15px]">{slide.description}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link to={slide.cta} className="button-light" tabIndex={active ? undefined : -1}>
            Top Up Sekarang <ArrowRight className="size-[17px]" />
          </Link>
          <span className="rounded-xl border border-white/25 bg-slate-950/20 px-3.5 py-2.5 text-xs font-extrabold text-white backdrop-blur">{slide.discount}</span>
        </div>
      </div>
    </div>
  )
}

export function HeroCarousel() {
  const [trackPosition, setTrackPosition] = useState(1)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [interacting, setInteracting] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const regionRef = useRef<HTMLDivElement>(null)
  const movingRef = useRef(false)
  const transitionTimerRef = useRef<number | undefined>(undefined)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const paused = interacting
  const active = getLogicalIndex(trackPosition)

  const snapToRealSlide = useCallback((position: number) => {
    const normalizedPosition = position === 0
      ? bannerCount
      : position === bannerCount + 1
        ? 1
        : position

    if (normalizedPosition === position) return

    setTransitionEnabled(false)
    setTrackPosition(normalizedPosition)
    window.cancelAnimationFrame(animationFrameRef.current ?? 0)
    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = window.requestAnimationFrame(() => setTransitionEnabled(true))
    })
  }, [])

  const finishMovement = useCallback((position: number) => {
    window.clearTimeout(transitionTimerRef.current)
    movingRef.current = false
    snapToRealSlide(position)
  }, [snapToRealSlide])

  const moveTrack = useCallback((position: number) => {
    if (movingRef.current) return false

    movingRef.current = true
    setTransitionEnabled(true)
    setTrackPosition(position)
    window.clearTimeout(transitionTimerRef.current)
    transitionTimerRef.current = window.setTimeout(() => finishMovement(position), TRANSITION_DURATION + 120)
    return true
  }, [finishMovement])

  const announceSlide = useCallback((index: number) => {
    setAnnouncement(`Banner ${index + 1} dari ${bannerCount}: ${heroBanners[index].title}`)
  }, [])

  const previous = useCallback((announce = true) => {
    const nextIndex = (active - 1 + bannerCount) % bannerCount
    if (moveTrack(trackPosition - 1) && announce) announceSlide(nextIndex)
  }, [active, announceSlide, moveTrack, trackPosition])

  const next = useCallback((announce = true) => {
    const nextIndex = (active + 1) % bannerCount
    if (moveTrack(trackPosition + 1) && announce) announceSlide(nextIndex)
  }, [active, announceSlide, moveTrack, trackPosition])

  const changeSlide = useCallback((nextIndex: number, announce = false) => {
    if (nextIndex === active) return

    const targetPosition = active === bannerCount - 1 && nextIndex === 0
      ? bannerCount + 1
      : active === 0 && nextIndex === bannerCount - 1
        ? 0
        : nextIndex + 1

    if (moveTrack(targetPosition) && announce) announceSlide(nextIndex)
  }, [active, announceSlide, moveTrack])

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => next(false), 5500)
    return () => window.clearInterval(timer)
  }, [next, paused])

  useEffect(() => () => {
    window.clearTimeout(transitionTimerRef.current)
    window.cancelAnimationFrame(animationFrameRef.current ?? 0)
  }, [])

  return (
    <div
      ref={regionRef}
      className="hero-shell"
      role="region"
      aria-roledescription="carousel"
      aria-label="Promo utama"
      tabIndex={0}
      onFocus={(event) => {
        const target = event.target
        if (target === event.currentTarget || (target instanceof HTMLElement && target.matches('a, button'))) {
          setInteracting(true)
        }
      }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false) }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'ArrowLeft') previous()
        if (event.key === 'ArrowRight') next()
      }}
    >
      <h1 className="sr-only">NEXA TOPUP — top up game favorit tanpa ribet</h1>
      <div
        className="hero-track"
        style={{
          transform: `translate3d(-${trackPosition * 100}%, 0, 0)`,
          transition: transitionEnabled
            ? `transform ${TRANSITION_DURATION}ms cubic-bezier(.22,.61,.36,1)`
            : 'none',
        }}
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget || event.propertyName !== 'transform') return
          finishMovement(trackPosition)
        }}
      >
        {carouselSlides.map((slide, index) => {
          const logicalIndex = index === 0
            ? bannerCount - 1
            : index === bannerCount + 1
              ? 0
              : index - 1

          return (
            <HeroSlide
              key={`${slide.id}-${index}`}
              slide={slide}
              active={index === trackPosition}
              logicalIndex={logicalIndex}
            />
          )
        })}
      </div>

      <button type="button" className="carousel-arrow left-4 sm:left-6" onClick={() => previous()} aria-label="Banner sebelumnya">
        <ChevronLeft className="size-5" />
      </button>
      <button type="button" className="carousel-arrow right-4 sm:right-6" onClick={() => next()} aria-label="Banner berikutnya">
        <ChevronRight className="size-5" />
      </button>
      <div className="absolute bottom-1 left-1/2 z-20 flex -translate-x-1/2" role="group" aria-label="Pilih banner">
        {heroBanners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            className={`carousel-dot ${index === active ? 'active' : ''}`}
            onClick={() => changeSlide(index, true)}
            aria-current={index === active ? 'true' : undefined}
            aria-label={`Tampilkan banner ${index + 1}`}
          />
        ))}
      </div>
      <span className="sr-only" aria-live="polite">{announcement}</span>
    </div>
  )
}
