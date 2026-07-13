import { useEffect, useId, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  Clock3,
  FileSearch,
  Gamepad2,
  History,
  ReceiptText,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { formatRupiah, getTransaction, getTransactions } from '../services/transactionService'
import type { Transaction } from '../types'
import { Seo } from '../components/Seo'

const statusContent: Record<
  Transaction['status'],
  { label: string; className: string; dotClassName: string }
> = {
  success: {
    label: 'Berhasil',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dotClassName: 'bg-emerald-500',
  },
  pending: {
    label: 'Diproses',
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
    dotClassName: 'bg-amber-500',
  },
  failed: {
    label: 'Gagal',
    className: 'bg-rose-50 text-rose-700 ring-rose-200',
    dotClassName: 'bg-rose-500',
  },
}

const formatDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Waktu tidak tersedia'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function CheckTransactionPage() {
  const navigate = useNavigate()
  const invoiceInputId = useId()
  const [invoice, setInvoice] = useState('')
  const [history, setHistory] = useState<Transaction[]>(() => getTransactions())
  const [error, setError] = useState('')

  useEffect(() => {
    const refreshHistory = () => setHistory(getTransactions())

    window.addEventListener('focus', refreshHistory)
    window.addEventListener('storage', refreshHistory)

    return () => {
      window.removeEventListener('focus', refreshHistory)
      window.removeEventListener('storage', refreshHistory)
    }
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedInvoice = invoice.trim()

    if (!normalizedInvoice) {
      setError('Masukkan nomor invoice terlebih dahulu.')
      return
    }

    const transaction = getTransaction(normalizedInvoice)
    if (!transaction) {
      setError('Invoice tidak ditemukan di riwayat browser ini. Periksa kembali penulisannya.')
      return
    }

    setError('')
    navigate(`/transaction/${encodeURIComponent(transaction.invoice)}`)
  }

  return (
    <main className="min-h-[70vh] bg-slate-50/70 py-10 sm:py-14">
      <Seo title="Cek Transaksi" description="Cari invoice simulasi dan lihat riwayat transaksi yang tersimpan di browser ini." />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-5 py-8 text-white shadow-xl shadow-indigo-950/10 sm:px-9 sm:py-10 lg:px-12">
          <div
            className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="max-w-xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100 ring-1 ring-inset ring-white/15">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Pengecekan lokal &amp; aman
              </span>
              <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                Cek status transaksi
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                Masukkan nomor invoice NEXA TOPUP untuk melihat status dan rincian pesanan simulasi Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="rounded-2xl bg-white p-2 shadow-2xl shadow-black/20">
              <label htmlFor={invoiceInputId} className="sr-only">
                Nomor invoice
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id={invoiceInputId}
                    name="invoice"
                    value={invoice}
                    onChange={(event) => {
                      setInvoice(event.target.value)
                      if (error) setError('')
                    }}
                    aria-describedby={error ? `${invoiceInputId}-error` : `${invoiceInputId}-hint`}
                    aria-invalid={Boolean(error)}
                    autoComplete="off"
                    placeholder="Contoh: NX-20260713-ABC123"
                    className="h-12 w-full rounded-xl border border-transparent bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-200"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
                >
                  Cek Invoice
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p id={`${invoiceInputId}-hint`} className="sr-only">
                Nomor invoice tersedia pada halaman transaksi setelah simulasi checkout selesai.
              </p>
            </form>
          </div>
        </section>

        <div className="min-h-7 pt-2" aria-live="polite">
          {error ? (
            <div
              id={`${invoiceInputId}-error`}
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
            >
              <FileSearch className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </div>
          ) : null}
        </div>

        <section aria-labelledby="transaction-history-heading" className="mt-8 sm:mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                <History className="h-4 w-4" aria-hidden="true" />
                Riwayat browser
              </div>
              <h2 id="transaction-history-heading" className="text-2xl font-bold tracking-tight text-slate-950">
                Transaksi terbaru
              </h2>
              <p className="mt-1 text-sm text-slate-500">Data hanya tersimpan sementara di perangkat ini.</p>
            </div>
            {history.length > 0 ? (
              <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
                {history.length} transaksi
              </span>
            ) : null}
          </div>

          {history.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm sm:py-16">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <ReceiptText className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-950">Belum ada transaksi</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Selesaikan simulasi top-up pertama Anda. Invoice yang dibuat akan muncul otomatis di sini.
              </p>
              <Link
                to="/games"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
              >
                <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                Pilih Game
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((transaction) => {
                const status = statusContent[transaction.status]

                return (
                  <Link
                    key={transaction.invoice}
                    to={`/transaction/${encodeURIComponent(transaction.invoice)}`}
                    aria-label={`Lihat transaksi ${transaction.invoice} untuk ${transaction.gameName}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                        <Gamepad2 className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${status.className}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dotClassName}`} aria-hidden="true" />
                        {status.label}
                      </span>
                    </div>
                    <h3 className="mt-4 truncate text-base font-bold text-slate-950">{transaction.gameName}</h3>
                    <p className="mt-1 truncate font-mono text-xs font-medium text-slate-500">{transaction.invoice}</p>
                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <p className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                          {formatDate(transaction.createdAt)}
                        </p>
                        <p className="mt-1.5 text-sm font-bold text-slate-950">{formatRupiah(transaction.total)}</p>
                      </div>
                      <ArrowRight
                        className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        <aside className="mt-8 flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4 text-sm text-sky-900 sm:px-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" aria-hidden="true" />
          <p className="leading-6">
            <strong>Mode simulasi:</strong> halaman ini tidak memeriksa transaksi atau pembayaran sungguhan. Hanya invoice mock yang tersimpan di browser ini yang dapat ditemukan.
          </p>
        </aside>
      </div>
    </main>
  )
}
