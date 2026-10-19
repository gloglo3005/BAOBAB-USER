import { useEffect } from 'react'
import InstallApp from './InstallApp'
import { NavLink } from 'react-router-dom'
import { useAuth } from './auth'
import { watchTables } from './responsiveTables'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  useEffect(() => watchTables(), [])
  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <div className="brand"><img src="/favicon.png" alt="" /><div>Baobab<small>Espace lecteur</small></div></div>
          <nav className="topnav">
            <NavLink to="/" end>Mes bibliothèques</NavLink>
            <NavLink to="/coworking">Coworking</NavLink>
            <NavLink to="/explore">Explorer</NavLink>
            <NavLink to="/settings">Compte</NavLink>
          </nav>
          <span style={{ fontSize: '.85rem' }}>{user.first_name || user.email}</span>
          <InstallApp />
          <button className="btn btn-ghost btn-sm" onClick={logout}>Déconnexion</button>
        </div>
      </header>
      <main className="container">{children}</main>
    </>
  )
}
