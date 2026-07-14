import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRupiah } from '../services/transactionService'
import type { Product } from '../types'
import { ImageWithFallback } from './ImageWithFallback'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const accessibleLabel = `Buka top up ${product.name}, ${product.itemLabel}, harga ${formatRupiah(product.price)}`

  return (
    <Link
      to={`/game/${product.gameSlug}?package=${encodeURIComponent(product.denominationId)}`}
      className="product-card group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0914]"
      aria-label={accessibleLabel}
    >
      <article>
        <div className="product-card-image">
          <ImageWithFallback
            src={product.image}
            alt={`Ilustrasi abstrak orisinal untuk ${product.name}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0613]/55 via-transparent to-transparent" aria-hidden="true" />
          {product.discount !== undefined && (
            <span className="absolute left-2 top-2 rounded-full border border-white/10 bg-[#0a0613]/80 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
              -{product.discount}%
            </span>
          )}
          {product.badge && (
            <span className="absolute right-2 top-2 max-w-[56%] truncate rounded-full border border-white/10 bg-[#0a0613]/80 px-2 py-1 text-[10px] font-semibold text-[#d8d1e6] backdrop-blur-md">
              {product.badge}
            </span>
          )}
        </div>

        <div className="product-card-body">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8f879e]">{product.category}</p>
          <h3 className="product-card-title mt-1">{product.name} — {product.itemLabel}</h3>

          <div className="product-card-footer">
            <div className="min-w-0">
              {product.oldPrice !== undefined && (
                <p className="truncate text-[10px] text-[#81798e] line-through">{formatRupiah(product.oldPrice)}</p>
              )}
              <p className="text-[10px] uppercase tracking-[0.06em] text-[#6b6582]">Harga</p>
              <p className="truncate text-[15px] font-extrabold text-violet-300">{formatRupiah(product.price)}</p>
            </div>
            <span
              className="product-card-arrow"
              aria-hidden="true"
            >
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
