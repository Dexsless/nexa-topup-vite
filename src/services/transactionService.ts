import type { CheckoutPayload, Transaction } from '../types'

const STORAGE_KEY = 'nexa-topup-transactions'
const TRANSACTION_EVENT = 'nexa-transactions-updated'

const wait = (milliseconds: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const handleAbort = () => {
      window.clearTimeout(timer)
      reject(new DOMException('Checkout dibatalkan.', 'AbortError'))
    }
    const timer = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve()
    }, milliseconds)
    if (signal?.aborted) handleAbort()
    else signal?.addEventListener('abort', handleAbort, { once: true })
  })

const isTransaction = (value: unknown): value is Transaction => {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  const requiredStrings = ['invoice', 'gameSlug', 'gameName', 'userId', 'denominationId', 'denominationLabel', 'paymentMethodId', 'paymentMethodName', 'whatsapp', 'createdAt']
  const requiredNumbers = ['subtotal', 'adminFee', 'discount', 'total']
  return (
    requiredStrings.every((key) => typeof item[key] === 'string') &&
    requiredNumbers.every((key) => typeof item[key] === 'number' && Number.isFinite(item[key])) &&
    ['success', 'pending', 'failed'].includes(String(item.status)) &&
    (item.zoneId === undefined || typeof item.zoneId === 'string') &&
    (item.promoCode === undefined || typeof item.promoCode === 'string')
  )
}

const readTransactions = (): Transaction[] => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored) as unknown
    return Array.isArray(parsed) ? parsed.filter(isTransaction) : []
  } catch {
    return []
  }
}

const createInvoiceNumber = () => {
  const date = new Date()
  const day = [date.getFullYear(), `${date.getMonth() + 1}`.padStart(2, '0'), `${date.getDate()}`.padStart(2, '0')].join('')
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `NX-${day}-${random}`
}

export const getTransactions = () => readTransactions()

export const getTransactionCount = () => readTransactions().length

export const subscribeToTransactions = (callback: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback()
  }
  window.addEventListener('storage', handleStorage)
  window.addEventListener(TRANSACTION_EVENT, callback)
  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(TRANSACTION_EVENT, callback)
  }
}

export const getTransaction = (invoice?: string) =>
  readTransactions().find((transaction) => transaction.invoice.toLowerCase() === invoice?.toLowerCase())

export const createMockTransaction = async (payload: CheckoutPayload, signal?: AbortSignal): Promise<Transaction> => {
  await wait(1200, signal)
  if (signal?.aborted) throw new DOMException('Checkout dibatalkan.', 'AbortError')

  const adminFee = payload.paymentMethod.fee
  const transaction: Transaction = {
    invoice: createInvoiceNumber(),
    gameSlug: payload.game.slug,
    gameName: payload.game.name,
    userId: payload.userId,
    zoneId: payload.zoneId,
    denominationId: payload.denomination.id,
    denominationLabel: payload.denomination.amount,
    paymentMethodId: payload.paymentMethod.id,
    paymentMethodName: payload.paymentMethod.name,
    whatsapp: payload.whatsapp,
    promoCode: payload.promoCode,
    subtotal: payload.denomination.price,
    adminFee,
    discount: payload.discount,
    total: Math.max(0, payload.denomination.price + adminFee - payload.discount),
    status: 'success',
    createdAt: new Date().toISOString(),
  }

  try {
    const next = [transaction, ...readTransactions()].slice(0, 20)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event(TRANSACTION_EVENT))
  } catch {
    throw new Error('Penyimpanan browser tidak tersedia. Coba nonaktifkan mode privat lalu ulangi.')
  }

  return transaction
}

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
