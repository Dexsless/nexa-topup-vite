import {
  AlertCircle,
  BadgeCheck,
  Banknote,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  Info,
  LoaderCircle,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Smartphone,
  Tag,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '../components/PageStates'
import { ImageWithFallback } from '../components/ImageWithFallback'
import { Seo } from '../components/Seo'
import { useToast } from '../components/ToastProvider'
import { getGameBySlug } from '../data/games'
import { paymentMethods } from '../data/paymentMethods'
import { promos } from '../data/promos'
import { createMockTransaction, formatRupiah, getTransactions } from '../services/transactionService'
import type { PaymentMethod } from '../types'

type FormErrors = Record<string, string>

function PaymentIcon({ method }: { method: PaymentMethod }) {
  if (method.icon === 'qr') return <QrCode className="size-5" />
  if (method.icon === 'bank') return <Building2 className="size-5" />
  return <WalletCards className="size-5" />
}

export function GameDetailPage() {
  const { slug } = useParams()
  const game = getGameBySlug(slug)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [userId, setUserId] = useState('')
  const [zoneId, setZoneId] = useState('')
  const [denominationId, setDenominationId] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const checkoutControllerRef = useRef<AbortController | null>(null)

  useEffect(() => () => checkoutControllerRef.current?.abort(), [])

  const selectedDenomination = game?.denominations.find((item) => item.id === denominationId)
  const selectedPayment = paymentMethods.find((item) => item.id === paymentId)
  const appliedPromoData = promos.find((promo) => promo.code === appliedPromo)
  const discount = !appliedPromoData || !selectedDenomination
    ? 0
    : appliedPromoData.discountType === 'fixed'
      ? Math.min(appliedPromoData.discountValue, selectedDenomination.price)
      : Math.min(
          appliedPromoData.maxDiscount ?? Number.POSITIVE_INFINITY,
          Math.round(selectedDenomination.price * (appliedPromoData.discountValue / 100)),
        )
  const total = Math.max(0, (selectedDenomination?.price ?? 0) + (selectedPayment?.fee ?? 0) - discount)

  if (!game) {
    return (
      <main className="page-container py-12">
        <Seo title="Game Tidak Ditemukan" description="Game yang dipilih tidak tersedia di katalog NEXA TOPUP." />
        <ErrorState
          title="Game tidak ditemukan"
          description="Alamat game mungkin berubah atau game tersebut belum tersedia dalam katalog demo kami."
          headingLevel={1}
          action={<Link to="/games" className="button-primary">Kembali ke Katalog</Link>}
        />
      </main>
    )
  }

  const setFieldError = (field: string, message = '') => setErrors((current) => ({ ...current, [field]: message }))

  const applyPromo = () => {
    const normalized = promoCode.trim().toUpperCase()
    if (!normalized) {
      setFieldError('promo', 'Masukkan kode promo terlebih dahulu.')
      setAppliedPromo(null)
      return
    }
    const promo = promos.find((item) => item.code === normalized)
    if (!promo) {
      setFieldError('promo', 'Kode promo tidak valid atau sudah berakhir.')
      setAppliedPromo(null)
      return
    }
    if (promo.gameSlug && promo.gameSlug !== game.slug) {
      setFieldError('promo', `Kode ini khusus untuk ${getGameBySlug(promo.gameSlug)?.name ?? 'game lain'}.`)
      setAppliedPromo(null)
      return
    }
    if (normalized === 'HALONEXA' && getTransactions().length > 0) {
      setFieldError('promo', 'Kode pengguna baru hanya dapat dipakai sebelum transaksi pertama di browser ini.')
      setAppliedPromo(null)
      return
    }
    setPromoCode(normalized)
    setAppliedPromo(normalized)
    setFieldError('promo')
    showToast(`Kode ${normalized} berhasil diterapkan.`, 'success')
  }

  const validate = () => {
    const next: FormErrors = {}
    if (!/^[A-Za-z0-9._-]{4,20}$/.test(userId.trim())) next.userId = 'User ID harus terdiri dari 4–20 huruf, angka, titik, garis bawah, atau tanda hubung.'
    if (game.requiresZone && !/^\d{2,8}$/.test(zoneId.trim())) next.zoneId = 'Zone ID harus berupa 2–8 digit angka.'
    if (!selectedDenomination) next.denomination = 'Pilih satu nominal top up.'
    if (!selectedPayment) next.payment = 'Pilih satu metode pembayaran.'
    const normalizedWa = whatsapp.replace(/[\s-]/g, '')
    if (!/^(?:\+62|62|08)\d{8,12}$/.test(normalizedWa)) next.whatsapp = 'Gunakan nomor Indonesia yang valid, misalnya 081234567890.'
    if (promoCode.trim() && !appliedPromo) next.promo = 'Terapkan kode yang valid atau kosongkan kolom promo.'
    if (!agreed) next.agreement = 'Centang persetujuan sebelum melanjutkan.'
    setErrors(next)

    const fieldOrder = ['userId', 'zoneId', 'denomination', 'payment', 'whatsapp', 'promo', 'agreement']
    const first = fieldOrder.find((field) => next[field])
    if (first) window.requestAnimationFrame(() => document.getElementById(first)?.focus())
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')
    if (!validate() || !selectedDenomination || !selectedPayment) {
      showToast('Periksa kembali data yang masih belum lengkap.', 'error')
      return
    }

    setSubmitting(true)
    const controller = new AbortController()
    checkoutControllerRef.current = controller
    try {
      const transaction = await createMockTransaction({
        game,
        userId: userId.trim(),
        zoneId: game.requiresZone ? zoneId.trim() : undefined,
        denomination: selectedDenomination,
        paymentMethod: selectedPayment,
        whatsapp: whatsapp.replace(/[\s-]/g, ''),
        promoCode: appliedPromo ?? undefined,
        discount,
      }, controller.signal)
      showToast('Simulasi transaksi berhasil dibuat.', 'success')
      navigate(`/transaction/${transaction.invoice}`)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan. Silakan coba lagi.'
      setSubmitError(message)
      showToast(message, 'error')
    } finally {
      if (!controller.signal.aborted) setSubmitting(false)
    }
  }

  const clearError = (field: string) => {
    if (errors[field]) setFieldError(field)
  }

  const handleChoiceKey = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    ids: string[],
    currentId: string,
    setCurrentId: (value: string) => void,
    errorField: string,
    idPrefix: string,
  ) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const currentIndex = Math.max(0, ids.indexOf(currentId))
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? ids.length - 1
        : ['ArrowRight', 'ArrowDown'].includes(event.key)
          ? (currentIndex + 1) % ids.length
          : (currentIndex - 1 + ids.length) % ids.length
    const nextId = ids[nextIndex]
    setCurrentId(nextId)
    clearError(errorField)
    window.requestAnimationFrame(() => document.getElementById(`${idPrefix}-${nextId}`)?.focus())
  }

  return (
    <main className="page-container pb-4 pt-6 md:pt-8">
      <Seo title={`Top Up ${game.name}`} description={`Simulasi top up ${game.name} dengan pilihan ${game.unit} dan metode pembayaran yang beragam.`} />

      <nav className="mb-5 flex items-center gap-1.5 overflow-hidden text-xs text-slate-500" aria-label="Breadcrumb">
        <Link to="/" className="shrink-0 rounded hover:text-violet-700">Beranda</Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <Link to="/games" className="shrink-0 rounded hover:text-violet-700">Semua Game</Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <span className="truncate font-semibold text-slate-800" aria-current="page">{game.name}</span>
      </nav>

      <section
        className="relative min-h-[210px] overflow-hidden rounded-[24px] p-5 text-white sm:p-7 md:min-h-[250px] md:p-9"
        style={{ background: `linear-gradient(125deg, ${game.colors[0]}, ${game.colors[1]} 62%, ${game.colors[2]})` }}
        aria-labelledby="game-title"
      >
        <div className="absolute inset-0 bg-slate-950/45" aria-hidden="true" />
        <div className="absolute -right-16 -top-20 size-72 rounded-full border-[44px] border-white/10" aria-hidden="true" />
        <div className="absolute bottom-[-110px] right-[24%] size-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
        <div className="relative flex max-w-3xl items-center gap-4 sm:gap-6">
          <div className="size-24 shrink-0 overflow-hidden rounded-[20px] border border-white/25 bg-white/10 shadow-xl sm:size-28 md:size-32">
            <ImageWithFallback src={game.image} alt={`Ilustrasi abstrak orisinal untuk ${game.name}`} className="h-full w-full object-cover" eager />
          </div>
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-extrabold tracking-wider backdrop-blur">{game.category}</span>
            <h1 id="game-title" className="mt-3 text-[24px] font-extrabold tracking-[-0.04em] sm:text-[32px] md:text-[38px]">{game.name}</h1>
            <p className="mt-1 text-xs font-semibold text-white/90">{game.publisher}</p>
            <p className="mt-3 hidden max-w-xl text-sm leading-6 text-white/90 sm:block">{game.description}</p>
          </div>
        </div>
      </section>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cyan-200/70 bg-cyan-50 px-4 py-3 text-xs leading-5 text-cyan-900">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p><strong>Mode simulasi:</strong> checkout ini tidak memproses pembayaran atau mengirim item game nyata.</p>
      </div>

      <form className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start" onSubmit={handleSubmit} noValidate>
        <fieldset className="contents" disabled={submitting}>
        <div className="space-y-5">
          <section className="form-card" aria-labelledby="account-step">
            <div className="form-step-title">
              <span className="form-step-badge">1</span>
              <div>
                <h2 id="account-step" className="text-base font-bold text-slate-950">Masukkan data akun</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Pastikan data sesuai dengan profil game tujuan.</p>
              </div>
            </div>
            <div className={`mt-5 grid gap-4 ${game.requiresZone ? 'sm:grid-cols-[1fr_0.55fr]' : ''}`}>
              <div>
                <label className="form-label" htmlFor="userId">User ID</label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
                  <input
                    id="userId"
                    className={`form-input !pl-10 ${errors.userId ? 'error' : ''}`}
                    value={userId}
                    onChange={(event) => { setUserId(event.target.value); clearError('userId') }}
                    placeholder="Contoh: 12345678"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.userId)}
                    aria-describedby={errors.userId ? 'userId-error' : undefined}
                  />
                </div>
                {errors.userId && <p id="userId-error" className="form-error"><AlertCircle className="size-3.5" /> {errors.userId}</p>}
              </div>
              {game.requiresZone && (
                <div>
                  <label className="form-label" htmlFor="zoneId">Zone ID</label>
                  <input
                    id="zoneId"
                    className={`form-input ${errors.zoneId ? 'error' : ''}`}
                    inputMode="numeric"
                    value={zoneId}
                    onChange={(event) => { setZoneId(event.target.value.replace(/\D/g, '').slice(0, 8)); clearError('zoneId') }}
                    placeholder="Contoh: 1234"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.zoneId)}
                    aria-describedby={errors.zoneId ? 'zoneId-error' : undefined}
                  />
                  {errors.zoneId && <p id="zoneId-error" className="form-error"><AlertCircle className="size-3.5" /> {errors.zoneId}</p>}
                </div>
              )}
            </div>
            <button type="button" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl px-2 text-xs font-bold text-violet-700 transition hover:bg-violet-50" onClick={() => setHelpOpen((current) => !current)} aria-expanded={helpOpen}>
              <CircleHelp className="size-4" /> Di mana saya menemukan User ID?
            </button>
            {helpOpen && (
              <div className="relative mt-2 rounded-xl border border-violet-100 bg-violet-50 p-4 pr-10 text-xs leading-5 text-violet-900">
                Buka profil di dalam game, lalu cari nomor akun di bawah nama pemain. Untuk game ini, {game.requiresZone ? 'User ID dan Zone ID biasanya tampil bersebelahan.' : 'cukup salin User ID tanpa spasi.'}
                <button type="button" className="absolute right-2 top-2 grid size-8 place-items-center rounded-lg hover:bg-violet-100" onClick={() => setHelpOpen(false)} aria-label="Tutup bantuan"><X className="size-4" /></button>
              </div>
            )}
          </section>

          <section className="form-card" aria-labelledby="nominal-step">
            <div className="form-step-title">
              <span className="form-step-badge">2</span>
              <div>
                <h2 id="nominal-step" className="text-base font-bold text-slate-950">Pilih nominal {game.unit}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Harga yang tampil adalah data mock untuk kebutuhan demo.</p>
              </div>
            </div>
            <div id="denomination" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label={`Nominal ${game.unit}`} aria-required="true" aria-invalid={Boolean(errors.denomination)} aria-describedby={errors.denomination ? 'denomination-error' : undefined} tabIndex={-1}>
              {game.denominations.map((item, index) => {
                const selected = item.id === denominationId
                return (
                  <button
                    key={item.id}
                    type="button"
                    id={`denomination-${item.id}`}
                    role="radio"
                    aria-checked={selected}
                    tabIndex={selected || (!denominationId && index === 0) ? 0 : -1}
                    className={`choice-card ${selected ? 'selected' : ''}`}
                    onClick={() => { setDenominationId(item.id); clearError('denomination') }}
                    onKeyDown={(event) => handleChoiceKey(event, game.denominations.map((option) => option.id), denominationId, setDenominationId, 'denomination', 'denomination')}
                  >
                    {selected && <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-violet-600 text-white"><Check className="size-3" /></span>}
                    {item.popular && <span className="mb-2 inline-flex rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-700">POPULER</span>}
                    <span className="block pr-5 text-[13px] font-bold leading-5 text-slate-900">{item.amount}</span>
                    {item.bonus && <span className="mt-1 block text-[10px] font-semibold text-emerald-700">{item.bonus}</span>}
                    <span className="mt-2 block text-[12px] font-extrabold text-violet-700">{formatRupiah(item.price)}</span>
                  </button>
                )
              })}
            </div>
            {errors.denomination && <p id="denomination-error" className="form-error"><AlertCircle className="size-3.5" /> {errors.denomination}</p>}
          </section>

          <section className="form-card" aria-labelledby="payment-step">
            <div className="form-step-title">
              <span className="form-step-badge">3</span>
              <div>
                <h2 id="payment-step" className="text-base font-bold text-slate-950">Pilih metode pembayaran</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Biaya layanan berbeda untuk setiap metode.</p>
              </div>
            </div>
            <div id="payment" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Metode pembayaran" aria-required="true" aria-invalid={Boolean(errors.payment)} aria-describedby={errors.payment ? 'payment-error' : undefined} tabIndex={-1}>
              {paymentMethods.map((method, index) => {
                const selected = method.id === paymentId
                return (
                  <button
                    key={method.id}
                    type="button"
                    id={`payment-${method.id}`}
                    role="radio"
                    aria-checked={selected}
                    tabIndex={selected || (!paymentId && index === 0) ? 0 : -1}
                    className={`choice-card !min-h-[82px] ${selected ? 'selected' : ''}`}
                    onClick={() => { setPaymentId(method.id); clearError('payment') }}
                    onKeyDown={(event) => handleChoiceKey(event, paymentMethods.map((option) => option.id), paymentId, setPaymentId, 'payment', 'payment')}
                  >
                    <span className="grid size-8 place-items-center rounded-lg text-white" style={{ backgroundColor: method.color }}><PaymentIcon method={method} /></span>
                    {selected && <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-violet-600 text-white"><Check className="size-3" /></span>}
                    <span className="mt-2 block text-[12px] font-bold leading-4 text-slate-900">{method.name}</span>
                    <span className="mt-1 block text-[10px] text-slate-500">Biaya {formatRupiah(method.fee)}</span>
                  </button>
                )
              })}
            </div>
            {errors.payment && <p id="payment-error" className="form-error"><AlertCircle className="size-3.5" /> {errors.payment}</p>}
          </section>

          <section className="form-card" aria-labelledby="contact-step">
            <div className="form-step-title">
              <span className="form-step-badge">4</span>
              <div>
                <h2 id="contact-step" className="text-base font-bold text-slate-950">Kontak & promo</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Nomor hanya disimpan lokal bersama riwayat transaksi mock.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label" htmlFor="whatsapp">Nomor WhatsApp</label>
                <div className="relative">
                  <Smartphone className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
                  <input
                    id="whatsapp"
                    className={`form-input !pl-10 ${errors.whatsapp ? 'error' : ''}`}
                    type="tel"
                    inputMode="tel"
                    value={whatsapp}
                    onChange={(event) => { setWhatsapp(event.target.value.slice(0, 17)); clearError('whatsapp') }}
                    placeholder="081234567890"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(errors.whatsapp)}
                    aria-describedby={errors.whatsapp ? 'whatsapp-error' : undefined}
                  />
                </div>
                {errors.whatsapp && <p id="whatsapp-error" className="form-error"><AlertCircle className="size-3.5" /> {errors.whatsapp}</p>}
              </div>
              <div>
                <label className="form-label" htmlFor="promo">Kode promo <span className="font-normal text-slate-600">(opsional)</span></label>
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Tag className="pointer-events-none absolute left-3.5 top-1/2 size-[17px] -translate-y-1/2 text-slate-400" />
                    <input
                      id="promo"
                      className={`form-input !pl-10 uppercase ${errors.promo ? 'error' : ''}`}
                      value={promoCode}
                      onChange={(event) => { setPromoCode(event.target.value.toUpperCase().slice(0, 16)); setAppliedPromo(null); clearError('promo') }}
                      placeholder="NEXA15"
                      aria-invalid={Boolean(errors.promo)}
                      aria-describedby={errors.promo ? 'promo-error' : appliedPromo ? 'promo-success' : undefined}
                    />
                  </div>
                  <button type="button" className="button-secondary !px-3.5 !text-xs" onClick={applyPromo}>Terapkan</button>
                </div>
                {errors.promo && <p id="promo-error" className="form-error"><AlertCircle className="size-3.5" /> {errors.promo}</p>}
                {appliedPromo && <p id="promo-success" className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><BadgeCheck className="size-3.5" /> Promo aktif</p>}
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24" aria-labelledby="summary-title">
          <div className="summary-card">
            <div className="flex items-start gap-3">
              <span className="form-step-badge">5</span>
              <div>
                <h2 id="summary-title" className="text-base font-bold text-slate-950">Ringkasan pesanan</h2>
                <p className="mt-1 text-xs text-slate-500">Tinjau sebelum membuat invoice.</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <ImageWithFallback src={game.image} alt="" className="size-12 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-950">{game.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{selectedDenomination?.amount ?? `Belum memilih ${game.unit}`}</p>
              </div>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              <div className="summary-row"><span className="text-slate-500">Harga item</span><strong className="text-slate-800">{formatRupiah(selectedDenomination?.price ?? 0)}</strong></div>
              <div className="summary-row"><span className="text-slate-500">Biaya layanan</span><strong className="text-slate-800">{formatRupiah(selectedPayment?.fee ?? 0)}</strong></div>
              {discount > 0 && <div className="summary-row"><span className="text-emerald-700">Diskon promo</span><strong className="text-emerald-700">−{formatRupiah(discount)}</strong></div>}
            </div>
            <div className="mt-3 flex items-end justify-between gap-4 rounded-xl bg-violet-50 px-4 py-3">
              <span className="text-xs font-semibold text-violet-700">Total pembayaran</span>
              <strong className="text-lg font-extrabold text-violet-800">{formatRupiah(total)}</strong>
            </div>
            <label className={`mt-5 flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs leading-5 ${errors.agreement ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}>
              <input id="agreement" type="checkbox" className="mt-1 size-4 rounded accent-violet-600" checked={agreed} onChange={(event) => { setAgreed(event.target.checked); clearError('agreement') }} required aria-required="true" aria-describedby={errors.agreement ? 'agreement-error' : undefined} />
              <span className="text-slate-600">Saya menyetujui data ini digunakan hanya untuk membuat transaksi simulasi dan disimpan sementara di browser ini.</span>
            </label>
            {errors.agreement && <p id="agreement-error" className="form-error"><AlertCircle className="size-3.5" /> {errors.agreement}</p>}
            {submitError && (
              <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" /> {submitError}
              </div>
            )}
            <button type="submit" className="button-primary mt-5 min-h-[52px] w-full" disabled={submitting}>
              {submitting ? <><LoaderCircle className="size-[18px] animate-spin" /> Membuat Invoice...</> : <><Banknote className="size-[18px]" /> Beli Sekarang</>}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] leading-4 text-slate-600"><LockKeyhole className="size-3.5" /> Tidak ada dana yang ditagihkan pada mode demo.</p>
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-[11px] leading-4 text-slate-500">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" /> Data transaksi tersimpan lokal di perangkatmu dan tidak dikirim ke server.
          </div>
        </aside>
        </fieldset>
      </form>
    </main>
  )
}
