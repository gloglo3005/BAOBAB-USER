import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { get, post } from '../api'
import { Badge, Empty, ErrorBox, Field, Loading, Modal, Pager, dateTime, label, money, rows, useAction, useFetch } from '../ui'

const TABS = [['reservations', 'Réservations'], ['sessions', 'Mes passages'], ['payments', 'Paiements']]

export default function CwMine() {
  const { orgId, info } = useOutletContext()
  const [tab, setTab] = useState('reservations')
  const [page, setPage] = useState(1)
  const [cancelling, setCancelling] = useState(null)
  const [reason, setReason] = useState('')
  const action = useAction()
  const { data, loading, error, reload } = useFetch(() => (info.my_customer ? get(`/reader/coworking/${orgId}/${tab}/`, { page }) : Promise.resolve({ results: [], count: 0 })), [orgId, tab, page, info.my_customer?.id])
  const list = rows(data)

  const cancel = async (e) => {
    e.preventDefault()
    if (await action.run(() => post(`/reader/coworking/${orgId}/reservations/${cancelling.id}/cancel/`, { reason }))) { setCancelling(null); setReason(''); reload() }
  }

  return (
    <>
      <div className="tabs">
        {TABS.map(([k, text]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); setPage(1) }}>{text}</button>)}
      </div>
      <ErrorBox>{error}</ErrorBox>
      {loading && <Loading />}
      {data && (list.length === 0 ? <Empty /> : (
        <div className="table-wrap"><table>
          {tab === 'reservations' && (<>
            <thead><tr><th>Ressource</th><th>Début</th><th>Fin</th><th>Montant</th><th>Statut</th><th /></tr></thead>
            <tbody>{list.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.resource_code}</strong><div className="muted">{r.resource_name}</div></td>
                <td>{dateTime(r.starts_at)}</td><td>{dateTime(r.ends_at)}</td>
                <td>{money(r.quoted_amount, r.currency)}<div className="muted">payé {money(r.amount_paid, r.currency)}</div></td>
                <td><Badge value={r.status} /></td>
                <td className="actions">{r.status === 'CONFIRMED' && <button className="btn btn-ghost btn-sm" onClick={() => setCancelling(r)}>Annuler</button>}</td>
              </tr>
            ))}</tbody>
          </>)}
          {tab === 'sessions' && (<>
            <thead><tr><th>Ressource</th><th>Arrivée</th><th>Sortie</th><th>Montant</th><th>Statut</th></tr></thead>
            <tbody>{list.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.resource_code}</strong></td><td>{dateTime(s.checked_in_at)}</td><td>{dateTime(s.checked_out_at)}</td>
                <td>{s.status === 'OPEN' ? '—' : <>{money(s.amount, s.currency)}<div className="muted">solde {money(s.balance, s.currency)}</div></>}</td>
                <td><Badge value={s.status} /></td>
              </tr>
            ))}</tbody>
          </>)}
          {tab === 'payments' && (<>
            <thead><tr><th>Reçu</th><th>Montant</th><th>Moyen</th><th>Date</th><th>Statut</th></tr></thead>
            <tbody>{list.map((p) => (
              <tr key={p.id}><td>{p.receipt_number}</td><td><strong>{money(p.amount, p.currency)}</strong></td><td>{label(p.method)}</td><td>{dateTime(p.paid_at)}</td><td><Badge value={p.status} /></td></tr>
            ))}</tbody>
          </>)}
        </table></div>
      ))}
      <Pager page={page} count={data?.count || 0} pageSize={20} onPage={setPage} />
      {cancelling && (
        <Modal title="Annuler la réservation" onClose={() => setCancelling(null)}>
          <form onSubmit={cancel}>
            <ErrorBox>{action.error}</ErrorBox>
            <p className="muted">{cancelling.resource_code} · {dateTime(cancelling.starts_at)}. L'annulation n'est possible que jusqu'à {info.cancellation_deadline_hours} h avant le début.</p>
            <Field label="Motif (obligatoire)"><input required maxLength={200} value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
            <div className="form-actions"><button type="button" className="btn btn-ghost" onClick={() => setCancelling(null)}>Retour</button><button className="btn btn-danger" disabled={action.busy}>Annuler la réservation</button></div>
          </form>
        </Modal>
      )}
    </>
  )
}
