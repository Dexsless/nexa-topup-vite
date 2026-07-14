import { ArrowUpRight, TicketPercent } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Promo } from '../types'

export function PromoCard({ promo }: { promo: Promo }) {
  const destination = promo.gameSlug ? `/game/${promo.gameSlug}` : '/promos'
  return (
    <Link id={`promo-${promo.id}`} to={destination} className={`promo-card group ${promo.featured ? 'featured' : ''}`}>
      <div className={`relative h-[145px] overflow-hidden bg-gradient-to-br ${promo.gradient}`}>
        <div className="promo-orb one" aria-hidden="true" />
        <div className="promo-orb two" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/5 via-slate-950/20 to-slate-950/55" aria-hidden="true" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0a0613]/35 px-2.5 py-1 text-[10px] font-extrabold text-white backdrop-blur-md">
          <TicketPercent className="size-3.5" /> {promo.badge}
        </span>
        <div className="absolute inset-x-4 bottom-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">Kode promo</p>
          <p className="mt-1 text-2xl font-black tracking-[-0.04em] text-white drop-shadow">{promo.code}</p>
        </div>
      </div>
      <div className="flex min-h-[155px] flex-col p-4">
        <h3 className="line-clamp-2 min-h-11 text-[15px] font-extrabold leading-[22px] tracking-[-0.025em] text-white">{promo.title}</h3>
        <p className="mt-1 line-clamp-2 text-[11px] leading-[17px] text-[#9f97b1]">{promo.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <span className="text-[10px] font-semibold text-violet-300">{promo.period}</span>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-violet-600 text-white shadow-[0_8px_20px_rgba(98,87,255,0.35)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
