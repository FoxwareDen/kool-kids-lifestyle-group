import { ChevronRight } from 'lucide-react'

/**
 * Props for the {@link TimelineHero} component.
 * @typedef {Object} TimelineHeroProps
 * @property {string} crumbLabel - Breadcrumb label for the section (e.g. "Blog").
 * @property {string} crumbHref - Breadcrumb link target for the section.
 * @property {string} eyebrow - Small uppercase kicker above the title.
 * @property {string} title - The main hero headline.
 * @property {string} subtitle - Script-styled supporting line.
 */

/**
 * The shared page hero for the blogs/events timeline routes. Mirrors the
 * visual language of the other secondary-page heroes (full-bleed image, navy
 * and script subtitle) while accepting per-route labelling via props.
 *
 * @param {TimelineHeroProps} props - Component props.
 * @returns {JSX.Element} The rendered hero section.
 */
export function TimelineHero({
  crumbLabel,
  crumbHref,
  eyebrow,
  title,
  subtitle,
}: {
  crumbLabel: string
  crumbHref: string
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <section className="relative flex min-h-[55svh] w-full items-end overflow-hidden bg-[var(--brand-navy)] pb-14">
      {/* Background image */}
      <img
        src="/hero-karoo-river.png"
        alt="The Orange River winding through the Karoo landscape near Prieska"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-navy)]/95 via-[var(--brand-navy)]/55 to-[var(--brand-navy)]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)]/85 via-transparent to-[var(--brand-navy)]/40" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--brand-navy)] to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            <li>
              <a
                href="/"
                className="no-underline !text-white/70 transition-colors hover:!text-[var(--brand-orange)]"
              >
                Home
              </a>
            </li>
            <ChevronRight className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
            <li>
              <a
                href={crumbHref}
                className="no-underline !text-white/70 transition-colors hover:!text-[var(--brand-orange)]"
              >
                {crumbLabel}
              </a>
            </li>
            <ChevronRight className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
            <li className="text-[var(--brand-orange)]" aria-current="page">
              Timeline
            </li>
          </ol>
        </nav>

        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
          {eyebrow}
        </p>
        <h1 className="display-title mt-3 max-w-3xl text-balance text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-[3.5rem]">
          {title}
        </h1>
        <p className="script-title mt-2 text-2xl font-semibold text-[var(--brand-orange)] sm:text-3xl">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
