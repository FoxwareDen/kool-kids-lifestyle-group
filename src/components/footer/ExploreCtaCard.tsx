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
  function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

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
    { icon: WhatsAppIcon, label: 'WhatsApp Us', variant: 'green' as const, href: '#' },
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
