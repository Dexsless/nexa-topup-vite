import { ArrowUpRight, Gamepad2, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type RefObject } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getTransactionCount, subscribeToTransactions } from '../services/transactionService'
import { siteConfig } from '../data/content'
import { games } from '../data/games'
import { BrandLogo } from './BrandLogo'
import { ImageWithFallback } from './ImageWithFallback'
import { SearchBox } from './SearchBox'
import { useToast } from './ToastProvider'

const navigation = [
  { label: 'Beranda', to: '/' },
  { label: 'Daftar Game', to: '/games' },
  { label: 'Promo', to: '/promos' },
  { label: 'Cara Top Up', to: '/#cara-topup', hash: true },
  { label: 'Cek Transaksi', to: '/check-transaction' },
]

function useDialogFocus(
  open: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLButtonElement | null>,
) {
  useEffect(() => {
    if (!open || !dialogRef.current) return
    const dialog = dialogRef.current
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const trigger = triggerRef.current
    const background = ['header', '#main-content', 'footer']
      .map((selector) => document.querySelector<HTMLElement>(selector))
      .filter((element): element is HTMLElement => Boolean(element))
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    background.forEach((element) => { element.inert = true })

    const getFocusable = () => Array.from(
      dialog.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])'),
    ).filter((element) => !element.hasAttribute('hidden'))

    const focusFrame = window.requestAnimationFrame(() => getFocusable()[0]?.focus())
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const focusable = getFocusable()
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', trapFocus)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', trapFocus)
      background.forEach((element) => { element.inert = false })
      document.body.style.overflow = previousOverflow
      const target = trigger ?? previousFocus
      window.requestAnimationFrame(() => target?.focus())
    }
  }, [dialogRef, open, triggerRef])
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 12)
  const menuDialogRef = useRef<HTMLElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const loginDialogRef = useRef<HTMLDivElement>(null)
  const loginReturnRef = useRef<HTMLButtonElement>(null)
  const searchPanelRef = useRef<HTMLDivElement>(null)
  const searchTriggerRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const transactionCount = useSyncExternalStore(subscribeToTransactions, getTransactionCount, () => 0)

  useDialogFocus(mobileOpen, menuDialogRef, menuTriggerRef)
  useDialogFocus(loginOpen, loginDialogRef, loginReturnRef)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        setLoginOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  useEffect(() => {
    if (!searchOpen) return
    const closeOutside = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (!searchPanelRef.current?.contains(target) && !searchTriggerRef.current?.contains(target)) setSearchOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [searchOpen])

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginOpen(false)
    showToast('Mode demo aktif. Akun tidak diperlukan untuk mencoba top up.', 'success')
  }

  return (
    <>
      <header className={`site-header sticky top-0 z-50 ${scrolled || searchOpen ? 'scrolled' : ''}`}>
        <div className="page-container flex h-16 items-center gap-4 lg:h-[72px]">
          <BrandLogo />
          <nav className="mx-auto hidden items-center gap-1 rounded-2xl border border-white/[0.045] bg-white/[0.025] p-1 xl:flex" aria-label="Navigasi utama">
            {navigation.map((item) => item.hash ? (
              <Link key={item.label} to={item.to} className="nav-link">{item.label}</Link>
            ) : (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <button ref={searchTriggerRef} type="button" className="icon-button" onClick={() => setSearchOpen((current) => !current)} aria-label={searchOpen ? 'Tutup pencarian' : 'Buka pencarian'} aria-expanded={searchOpen} aria-controls="header-search-panel">
              {searchOpen ? <X className="size-[18px]" /> : <Search className="size-[18px]" />}
            </button>
            <div className="hidden lg:block">
              <button type="button" className="button-secondary !h-10 !px-4" onClick={(event) => { loginReturnRef.current = event.currentTarget; setLoginOpen(true) }}>
                <UserRound className="size-[17px]" aria-hidden="true" />
                Masuk
              </button>
            </div>
            <button type="button" className="icon-button relative" onClick={() => navigate('/check-transaction')} aria-label={`Riwayat transaksi${transactionCount ? `, ${transactionCount} tersimpan` : ''}`}>
              <ShoppingBag className="size-5" aria-hidden="true" />
              {transactionCount > 0 && <span className="cart-badge">{Math.min(transactionCount, 9)}</span>}
            </button>
            <Link to="/games" className="button-primary !hidden !h-10 !px-4 sm:!inline-flex">
              <Gamepad2 className="size-[17px]" /> Top Up
            </Link>
            <div className="xl:hidden">
              <button ref={menuTriggerRef} type="button" className="icon-button" onClick={() => { setSearchOpen(false); setMobileOpen(true) }} aria-label="Buka menu" aria-expanded={mobileOpen}>
                <Menu className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div id="header-search-panel" ref={searchPanelRef} className="header-search-panel border-t border-white/[0.06] bg-[#0d0818]/98 shadow-2xl shadow-black/30" aria-label="Panel pencarian">
            <div className="page-container py-5">
              <div className="ml-auto max-w-xl rounded-[18px] border border-white/[0.08] bg-[#151025] p-4">
                <SearchBox compact autoFocus onNavigate={() => setSearchOpen(false)} />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-violet-300">Game populer</p>
                  <Link to="/games" className="text-xs font-bold text-[#9e96b0] hover:text-white" onClick={() => setSearchOpen(false)}>Lihat semua</Link>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {games.slice(0, 4).map((game) => (
                    <Link key={game.id} to={`/game/${game.slug}`} className="group flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] p-2 transition hover:border-violet-400/25 hover:bg-violet-500/10" onClick={() => setSearchOpen(false)}>
                      <ImageWithFallback src={game.image} alt="" className="size-9 shrink-0 rounded-lg object-cover" />
                      <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-white">{game.name}</span>
                      <ArrowUpRight className="size-3.5 shrink-0 text-violet-300 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] xl:hidden" role="presentation">
          <button type="button" className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Tutup menu" />
          <aside ref={menuDialogRef} className="mobile-menu-sheet absolute inset-x-0 top-0 z-10 flex max-h-[min(92dvh,680px)] flex-col overflow-y-auto rounded-b-[24px] border-b border-white/10 bg-[#110b20] p-5 text-white shadow-2xl sm:min-h-[520px] sm:px-7" role="dialog" aria-modal="true" aria-label="Menu seluler">
            <div className="flex items-center justify-between">
              <BrandLogo onClick={() => setMobileOpen(false)} />
              <button type="button" className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Tutup menu">
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-6">
              <SearchBox compact onNavigate={() => setMobileOpen(false)} />
            </div>
            <nav className="mt-5 grid gap-1 sm:grid-cols-2" aria-label="Navigasi seluler">
              {navigation.map((item) => item.hash ? (
                <Link key={item.label} to={item.to} onClick={() => setMobileOpen(false)} className="mobile-nav-link">{item.label}</Link>
              ) : (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button type="button" className="button-primary mt-8 w-full sm:mt-auto" onClick={() => { loginReturnRef.current = menuTriggerRef.current; setMobileOpen(false); setLoginOpen(true) }}>
              <UserRound className="size-[18px]" />
              Masuk ke {siteConfig.namePrimary}
            </button>
          </aside>
        </div>
      )}

      {loginOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setLoginOpen(false) }}>
          <div ref={loginDialogRef} className="modal-card max-h-[calc(100vh-2rem)] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="eyebrow">MODE DEMO</span>
                <h2 id="login-title" className="mt-2 text-xl font-bold text-white">Masuk ke {siteConfig.namePrimary}</h2>
                <p className="mt-1 text-sm leading-6 text-[#a39bad]">Form ini hanya simulasi antarmuka. Tidak ada akun atau data yang dikirim.</p>
              </div>
              <button type="button" className="icon-button" onClick={() => setLoginOpen(false)} aria-label="Tutup dialog">
                <X className="size-5" />
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="form-label" htmlFor="login-email">Email</label>
                <input className="form-input" id="login-email" type="email" placeholder="nama@email.com" required autoFocus />
              </div>
              <div>
                <label className="form-label" htmlFor="login-password">Kata sandi</label>
                <input className="form-input" id="login-password" type="password" placeholder="Minimal 6 karakter" minLength={6} required />
              </div>
              <button type="submit" className="button-primary w-full">Lanjutkan mode demo</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
