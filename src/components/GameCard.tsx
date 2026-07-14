import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Game } from '../types'
import { formatRupiah } from '../services/transactionService'
import { ImageWithFallback } from './ImageWithFallback'

export function GameCard({ game }: { game: Game }) {
  return (
    <Link to={`/game/${game.slug}`} className="game-card group" aria-label={`Top up ${game.name}, mulai ${formatRupiah(game.startingPrice)}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#1a1429]">
        <ImageWithFallback src={game.image} alt={`Ilustrasi abstrak orisinal untuk ${game.name}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" />
        <span className="absolute left-2 top-2 rounded-full border border-white/10 bg-[#0a0613]/75 px-2 py-1 text-[9.5px] font-semibold uppercase tracking-wide text-[#d8d1e6] backdrop-blur">{game.promo ?? game.category}</span>
        <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-slate-950/25 text-white opacity-0 backdrop-blur transition group-hover:opacity-100" aria-hidden="true">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="min-w-0 p-3.5">
        <p className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f879e]">{game.publisher}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[40px] text-[14px] font-semibold leading-[20px] text-white">{game.name}</h3>
        <div className="mt-3 flex items-end justify-between gap-2 border-t border-dashed border-white/[0.08] pt-3">
          <div className="min-w-0">
            <p className="text-[10px] text-[#8e879d]">Mulai</p>
            <p className="mt-0.5 truncate text-[14px] font-extrabold text-violet-300">{formatRupiah(game.startingPrice)}</p>
          </div>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-violet-600 text-white transition group-hover:translate-x-0.5" aria-hidden="true"><ArrowUpRight className="size-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}
