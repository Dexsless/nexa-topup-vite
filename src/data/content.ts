export const siteConfig = {
  name: 'NEXA TOPUP',
  namePrimary: 'NEXA',
  nameAccent: 'TOPUP',
  description: 'Platform simulasi top-up game dan voucher digital dengan pengalaman yang ringkas, jernih, dan menyenangkan.',
} as const

export const heroBanners = [
  {
    id: 'weekend',
    eyebrow: 'WEEKEND FLASH DEAL',
    title: 'Top up favoritmu, harga lagi turun.',
    description: 'Pilih paket game terlaris dan nikmati harga spesial akhir pekan.',
    discount: 'HEMAT 18%',
    cta: '/game/mobile-legends',
    gradient: 'from-[#161833] via-[#5448df] to-[#26c0e5]',
    accent: '#92f3d4',
    image: '/images/banners/weekend-drop.jpg',
  },
  {
    id: 'new-user',
    eyebrow: 'BONUS PENGGUNA BARU',
    title: 'Mulai main tanpa bikin saldo menipis.',
    description: 'Gunakan kode HALONEXA dan dapatkan potongan transaksi pertamamu.',
    discount: 'POTONGAN 10K',
    cta: '/game/free-fire',
    gradient: 'from-[#2c193f] via-[#8d3ec0] to-[#ff846a]',
    accent: '#ffd780',
    image: '/images/banners/new-user-reward.jpg',
  },
  {
    id: 'instant',
    eyebrow: 'TRANSAKSI LEBIH TENANG',
    title: 'Satu tempat untuk top up cepat dan aman.',
    description: 'Alur pembelian jelas, pilihan pembayaran lengkap, dan status mudah dicek.',
    discount: 'PROSES INSTAN',
    cta: '/games',
    gradient: 'from-[#102d4e] via-[#126f8f] to-[#45d1ba]',
    accent: '#c2ffef',
    image: '/images/banners/secure-checkout.jpg',
  },
]

export const vouchers = [
  { id: 'steam', name: 'Steam Wallet', category: 'Gaming', icon: 'SW', color: '#1f4d6b' },
  { id: 'google-play', name: 'Google Play', category: 'Apps & Games', icon: 'GP', color: '#39a66f' },
  { id: 'ps-gift', name: 'Console Gift Card', category: 'Gaming', icon: 'GC', color: '#315cff' },
  { id: 'spotify', name: 'Spotify', category: 'Music', icon: 'SP', color: '#18a95b' },
  { id: 'netflix', name: 'Netflix', category: 'Entertainment', icon: 'NF', color: '#d82f3d' },
  { id: 'garena', name: 'Garena Shell', category: 'Gaming', icon: 'GS', color: '#e7513e' },
]
