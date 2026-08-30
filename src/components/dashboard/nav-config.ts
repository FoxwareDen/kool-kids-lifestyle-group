import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  FilePlus2,
  CalendarDays,
  CalendarPlus,
  CalendarCheck2,
  HomeIcon,
  Newspaper,
  ViewIcon,
} from 'lucide-react'
import { resolveTranslatable, type Language } from '#/lib/experiences'

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
  exact?: boolean
  search?: Record<string, unknown>
}

export function getDashboardNav(lang: Language = 'en'): DashboardNavItem[] {
  return [
    {
      label: resolveTranslatable({ default: 'Home', translations: { af: 'Tuis' } }, lang),
      description: resolveTranslatable({ default: 'Back to user side', translations: { af: 'Terug na die gebruikerskant' } }, lang),
      to: '/',
      icon: HomeIcon,
      exact: true,
    },
    {
      label: resolveTranslatable({ default: 'Dashboard', translations: { af: 'Paneel' } }, lang),
      description: resolveTranslatable({ default: 'Overview and how-to guides', translations: { af: 'Oorsig en gidses' } }, lang),
      to: '/dashboard/',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: resolveTranslatable({ default: 'Active Bookings', translations: { af: 'Aktiewe Besprekings' } }, lang),
      description: resolveTranslatable({ default: 'Monitor all current active bookings', translations: { af: 'Monitor alle huidige aktiewe besprekinge' } }, lang),
      to: '/dashboard/bookings',
      icon: CalendarCheck2,
      exact: true,
    },
    {
      label: resolveTranslatable({ default: 'Schedules', translations: { af: 'Skedules' } }, lang),
      description: resolveTranslatable({ default: 'Overview of the existing schedules', translations: { af: 'Oorsig van die bestaande skedules' } }, lang),
      to: '/dashboard/calendars',
      icon: CalendarDays,
      exact: true,
    },
    {
      label: resolveTranslatable({ default: 'Create Schedule', translations: { af: 'Skep Skedule' } }, lang),
      description: resolveTranslatable({ default: 'Create Schedule for experiences', translations: { af: 'Skep ’n skedule vir ervarings' } }, lang),
      to: '/dashboard/create-calendar',
      icon: CalendarPlus,
      exact: true,
    },
    {
      label: resolveTranslatable({ default: 'Create Posts', translations: { af: 'Skep Plasings' } }, lang),
      description: resolveTranslatable({ default: 'Publish a new Blog or Event page', translations: { af: 'Publiseer ’n nuwe Blog- of Gebeurtenisbladsy' } }, lang),
      to: '/dashboard/create-post',
      icon: Newspaper,
    },
    {
      label: resolveTranslatable({ default: 'Create Experience', translations: { af: 'Skep Ervaring' } }, lang),
      description: resolveTranslatable({ default: 'Publish a new experience page', translations: { af: 'Publiseer ’n nuwe ervaringsbladsy' } }, lang),
      to: '/dashboard/create-experience',
      icon: FilePlus2,
    },
    {
      label: resolveTranslatable({ default: 'Experiences', translations: { af: 'Ervarings' } }, lang),
      description: resolveTranslatable({ default: 'Review and manage experience pages', translations: { af: 'Bestudeer en bestuur ervaringsbladse' } }, lang),
      to: '/dashboard/experiences',
      icon: ViewIcon,
    },
  ]
}

export function getActiveNavLabel(pathname: string, lang: Language = 'en'): string {
  const nav = getDashboardNav(lang)
  const match = [...nav]
    .filter((item) => {
      const base = item.to.replace(/\/$/, '')
      if (item.exact) return pathname.replace(/\/$/, '') === base
      return pathname.startsWith(base)
    })
    .sort((a, b) => b.to.length - a.to.length)[0]

  return match?.label ?? nav[0].label
}
