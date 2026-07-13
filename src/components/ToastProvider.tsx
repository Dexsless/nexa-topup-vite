/* eslint-disable react-refresh/only-export-components */
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Date.now() + Math.floor(Math.random() * 1000)
      setToasts((current) => [...current.slice(-2), { id, message, type }])
      window.setTimeout(() => removeToast(id), 4200)
    },
    [removeToast],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 top-20 z-[80] flex flex-col items-center gap-2 md:left-auto md:right-6 md:top-24 md:w-[360px]" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? CircleAlert : Info
          return (
            <div key={toast.id} role="status" className={`toast pointer-events-auto ${toast.type}`}>
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <p className="min-w-0 flex-1 text-sm font-medium">{toast.message}</p>
              <button type="button" className="icon-button !size-8 !text-current" onClick={() => removeToast(toast.id)} aria-label="Tutup notifikasi">
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
