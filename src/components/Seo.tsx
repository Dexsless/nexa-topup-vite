import { useEffect } from 'react'
import { siteConfig } from '../data/content'

export function Seo({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = `${title} | ${siteConfig.name}`
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previous = meta?.content
    if (meta) meta.content = description
    return () => {
      document.title = `${siteConfig.name} — Top Up Game Tanpa Ribet`
      if (meta && previous) meta.content = previous
    }
  }, [title, description])

  return null
}
