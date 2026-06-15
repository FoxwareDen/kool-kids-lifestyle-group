import { ChevronRight } from 'lucide-react'
import { SiteHeader } from '#/components/hero/SiteHeader'

/**
 * The page hero for the "About Prieska" route. Displays a full-width Karoo
 * background image behind navy readability overlays, the shared
 * {@link SiteHeader}, a breadcrumb trail, an orange eyebrow, a serif headline
 * and a script-styled subtitle. Mirrors the visual language of the home hero
 * but in a shorter, secondary-page format.
 *
 * @returns {JSX.Element} The rendered about hero section.
 */
export function AboutHero() {
  return (
    <section className="relative flex min-h-[60svh] w-full items-end overflow-hidden bg-[var(--brand-navy)] pb-14">
      {/* Background image */}
      <img
        src="/hero-karoo-landscape.png"
        alt="Sweeping Karoo landscape surrounding the town of Prieska at golden hour"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-navy)]/95 via-[var(--brand-navy)]/55 to-[var(--brand-navy)]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)]/85 via-transparent to-[var(--brand-navy)]/40" />
      {/* Top fade so the solid navy navbar blends into the image */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--brand-navy)] to-transparent" />

      <SiteHeader />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            <li>
              <a href="/" className="no-underline !text-white/70 transition-colors hover:!text-[var(--brand-orange)]">
                Home
              </a>
            </li>
            <ChevronRight className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
            <li className="text-[var(--brand-orange)]" aria-current="page">
              About Prieska
            </li>
          </ol>
        </nav>

        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
          Get to Know Us
        </p>
        <h1 className="display-title mt-3 max-w-3xl text-balance text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-[3.5rem]">
          A Town Where Heritage Meets Adventure
        </h1>
        <p className="script-title mt-2 text-2xl font-semibold text-[var(--brand-orange)] sm:text-3xl">
          Discover the heart of the Northern Cape.
        </p>
      </div>
    </section>
  )
}
