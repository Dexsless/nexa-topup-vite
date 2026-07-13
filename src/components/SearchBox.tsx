import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchBoxProps {
  initialValue?: string
  compact?: boolean
  onNavigate?: () => void
}

export function SearchBox({ initialValue = '', compact = false, onNavigate }: SearchBoxProps) {
  const [query, setQuery] = useState(initialValue)
  const navigate = useNavigate()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = query.trim()
    navigate(normalized ? `/games?q=${encodeURIComponent(normalized)}` : '/games')
    onNavigate?.()
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={`search-box ${compact ? 'h-11' : ''}`}>
      <Search className="size-[18px] shrink-0 text-slate-400" aria-hidden="true" />
      <label className="sr-only" htmlFor={compact ? 'mobile-game-search' : 'desktop-game-search'}>
        Cari game
      </label>
      <input
        id={compact ? 'mobile-game-search' : 'desktop-game-search'}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Cari game..."
        autoComplete="off"
      />
      <button type="submit" className="sr-only">Cari</button>
    </form>
  )
}
