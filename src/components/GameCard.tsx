import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Game } from '../types'
import { formatRupiah } from '../services/transactionService'
import { ImageWithFallback } from './ImageWithFallback'

export function GameCard({ game }: { game: Game }) {
  return (
    <Link to={`/game/${game.slug}`} className="game-card group" aria-label={`Top up ${game.name}, mulai ${formatRupiah(game.startingPrice)}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <ImageWithFallback src={game.image} alt={`Ilustrasi abstrak orisinal untuk ${game.name}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]" />
        {game.promo && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-violet-700 shadow-sm">{game.promo}</span>}
        <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-slate-950/25 text-white opacity-0 backdrop-blur transition group-hover:opacity-100" aria-hidden="true">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="min-w-0 p-4">
        <p className="truncate text-[12px] font-medium text-slate-500">{game.publisher}</p>
        <h3 className="mt-1 line-clamp-2 min-h-[44px] text-[15px] font-bold leading-[22px] text-slate-950">{game.name}</h3>
        <p className="mt-2 text-[12px] text-slate-500">Mulai</p>
        <p className="mt-0.5 text-[14px] font-extrabold text-violet-700">{formatRupiah(game.startingPrice)}</p>
      </div>
    </Link>
  )
}
