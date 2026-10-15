import { useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { get, post } from '../api'
import { Empty, ErrorBox, Field, label, localToIso, rows, useAction } from '../ui'

const TYPES = ['', 'DESK', 'ROOM', 'OTHER']

export default function CwBook() {
  const { orgId, info } = useOutletContext()
  const navigate = useNavigate()
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [type, setType] = useState('')
  const [notes, setNotes] = useState('')
  const [found, setFound] = useState(null)
  const search = useAction()
  const book = useAction()

  if (!info.my_customer) {
    return <div className="alert alert-info">Créez d'abord votre fiche client dans l'onglet <Link to={`/c/${orgId}`}>Présentation</Link> pour pouvoir réserver.</div>
  }
  if (!info.booking_enabled) return <div className="alert alert-info">La réservation à l'avance est fermée pour le moment.</div>

  const find = async (e) => {
    e.preventDefault()
    setFound(null)
    const res = await search.run(() => get(`/reader/coworking/${orgId}/resources/availability/`, { start: localToIso(start), end: localToIso(end), type: type || undefined }))
    if (res) setFound(rows(res))
  }
  const reserve = async (resource) => {
    const ok = await book.run(() => post(`/reader/coworking/${orgId}/reservations/`, { resource: String(resource.id), starts_at: localToIso(start), ends_at: localToIso(end), notes }))
    if (ok) navigate(`/c/${orgId}/mine`)
  }

  return (
    <>
      <form className="card" onSubmit={find}>
        <h2>Quand ?</h2>
        <ErrorBox>{search.error}</ErrorBox>
        <div className="form-grid">
          <Field label="Début"><input type="datetime-local" required value={start} onChange={(e) => setStart(e.target.value)} /></Field>
          <Field label="Fin"><input type="datetime-local" required value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
          <Field label="Type"><select value={type} onChange={(e) => setType(e.target.value)}>{TYPES.map((t) => <option key={t} value={t}>{t ? label(t) : 'Tous'}</option>)}</select></Field>
        </div>
        <button className="btn" disabled={search.busy}>{search.busy ? 'Recherche…' : 'Voir les disponibilités'}</button>
      </form>
      {found && (
        <div className="section">
          <ErrorBox>{book.error}</ErrorBox>
          {found.length === 0 ? <Empty>Aucune ressource libre sur cette période.</Empty> : (
            <>
              <Field label="Note pour l'espace (facultatif)"><input maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
              <div className="lib-grid">
                {found.map((r) => (
                  <div key={r.id} className="card lib-card">
                    <h3>{r.code} · {r.name}</h3>
                    <p className="muted">{r.zone_name} · {label(r.resource_type)} · {r.capacity} place(s)</p>
                    <button className="btn" style={{ marginTop: 'auto' }} disabled={book.busy} onClick={() => reserve(r)}>Réserver</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
