import { Calendar, Mail, MessageCircle, type LucideIcon } from 'lucide-react'

/**
 * Visual variants for {@link CtaButton}, matching the three buttons in the
 * "Ready to Explore" card.
 * @typedef {'orange' | 'outline' | 'green'} CtaButtonVariant
 */

/**
 * Props for the {@link CtaButton} component.
 * @typedef {Object} CtaButtonProps
 * @property {LucideIcon} icon - Icon rendered above the label.
 * @property {string} label - Button caption.
 * @property {CtaButtonVariant} variant - Color treatment of the button.
 * @property {string} [href] - Link target. Defaults to "#".
 */

const VARIANT_CLASSES: Record<'orange' | 'outline' | 'green', string> = {
  orange: 'bg-[var(--brand-orange)] !text-white hover:bg-[var(--brand-orange-deep)]',
  outline: 'border border-white/35 !text-white hover:bg-white/10',
  green: 'bg-[var(--palm)] !text-white hover:brightness-110',
}

/**
 * A compact, stacked icon-over-label call-to-action button used in the
 * "Ready to Explore" card. The color treatment is selected via `variant`.
 *
 * @param {CtaButtonProps} props - Component props.
 * @returns {JSX.Element} The rendered button.
 */
export function CtaButton({
  icon: Icon,
  label,
  variant,
  href = '#',
}: {
  icon: LucideIcon
  label: string
  variant: 'orange' | 'outline' | 'green'
  href?: string
}) {
  return (
    <a
      href={href}
      className={`flex flex-col items-center justify-center gap-2 px-3 py-4 text-center text-[0.7rem] font-bold uppercase tracking-widest no-underline transition-colors ${VARIANT_CLASSES[variant]}`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {label}
    </a>
  )
}

/**
 * A single action shown in the {@link ExploreCtaCard}.
 * @typedef {Object} ExploreAction
 * @property {LucideIcon} icon - Button icon.
 * @property {string} label - Button caption.
 * @property {CtaButtonVariant} variant - Button color treatment.
 * @property {string} [href] - Link target.
 */

/**
 * Props for the {@link ExploreCtaCard} component.
 * @typedef {Object} ExploreCtaCardProps
 * @property {string} eyebrow - Small uppercase kicker shown above the title.
 * @property {string} title - The serif heading text.
 * @property {string} description - Supporting paragraph text.
 * @property {ExploreAction[]} [actions] - Buttons rendered in the action row.
 *   Defaults to Book Now / Contact Us / WhatsApp Us.
 */

/**
 * The right column of the pre-footer band. Presents an eyebrow, serif heading,
 * a short prompt and a three-up row of {@link CtaButton}s inviting the visitor
 * to take the next step.
 *
 * @param {ExploreCtaCardProps} props - Component props.
 * @returns {JSX.Element} The rendered explore CTA card.
 */
export function ExploreCtaCard({
  eyebrow,
  title,
  description,
  actions = [
    { icon: Calendar, label: 'Book Now', variant: 'orange' as const, href: '#' },
    { icon: Mail, label: 'Contact Us', variant: 'outline' as const, href: '#' },
    { icon: MessageCircle, label: 'WhatsApp Us', variant: 'green' as const, href: '#' },
  ],
}: {
  eyebrow: string
  title: string
  description: string
  actions?: {
    icon: LucideIcon
    label: string
    variant: 'orange' | 'outline' | 'green'
    href?: string
  }[]
}) {
  return (
    <div className="flex flex-col">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
        {eyebrow}
      </p>
      <h2 className="display-title mt-3 text-balance text-3xl font-medium leading-[1.15] text-white sm:text-[2rem]">
        {title}
      </h2>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">{description}</p>

      <div className="mt-7 grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <CtaButton key={action.label} {...action} />
        ))}
      </div>
    </div>
  )
}
