import { Menu, ShoppingBag, UserRound, X } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent, type RefObject } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getTransactions } from '../services/transactionService'
import { siteConfig } from '../data/content'
import { BrandLogo } from './BrandLogo'
import { SearchBox } from './SearchBox'
import { useToast } from './ToastProvider'

const navigation = [
  { label: 'Beranda', to: '/' },
  { label: 'Semua Game', to: '/games' },
  { label: 'Promo', to: '/promos' },
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
  const menuDialogRef = useRef<HTMLElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const loginDialogRef = useRef<HTMLDivElement>(null)
  const loginReturnRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const transactionCount = getTransactions().length

  useDialogFocus(mobileOpen, menuDialogRef, menuTriggerRef)
  useDialogFocus(loginOpen, loginDialogRef, loginReturnRef)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        setLoginOpen(false)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginOpen(false)
    showToast('Mode demo aktif. Akun tidak diperlukan untuk mencoba top up.', 'success')
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0613]/90 backdrop-blur-xl">
        <div className="page-container flex h-16 items-center gap-4 lg:h-[72px]">
          <BrandLogo />
          <nav className="ml-5 hidden items-center gap-1 rounded-2xl border border-white/[0.045] bg-white/[0.025] p-1 lg:flex" aria-label="Navigasi utama">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden w-[205px] lg:block xl:w-[250px]">
            <SearchBox />
          </div>
          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <div className="hidden sm:block">
              <button type="button" className="button-secondary !h-10 !px-4" onClick={(event) => { loginReturnRef.current = event.currentTarget; setLoginOpen(true) }}>
                <UserRound className="size-[17px]" aria-hidden="true" />
                Masuk
              </button>
            </div>
            <button type="button" className="icon-button relative" onClick={() => navigate('/check-transaction')} aria-label={`Riwayat transaksi${transactionCount ? `, ${transactionCount} tersimpan` : ''}`}>
              <ShoppingBag className="size-5" aria-hidden="true" />
              {transactionCount > 0 && <span className="cart-badge">{Math.min(transactionCount, 9)}</span>}
            </button>
            <div className="lg:hidden">
              <button ref={menuTriggerRef} type="button" className="icon-button" onClick={() => setMobileOpen(true)} aria-label="Buka menu" aria-expanded={mobileOpen}>
                <Menu className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="presentation">
          <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Tutup menu" />
          <aside ref={menuDialogRef} className="absolute right-0 top-0 flex h-full w-[min(88vw,380px)] flex-col overflow-y-auto border-l border-white/10 bg-[#110b20] p-5 text-white shadow-2xl" role="dialog" aria-modal="true" aria-label="Menu seluler">
            <div className="flex items-center justify-between">
              <BrandLogo onClick={() => setMobileOpen(false)} />
              <button type="button" className="icon-button" onClick={() => setMobileOpen(false)} aria-label="Tutup menu">
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-6">
              <SearchBox compact onNavigate={() => setMobileOpen(false)} />
            </div>
            <nav className="mt-5 flex flex-col" aria-label="Navigasi seluler">
              {navigation.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMobileOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button type="button" className="button-primary mt-auto w-full" onClick={() => { loginReturnRef.current = menuTriggerRef.current; setMobileOpen(false); setLoginOpen(true) }}>
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
