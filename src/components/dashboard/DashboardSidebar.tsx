import { LifeBuoy } from 'lucide-react'
import logo from '#/images/logo-2.png'
import { getDashboardNav } from './nav-config'
import { SidebarNavLink } from './SidebarNavLink'
import { Link } from '@tanstack/react-router'
import { resolveTranslatable, type Language } from '#/lib/experiences'

/**
 * Left-hand navigation rail for the admin dashboard.
 */
export function DashboardSidebar({ lang = 'en' }: { lang?: Language }) {
  const nav = getDashboardNav(lang)
  const manageLabel = resolveTranslatable({ default: 'Manage', translations: { af: 'Bestuur' } }, lang)
  const helpTitle = resolveTranslatable({ default: 'Need a hand?', translations: { af: 'Het jy hulp nodig?' } }, lang)
  const helpText = resolveTranslatable({ default: 'Open the Dashboard tab for step-by-step guides on every task.', translations: { af: 'Maak die Paneel-oortjie oop vir stap-vir-stap gidse vir elke taak.' } }, lang)

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--surface-strong)]">
      <div className="flex items-center gap-3 border-b border-[var(--line)] px-5 py-4">
        <img
          src={logo}
          alt="Kool Kids Lifestyle Group"
          className="size-9 rounded-sm object-contain"
        />-
        <div className="leading-tight">
          <p className="text-sm font-bold text-[var(--sea-ink)]">Kool Kids</p>
          <p className="text-xs text-[var(--sea-ink-soft)]">{resolveTranslatable({ default: 'Admin workspace', translations: { af: 'Admin werkspasie' } }, lang)}</p>
        </div>
      </div>

      <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <p className="px-3 pb-1 pt-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--sea-ink-soft)]">
          {manageLabel}
        </p>
        {nav.map((item) => (
          <SidebarNavLink key={item.to} item={item} />
        ))}
      </nav>

      <div className="border-t border-[var(--line)] p-3">
        <Link to='/dashboard#guides' className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-3">
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
