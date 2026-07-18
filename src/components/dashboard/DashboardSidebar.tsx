import { LifeBuoy } from 'lucide-react'
import logo from '#/images/logo-2.png'
import { DASHBOARD_NAV } from './nav-config'
import { SidebarNavLink } from './SidebarNavLink'

/**
 * Left-hand navigation rail for the admin dashboard.
 *
 * Layout mirrors the reference design: a branded header, the primary
 * navigation list, and a pinned help panel at the bottom. It renders the
 * shared {@link DASHBOARD_NAV} config, so pages never define navigation
 * themselves.
 */
export function DashboardSidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--surface-strong)]">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-[var(--line)] px-5 py-4">
        <img
          src={logo}
          alt="Kool Kids Lifestyle Group"
          className="size-9 rounded-sm object-contain"
        />-
        <div className="leading-tight">
          <p className="text-sm font-bold text-[var(--sea-ink)]">Kool Kids</p>
          <p className="text-xs text-[var(--sea-ink-soft)]">Admin workspace</p>
        </div>
      </div>

      {/* Primary navigation */}
      <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <p className="px-3 pb-1 pt-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--sea-ink-soft)]">
          Manage
        </p>
        {DASHBOARD_NAV.map((item) => (
          <SidebarNavLink key={item.to} item={item} />
        ))}
      </nav>

      {/* Help panel */}
      <div className="border-t border-[var(--line)] p-3">
        <div className="rounded-sm border border-[var(--line)] bg-[var(--surface)] p-3">
          <div className="flex items-center gap-2 text-[var(--sea-ink)]">
            <LifeBuoy className="size-4 text-[var(--brand-orange)]" />
            <p className="text-sm font-semibold">Need a hand?</p>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[var(--sea-ink-soft)]">
            Open the Dashboard tab for step-by-step guides on every task.
          </p>
        </div>
      </div>
    </aside>
  )
}
