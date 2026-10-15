import { NavLink, Outlet, useParams } from 'react-router-dom'
import { get } from '../api'
import { ErrorBox, Loading, PageHeader, useFetch } from '../ui'

// Espace d'une bibliothèque : charge le résumé (vérifie aussi l'accès du lecteur).
export default function LibrarySpace() {
  const { memberId } = useParams()
  const summary = useFetch(() => get(`/reader/${memberId}/summary/`), [memberId])
  if (summary.loading && !summary.data) return <Loading />
  if (summary.error) return <ErrorBox>{summary.error}</ErrorBox>
  const s = summary.data
  const base = `/l/${memberId}`
  return (
    <>
      <PageHeader title={s.organization.name} subtitle={`${s.member.first_name} ${s.member.last_name} · membre n° ${s.member.member_number}`} />
      <nav className="subnav">
        <NavLink to={base} end>Accueil</NavLink>
        <NavLink to={`${base}/catalog`}>Catalogue</NavLink>
        <NavLink to={`${base}/loans`}>Mes prêts</NavLink>
      </nav>
      <Outlet context={{ memberId, summary: s }} />
    </>
  )
}
