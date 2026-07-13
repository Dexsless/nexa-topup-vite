export const siteConfig = {
  name: 'NEXA TOPUP',
  namePrimary: 'NEXA',
  nameAccent: 'TOPUP',
  description: 'Platform simulasi top-up game dan voucher digital dengan pengalaman yang ringkas, jernih, dan menyenangkan.',
} as const

export const heroBanners = [
  {
    id: 'weekend',
    eyebrow: 'NEXA WEEKEND DROP',
    title: 'Mabar makin seru, budget tetap aman.',
    description: 'Nikmati diskon hingga 18% untuk game pilihan akhir pekan ini.',
    discount: 'HEMAT 18%',
    cta: '/game/mobile-legends',
    gradient: 'from-[#161833] via-[#5448df] to-[#26c0e5]',
    accent: '#92f3d4',
  },
  {
    id: 'new-user',
    eyebrow: 'KHUSUS PENGGUNA BARU',
    title: 'Top up pertama, harga lebih ringan.',
    description: 'Pakai kode HALONEXA dan dapatkan potongan Rp10.000.',
    discount: 'POTONGAN 10K',
    cta: '/game/free-fire',
    gradient: 'from-[#2c193f] via-[#8d3ec0] to-[#ff846a]',
    accent: '#ffd780',
  },
  {
    id: 'instant',
    eyebrow: 'ALUR RINGKAS',
    title: 'Top up selesai dalam lima langkah mudah.',
    description: 'Checkout simulasi yang jelas, responsif, dan mudah diikuti.',
    discount: '5 LANGKAH MUDAH',
    cta: '/games',
    gradient: 'from-[#102d4e] via-[#126f8f] to-[#45d1ba]',
    accent: '#c2ffef',
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
