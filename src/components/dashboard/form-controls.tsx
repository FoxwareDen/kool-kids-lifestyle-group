import type {
  ReactNode,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  ButtonHTMLAttributes,
} from 'react'
import { cn } from '#/lib/utils'

/**
 * Shared Tailwind class string for text-like inputs and selects.
 *
 * Centralised so every field across the dashboard renders with identical sharp
 * corners, theme colors, and focus ring. Prefer the {@link TextField} /
 * {@link SelectField} wrappers, but this is exported for one-off inputs.
 */
export const controlClass =
  'w-full rounded-sm border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)]/60 focus:border-[var(--brand-orange)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]/30'

/**
 * A titled panel used to group related form controls or content.
 *
 * Uses the sharp, bordered surface style shared across the admin dashboard.
 *
 * @param title - Heading shown at the top of the panel.
 * @param description - Optional supporting text under the title.
 * @param actions - Optional node (e.g. a button) rendered on the right of the header.
 * @param children - Panel body content.
 */
export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'rounded-sm border border-[var(--line)] bg-[var(--surface-strong)]',
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-4">
          <div>
            {title && (
              <h2 className="text-base font-bold text-[var(--sea-ink)]">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">{description}</p>
            )}
          </div>
          {actions}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

/**
 * Labelled text input. Wraps a native input with the shared control style.
 *
 * @param label - Field label shown above the input.
 * @param hint - Optional helper text shown below the input.
 * All other props are forwarded to the underlying `<input>`.
 */
export function TextField({
  label,
  hint,
  className,
  ...props
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-[var(--sea-ink)]">
        {label}
      </span>
      <input className={cn(controlClass, className)} {...props} />
      {hint && <span className="mt-1 block text-xs text-[var(--sea-ink-soft)]">{hint}</span>}
    </label>
  )
}

/**
 * Labelled select. Wraps a native select with the shared control style.
 *
 * @param label - Field label shown above the select.
 * @param children - `<option>` elements.
 * All other props are forwarded to the underlying `<select>`.
 */
export function SelectField({
  label,
  children,
  className,
  ...props
}: { label: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-[var(--sea-ink)]">
        {label}
      </span>
      <select className={cn(controlClass, className)} {...props}>
        {children}
      </select>
    </label>
  )
}

type ButtonVariant = 'primary' | 'ghost' | 'danger'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-deep)] disabled:bg-[var(--dash-panel-muted)] disabled:text-[var(--sea-ink-soft)]',
  ghost:
    'border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)]',
  danger:
    'border border-[color-mix(in_oklab,var(--destructive)_40%,var(--line))] bg-transparent text-[var(--destructive)] hover:bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)]',
}

/**
 * Themed action button with sharp corners and three intents.
 *
 * @param variant - Visual intent: `primary` (orange CTA), `ghost` (neutral
 * bordered), or `danger` (destructive). Defaults to `primary`.
 * All other props are forwarded to the underlying `<button>`.
 */
export function Button({
  variant = 'primary',
  className,
  ...props
}: { variant?: ButtonVariant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed',
        BUTTON_VARIANTS[variant],
        className,
      )}
      {...props}
    />
  )
}

/**
 * A small rounded pill/badge for statuses, day names, and counts.
 *
 * @param tone - `accent` (orange) or `neutral` (sand). Defaults to `neutral`.
 * @param children - Pill content.
 */
export function Pill({
  tone = 'neutral',
  children,
}: {
  tone?: 'accent' | 'neutral'
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-semibold',
        tone === 'accent'
          ? 'bg-[color-mix(in_oklab,var(--brand-orange)_16%,transparent)] text-[var(--brand-orange-deep)]'
          : 'border border-[var(--line)] bg-[var(--dash-panel-muted)] text-[var(--sea-ink-soft)]',
      )}
    >
      {children}
    </span>
  )
}
