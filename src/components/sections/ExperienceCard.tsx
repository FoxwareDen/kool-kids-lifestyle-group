import type { LucideIcon } from 'lucide-react'
import { IconBadge } from './IconBadge'
import { resolveTranslatable, type Language, type Translatable } from '#/lib/experiences'

/**
 * Props for the {@link ExperienceCard} component.
 * @typedef {Object} ExperienceCardProps
 * @property {string} image - Source path of the card's background image.
 * @property {string} imageAlt - Accessible description of the image.
 * @property {LucideIcon} icon - Icon shown in the circular badge.
 * @property {string} title - The experience name.
 * @property {string} description - Short supporting line of text.
 * @property {string} [href] - Link target for the card. Defaults to "#".
 */

/**
 * A tall, portrait-oriented card used in the "Choose Your Experience" section.
 * A photo fills the top, fading into a navy panel that holds an
 * {@link IconBadge}, title and short description. The whole card is a link.
 *
 * @param {ExperienceCardProps} props - Component props.
 * @returns {JSX.Element} The rendered experience card.
 */
export function ExperienceCard({
  image,
  imageAlt,
  icon,
  title,
  description,
  href = '#',
  lang
}: {
  image: string
  imageAlt: string
  icon: LucideIcon
  title: Translatable | undefined
  description: Translatable | undefined
  href?: string,
  lang: Language
}) {
  console.log(typeof title);
  console.log(title);
  
  
  return (
    <a
      href={href}
      className="group relative flex h-80 flex-col justify-end overflow-hidden border border-white/10 no-underline transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Background image */}
      <img
        src={image || '/placeholder.svg'}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Navy gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)] via-[var(--brand-navy)]/70 to-transparent" />

      {/* Content */}
      <div className="relative flex flex-col items-center gap-2 px-3 pb-6 text-center">
        <IconBadge icon={icon} />
        <h3 className="display-title mt-1 text-lg font-medium leading-tight !text-white">
          {resolveTranslatable(title!, lang)}
        </h3>
        <p className="text-xs leading-relaxed text-white/70">
        {resolveTranslatable(description!, lang)}
        </p>
      </div>
    </a>
  )
}
