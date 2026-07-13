import { Camera, Mail, MessageCircle, Video } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'
import { siteConfig } from '../data/content'

const columns = [
  {
    title: 'Bantuan',
    links: [
      { label: 'Cek transaksi', to: '/check-transaction' },
      { label: 'Cara top up', to: '/#cara-topup' },
      { label: 'Hubungi kami', to: '/contact' },
    ],
  },
  {
    title: 'Produk',
    links: [
      { label: 'Semua game', to: '/games' },
      { label: 'Promo', to: '/promos' },
      { label: 'Voucher digital', to: '/#voucher' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Ketentuan layanan', to: '/terms' },
      { label: 'Kebijakan privasi', to: '/privacy' },
      { label: 'Disclaimer', to: '/#disclaimer' },
    ],
  },
  {
    title: 'Kontak',
    links: [
      { label: 'Pusat bantuan', to: '/contact' },
      { label: 'Pusat transaksi', to: '/check-transaction' },
      { label: 'Kirim masukan', to: '/contact#feedback' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-20 bg-[#15183b] text-white md:mt-28">
      <div className="page-container pb-8 pt-12 md:pt-16">
        <div className="grid gap-10 md:grid-cols-[1.35fr_2fr] lg:gap-20">
          <div>
            <BrandLogo light />
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/60">{siteConfig.description}</p>
            <div className="mt-6 flex gap-2" aria-label="Media sosial">
              <a className="footer-social" href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Camera className="size-[18px]" /></a>
              <a className="footer-social" href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Video className="size-[18px]" /></a>
              <Link className="footer-social" to="/contact" aria-label="Kontak"><Mail className="size-[18px]" /></Link>
              <a className="footer-social" href="https://wa.me/?text=Halo%20NEXA%20TOPUP" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle className="size-[18px]" /></a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-bold text-white">{column.title}</h2>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.to.startsWith('mailto:') || link.to.startsWith('http') ? (
                        <a className="footer-link" href={link.to}>{link.label}</a>
                      ) : (
                        <Link className="footer-link" to={link.to}>{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div id="disclaimer" className="mt-12 border-t border-white/10 pt-7 text-xs leading-5 text-white/60">
          <p>Nama dan merek game yang disebutkan merupakan milik pemegang hak masing-masing. NEXA TOPUP tidak menggunakan logo, karakter, atau aset resmi game dan tidak terafiliasi dengan penerbit terkait.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 {siteConfig.name}. Dibuat untuk demonstrasi antarmuka.</p>
            <p>Checkout di situs ini adalah simulasi—tidak ada pembayaran nyata.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
