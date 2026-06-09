import type { LucideIcon } from 'lucide-react'

/**
 * Props for the {@link IconBadge} component.
 * @typedef {Object} IconBadgeProps
 * @property {LucideIcon} icon - The lucide-react icon component to render.
 * @property {string} [className] - Optional extra classes for positioning.
 */

/**
 * A circular navy badge containing a single white icon. Used as the overlapping
 * emblem on story and experience cards.
 *
 * @param {IconBadgeProps} props - Component props.
 * @returns {JSX.Element} The rendered icon badge.
 */
export function IconBadge({
  icon: Icon,
  className = '',
}: {
  icon: LucideIcon
  className?: string
}) {
  return (
    <span
      className={`flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-navy)] text-white shadow-lg shadow-black/20 ring-4 ring-[var(--brand-orange)]/0 ${className}`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </span>
  )
}
