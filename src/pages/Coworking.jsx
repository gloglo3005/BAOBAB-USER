import { useState } from 'react'
import { Link } from 'react-router-dom'
import { get } from '../api'
import { Badge, Empty, ErrorBox, Loading, PageHeader, Pager, rows, useDebounced, useFetch } from '../ui'

// Liste des espaces de coworking disponibles.
export default function Coworking() {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const dq = useDebounced(q)
  const { data, loading, error } = useFetch(() => get('/reader/organizations/', { q: dq, module: 'coworking', page }), [dq, page])
  const list = rows(data)
  return (
    <>
      <PageHeader title="Coworking" subtitle="Réservez un poste de travail ou une salle" />
      <div className="toolbar"><input type="search" placeholder="Nom ou ville…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} /></div>
      <ErrorBox>{error}</ErrorBox>
      {loading && <Loading />}
      {data && (list.length === 0 ? <Empty>Aucun espace de coworking pour le moment.</Empty> : (
        <div className="lib-grid">
          {list.map((o) => (
            <div key={o.id} className="card lib-card">
              <h2>{o.name}</h2>
              <p className="muted">{[o.city, o.country].filter(Boolean).join(', ')}</p>
              {o.description && <p>{o.description}</p>}
              <div style={{ marginTop: 'auto' }}>
                {o.my_customer && <><Badge value={o.my_customer.status} />{' '}</>}
                <Link className="btn" to={`/c/${o.id}`} style={{ textDecoration: 'none' }}>{o.my_customer ? 'Ouvrir' : 'Découvrir'}</Link>
              </div>
            </div>
          ))}
        </div>
      ))}
      <Pager page={page} count={data?.count || 0} pageSize={20} onPage={setPage} />
    </>
  )
}
