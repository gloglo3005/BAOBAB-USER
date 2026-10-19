import { NavLink, Outlet, useParams } from 'react-router-dom'
import { get } from '../api'
import { ErrorBox, Loading, useFetch } from '../ui'
import PageBanner from '../PageBanner'

// Espace d'un coworking : charge la présentation et ma fiche client, puis affiche les sous-pages.
export default function CwSpace() {
  const { orgId } = useParams()
  const info = useFetch(() => get(`/reader/coworking/${orgId}/`), [orgId])
  if (info.loading && !info.data) return <Loading />
  if (info.error) return <ErrorBox>{info.error}</ErrorBox>
  const s = info.data
  const base = `/c/${orgId}`
  return (
    <>
      <PageBanner title={s.organization.name} subtitle={[s.organization.city, s.organization.country].filter(Boolean).join(', ')} image="/images/coworking.webp" position="center 60%" />
      <nav className="subnav">
        <NavLink to={base} end>Présentation</NavLink>
        <NavLink to={`${base}/book`}>Réserver</NavLink>
        <NavLink to={`${base}/mine`}>Mes réservations</NavLink>
      </nav>
      <Outlet context={{ orgId, info: s, reload: info.reload }} />
    </>
  )
}
