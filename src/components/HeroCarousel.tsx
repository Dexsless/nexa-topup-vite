import { ArrowRight, ChevronLeft, ChevronRight, Gamepad2, Pause, Play, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { heroBanners } from '../data/content'

const subscribeToReducedMotion = (callback: () => void) => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

const getReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function HeroSlide({ slide, active }: { slide: (typeof heroBanners)[number]; active: boolean }) {
  return (
    <div
      className={`hero-slide bg-gradient-to-br ${slide.gradient} ${active ? 'active' : 'leaving'}`}
      aria-hidden={!active}
      inert={!active}
    >
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow" style={{ background: slide.accent }} aria-hidden="true" />
      <div className="hero-art" aria-hidden="true">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="hero-chip"><Gamepad2 className="size-16 md:size-20" /></div>
        <div className="hero-spark"><Sparkles className="size-8" /></div>
      </div>
      <div className="relative z-10 max-w-[630px] px-6 pb-20 pt-12 sm:px-10 sm:pt-16 lg:px-14 lg:pt-[68px]">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.16em] text-white backdrop-blur">{slide.eyebrow}</span>
        <h2 className="mt-5 max-w-[620px] text-[31px] font-extrabold leading-[1.12] tracking-[-0.045em] text-white sm:text-[40px] lg:text-[48px]">{slide.title}</h2>
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
  const [active, setActive] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [manualPaused, setManualPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const regionRef = useRef<HTMLDivElement>(null)
  const transitionTimerRef = useRef<number | undefined>(undefined)
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, () => false)
  const paused = manualPaused || interacting || reducedMotion

  const changeSlide = useCallback((nextIndex: number, announce = false) => {
    if (nextIndex === active) return
    setPreviousIndex(active)
    setActive(nextIndex)
    window.clearTimeout(transitionTimerRef.current)
    transitionTimerRef.current = window.setTimeout(() => setPreviousIndex(null), reducedMotion ? 0 : 700)
    if (announce) setAnnouncement(`Banner ${nextIndex + 1} dari ${heroBanners.length}: ${heroBanners[nextIndex].title}`)
  }, [active, reducedMotion])

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => changeSlide((active + 1) % heroBanners.length), 5500)
    return () => window.clearInterval(timer)
  }, [active, changeSlide, paused])

  useEffect(() => () => window.clearTimeout(transitionTimerRef.current), [])

  const previous = () => changeSlide((active - 1 + heroBanners.length) % heroBanners.length, true)
  const next = () => changeSlide((active + 1) % heroBanners.length, true)
  const slide = heroBanners[active]
  const previousSlide = previousIndex === null ? null : heroBanners[previousIndex]

  return (
    <div
      ref={regionRef}
      className="hero-shell"
      role="region"
      aria-roledescription="carousel"
      aria-label="Promo utama"
      tabIndex={0}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false) }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'ArrowLeft') previous()
        if (event.key === 'ArrowRight') next()
      }}
    >
      <h1 className="sr-only">NEXA TOPUP — top up game favorit tanpa ribet</h1>
      {previousSlide && <HeroSlide key={previousSlide.id} slide={previousSlide} active={false} />}
      <HeroSlide key={slide.id} slide={slide} active />

      <button type="button" className="carousel-arrow left-4 sm:left-6" onClick={previous} aria-label="Banner sebelumnya">
        <ChevronLeft className="size-5" />
      </button>
      <button type="button" className="carousel-arrow right-4 sm:right-6" onClick={next} aria-label="Banner berikutnya">
        <ChevronRight className="size-5" />
      </button>
      <button
        type="button"
        className="absolute right-4 top-4 z-20 grid size-11 place-items-center rounded-full border border-white/15 bg-slate-950/20 text-white backdrop-blur transition hover:bg-white hover:text-slate-900 sm:right-6 sm:top-6"
        onClick={() => setManualPaused((current) => !current)}
        aria-label={manualPaused ? 'Lanjutkan carousel otomatis' : 'Jeda carousel otomatis'}
        aria-pressed={manualPaused}
      >
        {manualPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
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
