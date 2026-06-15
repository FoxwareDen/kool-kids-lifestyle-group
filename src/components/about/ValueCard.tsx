import type { LucideIcon } from 'lucide-react'

/**
 * Props for the {@link ValueCard} component.
 * @typedef {Object} ValueCardProps
 * @property {LucideIcon} icon - Icon shown in the card's badge.
 * @property {string} title - The card heading (e.g. "Our Mission").
 * @property {string} description - Supporting paragraph text.
 */

/**
 * A clean, corporate card used to present a single mission, vision or value
 * statement. A square orange-tinted icon badge sits above a serif title and a
 * short description, on a white surface with a subtle border and top accent.
 *
 * @param {ValueCardProps} props - Component props.
 * @returns {JSX.Element} The rendered value card.
 */
export function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <article className="group relative flex flex-col border border-[var(--brand-navy)]/10 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[var(--brand-orange)] transition-transform duration-300 group-hover:scale-x-100"
      />
      <span className="flex h-14 w-14 items-center justify-center rounded-md bg-[var(--brand-navy)] text-white">
        <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <h3 className="display-title mt-6 text-xl font-medium text-[var(--brand-navy)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--brand-navy)]/70">
        {description}
      </p>
    </article>
  )
}
