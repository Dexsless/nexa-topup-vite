import { useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Check,
  Clock3,
  Copy,
  Gamepad2,
  Hash,
  MessageCircle,
  ReceiptText,
  RotateCcw,
  ShieldAlert,
  Tag,
  UserRound,
  WalletCards,
  XCircle,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { formatRupiah, getTransaction } from '../services/transactionService'
import type { Transaction } from '../types'
import { Seo } from '../components/Seo'

const statusContent: Record<
  Transaction['status'],
  {
    title: string
    description: string
    icon: typeof BadgeCheck
    iconClassName: string
    badgeClassName: string
    badge: string
  }
> = {
  success: {
    title: 'Transaksi berhasil',
    description: 'Simulasi pesanan telah selesai dan tercatat di riwayat browser Anda.',
    icon: BadgeCheck,
    iconClassName: 'bg-emerald-500 text-white shadow-emerald-500/25',
    badgeClassName: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    badge: 'Berhasil',
  },
  pending: {
    title: 'Transaksi sedang diproses',
    description: 'Simulasi pesanan masih menunggu pembaruan status.',
    icon: Clock3,
    iconClassName: 'bg-amber-500 text-white shadow-amber-500/25',
    badgeClassName: 'bg-amber-50 text-amber-700 ring-amber-200',
    badge: 'Diproses',
  },
  failed: {
    title: 'Transaksi tidak berhasil',
    description: 'Simulasi pesanan gagal diselesaikan. Anda dapat membuat pesanan baru.',
    icon: XCircle,
    iconClassName: 'bg-rose-500 text-white shadow-rose-500/25',
    badgeClassName: 'bg-rose-50 text-rose-700 ring-rose-200',
    badge: 'Gagal',
  },
}

const formatDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Waktu tidak tersedia'

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date)
}

export default function TransactionPage() {
  const { invoice } = useParams<{ invoice: string }>()
  const transaction = getTransaction(invoice)
  const [copyFeedback, setCopyFeedback] = useState<{
    invoice: string
    state: 'copied' | 'error'
  } | null>(null)
  const copyState =
    transaction && copyFeedback?.invoice === transaction.invoice ? copyFeedback.state : 'idle'

  const handleCopyInvoice = async () => {
    if (!transaction) return

    try {
      await navigator.clipboard.writeText(transaction.invoice)
      setCopyFeedback({ invoice: transaction.invoice, state: 'copied' })
    } catch {
      setCopyFeedback({ invoice: transaction.invoice, state: 'error' })
    }
  }

  if (!transaction) {
    return (
      <main className="flex min-h-[70vh] items-center bg-slate-50/70 py-12">
        <Seo title="Transaksi Tidak Ditemukan" description="Invoice simulasi tidak ditemukan pada penyimpanan browser ini." />
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-12 shadow-xl shadow-slate-950/5 sm:px-12 sm:py-16">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-8 w-8" aria-hidden="true" />
            </span>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Invoice tidak tersedia</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Transaksi tidak ditemukan
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
              Invoice ini tidak ada di penyimpanan browser Anda. Pastikan tautan benar atau cari kembali dari halaman cek transaksi.
            </p>
            {invoice ? (
              <p className="mx-auto mt-5 max-w-md break-all rounded-xl bg-slate-50 px-4 py-3 font-mono text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                {invoice}
              </p>
            ) : null}
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/check-transaction"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
              >
                <ReceiptText className="h-4 w-4" aria-hidden="true" />
                Cek Invoice Lain
              </Link>
              <Link
                to="/games"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
              >
                <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                Lihat Semua Game
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const status = statusContent[transaction.status]
  const StatusIcon = status.icon
  const userReference = transaction.zoneId ? `${transaction.userId} (${transaction.zoneId})` : transaction.userId

  return (
    <main className="min-h-[70vh] bg-slate-50/70 py-8 sm:py-12">
      <Seo title={`Transaksi ${transaction.invoice}`} description={`Detail transaksi simulasi ${transaction.gameName} dengan invoice ${transaction.invoice}.`} />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link
            to="/check-transaction"
            className="inline-flex items-center gap-1.5 transition hover:text-indigo-600 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Cek Transaksi
          </Link>
          <span aria-hidden="true">/</span>
          <span className="min-w-0 truncate font-medium text-slate-900">{transaction.invoice}</span>
        </nav>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-950/5">
          <div className="relative overflow-hidden border-b border-slate-100 bg-slate-950 px-5 py-8 text-white sm:px-9 sm:py-10">
            <div
              className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-40 left-1/4 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg ${status.iconClassName}`}>
                <StatusIcon className="h-8 w-8" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${status.badgeClassName}`}>
                    {status.badge}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(transaction.createdAt)}</span>
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{status.title}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{status.description}</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-9 sm:py-8">
            <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nomor invoice</p>
                <p className="mt-1 break-all font-mono text-sm font-bold text-slate-950 sm:text-base">{transaction.invoice}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyInvoice}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
              >
                {copyState === 'copied' ? (
                  <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                {copyState === 'copied' ? 'Tersalin' : 'Salin Invoice'}
              </button>
            </div>
            <p className="mt-2 min-h-5 text-right text-xs text-slate-500" role="status" aria-live="polite">
              {copyState === 'copied'
                ? 'Nomor invoice berhasil disalin.'
                : copyState === 'error'
                  ? 'Tidak dapat menyalin otomatis. Pilih nomor invoice di atas lalu salin manual.'
                  : ''}
            </p>

            <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                  <ReceiptText className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                  Informasi pesanan
                </h2>
                <dl className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200 px-4 sm:px-5">
                  <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:items-center">
                    <dt className="flex items-center gap-2 text-sm text-slate-500">
                      <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                      Game
                    </dt>
                    <dd className="text-sm font-semibold text-slate-950 sm:text-right">{transaction.gameName}</dd>
                  </div>
                  <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:items-center">
                    <dt className="flex items-center gap-2 text-sm text-slate-500">
                      <UserRound className="h-4 w-4" aria-hidden="true" />
                      User ID{transaction.zoneId ? ' / Zone' : ''}
                    </dt>
                    <dd className="break-all font-mono text-sm font-semibold text-slate-950 sm:text-right">{userReference}</dd>
                  </div>
                  <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:items-center">
                    <dt className="flex items-center gap-2 text-sm text-slate-500">
                      <Hash className="h-4 w-4" aria-hidden="true" />
                      Nominal
                    </dt>
                    <dd className="text-sm font-semibold text-slate-950 sm:text-right">{transaction.denominationLabel}</dd>
                  </div>
                  <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:items-center">
                    <dt className="flex items-center gap-2 text-sm text-slate-500">
                      <WalletCards className="h-4 w-4" aria-hidden="true" />
                      Pembayaran
                    </dt>
                    <dd className="text-sm font-semibold text-slate-950 sm:text-right">{transaction.paymentMethodName}</dd>
                  </div>
                  <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:items-center">
                    <dt className="flex items-center gap-2 text-sm text-slate-500">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      WhatsApp
                    </dt>
                    <dd className="text-sm font-semibold text-slate-950 sm:text-right">{transaction.whatsapp}</dd>
                  </div>
                  {transaction.promoCode ? (
                    <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:items-center">
                      <dt className="flex items-center gap-2 text-sm text-slate-500">
                        <Tag className="h-4 w-4" aria-hidden="true" />
                        Kode promo
                      </dt>
                      <dd className="font-mono text-sm font-semibold text-indigo-700 sm:text-right">{transaction.promoCode}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              <aside>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                  <Banknote className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                  Ringkasan pembayaran
                </h2>
                <div className="mt-4 rounded-2xl bg-slate-950 p-5 text-white shadow-lg shadow-indigo-950/10 sm:p-6">
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-slate-400">Subtotal</dt>
                      <dd className="font-medium">{formatRupiah(transaction.subtotal)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-slate-400">Biaya admin</dt>
                      <dd className="font-medium">{formatRupiah(transaction.adminFee)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-slate-400">Diskon</dt>
                      <dd className={transaction.discount > 0 ? 'font-semibold text-emerald-400' : 'font-medium'}>
                        {transaction.discount > 0 ? `- ${formatRupiah(transaction.discount)}` : formatRupiah(0)}
                      </dd>
                    </div>
                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                      <dt>
                        <span className="block text-xs text-slate-400">Total pembayaran</span>
                        <span className="mt-1 block text-sm font-semibold">Total</span>
                      </dt>
                      <dd className="text-xl font-bold tracking-tight text-indigo-300 sm:text-2xl">
                        {formatRupiah(transaction.total)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                  <p className="leading-6">
                    <strong>Ini adalah simulasi.</strong> Tidak ada pembayaran, pengiriman item, atau transaksi uang sungguhan yang terjadi.
                  </p>
                </div>
              </aside>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
              <Link
                to="/check-transaction"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Kembali ke Riwayat
              </Link>
              <Link
                to={`/game/${transaction.gameSlug}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Top Up Lagi
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
