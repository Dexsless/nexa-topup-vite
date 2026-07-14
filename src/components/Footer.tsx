import { Camera, Mail, MessageCircle, Video } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'
import { siteConfig } from '../data/content'

const columns = [
  {
    title: 'Halaman',
    links: [
      { label: 'Beranda', to: '/' },
      { label: 'Daftar Game', to: '/games' },
      { label: 'Promo', to: '/promos' },
      { label: 'Cek Transaksi', to: '/check-transaction' },
    ],
  },
  {
    title: 'Bantuan',
    links: [
      { label: 'Cara Top Up', to: '/#cara-topup' },
      { label: 'Hubungi Kami', to: '/contact' },
      { label: 'Ketentuan Layanan', to: '/terms' },
      { label: 'Kebijakan Privasi', to: '/privacy' },
    ],
  },
]

const paymentLabels = ['QRIS', 'GoPay', 'DANA', 'OVO', 'ShopeePay', 'Virtual Account']

export function Footer() {
  return (
    <footer className="site-footer mt-20 text-white md:mt-28">
      <div className="page-container">
        <div className="footer-grid">
          <div>
            <BrandLogo light />
            <p className="mt-4 max-w-[320px] text-sm leading-[1.65] text-[#a5a0b8]">{siteConfig.description}</p>
            <div className="mt-5 flex gap-2.5" aria-label="Media sosial">
              <Link className="footer-social" to="/contact#social" aria-label="Informasi Instagram"><Camera className="size-[18px]" /></Link>
              <Link className="footer-social" to="/contact#social" aria-label="Informasi YouTube"><Video className="size-[18px]" /></Link>
              <Link className="footer-social" to="/contact" aria-label="Email dan kontak"><Mail className="size-[18px]" /></Link>
              <a className="footer-social" href="https://wa.me/?text=Halo%20NEXA%20TOPUP" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle className="size-[18px]" /></a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="footer-title">{column.title}</h2>
              <ul className="space-y-1">
                {column.links.map((link) => (
                  <li key={link.label}><Link className="footer-link" to={link.to}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="footer-title">Pembayaran</h2>
            <p className="text-[13px] leading-5 text-[#a5a0b8]">Metode pembayaran yang tersedia pada simulasi checkout.</p>
            <div className="footer-payments" aria-label="Metode pembayaran">
              {paymentLabels.slice(0, 5).map((payment) => <span key={payment} className="footer-payment">{payment}</span>)}
              <span className="footer-payment muted">+1 lainnya</span>
            </div>
          </div>
        </div>

        <div id="disclaimer" className="border-t border-white/[0.07] pt-7 text-xs leading-5 text-[#7d768d]">
          <p>Nama dan merek game merupakan milik pemegang hak masing-masing. Ilustrasi pada NEXA TOPUP dibuat orisinal dan situs ini tidak terafiliasi dengan penerbit game terkait.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 {siteConfig.name}. Dibuat untuk demonstrasi antarmuka.</p>
            <p>Checkout bersifat simulasi—tidak ada pembayaran nyata.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
