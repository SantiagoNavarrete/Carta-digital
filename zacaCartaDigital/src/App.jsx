import { useState } from 'react'
import { menuSections, complements } from './data/menuData'
import './App.css'

function ChefHat() {
  return (
    <svg className="chef-hat" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M14 31a12 12 0 0 1 6-22 13 13 0 0 1 24 0 12 12 0 0 1 6 22v22H14V31Z" fill="currentColor" />
      <path d="M13 35h38v9H13zM19 54h26" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M26 16c-3 3-4 7-3 10m15-10c3 3 4 7 3 10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".85" />
    </svg>
  )
}

function Header({ search, onSearchChange }) {
  return (
    <header className="site-header">
      <div className="brand-mark"><ChefHat /></div>
      <p className="header-kicker">COCINA MEXICANA · ITALIANA · ARGENTINA</p>
      <h1>EntreNos</h1>
      <p className="tagline">Más que comida, buenos momentos</p>
      <div className="flag-rule" aria-hidden="true"><span /><span /><span /></div>
      <label className="search-box">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Busca tu próximo antojo"
          aria-label="Buscar platos"
        />
        {search && <button type="button" onClick={() => onSearchChange('')} aria-label="Limpiar búsqueda">×</button>}
      </label>
    </header>
  )
}

function MenuItem({ item }) {
  return (
    <li className="menu-item">
      <div className="item-main">
        <span className="item-name">{item.name}</span>
        {item.description && <span className="item-description">{item.description}</span>}
      </div>
      <span className="dot-leader" aria-hidden="true" />
      <span className="item-price">{item.price}</span>
    </li>
  )
}

function CategorySection({ section }) {
  return (
    <section className="category-section" id={section.id}>
      <div className="section-heading">
        <span className="section-index">{section.number}</span>
        <h2>{section.title}</h2>
        {section.subtitle && <span className="section-subtitle">{section.subtitle}</span>}
      </div>
      {section.note && <p className="section-note">{section.note}</p>}
      <ul className="menu-list">{section.items.map((item) => <MenuItem key={item.name} item={item} />)}</ul>
      {section.footnote && <p className="section-footnote">{section.footnote}</p>}
    </section>
  )
}

function Complements() {
  return (
    <aside className="complements" aria-labelledby="complements-title">
      <div>
        <p className="complements-eyebrow">EL TOQUE FINAL</p>
        <h2 id="complements-title">Complementos a elección <span>¡GRATIS!</span></h2>
      </div>
      <ul className="complement-list">
        {complements.map((complement) => (
          <li key={complement.name}><span aria-hidden="true">{complement.icon}</span>{complement.name}</li>
        ))}
      </ul>
    </aside>
  )
}

function Footer() {
  return <footer className="site-footer">Pasión por la buena comida <span aria-label="amor">♥</span></footer>
}

function App() {
  const [search, setSearch] = useState('')
  const normalizedSearch = search.trim().toLocaleLowerCase('es')
  const visibleSections = menuSections.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      `${item.name} ${item.description ?? ''}`.toLocaleLowerCase('es').includes(normalizedSearch),
    ),
  }))

  return (
    <div className="menu-page">
      <div className="corner-ribbon corner-ribbon-top" aria-hidden="true" />
      <div className="corner-ribbon corner-ribbon-bottom" aria-hidden="true" />
      <Header search={search} onSearchChange={setSearch} />
      <nav className="category-nav" aria-label="Categorías del menú">
        {visibleSections.map((section) => (
          <a key={section.id} href={`#${section.id}`} aria-disabled={section.items.length === 0} className={section.items.length === 0 ? 'is-disabled' : ''}>
            {section.title}
          </a>
        ))}
      </nav>
      <main className="menu-content">
        {visibleSections.some((section) => section.items.length > 0)
          ? visibleSections.filter((section) => section.items.length > 0).map((section) => <CategorySection key={section.id} section={section} />)
          : <p className="empty-state">No encontramos platos con “{search}”. Prueba con otro nombre.</p>}
        <Complements />
      </main>
      <Footer />
    </div>
  )
}

export default App