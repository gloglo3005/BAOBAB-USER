import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth'
import Layout from './Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import ChangePassword from './pages/ChangePassword'
import Libraries from './pages/Libraries'
import Explore from './pages/Explore'
import LibrarySpace from './pages/LibrarySpace'
import LibraryHome from './pages/LibraryHome'
import Catalog from './pages/Catalog'
import BookDetail from './pages/BookDetail'
import MyLoans from './pages/MyLoans'
import Coworking from './pages/Coworking'
import CwSpace from './pages/CwSpace'
import CwHome from './pages/CwHome'
import CwBook from './pages/CwBook'
import CwMine from './pages/CwMine'
import { Loading, NotFound } from './ui'

function Protected({ children }) {
  const { user, status } = useAuth()
  if (status === 'loading') return <div className="auth-page"><Loading /></div>
  if (!user) return <Navigate to="/login" replace />
  if (user.must_change_password) return <Navigate to="/password" replace />
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password" element={<ChangePassword />} />
      <Route path="/" element={<Protected><Libraries /></Protected>} />
      <Route path="/explore" element={<Protected><Explore /></Protected>} />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}