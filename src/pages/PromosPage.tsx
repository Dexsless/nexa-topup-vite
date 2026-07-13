import { CalendarDays, Copy, Sparkles, TicketPercent } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { useToast } from '../components/ToastProvider'
import { promos } from '../data/promos'

export function PromosPage() {
  const { showToast } = useToast()

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      showToast(`Kode ${code} berhasil disalin.`, 'success')
    } catch {
      showToast(`Catat kode promo: ${code}`, 'info')
    }
  }

  return (
    <main className="page-container pb-4 pt-10 md:pt-14">
      <Seo title="Promo Spesial" description="Lihat seluruh promo mock NEXA TOPUP beserta kode dan periode berlakunya." />
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#181a3d] via-[#5549db] to-[#25bde2] px-6 py-10 text-white sm:px-10 md:py-14">
        <div className="absolute -right-20 -top-24 size-72 rounded-full border-[50px] border-white/10" aria-hidden="true" />
        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.12em] backdrop-blur"><Sparkles className="size-3.5" /> NEXA DEALS</span>
          <h1 className="mt-4 text-[31px] font-extrabold tracking-[-0.045em] sm:text-[40px]">Promo kecil, keseruan maksimal.</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">Seluruh promo di halaman ini adalah data simulasi untuk mendemonstrasikan pengalaman checkout.</p>
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Daftar promo">
        {promos.map((promo) => (
          <article key={promo.id} id={promo.id} className={`relative overflow-hidden rounded-[22px] bg-gradient-to-br p-5 text-white shadow-lg ${promo.gradient} ${promo.featured ? 'md:col-span-2 md:grid md:grid-cols-[1.2fr_0.8fr] md:items-end md:p-8' : 'sm:p-6'}`}>
            <div className="absolute -right-10 -top-10 size-36 rounded-full border-[24px] border-white/10" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-slate-950/50 to-slate-950/70" aria-hidden="true" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold backdrop-blur"><TicketPercent className="size-3.5" /> {promo.badge}</span>
              <h2 className={`mt-4 font-extrabold tracking-[-0.035em] ${promo.featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{promo.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/95">{promo.description}</p>
              <p className="mt-4 flex items-center gap-2 text-xs text-white/90"><CalendarDays className="size-4" /> {promo.period}</p>
            </div>
            <div className={`relative mt-6 flex flex-wrap gap-2 ${promo.featured ? 'md:mt-0 md:justify-end' : ''}`}>
              <button type="button" className="button-light !min-h-10 !px-4 !text-xs" onClick={() => copyCode(promo.code)} aria-label={`Salin kode promo ${promo.code}`}>
                <Copy className="size-4" /> {promo.code}
              </button>
              <Link to={promo.gameSlug ? `/game/${promo.gameSlug}` : '/games'} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20">
                Gunakan Promo
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
