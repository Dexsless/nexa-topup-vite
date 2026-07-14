import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface SectionHeadingProps {
  headingId?: string
  eyebrow?: string
  title: string
  description?: string
  link?: string
  linkLabel?: string
}

export function SectionHeading({ headingId, eyebrow, title, description, link, linkLabel = 'Lihat Semua' }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={headingId} className="mt-2 text-[22px] font-bold tracking-[-0.035em] text-slate-950 md:text-[30px]">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-[15px]">{description}</p>}
      </div>
      {link && (
        <Link to={link} className="link-arrow shrink-0">
          <span className="hidden sm:inline">{linkLabel}</span>
          <span className="sm:hidden">Lihat</span>
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}
