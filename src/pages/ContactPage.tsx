import { Headphones, MessageSquareText, Send, ShieldCheck } from 'lucide-react'
import { type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { useToast } from '../components/ToastProvider'

export function ContactPage() {
  const { showToast } = useToast()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.currentTarget.reset()
    showToast('Masukan demo berhasil dicatat di layar. Tidak ada data yang dikirim ke server.', 'success')
  }

  return (
    <main className="page-container py-10 md:py-14">
      <Seo title="Pusat Bantuan" description="Pusat bantuan dan formulir masukan simulasi NEXA TOPUP." />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[24px] bg-gradient-to-br from-[#181a3d] via-violet-700 to-cyan-600 p-6 text-white sm:p-8" aria-labelledby="contact-title">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-extrabold tracking-wider">PUSAT BANTUAN</span>
          <h1 id="contact-title" className="mt-4 text-[30px] font-extrabold tracking-[-0.04em] sm:text-[36px]">Ada yang bisa dibantu?</h1>
          <p className="mt-3 text-sm leading-6 text-white/75">Karena situs ini merupakan demo frontend, formulir tidak mengirim data keluar dari browser.</p>
          <div className="mt-8 space-y-3">
            <div className="flex gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur"><Headphones className="mt-0.5 size-5 shrink-0" /><div><h2 className="text-sm font-bold">Bantuan transaksi</h2><p className="mt-1 text-xs leading-5 text-white/70">Cari invoice yang tersimpan pada browser ini.</p></div></div>
            <div className="flex gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur"><ShieldCheck className="mt-0.5 size-5 shrink-0" /><div><h2 className="text-sm font-bold">Privasi lokal</h2><p className="mt-1 text-xs leading-5 text-white/70">Data demo tidak dikirim ke backend.</p></div></div>
          </div>
          <Link to="/check-transaction" className="button-light mt-6">Cek Transaksi</Link>
        </section>

        <section id="feedback" className="form-card scroll-mt-28" aria-labelledby="feedback-title">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-violet-100 text-violet-700"><MessageSquareText className="size-5" /></span>
            <div><p className="eyebrow">FORMULIR DEMO</p><h2 id="feedback-title" className="mt-1 text-xl font-bold text-slate-950">Kirim masukan</h2></div>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="form-label" htmlFor="contact-name">Nama</label><input id="contact-name" className="form-input" required placeholder="Nama kamu" /></div>
              <div><label className="form-label" htmlFor="contact-email">Email</label><input id="contact-email" className="form-input" type="email" required placeholder="nama@email.com" /></div>
            </div>
            <div><label className="form-label" htmlFor="contact-topic">Topik</label><select id="contact-topic" className="form-select" defaultValue="transaction"><option value="transaction">Transaksi demo</option><option value="catalog">Katalog game</option><option value="feedback">Masukan tampilan</option></select></div>
            <div><label className="form-label" htmlFor="contact-message">Pesan</label><textarea id="contact-message" className="form-input !h-32 resize-y py-3" required minLength={10} placeholder="Tulis pesan minimal 10 karakter..." /></div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">Jangan masukkan password, kode OTP, atau data pembayaran. Form ini hanya simulasi dan tidak mengirim pesan nyata.</div>
            <button type="submit" className="button-primary"><Send className="size-4" /> Kirim Masukan Demo</button>
          </form>
        </section>
      </div>
    </main>
  )
}
