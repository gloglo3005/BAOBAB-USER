import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../public.css'

const ANNEE = new Date().getFullYear()

const ICONS = {
  book: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
  building: <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4M10 10h4M10 14h4M10 18h4" /></>,
  desk: <><rect x="3" y="3" width="18" height="12" rx="2" /><path d="M8 21h8M12 15v6" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
}

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  )
}

// Photo réelle uniquement : plus aucun dessin ni image de remplacement.
function Photo({ src, alt, width, height, eager = false }) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
    />
  )
}

const NAV = [
  { id: 'top', label: 'Accueil' },
  { id: 'livres', label: 'Explorer les livres' },
  { id: 'bibliotheques', label: 'Bibliothèques' },
  { id: 'espaces', label: 'Espaces de travail' },
  { id: 'a-propos', label: 'À propos' },
]

function useReveal() {
  useEffect(() => {
    const root = document.querySelector('.pb')
    const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!root || calm || !('IntersectionObserver' in window)) return undefined
    root.classList.add('pb-js')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      root.classList.remove('pb-js')
    }
  }, [])
}

function goTo(id, after) {
  return (e) => {
    e.preventDefault()
    const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior = calm ? 'auto' : 'smooth'
    if (id === 'top') window.scrollTo({ top: 0, behavior })
    else document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
    if (after) after()
  }
}

export default function PublicHome() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useReveal()

  useEffect(() => {
    const before = document.title
    document.title = 'Baobab · Livres, bibliothèques et espaces de travail'
    return () => { document.title = before }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className="pb" id="top">
      <header className={`pb-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="pb-bar">
          <Link to="/" className="pb-brand" onClick={close}><img src="/favicon.png" alt="" />Baobab</Link>
          <nav className="pb-nav" aria-label="Navigation principale">
            {NAV.map((n) => <a key={n.id} href={`#${n.id}`} onClick={goTo(n.id)}>{n.label}</a>)}
          </nav>
          <div className="pb-actions">
            <Link to="/login" className="btn btn-ghost">Se connecter</Link>
            <Link to="/register" className="btn">Créer un compte</Link>
          </div>
          <button type="button" className="pb-burger" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} aria-controls="pb-menu" onClick={() => setOpen((v) => !v)}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
        <div id="pb-menu" className={`pb-menu ${open ? 'open' : ''}`}>
          {NAV.map((n) => <a key={n.id} href={`#${n.id}`} onClick={goTo(n.id, close)}>{n.label}</a>)}
          <div className="pb-menu-actions">
            <Link to="/login" className="btn btn-ghost" onClick={close}>Se connecter</Link>
            <Link to="/register" className="btn" onClick={close}>Créer un compte</Link>
          </div>
        </div>
      </header>

      <section className="pb-hero">
        <div className="pb-hero-in">
          <div className="pb-hero-text">
            <span className="pb-eyebrow pb-rise">Bibliothèques · Ressources · Coworking</span>
            <h1 className="pb-rise" style={{ '--d': '80ms' }}>Le savoir et les espaces pour le faire grandir.</h1>
            <p className="pb-lead pb-rise" style={{ '--d': '160ms' }}>
              Découvrez des livres, explorez des bibliothèques et trouvez des espaces pour étudier, apprendre et travailler.
            </p>
            <div className="pb-cta pb-rise" style={{ '--d': '240ms' }}>
              <Link to="/explore" className="btn btn-lg">Explorer les ressources</Link>
              <Link to="/coworking" className="btn btn-lg btn-ghost">Trouver un espace de travail</Link>
            </div>
            <p className="pb-note pb-rise" style={{ '--d': '300ms' }}>Connectez-vous ou créez un compte pour accéder aux catalogues et aux espaces.</p>
          </div>
          <figure className="pb-hero-art pb-rise" style={{ '--d': '160ms' }}>
            <Photo
              src="/images/hero.webp"
              alt="Des étagères de livres baignées de lumière, devant une grande fenêtre"
              width={1000}
              height={850}
              eager
            />
          </figure>
        </div>
      </section>

      <section className="pb-section pb-sage">
        <div className="pb-wrap">
          <h2 className="pb-title" data-reveal>Trois façons d’avancer</h2>
          <div className="pb-trio">
            <article className="pb-card" data-reveal>
              <div className="pb-ico"><Icon name="building" /></div>
              <span className="pb-tag ok">Disponible</span>
              <h3>Bibliothèques</h3>
              <p>Retrouvez le catalogue de chaque bibliothèque, suivez vos prêts et vos dates de retour.</p>
            </article>
            <article className="pb-card" data-reveal style={{ '--d': '100ms' }}>
              <div className="pb-ico"><Icon name="book" /></div>
              <span className="pb-tag soon">Progressivement</span>
              <h3>Ressources intellectuelles</h3>
              <p>Des livres d’abord, puis un accès élargi à d’autres ressources, à mesure que les fonctions arrivent.</p>
            </article>
            <article className="pb-card" data-reveal style={{ '--d': '200ms' }}>
              <div className="pb-ico"><Icon name="desk" /></div>
              <span className="pb-tag ok">Disponible</span>
              <h3>Espaces de travail</h3>
              <p>Consultez les espaces de coworking et réservez une place ou une salle depuis votre téléphone.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="livres" className="pb-section">
        <div className="pb-wrap pb-split">
          <div data-reveal>
            <span className="pb-kicker">Explorer les livres</span>
            <h2>Trouvez le bon livre, sachez s’il est disponible</h2>
            <ul className="pb-list">
              <li>Recherche par titre ou par auteur dans le catalogue de chaque bibliothèque</li>
              <li>Filtre par catégorie et par ouvrages disponibles</li>
              <li>Disponibilité des exemplaires et emplacement sur la fiche du livre</li>
              <li>Suivi de vos prêts en cours et de leurs échéances</li>
            </ul>
            <Link to="/explore" className="btn">Explorer le catalogue</Link>
          </div>
          <figure className="pb-photo" data-reveal style={{ '--d': '120ms' }}>
            <Photo
              src="/images/livres.webp"
              alt="Une rangée de livres posés côte à côte sur une table"
              width={1000}
              height={750}
            />
          </figure>
        </div>
      </section>

      <section id="bibliotheques" className="pb-section pb-ivory">
        <div className="pb-wrap">
          <h2 className="pb-title" data-reveal>Découvrez les bibliothèques</h2>
          <p className="pb-sub" data-reveal style={{ '--d': '80ms' }}>Chaque bibliothèque présente son nom, sa localisation et sa description. Vous choisissez celles que vous voulez rejoindre.</p>
          <figure className="pb-banner" data-reveal>
            <Photo
              src="/images/bibliotheques.webp"
              alt="De grandes étagères en bois remplies de livres dans une bibliothèque"
              width={1600}
              height={640}
            />
          </figure>
          <ol className="pb-steps">
            <li data-reveal><span>1</span><h3>Parcourez</h3><p>Recherchez une bibliothèque par son nom ou sa ville.</p></li>
            <li data-reveal style={{ '--d': '100ms' }}><span>2</span><h3>Demandez l’adhésion</h3><p>La bibliothèque valide votre demande.</p></li>
            <li data-reveal style={{ '--d': '200ms' }}><span>3</span><h3>Accédez au catalogue</h3><p>Consultez les livres et suivez vos emprunts.</p></li>
          </ol>
          <div className="pb-center" data-reveal><Link to="/explore" className="btn btn-ghost">Voir les bibliothèques</Link></div>
        </div>
      </section>

      <section id="espaces" className="pb-section">
        <div className="pb-wrap pb-split pb-rev">
          <figure className="pb-photo" data-reveal>
            <Photo
              src="/images/coworking.webp"
              alt="Un grand espace de travail partagé avec de longues tables en bois et des chaises"
              width={1000}
              height={750}
            />
          </figure>
          <div data-reveal style={{ '--d': '100ms' }}>
            <span className="pb-kicker">Espaces de travail</span>
            <h2>Trouvez votre espace de travail</h2>
            <ul className="pb-list">
              <li>Consultez les espaces de coworking, leurs zones et leurs horaires</li>
              <li>Réservez une place ou une salle quand l’espace le permet</li>
              <li>Retrouvez vos réservations au même endroit</li>
            </ul>
            <Link to="/coworking" className="btn">Découvrir les espaces</Link>
          </div>
        </div>
      </section>

      <section className="pb-section pb-sage">
        <div className="pb-wrap pb-split">
          <div data-reveal>
            <span className="pb-kicker">Apprendre, découvrir, travailler</span>
            <h2 className="pb-quote">Les bonnes ressources et un environnement adapté peuvent ouvrir de nouvelles possibilités.</h2>
            <p className="pb-text">Baobab vous aide à découvrir des livres, des bibliothèques et des espaces pour donner vie à vos idées.</p>
          </div>
          <figure className="pb-photo" data-reveal style={{ '--d': '100ms' }}>
            <Photo
              src="/images/apprendre.webp"
              alt="Un jeune lecteur adossé à un arbre, plongé dans son livre au coucher du soleil"
              width={1000}
              height={750}
            />
          </figure>
        </div>
      </section>

      <section id="a-propos" className="pb-section pb-ivory">
        <div className="pb-wrap pb-about">
          <h2 className="pb-title" data-reveal>À propos de Baobab</h2>
          <p className="pb-sub" data-reveal style={{ '--d': '80ms' }}>
            Baobab rapproche les personnes des ressources intellectuelles et des lieux qui favorisent l’apprentissage et le travail.
            La plateforme démarre au Togo et s’enrichit pas à pas.
          </p>
          <figure className="pb-banner" data-reveal>
            <Photo
              src="/images/a-propos.webp"
              alt="Une fenêtre ouverte sur la mer, avec des étagères de livres sous un plafond en bois"
              width={1400}
              height={560}
            />
          </figure>
          <div className="pb-now">
            <div data-reveal>
              <h3>Disponible aujourd’hui</h3>
              <ul className="pb-list">
                <li>Catalogues des bibliothèques et fiches des livres</li>
                <li>Adhésion aux bibliothèques et suivi des prêts</li>
                <li>Découverte et réservation d’espaces de coworking</li>
              </ul>
            </div>
            <div data-reveal style={{ '--d': '100ms' }}>
              <h3>Prévu progressivement</h3>
              <ul className="pb-list soon">
                <li>Accès élargi à d’autres ressources, y compris numériques</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-section pb-final">
        <div className="pb-band pb-band-photo" data-reveal>
          <h2>Prêt à découvrir Baobab ?</h2>
          <p>Créez votre compte pour explorer les bibliothèques et les espaces de travail.</p>
          <div className="pb-cta pb-center">
            <Link to="/register" className="btn btn-lg btn-ochre">Créer un compte</Link>
            <Link to="/login" className="btn btn-lg pb-ghost-light">Se connecter</Link>
          </div>
        </div>
      </section>

      <footer className="pb-footer">
        <div className="pb-foot-in">
          <div>
            <Link to="/" className="pb-brand"><img src="/favicon.png" alt="" />Baobab</Link>
            <p>Le savoir et les espaces pour le faire grandir.</p>
          </div>
          <nav aria-label="Liens du pied de page">
            {NAV.filter((n) => n.id !== 'top').map((n) => <a key={n.id} href={`#${n.id}`} onClick={goTo(n.id)}>{n.label}</a>)}
            <Link to="/confidentialite">Politique de confidentialité</Link>
          </nav>
        </div>
        <div className="pb-copy">© {ANNEE} Baobab. Tous droits réservés.</div>
      </footer>
    </div>
  )
}