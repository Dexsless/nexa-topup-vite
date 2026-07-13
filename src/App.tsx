import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import CheckTransactionPage from './pages/CheckTransactionPage'
import { GameDetailPage } from './pages/GameDetailPage'
import { GamesPage } from './pages/GamesPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PromosPage } from './pages/PromosPage'
import TransactionPage from './pages/TransactionPage'
import { ContactPage } from './pages/ContactPage'
import { LegalPage } from './pages/LegalPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="promos" element={<PromosPage />} />
        <Route path="game/:slug" element={<GameDetailPage />} />
        <Route path="check-transaction" element={<CheckTransactionPage />} />
        <Route path="transaction/:invoice" element={<TransactionPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="terms" element={<LegalPage type="terms" />} />
        <Route path="privacy" element={<LegalPage type="privacy" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
