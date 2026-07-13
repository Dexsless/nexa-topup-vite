import { FileCheck2, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'

interface LegalPageProps {
  type: 'terms' | 'privacy'
}

export function LegalPage({ type }: LegalPageProps) {
  const privacy = type === 'privacy'
  return (
    <main className="page-container py-10 md:py-14">
      <Seo title={privacy ? 'Kebijakan Privasi' : 'Ketentuan Layanan'} description={`Informasi ${privacy ? 'privasi' : 'ketentuan'} untuk demo frontend NEXA TOPUP.`} />
      <article className="mx-auto max-w-3xl rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-9">
        <span className="grid size-12 place-items-center rounded-2xl bg-violet-100 text-violet-700">{privacy ? <LockKeyhole className="size-6" /> : <FileCheck2 className="size-6" />}</span>
        <p className="eyebrow mt-6">DOKUMEN DEMO</p>
        <h1 className="mt-2 text-[30px] font-extrabold tracking-[-0.04em] text-slate-950 sm:text-[38px]">{privacy ? 'Kebijakan Privasi' : 'Ketentuan Layanan'}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">Terakhir diperbarui: 13 Juli 2026. Dokumen ini menjelaskan perilaku aplikasi demonstrasi, bukan layanan pembayaran nyata.</p>
        <div className="mt-8 space-y-7 text-sm leading-7 text-slate-600">
          {privacy ? (
            <>
              <section><h2 className="text-lg font-bold text-slate-950">Data yang disimpan</h2><p className="mt-2">Data transaksi mock—termasuk User ID, nomor WhatsApp, item, dan invoice—hanya disimpan melalui localStorage pada browser yang digunakan.</p></section>
              <section><h2 className="text-lg font-bold text-slate-950">Pengiriman data</h2><p className="mt-2">Aplikasi ini tidak memiliki backend, analitik, autentikasi, atau payment gateway. Formulir bantuan juga tidak mengirim data ke server.</p></section>
              <section><h2 className="text-lg font-bold text-slate-950">Kontrol pengguna</h2><p className="mt-2">Riwayat dapat dihapus dengan membersihkan data situs pada browser. Jangan gunakan data akun atau kontak sensitif saat mencoba demo.</p></section>
            </>
          ) : (
            <>
              <section><h2 className="text-lg font-bold text-slate-950">Penggunaan demo</h2><p className="mt-2">NEXA TOPUP hanya mendemonstrasikan antarmuka top-up. Tidak ada pembayaran, validasi akun game, pengiriman item, atau layanan pelanggan nyata.</p></section>
              <section><h2 className="text-lg font-bold text-slate-950">Harga dan promo</h2><p className="mt-2">Seluruh harga, biaya, kode promo, publisher, status, dan invoice merupakan data mock dan tidak dapat dijadikan penawaran komersial.</p></section>
              <section><h2 className="text-lg font-bold text-slate-950">Merek pihak ketiga</h2><p className="mt-2">Nama game merupakan milik pemegang hak masing-masing. Ilustrasi yang dipakai bersifat abstrak dan orisinal; aplikasi ini tidak terafiliasi dengan publisher terkait.</p></section>
            </>
          )}
        </div>
        <div className="mt-9 flex flex-wrap gap-3 border-t border-slate-100 pt-6"><Link to="/" className="button-primary">Kembali ke Beranda</Link><Link to={privacy ? '/terms' : '/privacy'} className="button-secondary">Baca {privacy ? 'Ketentuan' : 'Privasi'}</Link></div>
      </article>
    </main>
  )
}
