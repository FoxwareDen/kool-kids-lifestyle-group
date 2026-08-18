/**
 * Props for the {@link StorySpotlight} component.
 * @typedef {Object} StorySpotlightProps
 * @property {string} image - Source path of the full-bleed background image.
 * @property {string} imageAlt - Accessible description of the image.
 * @property {string} eyebrow - Small uppercase kicker shown above the title.
 * @property {string} title - The serif headline overlaid on the image.
 * @property {string} description - Supporting paragraph text.
 * @property {string} [href] - Link target for the button. Defaults to "#".
 * @property {string} [ctaLabel] - Button text. Defaults to "Learn more".
 */

import { ArrowRight } from 'lucide-react'

/**
 * A tall feature card with a full-bleed photo, a dark gradient overlay and
 * overlaid text content (eyebrow, serif title, description and an outlined
 * call-to-action button). Used as the left column of the "Plan Your Visit"
 * section to spotlight the town's story.
 *
 * @param {StorySpotlightProps} props - Component props.
 * @returns {JSX.Element} The rendered spotlight card.
 */
export function StorySpotlight({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  href = '#',
  ctaLabel = 'Learn more',
}: {
  image: string
  imageAlt: string
  eyebrow: string
  title: string
  description: string
  href?: string
  ctaLabel?: string
}) {
  return (
    <article className="relative flex min-h-[26rem] flex-col justify-end overflow-hidden lg:h-full">
      <img
        src={image || '/placeholder.svg'}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-navy)]/90 via-[var(--brand-navy)]/55 to-[var(--brand-navy)]/20" />

      <div className="relative max-w-md p-8 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
          {eyebrow}
        </p>
        <h3 className="display-title mt-3 text-balance text-3xl font-medium leading-[1.15] !text-white sm:text-4xl">
          {title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-white/80">
          {description}
        </p>

        <a
          href="/heritage"
          className="group mt-7 inline-flex items-center gap-3 border border-[var(--brand-orange)] px-6 py-3 text-xs font-bold uppercase tracking-widest !text-[var(--brand-orange)] no-underline transition-colors hover:bg-[var(--brand-orange)] hover:!text-white"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </article>
  )
}
