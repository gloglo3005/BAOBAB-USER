import { useState } from 'react'
import InstallApp from '../InstallApp'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { ErrorBox, Field, useAction } from '../ui'

export default function Login() {
  const { user, status, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { busy, error, run } = useAction()

  if (status === 'ready' && user) {
    return <Navigate to={user.must_change_password ? '/password' : '/'} replace />
  }

  const submit = async (e) => {
    e.preventDefault()
    const me = await run(() => login(email.trim(), password))
    if (me) navigate(me.must_change_password ? '/password' : '/')
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <div className="auth-logo"><img src="/logo.png" alt="Baobab" /><small>Espace lecteur</small></div>
        <h2>Connexion</h2>
        <p className="muted">Consultez vos prêts et le catalogue de vos bibliothèques.</p>
        <ErrorBox>{error}</ErrorBox>
        <Field label="Email"><input type="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Mot de passe"><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <button className="btn" disabled={busy} style={{ width: '100%' }}>{busy ? 'Connexion…' : 'Se connecter'}</button>
        <div style={{ textAlign: 'center', marginTop: '.8rem' }}><InstallApp /></div>
        <p className="muted" style={{ textAlign: 'center', marginTop: '1rem' }}>Pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
      </form>
    </div>
  )
}