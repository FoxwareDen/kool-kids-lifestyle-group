import type { ReactNode } from 'react'
import type { Language } from '#/lib/experiences'
import { SelectField, controlClass } from '#/components/dashboard/form-controls'

/**
 * The three publish states a post/experience can be in. Persisted verbatim to
 * the PocketBase `status` field, so the casing here must match the collection.
 */
export const STATUS_OPTIONS = ['Draft', 'Published', 'Private'] as const

/** A single publish state (`'Draft' | 'Published' | 'Private'`). */
export type PostStatus = (typeof STATUS_OPTIONS)[number]

/** Languages the editor can author content in, paired with display labels. */
export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'af', label: 'Afrikaans' },
]

/**
 * Compact language dropdown intended to sit inline next to the page heading.
 *
 * Uses the shared admin control style but is width-fit so it can live in a
 * header row rather than a full-width form column.
 *
 * @param value - Currently selected language.
 * @param onChange - Called with the newly selected language.
 */
export function LanguageDropdown({
  value,
  onChange,
}: {
  value: Language
  onChange: (lang: Language) => void
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">Content language</span>
      <select
        aria-label="Content language"
        className={`${controlClass} w-auto py-1.5`}
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
      >
        {LANGUAGE_OPTIONS.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  )
}

/**
 * Labelled Draft / Published / Private selector built on the shared
 * {@link SelectField}, so it matches every other admin dashboard control.
 *
 * @param value - Currently selected status.
 * @param onChange - Called with the newly selected status.
 * @param label - Field label. Defaults to `"Status"`.
 */
export function StatusSelect({
  value,
  onChange,
  label = 'Status',
}: {
  value: PostStatus
  onChange: (status: PostStatus) => void
  label?: string
}) {
  return (
    <SelectField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as PostStatus)}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </SelectField>
  )
}

/**
 * A labelled form row wrapper that stacks its label above `children`, matching
 * the spacing of {@link SelectField} / TextField for controls that need custom
 * bodies (file inputs, textareas, chip lists, etc.).
 *
 * @param label - Field label shown above the control.
 * @param hint - Optional helper text shown below the control.
 * @param children - The control(s) to render.
 */
export function FormRow({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="block">
      <span className="mb-1 block text-sm font-semibold text-[var(--sea-ink)]">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[var(--sea-ink-soft)]">{hint}</span>}
    </div>
  )
}

/** Themed error banner shown above the submit button on validation/save failure. */
export function ErrorBanner({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-sm border border-[color-mix(in_oklab,var(--destructive)_40%,var(--line))] bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] px-3 py-2 text-xs font-medium text-[var(--destructive)]"
    >
      {message}
    </p>
  )
}
