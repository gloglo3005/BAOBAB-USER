import { useState } from 'react'
import { Link } from 'react-router-dom'
import { get, post } from '../api'
import { Badge, Empty, ErrorBox, Field, Loading, rows, useAction, useFetch } from '../ui'
import PageBanner from '../PageBanner'

const STATUS_HELP = {
  PENDING: "Demande envoyée : en attente de validation par la bibliothèque.",
  SUSPENDED: 'Adhésion suspendue.',
  REJECTED: 'Demande refusée par la bibliothèque.',
}

export default function Libraries() {
  const { data, loading, error, reload } = useFetch(() => get('/reader/memberships/'), [])
  const [code, setCode] = useState('')
  const [done, setDone] = useState('')
  const action = useAction()
  const list = rows(data)

  const link = async (e) => {
    e.preventDefault()
    setDone('')
    const m = await action.run(() => post('/reader/link/', { code: code.trim() }))
    if (m) { setCode(''); setDone(`Compte relié à ${m.organization.name} (${m.member_number}).`); reload() }
  }

  return (
    <>
      <PageBanner title="Mes bibliothèques" subtitle="Les bibliothèques où vous êtes inscrit" image="/images/lecture.webp" />
      {loading && <Loading />}
      <ErrorBox>{error}</ErrorBox>
      {data && (list.length === 0 ? (
        <div className="card">
          <Empty>Vous n'êtes inscrit dans aucune bibliothèque.</Empty>
          <p style={{ textAlign: 'center' }}><Link className="btn" to="/explore">Explorer les bibliothèques</Link></p>
        </div>
      ) : (
        <div className="lib-grid">
          {list.map((m) => (
            <div key={m.id} className="card lib-card">
              <h2>{m.organization.name} <Badge value={m.status} /></h2>
              <p className="muted">Membre n° {m.member_number}</p>
              {m.status === 'ACCEPTED' && (
                <p>{m.active_loans} prêt(s) en cours{m.overdue_loans > 0 && <> · <strong style={{ color: 'var(--bad)' }}>{m.overdue_loans} en retard</strong></>}</p>
              )}
              {STATUS_HELP[m.status] && <p className="muted">{STATUS_HELP[m.status]}</p>}
              {m.status !== 'REJECTED' && <Link className="btn" to={`/l/${m.id}`} style={{ textAlign: 'center', textDecoration: 'none', marginTop: 'auto' }}>Ouvrir</Link>}
            </div>
          ))}
        </div>
      ))}

      <div className="section card">
        <h2>J'ai un code de rattachement</h2>
        <p className="muted">La bibliothèque vous a remis un code au comptoir ? Saisissez-le pour relier votre compte à votre fiche de membre.</p>
        <form className="toolbar" onSubmit={link} style={{ marginTop: '.8rem' }}>
          <Field label=""><input placeholder="Code" required maxLength={20} value={code} onChange={(e) => setCode(e.target.value)} /></Field>
          <button className="btn" disabled={action.busy}>Relier mon compte</button>
        </form>
        <ErrorBox>{action.error}</ErrorBox>
        {done && <div className="alert alert-ok">{done}</div>}
      </div>
    </>
  )
}
