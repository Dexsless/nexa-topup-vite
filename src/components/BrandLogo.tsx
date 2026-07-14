import { Link } from 'react-router-dom'
import { siteConfig } from '../data/content'

interface BrandLogoProps {
  light?: boolean
  onClick?: () => void
}

export function BrandLogo({ light = false, onClick }: BrandLogoProps) {
  return (
    <Link className="inline-flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500" to="/" onClick={onClick}>
      <span className="brand-mark" aria-hidden="true">
        <span>N</span>
      </span>
      <span className="text-[15px] font-extrabold tracking-[-0.03em] text-white">
        {siteConfig.namePrimary} <span className={light ? 'text-violet-300' : 'text-fuchsia-300'}>{siteConfig.nameAccent}</span>
      </span>
      <span className="sr-only">Kembali ke beranda {siteConfig.name}</span>
    </Link>
  )
}
