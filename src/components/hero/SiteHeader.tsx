import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Menu, X, Globe } from 'lucide-react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import type { Language } from '#/lib/experiences'
import { useExperienceCategories } from '#/hooks/useExperiences'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const LANGUAGES: { code: Language; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'af', label: 'Afrikaans', short: 'AF' },
]

const NAV_ITEMS: Record<Language, any> = {
  en: [
    { label: 'HOME', href: '/', authed: false },
    { label: "DashBoard", href: "/dashboard", authed: true },
    { label: 'ABOUT PRIESKA', href: '/about-prieska', authed: false },
    { label: 'EXPERIENCES', href: '/experiences', hasDropdown: true, authed: false },
    { label: 'HERITAGE', href: '/heritage', authed: false },
    { label: 'GALLERY', href: '/gallery', authed: false },
    { label: 'EVENTS', href: '/events', authed: false },
    { label: 'BLOG', href: '/blogs', authed: false },
    { label: 'CONTACT', href: '/contact', authed: false },
  ],
  af: [
    { label: 'TUIS', href: '/', authed: false },
    { label: "Proneel", href: "/dashboard", authed: true },
    { label: 'OOR PRIESKA', href: '/about-prieska', authed: false },
    { label: 'ERVARINGS', href: '/experiences', hasDropdown: true, authed: false },
    { label: 'ERFENIS', href: '/heritage', authed: false },
    { label: 'GALERY', href: '/gallery', authed: false },
    { label: 'GEBEURE', href: '/events', authed: false },
    { label: 'BLOG', href: '/blogs', authed: false },
    { label: 'KONTAK', href: '/contact', authed: false },
  ]
}

export function SiteHeader({ isAuthed }: { isAuthed: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { categories, isLoading: categoriesLoading } = useExperienceCategories()
  const langRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  
  // FIX: Read language from URL using useSearch
  const search = useSearch({ from: '__root__' }) as { lang?: Language }
  const lang = search.lang || 'en' // Default to English if not specified

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0]

  function switchLang(code: Language) {
    // FIX: Use replace to avoid creating history entries
    navigate({ 
      to: window.location.pathname, // Stay on current page
      search: (prev) => ({ ...prev, lang: code }),
      replace: true // Replace instead of push
    })
    setLangOpen(false)
    setMobileOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-[var(--brand-navy)] overflow-visible">
      {/* Brand */}
      <a href="/" className="absolute left-0 top-0 z-10 flex items-center no-underline" aria-label="360 Experiences home">
        <img
          src="/logo-2.png"
          alt="360 Experiences logo"
          className={`
            w-auto object-contain transition-all duration-500 ease-in-out
            ${mobileOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
            ${scrolled ? 'h-13 mb-0' : 'h-25 mb-[-3rem]'}
          `}
        />
      </a>
      
      <div className="mx-auto flex max-w-[1280px] py-2 items-center justify-end px-4 sm:px-6 lg:px-8">
        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_ITEMS[lang].map((item, index) => {
            return item.authed ? (
              isAuthed ? (
                <Link
                  key={item.label + index}
                  to={item.href}
                  search={(prev) => prev}
                  className="flex items-center gap-1 text-xs font-semibold tracking-wide !text-white/85 no-underline transition-colors hover:!text-[var(--brand-orange)]"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="h-3 w-3" />}
                </Link>
              ) : null
            ) : (
              <Link
                key={item.label + index}
                to={item.href}
                search={(prev) => prev}
                className="flex items-center gap-1 text-xs font-semibold tracking-wide !text-white/85 no-underline transition-colors hover:!text-[var(--brand-orange)]"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-3 w-3" />}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-30">
          <a
            href="https://wa.me/27721234567"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact us on WhatsApp"
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#25D366] !text-white no-underline shadow-lg shadow-black/20 transition-colors hover:bg-[#1ebe5b] sm:flex"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>

          {/* Language switcher */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
              aria-label="Switch language"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold tracking-wide text-white/85 border border-white/20 hover:border-white/50 hover:text-white transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              {currentLang.short}
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <ul
                role="listbox"
                aria-label="Language"
                className="absolute right-0 top-full mt-1 w-36 bg-[var(--brand-navy)] border border-white/15 shadow-xl z-50"
              >
                {LANGUAGES.map((l) => (
                  <li key={l.code} role="option" aria-selected={l.code === lang}>
                    <button
                      type="button"
                      onClick={() => switchLang(l.code)}
                      className={`
                        w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide text-left transition-colors
                        ${l.code === lang
                          ? 'text-[var(--brand-orange)] bg-white/5'
                          : 'text-white/75 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <span className="w-5 text-center opacity-60">{l.short}</span>
                      {l.label}
                      {l.code === lang && <span className="ml-auto text-[var(--brand-orange)]">✓</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md text-white lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          className="border-t border-white/10 bg-[var(--brand-navy)]/95 px-4 py-4 backdrop-blur lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS[lang].map((item, index) => {
              if (item.authed && !isAuthed) return null
              
              return (
                <li key={item.label + index}>
                  <a
                    href={item.href}
                    className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
                  >
                    {item.label}
                    {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                  </a>
                </li>
              )
            })}
            
            <li className="mt-2 border-t border-white/10 pt-2">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">Language</p>
              <div className="flex gap-1 px-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => switchLang(l.code)}
                    className={`
                      flex-1 py-2 text-xs font-semibold tracking-wide border transition-colors
                      ${l.code === lang
                        ? 'border-[var(--brand-orange)] text-[var(--brand-orange)]'
                        : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white/80'
                      }
                    `}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}