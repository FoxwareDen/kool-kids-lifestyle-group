import { LifeBuoy, X } from 'lucide-react'
import logo from '#/images/logo-2.png'
import { getDashboardNav } from './nav-config'
import { SidebarNavLink } from './SidebarNavLink'
import { Link } from '@tanstack/react-router'
import { resolveTranslatable, type Language } from '#/lib/experiences'

/**
 * Left-hand navigation rail for the admin dashboard.
 */
export function DashboardSidebar({
  lang = 'en',
  mobileOpen = false,
  onClose,
}: {
  lang?: Language
  mobileOpen?: boolean
  onClose?: () => void
}) {
  const nav = getDashboardNav(lang)
  const manageLabel = resolveTranslatable(
    { default: 'Manage', translations: { af: 'Bestuur' } },
    lang,
  )
  const helpTitle = resolveTranslatable(
    { default: 'Need a hand?', translations: { af: 'Het jy hulp nodig?' } },
    lang,
  )
  const helpText = resolveTranslatable(
    {
      default: 'Open the Dashboard tab for step-by-step guides on every task.',
      translations: {
        af: 'Maak die Paneel-oortjie oop vir stap-vir-stap gidse vir elke taak.',
      },
    },
    lang,
  )

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-72 max-w-[calc(100vw-3rem)] shrink-0 flex-col border-r border-[var(--line)] bg-[var(--surface-strong)] transition-transform duration-200 md:static md:z-auto md:h-full md:w-64 md:max-w-none md:translate-x-0 md:transition-none ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center gap-3 border-b border-[var(--line)] px-5 py-4">
        <img
          decoding="async"
          loading="lazy"
          src={logo}
          alt="Kool Kids Lifestyle Group"
          className="size-9 rounded-sm object-contain"
        />
        <div className="leading-tight">
          <p className="text-sm font-bold text-[var(--sea-ink)]">Kool Kids</p>
          <p className="text-xs text-[var(--sea-ink-soft)]">
            {resolveTranslatable(
              {
                default: 'Admin workspace',
                translations: { af: 'Admin werkspasie' },
              },
              lang,
            )}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close dashboard navigation"
          className="ml-auto inline-flex size-9 items-center justify-center text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] md:hidden"
          onClick={onClose}
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <nav
        aria-label="Dashboard"
        className="flex flex-1 flex-col gap-1 overflow-y-auto p-3"
        onClick={onClose}
      >
        <p className="px-3 pb-1 pt-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--sea-ink-soft)]">
          {manageLabel}
        </p>
        {nav.map((item) => (
          <SidebarNavLink key={item.to} item={item} />
        ))}
      </nav>

      <div className="border-t border-[var(--line)] p-3">
        <Link
          to="/dashboard#guides"
          className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-3"
        >
          <div className="flex items-center gap-2 text-[var(--sea-ink)]">
            <LifeBuoy className="size-4 text-[var(--brand-orange)]" />
            <p className="text-sm font-semibold">{helpTitle}</p>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[var(--sea-ink-soft)]">
            {helpText}
          </p>
        </Link>
      </div>
    </aside>
  )
}
