import { ArrowRight } from 'lucide-react'

/**
 * Visual style variants for {@link HeroButton}.
 * @typedef {'primary' | 'outline'} HeroButtonVariant
 */

/**
 * Props for the {@link HeroButton} component.
 * @typedef {Object} HeroButtonProps
 * @property {string} children - The button label text.
 * @property {HeroButtonVariant} [variant] - Visual style. Defaults to "primary".
 * @property {string} [href] - Optional link target. Defaults to "#".
 */

/**
 * A call-to-action button used inside the hero section. Renders as an anchor
 * with a trailing arrow icon. Supports a solid "primary" style and a
 * transparent "outline" style.
 *
 * @param {HeroButtonProps} props - Component props.
 * @returns {JSX.Element} The rendered CTA button.
 */
export function HeroButton({
  children,
  variant = 'primary',
  href = '#',
}: {
  children: React.ReactNode
  variant?: 'primary' | 'outline'
  href?: string
}) {
  const base =
    'group inline-flex items-center justify-between gap-6 rounded-md px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors'

  const styles =
    variant === 'primary'
      ? 'bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-deep)] shadow-lg shadow-black/20'
      : 'border border-white/40 text-white hover:bg-white/10'

  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  )
}
