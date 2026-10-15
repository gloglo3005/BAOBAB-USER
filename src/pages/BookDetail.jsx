import { Link, useOutletContext, useParams } from 'react-router-dom'
import { get } from '../api'
import { Badge, ErrorBox, Loading, dateOnly, useFetch } from '../ui'

export default function BookDetail() {
  const { memberId } = useOutletContext()
  const { bookId } = useParams()
  const { data: b, loading, error } = useFetch(() => get(`/reader/${memberId}/books/${bookId}/`), [memberId, bookId])
  if (loading) return <Loading />
  if (error) return <ErrorBox>{error}</ErrorBox>
  if (!b) return null
  return (
    <>
      <p><Link to={`/l/${memberId}/catalog`}>← Catalogue</Link></p>
      <div className="card">
        <h1>{b.title}</h1>
        {b.subtitle && <p className="muted">{b.subtitle}</p>}
        <p>{b.authors.join(', ') || 'Auteur inconnu'}</p>
        <dl className="kv" style={{ marginTop: '1rem' }}>
          <dt>Catégorie</dt><dd>{b.category?.name || '—'}</dd>
          <dt>Éditeur</dt><dd>{[b.publisher, b.publication_year].filter(Boolean).join(' · ') || '—'}</dd>
          <dt>Langue</dt><dd>{b.language || '—'}</dd>
          <dt>ISBN</dt><dd>{b.isbn || '—'}</dd>
          <dt>Description</dt><dd>{b.description || '—'}</dd>
        </dl>
      </div>
      <div className="section card">
        <h2>Disponibilité : <span className={`avail ${b.available_total > 0 ? 'yes' : 'no'}`}>{b.available_total} exemplaire(s)</span></h2>
        {b.availability.length > 0 && (
          <ul>{b.availability.map((a, i) => <li key={i}>{a.location || 'Sans emplacement'} : {a.available}</li>)}</ul>
        )}
      </div>
      {b.my_loans.length > 0 && (
        <div className="section card">
          <h2>Vous avez emprunté ce livre</h2>
          {b.my_loans.map((l) => <p key={l.id}>Échéance le {dateOnly(l.due_date)} {l.is_overdue && <Badge value="En retard" tone="bad" />}</p>)}
        </div>
      )}
    </>
  )
}
