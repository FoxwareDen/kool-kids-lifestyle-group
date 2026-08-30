import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, Globe } from 'lucide-react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { resolveTranslatable, type Language } from '#/lib/experiences'

const LANGUAGES: { code: Language; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'af', label: 'Afrikaans', short: 'AF' },
]

/**
 * Sticky header shown above dashboard content.
 */
export function DashboardTopbar({
  sectionTitle,
  userName,
  lang = 'en',
}: {
  sectionTitle: string
  userName?: string
  lang?: Language
}) {
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const currentSearch = useSearch({ from: '/_authed/dashboard' }) as { lang?: Language }
  const initial = userName?.trim()?.[0]?.toUpperCase() ?? 'A'
  const workspaceLabel = resolveTranslatable({ default: 'Workspace', translations: { af: 'Werkspasie' } }, lang)
  const adminLabel = resolveTranslatable({ default: 'Administrator', translations: { af: 'Administrateur' } }, lang)
  const currentLang = LANGUAGES.find((l) => l.code === (currentSearch.lang ?? lang)) ?? LANGUAGES[0]

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function switchLang(code: Language) {
    navigate({
      to: window.location.pathname,
      search: (prev: Record<string, unknown> = {}) => ({ ...prev, lang: code }),
      replace: true,
    })
    setLangOpen(false)
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--line)] bg-[var(--surface-strong)] px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-[var(--sea-ink-soft)]">{workspaceLabel}</span>
        <ChevronRight className="size-4 text-[var(--sea-ink-soft)]" aria-hidden="true" />
        <span className="font-bold text-[var(--sea-ink)]">{sectionTitle}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangOpen((v) => !v)}
            aria-expanded={langOpen}
            aria-haspopup="listbox"
            aria-label="Switch language"
            className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-semibold tracking-wide text-[var(--sea-ink)] transition-colors hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange)]"
          >
            <Globe className="size-3.5" aria-hidden="true" />
            {currentLang.short}
            <ChevronDown className={`size-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>

          {langOpen && (
            <ul
              role="listbox"
              aria-label="Language"
              className="absolute right-0 top-full z-50 mt-1 w-36 border border-[var(--line)] bg-[var(--surface-strong)] shadow-lg"
            >
              {LANGUAGES.map((item) => (
                <li key={item.code} role="option" aria-selected={item.code === (currentSearch.lang ?? lang)}>
                  <button
                    type="button"
                    onClick={() => switchLang(item.code)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold tracking-wide transition-colors ${
                      item.code === (currentSearch.lang ?? lang)
                        ? 'bg-[var(--link-bg-hover)] text-[var(--brand-orange)]'
                        : 'text-[var(--sea-ink)] hover:bg-[var(--dash-panel-muted)] hover:text-[var(--sea-ink)]'
                    }`}
                  >
                    <span className="w-5 text-center opacity-70">{item.short}</span>
                    {item.label}
                    {item.code === (currentSearch.lang ?? lang) && <span className="ml-auto">✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <span className="hidden text-sm font-medium text-[var(--sea-ink-soft)] sm:inline">
          {userName ?? adminLabel}
        </span>
        <span
          className="flex size-8 items-center justify-center rounded-sm bg-[var(--brand-orange)] text-sm font-bold text-white"
          aria-hidden="true"
        >
          {initial}
        </span>
      </div>
    </header>
  )
}
