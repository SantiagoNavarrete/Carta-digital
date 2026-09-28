import { FACEBOOK_URL, INSTAGRAM_URL } from '../config'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle className="social-icon-dot" cx="17.5" cy="6.5" r="1" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.2 21v-8.2H17l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.8-.1-1.7-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.5v2.2H7.6v3.2h2.9V21h3.7Z" />
    </svg>
  )
}

function SocialLinks() {
  return (
    <nav className="social-links" aria-label="Redes sociales">
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Visitar Instagram de EntreNos">
        <InstagramIcon />
      </a>
      <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Visitar Facebook de EntreNos">
        <FacebookIcon />
      </a>
    </nav>
  )
}

export default SocialLinks