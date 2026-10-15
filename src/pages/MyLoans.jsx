import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { get } from '../api'
import { Badge, Empty, ErrorBox, Loading, Pager, dateOnly, rows, useFetch } from '../ui'

const TABS = [['active', 'En cours'], ['overdue', 'En retard'], ['history', 'Historique']]

export default function MyLoans() {
  const { memberId } = useOutletContext()
  const [status, setStatus] = useState('active')
  const [page, setPage] = useState(1)
  const { data, loading, error } = useFetch(() => get(`/reader/${memberId}/loans/`, { status, page }), [memberId, status, page])
  const loans = rows(data)
  return (
    <>
      <div className="tabs">
        {TABS.map(([k, text]) => <button key={k} className={status === k ? 'on' : ''} onClick={() => { setStatus(k); setPage(1) }}>{text}</button>)}
      </div>
      <ErrorBox>{error}</ErrorBox>
      {loading && <Loading />}
      {data && (loans.length === 0 ? <Empty /> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Livre</th><th>Emprunté le</th><th>Échéance</th><th>Rendu le</th><th>Statut</th></tr></thead>
          <tbody>{loans.map((l) => (
            <tr key={l.id}>
              <td><strong>{l.book.title}</strong><div className="muted">{l.authors.join(', ')}</div></td>
              <td>{dateOnly(l.borrowed_at)}</td><td>{dateOnly(l.due_date)}</td><td>{dateOnly(l.returned_at)}</td>
              <td>{l.is_overdue ? <Badge value={`${l.days_overdue} j de retard`} tone="bad" /> : l.status === 'ACTIVE' ? <Badge value={`${l.days_left} j restants`} tone="info" /> : <Badge value={l.status} />}</td>
            </tr>
          ))}</tbody>
        </table></div>
      ))}
      <Pager page={page} count={data?.count || 0} pageSize={20} onPage={setPage} />
    </>
  )
}
