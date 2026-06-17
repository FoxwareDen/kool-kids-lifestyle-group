import type { LucideIcon } from 'lucide-react'

/**
 * Props for the {@link ContactInfoItem} component.
 * @typedef {Object} ContactInfoItemProps
 * @property {LucideIcon} icon - Lucide icon component shown in the orange badge.
 * @property {string} label - Small uppercase label describing the detail.
 * @property {string[]} lines - One or more lines of detail text (e.g. address rows).
 * @property {string} [href] - Optional link target. When set, the first line is rendered as a link.
 */

/**
 * A single contact detail row: an orange icon badge beside a label and one or
 * more lines of text. Used inside {@link ContactDetails} for address, phone,
 * email and opening-hours entries. When `href` is provided the value becomes a
 * link (e.g. `tel:` or `mailto:`).
 *
 * @param {ContactInfoItemProps} props - Component props.
 * @returns {JSX.Element} The rendered contact info row.
 */
export function ContactInfoItem({
  icon: Icon,
  label,
  lines,
  href,
}: {
  icon: LucideIcon
  label: string
  lines: string[]
  href?: string
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55">
          {label}
        </p>
        <div className="mt-1 space-y-0.5">
          {lines.map((line, index) =>
            href && index === 0 ? (
              <a
                key={line}
                href={href}
                className="block text-sm font-medium leading-relaxed !text-[var(--brand-navy)] no-underline transition-colors hover:!text-[var(--brand-orange)]"
              >
                {line}
              </a>
            ) : (
              <p
                key={line}
                className="text-sm leading-relaxed text-[var(--brand-navy)]/70"
              >
                {line}
              </p>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
