import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  once?: boolean
  rootMargin?: string
  threshold?: number
}

/**
 * Adds `is-visible` when its content enters the viewport.
 * Content remains available to assistive technology while the effect is pending.
 */
export function Reveal({
  children,
  className,
  once = true,
  rootMargin = '0px 0px -8% 0px',
  threshold = 0.12,
  ...props
}: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current

    if (!element || typeof window === 'undefined') return

    const reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    let animationFrame: number | undefined

    const revealOnNextFrame = () => {
      animationFrame = window.requestAnimationFrame(() => setIsVisible(true))
    }

    const cancelPendingFrame = () => {
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame)
    }

    if (reducedMotionQuery?.matches || !('IntersectionObserver' in window)) {
      revealOnNextFrame()
      return cancelPendingFrame
    }

    let observer: IntersectionObserver | undefined

    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return

          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) observer?.unobserve(entry.target)
          } else if (!once) {
            setIsVisible(false)
          }
        },
        {
          rootMargin,
          threshold: Math.min(1, Math.max(0, threshold)),
        },
      )

      observer.observe(element)
    } catch {
      // Invalid observer options should never leave readable content concealed.
      revealOnNextFrame()
    }

    const revealForReducedMotion = (event: MediaQueryListEvent) => {
      if (event.matches) {
        observer?.disconnect()
        setIsVisible(true)
      }
    }

    reducedMotionQuery?.addEventListener('change', revealForReducedMotion)

    return () => {
      observer?.disconnect()
      cancelPendingFrame()
      reducedMotionQuery?.removeEventListener('change', revealForReducedMotion)
    }
  }, [once, rootMargin, threshold])

  return (
    <div
      ref={elementRef}
      className={['reveal', isVisible && 'is-visible', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}
