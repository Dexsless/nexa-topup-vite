import { ArrowUpRight, TicketPercent } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Promo } from '../types'

export function PromoCard({ promo }: { promo: Promo }) {
  const destination = promo.gameSlug ? `/game/${promo.gameSlug}` : '/promos'
  return (
    <Link id={`promo-${promo.id}`} to={destination} className={`promo-card group bg-gradient-to-br ${promo.gradient} ${promo.featured ? 'featured' : ''}`}>
      <div className="promo-orb one" aria-hidden="true" />
      <div className="promo-orb two" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/50 via-slate-950/50 to-slate-950/70" aria-hidden="true" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
            <TicketPercent className="size-3.5" /> {promo.badge}
          </span>
          <ArrowUpRight className="size-5 text-white/75 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </div>
        <div className="mt-auto">
          <h3 className={`${promo.featured ? 'text-2xl md:text-[28px]' : 'text-base md:text-lg'} max-w-[360px] font-extrabold tracking-[-0.025em] text-white`}>
            {promo.title}
          </h3>
          <p className={`mt-2 max-w-[420px] leading-5 text-white/95 ${promo.featured ? 'text-sm' : 'line-clamp-2 text-xs'}`}>{promo.description}</p>
          <span className="mt-3 inline-flex rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-extrabold tracking-wide text-slate-900">{promo.code}</span>
        </div>
      </div>
    </Link>
  )
}
