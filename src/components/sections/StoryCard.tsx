import { ArrowRight, type LucideIcon } from 'lucide-react'
import { IconBadge } from './IconBadge'

/**
 * Props for the {@link StoryCard} component.
 * @typedef {Object} StoryCardProps
 * @property {string} image - Source path of the card's banner image.
 * @property {string} imageAlt - Accessible description of the banner image.
 * @property {LucideIcon} icon - Icon shown in the overlapping circular badge.
 * @property {string} title - The card heading.
 * @property {string} description - Supporting paragraph text.
 * @property {string} [href] - Link target for the "Learn more" action. Defaults to "#".
 * @property {string} [ctaLabel] - Text for the call-to-action link. Defaults to "Learn more".
 */

/**
 * A content card used in the "Discover the Stories" section. Shows a banner
 * image with an overlapping {@link IconBadge}, a title, a short description and
 * a "Learn more" link with a trailing arrow. Sits on a light card surface.
 *
 * @param {StoryCardProps} props - Component props.
 * @returns {JSX.Element} The rendered story card.
 */
export function StoryCard({
  image,
  imageAlt,
  icon,
  title,
  description,
  href = '#',
  ctaLabel = 'Learn more',
}: {
  image: string
  imageAlt: string
  icon: LucideIcon
  title: string
  description: string
  href?: string
  ctaLabel?: string
}) {
  return (
    <article className="group flex flex-col bg-white shadow-sm shadow-black/5 transition-transform duration-300 hover:-translate-y-1">
      {/* Banner image with overlapping badge */}
      <div className="relative">
        <img
          src={image || '/placeholder.svg'}
          alt={imageAlt}
          className="h-44 w-full object-cover"
        />
        <IconBadge icon={icon} className="absolute -bottom-6 left-5" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-5 pb-6 pt-9">
        <h3 className="display-title text-xl font-medium text-[var(--brand-navy)]">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--brand-navy)]/70">
          {description}
        </p>

        <a
          href={href}
          className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest !text-[var(--brand-orange)] no-underline hover:!text-[var(--brand-orange-deep)]"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </article>
  )
}
