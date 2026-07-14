import {
  BadgeCheck,
  Banknote,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  Gamepad2,
  Headphones,
  IdCard,
  ListChecks,
  MessageCircle,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AutoProductRail } from '../components/AutoProductRail'
import { GameCard } from '../components/GameCard'
import { HeroCarousel } from '../components/HeroCarousel'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Seo } from '../components/Seo'
import { useToast } from '../components/ToastProvider'
import { vouchers } from '../data/content'
import { games } from '../data/games'
import { paymentMethods } from '../data/paymentMethods'
import { flashSaleProducts, newProducts } from '../data/products'

const benefits = [
  { value: '5 tahap', title: 'Proses cepat', description: 'Alur pembelian ringkas dan mudah diikuti.', icon: Zap },
  { value: 'Mode lokal', title: 'Pembayaran aman', description: 'Setiap rincian dapat ditinjau sebelum checkout.', icon: ShieldCheck },
  { value: '24/7', title: 'Layanan 24 jam', description: 'Katalog dan riwayat demo selalu dapat diakses.', icon: Clock3 },
  { value: `${paymentMethods.length} opsi`, title: 'Banyak metode', description: 'QRIS, e-wallet, dan virtual account tersedia.', icon: CreditCard },
]

const steps = [
  { title: 'Pilih game', description: 'Temukan game favoritmu.', icon: Gamepad2 },
  { title: 'Masukkan ID', description: 'Isi data akun dengan benar.', icon: IdCard },
  { title: 'Pilih nominal', description: 'Tentukan item yang dibutuhkan.', icon: ListChecks },
  { title: 'Bayar', description: 'Pilih metode pembayaran.', icon: Banknote },
  { title: 'Diproses', description: 'Invoice demo langsung dibuat.', icon: CheckCircle2 },
]

const faqs = [
  {
    question: 'Bagaimana cara melakukan top up di NEXA?',
    answer: 'Pilih game, masukkan User ID, tentukan nominal dan metode pembayaran, lalu periksa kembali ringkasan sebelum membuat invoice simulasi.',
  },
  {
    question: 'Apakah transaksi di website ini nyata?',
    answer: 'Belum. NEXA TOPUP saat ini merupakan demonstrasi frontend. Tidak ada dana yang ditagihkan dan tidak ada item game yang dikirim.',
  },
  {
    question: 'Di mana riwayat transaksi disimpan?',
    answer: 'Riwayat mock hanya tersimpan di localStorage browser pada perangkat yang digunakan dan tidak dikirim ke server.',
  },
  {
    question: 'Bagaimana jika salah memasukkan User ID?',
    answer: 'Form akan memeriksa format dasar input. Selalu tinjau kembali User ID dan Zone ID pada ringkasan sebelum melanjutkan.',
  },
  {
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer: 'Simulasi mendukung QRIS, GoPay, DANA, OVO, ShopeePay, dan Virtual Account. Integrasi gateway nyata dapat ditambahkan kemudian.',
  },
]

export function HomePage() {
  const { showToast } = useToast()
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <Seo title="Top Up Game Tanpa Ribet" description="Simulasi top-up game dan voucher digital dengan alur cepat, aman, dan responsif." />
      <main>
        <section className="page-container pt-5 md:pt-7" aria-label="Promo unggulan">
          <HeroCarousel />
        </section>

        <Reveal>
          <section className="page-container section-space" aria-labelledby="flash-sale-title">
            <SectionHeading headingId="flash-sale-title" title="Flash Sale" description="Harga spesial untuk paket favorit dalam waktu terbatas." link="/promos" linkLabel="Lihat semua" />
            <AutoProductRail products={flashSaleProducts} ariaLabel="Produk flash sale" speed={32} />
          </section>
        </Reveal>

        <Reveal>
          <section className="page-container section-space" aria-labelledby="new-products-title">
            <SectionHeading headingId="new-products-title" title="Baru Ditambahkan" description="Pilihan nominal terbaru yang siap masuk ke daftar top up." link="/games" linkLabel="Lihat semua" />
            <AutoProductRail products={newProducts} ariaLabel="Produk baru ditambahkan" reverse speed={36} />
          </section>
        </Reveal>

        <Reveal>
          <section id="games-populer" className="page-container section-space scroll-mt-28" aria-labelledby="popular-title">
            <SectionHeading headingId="popular-title" eyebrow="GAMES POPULER" title="Pilih Game Favoritmu" description="Katalog top up untuk game yang paling sering dicari." link="/games" linkLabel="Lihat semua" />
            <div className="game-grid">
              {games.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section id="voucher" className="page-container section-space scroll-mt-28" aria-labelledby="voucher-title">
            <SectionHeading headingId="voucher-title" eyebrow="PRODUK DIGITAL" title="Voucher & Entertainment" description="Kategori tambahan untuk kebutuhan digital sehari-hari." />
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
        </Reveal>

        <Reveal>
          <section className="page-container section-space" aria-labelledby="benefit-title">
            <div>
              <div className="stats-heading flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(74,222,128,0.15)]" /> KENAPA NEXA</p>
                  <h2 id="benefit-title" className="mt-4 max-w-[640px] text-[28px] font-semibold leading-[1.1] tracking-[-0.04em] text-white md:text-[44px]">Semua yang kamu butuhkan untuk top up.</h2>
                </div>
                <Link to="/games" className="button-primary w-fit">Mulai Top Up <MousePointer2 className="size-[17px]" /></Link>
              </div>
              <div className="trust-section grid grid-cols-2 lg:grid-cols-4">
                {benefits.map(({ value, title, description, icon: Icon }) => (
                  <article className="trust-stat" key={title}>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-[13px] font-medium text-[#a5a0b8]">{title}</h3>
                      <Icon className="size-[18px] text-violet-300" aria-hidden="true" />
                    </div>
                    <p className="trust-value">{value}</p>
                    <p className="trust-delta">→ {description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section id="cara-topup" className="page-container section-space scroll-mt-28" aria-labelledby="steps-title">
            <SectionHeading headingId="steps-title" eyebrow="MUDAH DIIKUTI" title="Cara Melakukan Top Up" description="Lima tahap singkat dari pemilihan game hingga invoice simulasi dibuat." />
            <div className="step-row">
              {steps.map(({ title, description, icon: Icon }, index) => (
                <div className="step-card" key={title}>
                  <span className="step-number"><Icon className="size-[19px]" /></span>
                  <div className="mt-0 sm:mt-5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold tracking-wider text-violet-400">LANGKAH {index + 1}</span>
                      {index === steps.length - 1 && <BadgeCheck className="size-4 text-emerald-500" />}
                    </div>
                    <h3 className="mt-1 text-[15px] font-bold text-slate-950">{title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="page-container section-space" aria-labelledby="faq-title">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:gap-16">
              <div className="faq-copy lg:pt-3">
                <p className="eyebrow">FREQUENTLY ASKED</p>
                <h2 id="faq-title" className="mt-3 max-w-md text-[28px] font-extrabold leading-tight tracking-[-0.04em] text-white md:text-[36px]">Pertanyaan Yang Sering Diajukan</h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-[#9e96b0]">Belum menemukan jawaban? Pusat bantuan kami siap menjelaskan alur simulasi NEXA.</p>
                <Link to="/contact" className="button-primary mt-6"><MessageCircle className="size-[17px]" /> Hubungi Support</Link>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, index) => {
                  const expanded = openFaq === index
                  return (
                    <div className={`faq-item ${expanded ? 'active' : ''}`} key={faq.question}>
                      <h3>
                        <button type="button" className="faq-trigger" onClick={() => setOpenFaq(expanded ? -1 : index)} aria-expanded={expanded} aria-controls={`faq-answer-${index}`}>
                          <span>{faq.question}</span>
                          <ChevronDown className={`size-[18px] shrink-0 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
                        </button>
                      </h3>
                      <div id={`faq-answer-${index}`} className={`faq-answer ${expanded ? 'open' : ''}`} aria-hidden={!expanded} inert={!expanded}>
                        <div><p>{faq.answer}</p></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="page-container section-space" aria-labelledby="final-cta-title">
            <div className="final-cta">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-300"><Sparkles className="size-4" /> Siap isi ulang?</span>
                <h2 id="final-cta-title" className="mt-2 text-xl font-extrabold text-white sm:text-2xl">Pilih game dan mulai top up sekarang.</h2>
                <p className="mt-1 text-sm text-[#9e96b0]">Harga jelas, alur ringkas, dan seluruh tombol bisa dicoba.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link to="/games" className="button-secondary">Lihat Game</Link>
                <Link to="/games" className="button-primary"><Gamepad2 className="size-[17px]" /> Mulai Top Up</Link>
              </div>
            </div>
          </section>
        </Reveal>

        <div className="page-container mt-7 flex items-center justify-center gap-2 text-xs text-[#8f879e]">
          <Headphones className="size-4 text-violet-400" /> Butuh bantuan transaksi? <Link to="/check-transaction" className="font-bold text-violet-300 hover:underline">Buka pusat transaksi</Link>
        </div>
      </main>
    </>
  )
}
