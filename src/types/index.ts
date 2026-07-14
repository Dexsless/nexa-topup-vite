export type GameCategory = 'MOBA' | 'Battle Royale' | 'RPG' | 'FPS' | 'Casual'

export interface Denomination {
  id: string
  amount: string
  price: number
  bonus?: string
  popular?: boolean
}

export interface Game {
  id: string
  slug: string
  name: string
  shortName: string
  publisher: string
  category: GameCategory
  description: string
  startingPrice: number
  promo?: string
  image: string
  colors: [string, string, string]
  unit: string
  requiresZone: boolean
  featured: boolean
  denominations: Denomination[]
}

export interface Product {
  id: string
  gameSlug: string
  denominationId: string
  name: string
  itemLabel: string
  publisher: string
  category: GameCategory
  image: string
  price: number
  oldPrice?: number
  discount?: number
  badge?: string
}

export interface Promo {
  id: string
  title: string
  description: string
  code: string
  badge: string
  period: string
  gradient: string
  featured?: boolean
  gameSlug?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxDiscount?: number
}

export interface PaymentMethod {
  id: string
  name: string
  group: 'E-Wallet & QR' | 'Virtual Account'
  fee: number
  color: string
  icon: 'qr' | 'wallet' | 'bank'
}

export interface Transaction {
  invoice: string
  gameSlug: string
  gameName: string
  userId: string
  zoneId?: string
  denominationId: string
  denominationLabel: string
  paymentMethodId: string
  paymentMethodName: string
  whatsapp: string
  promoCode?: string
  subtotal: number
  adminFee: number
  discount: number
  total: number
  status: 'success' | 'pending' | 'failed'
  createdAt: string
}

export interface CheckoutPayload {
  game: Game
  userId: string
  zoneId?: string
  denomination: Denomination
  paymentMethod: PaymentMethod
  whatsapp: string
  promoCode?: string
  discount: number
}
