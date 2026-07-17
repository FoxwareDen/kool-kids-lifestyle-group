import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  FilePlus2,
  CalendarDays,
  CalendarPlus,
} from 'lucide-react'

/**
 * A single navigation entry rendered in the dashboard sidebar.
 */
export type DashboardNavItem = {
  /** Text shown next to the icon. */
  label: string
  /** Short helper text describing what the destination does. */
  description: string
  /** TanStack Router destination path. */
  to: string
  /** Icon component rendered on the left of the label. */
  icon: LucideIcon
  /**
   * When `true` the link is only active on an exact path match.
   * Use for index routes so parent links do not stay highlighted.
   */
  exact?: boolean
  /** Optional search params required by the destination route. */
  search?: Record<string, unknown>
}

/**
 * Primary navigation for the admin dashboard.
 *
 * Each entry maps directly to a real dashboard route so the sidebar always
 * reflects a page that actually exists. Keeping this in one place makes it
 * trivial to add, reorder, or relabel sections without touching UI code.
 */
export const DASHBOARD_NAV: DashboardNavItem[] = [
  {
    label: 'Dashboard',
    description: 'Overview and how-to guides',
    to: '/dashboard/',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Create Experience',
    description: 'Publish a new experience page',
    to: '/dashboard/experience',
    icon: FilePlus2,
  },
  {
    label: 'Schedules',
    description: 'View and manage booking schedules',
    to: '/dashboard/calendars',
    icon: CalendarDays,
    search: { lang: 'en' },
  },
  {
    label: 'Create Schedule',
    description: 'Link an experience to dates and prices',
    to: '/dashboard/create-calendar',
    icon: CalendarPlus,
    search: { lang: 'en', calId: undefined },
  },
]

/**
 * Resolve the label of the nav item that best matches a pathname.
 *
 * Used by the top bar to show the current section. Falls back to the first
 * item (Dashboard) when nothing matches.
 *
 * @param pathname - The current location pathname (e.g. `/dashboard/calendars`).
 * @returns The matching nav item's label.
 */
export function getActiveNavLabel(pathname: string): string {
  // Prefer the most specific (longest) matching route.
  const match = [...DASHBOARD_NAV]
    .filter((item) => {
      const base = item.to.replace(/\/$/, '')
      if (item.exact) return pathname.replace(/\/$/, '') === base
      return pathname.startsWith(base)
    })
    .sort((a, b) => b.to.length - a.to.length)[0]

  return match?.label ?? DASHBOARD_NAV[0].label
}
