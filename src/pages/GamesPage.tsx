import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { GameCard } from '../components/GameCard'
import { EmptyState, GameGridSkeleton } from '../components/PageStates'
import { Seo } from '../components/Seo'
import { gameCategories, games } from '../data/games'
import type { GameCategory } from '../types'

export function GamesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const categoryParam = searchParams.get('category')
  const category = gameCategories.includes(categoryParam as GameCategory) ? categoryParam ?? 'Semua' : 'Semua'
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    timerRef.current = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(timerRef.current)
  }, [])

  const updateFilters = (nextQuery: string, nextCategory: string) => {
    setLoading(true)
    window.clearTimeout(timerRef.current)
    const next = new URLSearchParams()
    if (nextQuery.trim()) next.set('q', nextQuery.trim())
    if (nextCategory !== 'Semua') next.set('category', nextCategory)
    setSearchParams(next, { replace: true })
    timerRef.current = window.setTimeout(() => setLoading(false), 320)
  }

  const filteredGames = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return games.filter((game) => {
      const matchesQuery = !normalized || `${game.name} ${game.publisher} ${game.category}`.toLowerCase().includes(normalized)
      const matchesCategory = category === 'Semua' || game.category === category
      return matchesQuery && matchesCategory
    })
  }, [category, query])

  const reset = () => updateFilters('', 'Semua')

  return (
    <main className="page-container pb-4 pt-10 md:pt-14">
      <Seo title="Semua Game" description="Cari dan filter katalog game NEXA TOPUP berdasarkan nama, publisher, atau kategori." />
      <div className="max-w-2xl">
        <p className="eyebrow">KATALOG NEXA</p>
        <h1 className="mt-2 text-[30px] font-extrabold tracking-[-0.04em] text-slate-950 md:text-[40px]">Temukan game favoritmu.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 md:text-[15px]">Gunakan pencarian dan filter kategori untuk menemukan opsi top up yang tepat.</p>
      </div>

      <section className="mt-8" aria-label="Filter game">
        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
              <label className="sr-only" htmlFor="catalog-search">Cari katalog game</label>
              <input
                id="catalog-search"
                className="form-input !pl-10 !pr-10"
                type="search"
                value={query}
                onChange={(event) => updateFilters(event.target.value, category)}
                placeholder="Cari nama game atau publisher..."
              />
              {query && (
                <button type="button" className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={() => updateFilters('', category)} aria-label="Hapus pencarian">
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0" aria-label="Filter kategori">
              <SlidersHorizontal className="mr-1 size-[18px] shrink-0 text-slate-400" aria-hidden="true" />
              {gameCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`min-h-10 shrink-0 rounded-xl px-3.5 text-xs font-bold transition ${category === item ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  onClick={() => updateFilters(query, item)}
                  aria-pressed={category === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="catalog-results">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 id="catalog-results" className="text-lg font-bold text-slate-950">{query || category !== 'Semua' ? 'Hasil pencarian' : 'Semua game'}</h2>
            <p className="mt-1 text-xs text-slate-500" role="status" aria-live="polite">{loading ? 'Memuat katalog...' : `${filteredGames.length} game ditemukan`}</p>
          </div>
          {(query || category !== 'Semua') && <button type="button" className="button-secondary !min-h-10 !px-3.5 !text-xs" onClick={reset}>Reset filter</button>}
        </div>
        {loading ? (
          <GameGridSkeleton />
        ) : filteredGames.length > 0 ? (
          <div className="game-grid">{filteredGames.map((game) => <GameCard key={game.id} game={game} />)}</div>
        ) : (
          <EmptyState
            title="Game belum ditemukan"
            description="Coba kata kunci lain atau reset filter untuk melihat seluruh katalog yang tersedia."
            action={<button type="button" className="button-primary" onClick={reset}>Reset Filter</button>}
          />
        )}
      </section>
    </main>
  )
}
