import { useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { ErrorBox, Field } from '../ui'

const EMPTY = { first_name: '', last_name: '', email: '', phone: '', password1: '', password2: '' }

// Messages d'erreur par champ renvoyÃ©s par le backend ({champ: [messages]}).
function FieldErrors({ errors, name }) {
  const list = errors?.[name]
  if (!list) return null
  return <small style={{ color: 'var(--bad)' }}>{[].concat(list).join(' ')}</small>
}

export default function Register() {
  const { user, status, register } = useAuth()
  const navigate = useNavigate()
  const [f, setF] = useState(EMPTY)
  const [fieldErrors, setFieldErrors] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // AprÃ¨s l'inscription, l'utilisateur est connectÃ© : on l'envoie choisir sa bibliothÃ¨que.
  const registered = useRef(false)
  if (status === 'ready' && user) return <Navigate to={registered.current ? '/explore' : '/'} replace />

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setFieldErrors(null)
    if (f.password1 !== f.password2) {
      setFieldErrors({ password2: ['Les deux mots de passe ne correspondent pas.'] })
      return
    }
    setError('')
    setBusy(true)
    try {
      registered.current = true
      await register({ ...f, email: f.email.trim() })
      navigate('/explore')
    } catch (err) {
      registered.current = false
      // 400 : erreurs par champ ; sinon message gÃ©nÃ©ral (429 : trop de crÃ©ations, rÃ©seauâ€¦)
      if (err.status === 400 && err.data && !err.data.detail) setFieldErrors(err.data)
      else setError(err.status === 429 ? 'Trop de crÃ©ations de compte depuis cette connexion. RÃ©essayez plus tard.' : err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit} style={{ width: 'min(480px, 100%)' }}>
        <div className="brand"><img src="/favicon.svg" alt="" /><div>Baobab<small>Espace lecteur</small></div></div>
        <h2>CrÃ©er mon compte</h2>
        <p className="muted">Ensuite, vous choisirez votre bibliothÃ¨que.</p>
        <ErrorBox>{error}</ErrorBox>
        <div className="form-grid">
          <Field label="PrÃ©nom"><input required autoComplete="given-name" value={f.first_name} onChange={set('first_name')} /><FieldErrors errors={fieldErrors} name="first_name" /></Field>
          <Field label="Nom"><input required autoComplete="family-name" value={f.last_name} onChange={set('last_name')} /><FieldErrors errors={fieldErrors} name="last_name" /></Field>
        </div>
        <Field label="Adresse email"><input type="email" required autoComplete="email" value={f.email} onChange={set('email')} /><FieldErrors errors={fieldErrors} name="email" /></Field>
        <Field label="TÃ©lÃ©phone (facultatif)"><input autoComplete="tel" inputMode="tel" value={f.phone} onChange={set('phone')} /><FieldErrors errors={fieldErrors} name="phone" /></Field>
        <Field label="Mot de passe" hint="8 caractÃ¨res minimum, pas trop courant, pas uniquement des chiffres."><input type="password" required autoComplete="new-password" value={f.password1} onChange={set('password1')} /><FieldErrors errors={fieldErrors} name="password1" /></Field>
        <Field label="Confirmer le mot de passe"><input type="password" required autoComplete="new-password" value={f.password2} onChange={set('password2')} /><FieldErrors errors={fieldErrors} name="password2" /></Field>
        <button className="btn" disabled={busy} style={{ width: '100%' }}>{busy ? 'CrÃ©ationâ€¦' : 'CrÃ©er mon compte'}</button>
        <p className="muted" style={{ textAlign: 'center', marginTop: '1rem' }}>DÃ©jÃ  un compte ? <Link to="/login">Se connecter</Link></p>
      </form>
    </div>
  )
}