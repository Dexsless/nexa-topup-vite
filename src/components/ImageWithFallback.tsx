interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  eager?: boolean
}

export function ImageWithFallback({ src, alt, className = '', eager = false }: ImageWithFallbackProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={(event) => {
        if (!event.currentTarget.src.endsWith('/images/games/fallback.svg')) {
          event.currentTarget.src = '/images/games/fallback.svg'
        }
      }}
    />
  )
}
