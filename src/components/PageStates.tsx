import { CircleAlert, Gamepad2, RotateCcw, SearchX } from 'lucide-react'
import type { ReactNode } from 'react'

export function GameGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="game-grid" aria-label="Memuat daftar game" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          <div className="skeleton aspect-[4/3]" />
          <div className="space-y-3 p-4">
            <div className="skeleton h-3 w-2/5 rounded" />
            <div className="skeleton h-5 w-4/5 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface StateProps {
  title: string
  description: string
  action?: ReactNode
  headingLevel?: 1 | 2
}

export function EmptyState({ title, description, action }: StateProps) {
  return (
    <div className="state-card">
      <span className="state-icon"><SearchX className="size-7" /></span>
      <h2 className="mt-5 text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ title, description, action, headingLevel = 2 }: StateProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  return (
    <div className="state-card">
      <span className="state-icon error"><CircleAlert className="size-7" /></span>
      <Heading className="mt-5 text-xl font-bold text-slate-950">{title}</Heading>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="grid min-h-[55vh] place-items-center" role="status">
      <div className="text-center">
        <span className="mx-auto grid size-14 animate-pulse place-items-center rounded-2xl bg-violet-100 text-violet-600"><Gamepad2 className="size-7" /></span>
        <p className="mt-4 text-sm font-semibold text-slate-500">Menyiapkan NEXA...</p>
      </div>
    </div>
  )
}

export function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="button-secondary" onClick={onClick}>
      <RotateCcw className="size-4" /> Coba Lagi
    </button>
  )
}
