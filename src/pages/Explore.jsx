import { useState } from 'react'
import { Link } from 'react-router-dom'
import { get, post } from '../api'
import { Badge, Empty, ErrorBox, Loading, PageHeader, Pager, rows, useAction, useFetch } from '../ui'

export default function Explore() {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const action = useAction()
  const { data, loading, error, reload } = useFetch(() => get('/reader/organizations/', { q, module: 'library', page }), [q, page])
  const list = rows(data)

  const join = async (org) => {
    if (await action.run(() => post('/reader/memberships/', { organization: String(org.id) }))) reload()
  }

  return (
    <>
      <PageHeader title="Explorer" subtitle="Bibliothèques disponibles : demandez à les rejoindre" />
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
              <div style={{ marginTop: 'auto' }}>
                {o.my_membership ? (
                  <><Badge value={o.my_membership.status} />{' '}
                    {o.my_membership.status !== 'REJECTED' && <Link to={`/l/${o.my_membership.id}`}>Ouvrir</Link>}</>
                ) : (
                  <button className="btn" disabled={action.busy} onClick={() => join(o)}>Demander l'adhésion</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
      <Pager page={page} count={data?.count || 0} pageSize={20} onPage={setPage} />
    </>
  )
}
