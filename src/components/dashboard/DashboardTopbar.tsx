import { ChevronRight } from 'lucide-react'

/**
 * Sticky header shown above dashboard content.
 *
 * Displays a simple breadcrumb (workspace → current section) on the left and an
 * optional user badge on the right. Purely presentational; the section title is
 * computed by the layout from the active route.
 *
 * @param sectionTitle - Label of the section currently in view.
 * @param userName - Optional signed-in user's display name.
 */
export function DashboardTopbar({
  sectionTitle,
  userName,
}: {
  sectionTitle: string
  userName?: string
}) {
  const initial = userName?.trim()?.[0]?.toUpperCase() ?? 'A'

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--line)] bg-[var(--surface-strong)] px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-[var(--sea-ink-soft)]">Workspace</span>
        <ChevronRight className="size-4 text-[var(--sea-ink-soft)]" aria-hidden="true" />
        <span className="font-bold text-[var(--sea-ink)]">{sectionTitle}</span>
      </div>

      {/* User badge */}
      <div className="flex items-center gap-2">
        <span className="hidden text-sm font-medium text-[var(--sea-ink-soft)] sm:inline">
          {userName ?? 'Administrator'}
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
