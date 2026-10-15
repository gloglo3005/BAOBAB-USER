import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { get } from '../api'
import { Empty, ErrorBox, Loading, Pager, rows, useFetch } from '../ui'

export default function Catalog() {
  const { memberId } = useOutletContext()
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [available, setAvailable] = useState(false)
  const [page, setPage] = useState(1)
  const cats = useFetch(() => get(`/reader/${memberId}/categories/`), [memberId])
  const { data, loading, error } = useFetch(
    () => get(`/reader/${memberId}/books/`, { q, category, available: available ? '1' : undefined, page }),
    [memberId, q, category, available, page],
  )
  const books = rows(data)
  return (
    <>
      <div className="toolbar">
        <input type="search" placeholder="Titre, auteur…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1) }}>
          <option value="">Toutes catégories</option>
          {rows(cats.data).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="check field" style={{ margin: 0 }}>
          <input type="checkbox" checked={available} onChange={(e) => { setAvailable(e.target.checked); setPage(1) }} /> Disponibles seulement
        </label>
      </div>
      <ErrorBox>{error}</ErrorBox>
      {loading && <Loading />}
      {data && (books.length === 0 ? <Empty /> : (
        <div className="lib-grid">
          {books.map((b) => (
            <div key={b.id} className="card book-card lib-card">
              <Link to={`/l/${memberId}/catalog/${b.id}`}>
                <h3>{b.title}</h3>
                {b.subtitle && <p className="muted">{b.subtitle}</p>}
              </Link>
              <p className="muted">{b.authors.join(', ') || 'Auteur inconnu'}{b.publication_year ? ` · ${b.publication_year}` : ''}</p>
              <p style={{ marginTop: 'auto' }}>
                {b.category && <span className="badge badge-neutral">{b.category.name}</span>}{' '}
                <span className={`avail ${b.copies_available > 0 ? 'yes' : 'no'}`}>{b.copies_available > 0 ? `${b.copies_available} disponible(s)` : 'Indisponible'}</span>
              </p>
            </div>
          ))}
        </div>
      ))}
      <Pager page={page} count={data?.count || 0} pageSize={20} onPage={setPage} />
    </>
  )
}
