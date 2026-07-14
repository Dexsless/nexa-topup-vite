import {
  BadgeCheck,
  Banknote,
  CheckCircle2,
  Clock3,
  CreditCard,
  Gamepad2,
  Headphones,
  IdCard,
  ListChecks,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { GameCard } from '../components/GameCard'
import { HeroCarousel } from '../components/HeroCarousel'
import { PromoCard } from '../components/PromoCard'
import { SectionHeading } from '../components/SectionHeading'
import { Seo } from '../components/Seo'
import { useToast } from '../components/ToastProvider'
import { vouchers } from '../data/content'
import { games } from '../data/games'
import { promos } from '../data/promos'

const benefits = [
  { title: 'Proses cepat', description: 'Alur ringkas, tanpa langkah yang membingungkan.', icon: Zap },
  { title: 'Pembayaran aman', description: 'Simulasi checkout transparan dan mudah ditinjau.', icon: ShieldCheck },
  { title: 'Layanan 24 jam', description: 'Katalog dan riwayat demo dapat diakses kapan saja.', icon: Clock3 },
  { title: 'Banyak metode', description: 'Pilihan e-wallet, QRIS, dan virtual account.', icon: CreditCard },
]

const steps = [
  { title: 'Pilih game', description: 'Temukan game favoritmu.', icon: Gamepad2 },
  { title: 'Masukkan ID', description: 'Isi data akun dengan benar.', icon: IdCard },
  { title: 'Pilih nominal', description: 'Tentukan item yang dibutuhkan.', icon: ListChecks },
  { title: 'Bayar', description: 'Pilih metode pembayaran.', icon: Banknote },
  { title: 'Diproses', description: 'Invoice demo langsung dibuat.', icon: CheckCircle2 },
]

export function HomePage() {
  const { showToast } = useToast()

  return (
    <>
      <Seo title="Top Up Game Tanpa Ribet" description="Simulasi top-up game dan voucher digital dengan alur cepat, aman, dan responsif." />
      <main>
        <section className="page-container pt-5 md:pt-7" aria-label="Promo unggulan">
          <HeroCarousel />
        </section>

        <section className="page-container section-space" aria-labelledby="promo-title">
          <SectionHeading headingId="promo-title" eyebrow="PROMO PILIHAN" title="Promo Spesial" description="Penawaran terkurasi untuk membuat sesi bermainmu terasa lebih ringan." link="/promos" />
          <div className="promo-grid">
            {promos.map((promo) => <PromoCard key={promo.id} promo={promo} />)}
          </div>
        </section>

        <section className="page-container section-space" aria-labelledby="popular-title">
          <SectionHeading headingId="popular-title" eyebrow="PALING DICARI" title="Game Populer" description="Top up item game favorit dengan pilihan nominal yang fleksibel." link="/games" />
          <div className="game-grid">
            {games.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        </section>

        <section id="voucher" className="page-container section-space scroll-mt-28" aria-labelledby="voucher-title">
          <SectionHeading headingId="voucher-title" eyebrow="LEBIH DARI GAME" title="Voucher & Entertainment" description="Kategori tambahan untuk kebutuhan digital sehari-hari." />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {vouchers.map((voucher) => (
              <button
                key={voucher.id}
                type="button"
                className="voucher-card text-left"
                onClick={() => showToast(`${voucher.name} akan tersedia pada katalog berikutnya.`, 'info')}
                aria-label={`Lihat informasi ${voucher.name}`}
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-[15px] text-xs font-black text-white" style={{ backgroundColor: voucher.color }} aria-hidden="true">{voucher.icon}</span>
                <span className="min-w-0">
                  <strong className="line-clamp-2 text-[13px] leading-[18px] text-slate-950">{voucher.name}</strong>
                  <span className="mt-1 block truncate text-[11px] text-slate-500">{voucher.category}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="page-container section-space" aria-labelledby="benefit-title">
          <div className="benefit-banner">
            <div className="benefit-art" aria-hidden="true" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
              <div className="max-w-md">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.12em] text-violet-300">
                  <Sparkles className="size-3.5" /> KENAPA NEXA
                </span>
                <h2 id="benefit-title" className="mt-4 text-[26px] font-extrabold leading-tight tracking-[-0.04em] text-slate-950 md:text-[32px]">Top up lebih simpel, waktumu tetap untuk bermain.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Setiap tahap dirancang agar informasi penting mudah dipahami sebelum melanjutkan.</p>
                <Link to="/games" className="button-primary mt-6">
                  Mulai Top Up <MousePointer2 className="size-[17px]" />
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {benefits.map(({ title, description, icon: Icon }) => (
                  <div className="benefit-item" key={title}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-600 text-white"><Icon className="size-[19px]" /></span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-950">{title}</h3>
                      <p className="mt-0.5 text-[11px] leading-[17px] text-slate-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="cara-topup" className="page-container section-space scroll-mt-28" aria-labelledby="steps-title">
          <SectionHeading headingId="steps-title" eyebrow="MUDAH DIIKUTI" title="Cara Melakukan Top Up" description="Lima tahap singkat dari pemilihan game hingga invoice simulasi dibuat." />
          <div className="step-row">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <div className="step-card" key={title}>
                <span className="step-number"><Icon className="size-[19px]" /></span>
                <div className="mt-0 sm:mt-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold tracking-wider text-violet-600">LANGKAH {index + 1}</span>
                    {index === steps.length - 1 && <BadgeCheck className="size-4 text-emerald-500" />}
                  </div>
                  <h3 className="mt-1 text-[15px] font-bold text-slate-950">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Headphones className="size-4 text-violet-600" /> Butuh bantuan? <Link to="/check-transaction" className="font-bold text-violet-700 hover:underline">Kunjungi pusat transaksi</Link>
          </div>
        </section>
      </main>
    </>
  )
}
