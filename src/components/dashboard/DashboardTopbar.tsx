import { ChevronRight } from 'lucide-react'
import { resolveTranslatable, type Language } from '#/lib/experiences'

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
  const initial = userName?.trim()?.[0]?.toUpperCase() ?? 'A'
  const workspaceLabel = resolveTranslatable({ default: 'Workspace', translations: { af: 'Werkspasie' } }, lang)
  const adminLabel = resolveTranslatable({ default: 'Administrator', translations: { af: 'Administrateur' } }, lang)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--line)] bg-[var(--surface-strong)] px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-[var(--sea-ink-soft)]">{workspaceLabel}</span>
        <ChevronRight className="size-4 text-[var(--sea-ink-soft)]" aria-hidden="true" />
        <span className="font-bold text-[var(--sea-ink)]">{sectionTitle}</span>
      </div>

      <div className="flex items-center gap-2">
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
