import type { CSSProperties } from 'react'
import type { Product } from '../types'
import { ProductCard } from './ProductCard'

interface AutoProductRailProps {
  products: Product[]
  ariaLabel: string
  reverse?: boolean
  speed?: number
}

type MarqueeStyle = CSSProperties & {
  '--marquee-duration': string
}

export function AutoProductRail({ products, ariaLabel, reverse = false, speed = 34 }: AutoProductRailProps) {
  const style: MarqueeStyle = { '--marquee-duration': `${speed}s` }

  return (
    <div className={`product-marquee${reverse ? ' reverse' : ''}`} style={style}>
      <div className="product-marquee-track">
        <div className="product-marquee-set" role="list" aria-label={ariaLabel}>
          {products.map((product) => (
            <div key={product.id} role="listitem">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="product-marquee-set" aria-hidden="true" inert>
          {products.map((product) => (
            <div key={`${product.id}-duplicate`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
