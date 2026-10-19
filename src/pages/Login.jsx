import { useState } from 'react'
import InstallApp from '../InstallApp'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { ErrorBox, Field, PasswordInput, useAction, usePageTitle } from '../ui'

export default function Login() {
  const { user, status, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { busy, error, run } = useAction()
  usePageTitle('Connexion')

  if (status === 'ready' && user) {
    return <Navigate to={user.must_change_password ? '/password' : '/'} replace />
  }

  const submit = async (e) => {
    e.preventDefault()
    const me = await run(() => login(email.trim(), password))
    if (me) navigate(me.must_change_password ? '/password' : '/')
  }

  return (
    <div className="auth-page auth-split">
      <form className="card auth-card" onSubmit={submit} aria-busy={busy}>
        <div className="auth-logo"><img src="/logo.png" alt="Baobab" /><small>Espace lecteur</small></div>
        <h2>Connexion</h2>
        <p className="muted">Consultez vos prêts et le catalogue de vos bibliothèques.</p>
        <ErrorBox>{error}</ErrorBox>
        <Field label="Email"><input type="email" name="email" autoComplete="username" inputMode="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Mot de passe"><PasswordInput name="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <button className="btn" disabled={busy} style={{ width: '100%' }}>{busy ? 'Connexion…' : 'Se connecter'}</button>
        <details className="auth-help">
          <summary>Mot de passe oublié ?</summary>
          <p className="muted">Contactez votre structure (bibliothèque ou espace de coworking) : son personnel pourra vous aider à retrouver l'accès à votre compte.</p>
        </details>
        <div style={{ textAlign: 'center', marginTop: '.8rem' }}><InstallApp /></div>
        <p className="muted" style={{ textAlign: 'center', marginTop: '1rem' }}>Pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
        <p className="auth-foot muted"><Link to="/">← Accueil</Link> · <Link to="/confidentialite">Confidentialité</Link></p>
      </form>
    </div>
  )
}
