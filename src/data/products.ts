import type { Product } from '../types'
import { games } from './games'

type ProductDetails = Pick<Product, 'id' | 'gameSlug' | 'denominationId'> &
  Partial<Pick<Product, 'oldPrice' | 'discount' | 'badge'>>

const createProduct = (details: ProductDetails): Product => {
  const game = games.find(({ slug }) => slug === details.gameSlug)

  if (!game) {
    throw new Error(`Game dengan slug "${details.gameSlug}" tidak ditemukan.`)
  }

  const denomination = game.denominations.find(({ id }) => id === details.denominationId)

  if (!denomination) {
    throw new Error(`Nominal "${details.denominationId}" untuk ${game.name} tidak ditemukan.`)
  }

  return {
    ...details,
    name: game.name,
    publisher: game.publisher,
    category: game.category,
    image: game.image,
    itemLabel: denomination.amount,
    price: denomination.price,
  }
}

export const flashSaleProducts: Product[] = [
  createProduct({
    id: 'flash-mlbb-weekly',
    gameSlug: 'mobile-legends',
    denominationId: '172',
    oldPrice: 43000,
    discount: 9,
    badge: 'Paling laris',
  }),
  createProduct({
    id: 'flash-ff-140',
    gameSlug: 'free-fire',
    denominationId: '140',
    oldPrice: 21000,
    discount: 10,
  }),
  createProduct({
    id: 'flash-pubgm-325',
    gameSlug: 'pubg-mobile',
    denominationId: '325',
    oldPrice: 87000,
    discount: 9,
    badge: 'Harga kilat',
  }),
  createProduct({
    id: 'flash-hok-weekly',
    gameSlug: 'honor-of-kings',
    denominationId: 'weekly',
    oldPrice: 28000,
    discount: 11,
  }),
  createProduct({
    id: 'flash-valorant-475',
    gameSlug: 'valorant',
    denominationId: '475',
    oldPrice: 61000,
    discount: 10,
  }),
  createProduct({
    id: 'flash-genshin-blessing',
    gameSlug: 'genshin-impact',
    denominationId: 'blessing',
    oldPrice: 87000,
    discount: 9,
    badge: 'Pilihan hemat',
  }),
]

export const newProducts: Product[] = [
  createProduct({
    id: 'new-codm-53',
    gameSlug: 'call-of-duty-mobile',
    denominationId: '53',
    badge: 'Baru',
  }),
  createProduct({
    id: 'new-roblox-50k',
    gameSlug: 'roblox',
    denominationId: '50k',
    badge: 'Voucher',
  }),
  createProduct({
    id: 'new-genshin-300',
    gameSlug: 'genshin-impact',
    denominationId: '300',
  }),
  createProduct({
    id: 'new-hok-240',
    gameSlug: 'honor-of-kings',
    denominationId: '240',
  }),
  createProduct({
    id: 'new-mlbb-172',
    gameSlug: 'mobile-legends',
    denominationId: '172',
    badge: 'Populer',
  }),
  createProduct({
    id: 'new-ff-membership',
    gameSlug: 'free-fire',
    denominationId: 'membership',
  }),
]
