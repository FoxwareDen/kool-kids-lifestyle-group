import { Link } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import type { DashboardNavItem } from './nav-config'

/**
 * A single sidebar navigation row: an icon, a label, and an active indicator.
 *
 * The active state is driven by TanStack Router's `isActive` render prop, so it
 * always stays in sync with the current URL without manual comparisons. The
 * component is intentionally presentational — all routing data comes from the
 * passed {@link DashboardNavItem}.
 *
 * @param item - The navigation entry to render.
 */
export function SidebarNavLink({ item }: { item: DashboardNavItem }) {
  const Icon = item.icon

  return (
    <Link
      to={item.to as string}
      // Search params differ per route; the shared config type is loose on
      // purpose, so we cast here to satisfy the strongly-typed Link API.
      search={item.search as never}
      activeOptions={{ exact: item.exact ?? false }}
      title={item.description}
      className="block"
    >
      {({ isActive }) => (
        <span
          className={cn(
            'group flex items-center gap-3 rounded-sm border border-transparent px-3 py-2 text-sm font-semibold transition-colors',
            isActive
              ? 'border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink)] shadow-sm'
              : 'text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]',
          )}
        >
          {/* Left accent bar marks the active section for quick scanning. */}
          <span
            aria-hidden="true"
            className={cn(
              'h-5 w-[3px] rounded-full transition-colors',
              isActive ? 'bg-[var(--brand-orange)]' : 'bg-transparent',
            )}
          />
          <Icon
            className={cn(
              'size-[18px] shrink-0 transition-colors',
              isActive
                ? 'text-[var(--brand-orange)]'
                : 'text-[var(--sea-ink-soft)] group-hover:text-[var(--sea-ink)]',
            )}
          />
          {item.label}
        </span>
      )}
    </Link>
  )
}
