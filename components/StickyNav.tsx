'use client'

import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Testimony',    href: '#testimonials' },
]

export default function StickyNav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      //highlight active section
      const sections = ['home', 'about', 'testimonials']
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 140) {
          setActiveSection(id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`sticky-nav ${scrolled ? 'sticky-nav-scrolled' : ''}`}>
      <div className="sticky-nav-inner">
        <a
          href="#hero"
          className="sticky-nav-logo"
          onClick={(e) => handleClick(e, '#home')}
        >
          Next Mile Distance Project
        </a>

        <div className="sticky-nav-links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className={`sticky-nav-link ${activeSection === link.href.replace('#', '') ? 'sticky-nav-link-active' : ''}`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#intake-form"
            onClick={(e) => handleClick(e, '#intake-form')}
            className="sticky-nav-cta"
          >
            Apply
          </a>
        </div>
      </div>
    </nav>
  )
}