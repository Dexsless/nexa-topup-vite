import type { PaymentMethod } from '../types'

export const paymentMethods: PaymentMethod[] = [
  { id: 'qris', name: 'QRIS', group: 'E-Wallet & QR', fee: 1000, color: '#27324a', icon: 'qr' },
  { id: 'gopay', name: 'GoPay', group: 'E-Wallet & QR', fee: 1500, color: '#00a9e8', icon: 'wallet' },
  { id: 'dana', name: 'DANA', group: 'E-Wallet & QR', fee: 1500, color: '#1688ee', icon: 'wallet' },
  { id: 'ovo', name: 'OVO', group: 'E-Wallet & QR', fee: 1500, color: '#65459b', icon: 'wallet' },
  { id: 'shopeepay', name: 'ShopeePay', group: 'E-Wallet & QR', fee: 1500, color: '#ee4d2d', icon: 'wallet' },
  { id: 'va', name: 'Virtual Account', group: 'Virtual Account', fee: 2500, color: '#5965d8', icon: 'bank' },
]
