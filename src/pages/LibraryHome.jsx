import { Link, useOutletContext } from 'react-router-dom'
import { Badge, dateOnly } from '../ui'

export default function LibraryHome() {
  const { memberId, summary: s } = useOutletContext()
  return (
    <>
      {s.member.status !== 'ACCEPTED' && <div className="alert alert-info">Votre adhésion est « {s.member.status === 'PENDING' ? 'en attente' : 'suspendue'} » : certains services peuvent être limités.</div>}
      <div className="cards">
        <div className="card stat"><div className="num">{s.loans.active}</div><div className="lbl">Prêts en cours</div></div>
        <div className={`card stat ${s.loans.overdue ? 'warn' : ''}`}><div className="num">{s.loans.overdue}</div><div className="lbl">En retard</div></div>
      </div>
      <h2>Prochains retours</h2>
      {s.upcoming.length === 0 ? <p className="empty">Aucun prêt en cours.</p> : (
        <div className="table-wrap" style={{ marginTop: '.7rem' }}><table>
          <thead><tr><th>Livre</th><th>Échéance</th><th /></tr></thead>
          <tbody>{s.upcoming.map((l) => (
            <tr key={l.id}>
              <td><Link to={`/l/${memberId}/catalog/${l.book.id}`}><strong>{l.book.title}</strong></Link><div className="muted">{l.authors.join(', ')}</div></td>
              <td>{dateOnly(l.due_date)}</td>
              <td>{l.is_overdue ? <Badge value={`${l.days_overdue} j de retard`} tone="bad" /> : <Badge value={`${l.days_left} j restants`} tone={l.days_left <= 3 ? 'warn' : 'ok'} />}</td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </>
  )
}
