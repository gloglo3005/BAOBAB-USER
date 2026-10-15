import { useState } from 'react'
import { Link } from 'react-router-dom'
import { get, post } from '../api'
import { Badge, Empty, ErrorBox, Loading, PageHeader, Pager, rows, useAction, useDebounced, useFetch } from '../ui'

export default function Explore() {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const action = useAction()
  const dq = useDebounced(q)
  const { data, loading, error, reload } = useFetch(() => get('/reader/organizations/', { q: dq, page }), [dq, page])
  const list = rows(data)

  const join = async (org) => {
    if (await action.run(() => post('/reader/memberships/', { organization: String(org.id) }))) reload()
  }

  return (
    <>
      <PageHeader title="Explorer" subtitle="Bibliothèques et espaces de coworking" />
      <div className="toolbar"><input type="search" placeholder="Nom ou ville…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} /></div>
      <ErrorBox>{action.error || error}</ErrorBox>
      {loading && <Loading />}
      {data && (list.length === 0 ? <Empty /> : (
        <div className="lib-grid">
          {list.map((o) => (
            <div key={o.id} className="card lib-card">
              <h2>{o.name}</h2>
              <p className="muted">{[o.city, o.country].filter(Boolean).join(', ')}</p>
              {o.description && <p>{o.description}</p>}
              <p>{o.library_module && <span className="badge badge-neutral">Bibliothèque</span>}{' '}{o.coworking_module && <span className="badge badge-neutral">Coworking</span>}</p>
              <div style={{ marginTop: 'auto' }}>
                {o.library_module && (o.my_membership ? (
                  <><Badge value={o.my_membership.status} />{' '}
                    {o.my_membership.status !== 'REJECTED' && <Link to={`/l/${o.my_membership.id}`}>Ouvrir la bibliothèque</Link>}</>
                ) : (
                  <button className="btn" disabled={action.busy} onClick={() => join(o)}>Demander l'adhésion</button>
                ))}
                {o.coworking_module && <p><Link to={`/c/${o.id}`}>Voir l'espace de coworking</Link></p>}
              </div>
            </div>
          ))}
        </div>
      ))}
      <Pager page={page} count={data?.count || 0} pageSize={20} onPage={setPage} />
    </>
  )
}
