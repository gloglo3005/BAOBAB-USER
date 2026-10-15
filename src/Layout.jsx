import { NavLink } from 'react-router-dom'
import { useAuth } from './auth'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <div className="brand"><img src="/favicon.svg" alt="" /><div>Baobab<small>Espace lecteur</small></div></div>
          <nav className="topnav">
            <NavLink to="/" end>Mes bibliothèques</NavLink>
            <NavLink to="/explore">Explorer</NavLink>
          </nav>
          <span style={{ fontSize: '.85rem' }}>{user.first_name || user.email}</span>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Déconnexion</button>
        </div>
      </header>
      <main className="container">{children}</main>
    </>
  )
}
