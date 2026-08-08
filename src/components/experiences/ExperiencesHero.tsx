import { ChevronRight } from 'lucide-react'

/**
 * Props for {@link ExperiencesHero}.
 * @typedef {Object} ExperiencesHeroProps
 * @property {string} eyebrow - Small orange uppercase kicker.
 * @property {string} title - Main serif headline.
 * @property {string} subtitle - Script-styled supporting line.
 * @property {{ label: string, href?: string }[]} [crumbs] - Breadcrumb trail
 *   after "Home"; the last crumb is rendered as the current page.
 * @property {string} [image] - Background image source.
 */

/**
 * Shared hero banner for the experiences index and detail pages. Mirrors the
 * visual language of the heritage/about heroes: full-bleed image, navy
 *
 * @param {ExperiencesHeroProps} props - Component props.
 * @returns {JSX.Element} The rendered hero section.
 */
export function ExperiencesHero({
  eyebrow,
  title,
  subtitle,
  crumbs = [],
  image = '/images/sections/quad.png',
}: {
  eyebrow: string
  title: string
  subtitle: string
  crumbs?: { label: string; href?: string }[]
  image?: string
}) {
  return (
    <section className="relative flex min-h-[58svh] w-full items-end overflow-hidden bg-[var(--brand-navy)] pb-14">
      <img
        src={image || '/placeholder.svg'}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-navy)]/95 via-[var(--brand-navy)]/60 to-[var(--brand-navy)]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)]/90 via-transparent to-[var(--brand-navy)]/40" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--brand-navy)] to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            <li>
              <a
                href="/"
                className="no-underline !text-white/70 transition-colors hover:!text-[var(--brand-orange)]"
              >
                Home
              </a>
            </li>
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1
              return (
                <li key={crumb.label} className="flex items-center gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
                  {isLast || !crumb.href ? (
                    <span className="text-[var(--brand-orange)]" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <a
                      href={crumb.href}
                      className="no-underline !text-white/70 transition-colors hover:!text-[var(--brand-orange)]"
                    >
                      {crumb.label}
                    </a>
                  )}
                </li>
              )
            })}
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
