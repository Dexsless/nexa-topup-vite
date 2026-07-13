import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

function ScrollManager() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      window.requestAnimationFrame(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const target = document.getElementById(location.hash.slice(1))
        target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
        const focusTarget = target?.querySelector<HTMLElement>('h1, h2, h3') ?? target
        if (focusTarget) {
          focusTarget.tabIndex = -1
          focusTarget.focus({ preventScroll: true })
        }
      })
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    window.requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('#main-content main h1')
      const main = document.querySelector<HTMLElement>('#main-content main')
      const focusTarget = heading ?? main
      if (focusTarget) {
        focusTarget.tabIndex = -1
        focusTarget.focus({ preventScroll: true })
      }
    })
  }, [location.pathname, location.hash])

  return null
}

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition focus:translate-y-0">
        Lewati ke konten utama
      </a>
      <ScrollManager />
      <Header />
      <div id="main-content" tabIndex={-1}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
