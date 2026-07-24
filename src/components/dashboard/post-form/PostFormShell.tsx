import type { ReactNode } from 'react'
import type { Language } from '#/lib/experiences'
import { LanguageDropdown } from './fields'

/**
 * Two-pane authoring layout shared by Create Post and Create Experience.
 *
 * The left pane hosts a live preview; the right pane hosts the editor form.
 * The editor header shows the "Dashboard" eyebrow, the page title, and the
 * language dropdown inline to its right (per the admin layout spec).
 *
 * @param title - Page heading (e.g. "Create Post").
 * @param lang - Active authoring language, bound to the header dropdown.
 * @param onLangChange - Called when the header language dropdown changes.
 * @param preview - Left-pane preview content.
 * @param children - Right-pane editor form content.
 */
export function PostFormShell({
  title,
  lang,
  onLangChange,
  preview,
  children,
}: {
  title: string
  lang: Language
  onLangChange: (lang: Language) => void
  preview: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex w-full h-full bg-[var(--dash-panel-muted)]">
      <div className="flex-2 flex justify-center min-h-0 border-r border-[var(--line)] p-6 overflow-y-auto">
        <div className="w-11/12 overflow-hidden rounded-sm border border-[var(--line)] shadow-lg">
          {preview}
        </div>
      </div>

      <div className="flex-[1.2] p-5 flex flex-col gap-4 overflow-y-auto bg-[var(--surface-strong)]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
              Dashboard
            </p>
            <h1 className="mt-1.5 text-2xl font-bold text-[var(--sea-ink)]">{title}</h1>
          </div>
          <LanguageDropdown value={lang} onChange={onLangChange} />
        </header>

        {children}
      </div>
    </div>
  )
}

/**
 * Content-blocks section: a labelled heading, the list of block editors passed
 * as `children`, and the add-block buttons row.
 *
 * @param label - Section label. Defaults to `"Content Blocks"`.
 * @param addButtons - The {@link BlockAddButtons} element.
 * @param children - The rendered {@link BlockEditor} list.
 */
export function BlocksSection({
  label = 'Content Blocks',
  addButtons,
  children,
}: {
  label?: string
  addButtons: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-[var(--sea-ink)]">{label}</span>
      {children}
      <div className="mt-1">{addButtons}</div>
    </div>
  )
}
