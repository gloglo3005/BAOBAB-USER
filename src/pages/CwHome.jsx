import { Fragment, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { get, post } from '../api'
import { useAuth } from '../auth'
import { Badge, Empty, ErrorBox, Field, Loading, label, money, rows, useAction, useFetch } from '../ui'

const DAYS = [['mon', 'Lundi'], ['tue', 'Mardi'], ['wed', 'Mercredi'], ['thu', 'Jeudi'], ['fri', 'Vendredi'], ['sat', 'Samedi'], ['sun', 'Dimanche']]
const UNITS = { HOUR: 'heure', HALF_DAY: 'demi-journée (4 h)', DAY: 'journée (8 h)' }

function CustomerCard({ orgId, customer, onDone }) {
  const { user } = useAuth()
  const [f, setF] = useState({ first_name: user.first_name || '', last_name: user.last_name || '', phone: user.phone || '' })
  const { busy, error, run } = useAction()
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  if (customer) {
    return (
      <div className="card">
        <h2>Ma fiche client <Badge value={customer.status} /></h2>
        <p className="muted">N° {customer.customer_number} · {customer.first_name} {customer.last_name}</p>
      </div>
    )
  }
  const submit = async (e) => {
    e.preventDefault()
    if (await run(() => post(`/reader/coworking/${orgId}/customer/`, f))) onDone()
  }
  return (
    <form className="card" onSubmit={submit}>
      <h2>Créer ma fiche client</h2>
      <p className="muted">Une fiche est nécessaire pour réserver dans cet espace.</p>
      <ErrorBox>{error}</ErrorBox>
      <div className="form-grid">
        <Field label="Prénom"><input required value={f.first_name} onChange={set('first_name')} /></Field>
        <Field label="Nom"><input required value={f.last_name} onChange={set('last_name')} /></Field>
        <Field label="Téléphone"><input inputMode="tel" value={f.phone} onChange={set('phone')} /></Field>
      </div>
      <button className="btn" disabled={busy}>{busy ? 'Création…' : 'Créer ma fiche'}</button>
    </form>
  )
}

export default function CwHome() {
  const { orgId, info, reload } = useOutletContext()
  const resources = useFetch(() => get(`/reader/coworking/${orgId}/resources/`), [orgId])
  const rates = useFetch(() => get(`/reader/coworking/${orgId}/rates/`), [orgId])
  const resList = rows(resources.data)
  const nameOf = (id) => resList.find((r) => r.id === id)?.name || `Ressource n° ${id}`
  const hours = info.opening_hours || {}
  const limited = Object.keys(hours).length > 0
  const org = info.organization
  return (
    <>
      {(info.public_description || org.description) && <div className="card"><p>{info.public_description || org.description}</p></div>}
      <div className="section"><CustomerCard orgId={orgId} customer={info.my_customer} onDone={reload} /></div>

      <div className="section card">
        <h2>Horaires et règles</h2>
        {limited ? (
          <dl className="kv" style={{ marginTop: '.7rem' }}>
            {DAYS.map(([k, text]) => <Fragment key={k}><dt>{text}</dt><dd>{hours[k] ? `${hours[k][0]} – ${hours[k][1]}` : 'Fermé'}</dd></Fragment>)}
          </dl>
        ) : <p className="muted">Aucune restriction d'horaire : contactez l'espace pour les jours de fermeture.</p>}
        <ul className="muted" style={{ marginTop: '.7rem' }}>
          <li>Réservation de {info.min_booking_minutes} min à {info.max_booking_minutes} min.</li>
          <li>Annulation possible jusqu'à {info.cancellation_deadline_hours} h avant le début.</li>
          {info.max_upcoming_reservations > 0 && <li>Maximum {info.max_upcoming_reservations} réservation(s) à venir.</li>}
          {!info.booking_enabled && <li><strong>La réservation à l'avance est actuellement fermée.</strong></li>}
        </ul>
        {(org.address || org.phone || org.email) && <p className="muted">{[org.address, org.phone, org.email].filter(Boolean).join(' · ')}</p>}
      </div>

      <div className="section card">
        <h2>Ressources</h2>
        {resources.loading && <Loading />}
        {resources.data && (resList.length === 0 ? <Empty>Aucune ressource.</Empty> : (
          <div className="table-wrap" style={{ marginTop: '.7rem' }}><table>
            <thead><tr><th>Code</th><th>Nom</th><th>Zone</th><th>Type</th><th>Capacité</th></tr></thead>
            <tbody>{resList.map((r) => <tr key={r.id}><td><strong>{r.code}</strong></td><td>{r.name}</td><td>{r.zone_name}</td><td>{label(r.resource_type)}</td><td>{r.capacity}</td></tr>)}</tbody>
          </table></div>
        ))}
      </div>

      <div className="section card">
        <h2>Tarifs</h2>
        {rates.loading && <Loading />}
        {rates.data && (rows(rates.data).length === 0 ? <Empty>Tarifs non communiqués.</Empty> : (
          <ul style={{ marginTop: '.7rem' }}>
            {rows(rates.data).map((r) => <li key={r.id}>{r.resource ? nameOf(r.resource) : label(r.resource_type)} : <strong>{money(r.amount, r.currency)}</strong> / {UNITS[r.unit] || r.unit}</li>)}
          </ul>
        ))}
      </div>
    </>
  )
}
