import { ArrowLeft, Gamepad2, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'

export function NotFoundPage() {
  return (
    <main className="page-container grid min-h-[68vh] place-items-center py-14">
      <Seo title="Halaman Tidak Ditemukan" description="Halaman yang kamu cari tidak tersedia di NEXA TOPUP." />
      <div className="w-full max-w-2xl overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-6 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-10">
        <div className="relative mx-auto grid size-28 place-items-center">
          <span className="absolute inset-0 rounded-full bg-violet-100" />
          <span className="absolute inset-4 rounded-full border-2 border-dashed border-violet-300" />
          <Gamepad2 className="relative size-11 text-violet-700" />
        </div>
        <p className="mt-5 text-xs font-extrabold tracking-[0.18em] text-violet-600">ERROR 404</p>
        <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.04em] text-slate-950 sm:text-[36px]">Portal ini belum terbuka.</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">Tautan mungkin sudah berubah atau alamat yang dimasukkan kurang tepat. Yuk, kembali ke area yang tersedia.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="button-primary"><Home className="size-[17px]" /> Kembali ke Beranda</Link>
          <Link to="/games" className="button-secondary"><ArrowLeft className="size-[17px]" /> Lihat Semua Game</Link>
        </div>
      </div>
    </main>
  )
}
