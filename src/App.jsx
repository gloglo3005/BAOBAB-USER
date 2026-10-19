import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth'
import Layout from './Layout'
import Login from './pages/Login'
const Register = lazy(() => import('./pages/Register'))
const ChangePassword = lazy(() => import('./pages/ChangePassword'))
const Account = lazy(() => import('./pages/Account'))
const Libraries = lazy(() => import('./pages/Libraries'))
const PublicHome = lazy(() => import('./pages/PublicHome'))
const Explore = lazy(() => import('./pages/Explore'))
const LibrarySpace = lazy(() => import('./pages/LibrarySpace'))
const LibraryHome = lazy(() => import('./pages/LibraryHome'))
const Catalog = lazy(() => import('./pages/Catalog'))
const BookDetail = lazy(() => import('./pages/BookDetail'))
const MyLoans = lazy(() => import('./pages/MyLoans'))
const Coworking = lazy(() => import('./pages/Coworking'))
const CwSpace = lazy(() => import('./pages/CwSpace'))
const CwHome = lazy(() => import('./pages/CwHome'))
const CwBook = lazy(() => import('./pages/CwBook'))
const CwMine = lazy(() => import('./pages/CwMine'))
import Privacy from './pages/Privacy'
import { Loading, NotFound } from './ui'

function Protected({ children }) {
  const { user, status } = useAuth()
  if (status === 'loading') return <div className="auth-page"><Loading /></div>
  if (!user) return <Navigate to="/login" replace />
  if (user.must_change_password) return <Navigate to="/password" replace />
  return <Layout><Suspense fallback={<Loading />}>{children}</Suspense></Layout>
}

// Visiteur : page publique. Personne connectée : son espace habituel.
function Root() {
  const { user, status } = useAuth()
  if (status === 'loading') return <div className="auth-page"><Loading /></div>
  if (!user) return <PublicHome />
  return <Protected><Libraries /></Protected>
}
export default function App() {
  return (
    <Suspense fallback={<div className="auth-page"><Loading /></div>}>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password" element={<ChangePassword />} />
      <Route path="/" element={<Root />} />
      <Route path="/explore" element={<Protected><Explore /></Protected>} />
      <Route path="/settings" element={<Protected><Account /></Protected>} />
      <Route path="/l/:memberId" element={<Protected><LibrarySpace /></Protected>}>
        <Route index element={<LibraryHome />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="catalog/:bookId" element={<BookDetail />} />
        <Route path="loans" element={<MyLoans />} />
      </Route>
      <Route path="/coworking" element={<Protected><Coworking /></Protected>} />
      <Route path="/c/:orgId" element={<Protected><CwSpace /></Protected>}>
        <Route index element={<CwHome />} />
        <Route path="book" element={<CwBook />} />
        <Route path="mine" element={<CwMine />} />
      </Route>
      <Route path="/confidentialite" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  )
}