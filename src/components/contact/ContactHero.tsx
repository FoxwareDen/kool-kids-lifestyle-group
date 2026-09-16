import { ChevronRight } from 'lucide-react'
import { resolveTranslatable, type Language } from '#/lib/experiences'

/**
 * The page hero for the "Contact" route. Displays a full-width river
 * a breadcrumb trail, an orange eyebrow, a serif headline and a script-styled
 * subtitle. Mirrors the visual language of the About and Heritage heroes for a
 * consistent secondary-page format.
 *
 * @returns {JSX.Element} The rendered contact hero section.
 */
export function ContactHero({ lang = 'en' }: { lang?: Language }) {
  const home = resolveTranslatable({ default: 'Home', translations: { af: 'Tuis' } }, lang)
  const current = resolveTranslatable({ default: 'Contact', translations: { af: 'Kontak' } }, lang)
  const kickerText = resolveTranslatable({ default: 'We’d Love to Hear From You', translations: { af: 'Ons Wil Van Jou Hoor' } }, lang)
  const titleText = resolveTranslatable({ default: 'Get in Touch With Us', translations: { af: 'Kom In Kontak Met Ons' } }, lang)
  const subText = resolveTranslatable({ default: 'Let’s plan your Prieska adventure.', translations: { af: 'Laat ons jou Prieska-avontuur beplan.' } }, lang)

  return (
    <section className="relative flex min-h-[55svh] w-full items-end overflow-hidden bg-[var(--brand-navy)] pb-14">
      {/* Background image */}
      <img
        src="/hero-karoo-river.png"
        alt="The Orange River flowing past the town of Prieska in the Northern Cape"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-navy)]/95 via-[var(--brand-navy)]/55 to-[var(--brand-navy)]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)]/85 via-transparent to-[var(--brand-navy)]/40" />
      {/* Top fade so the solid navy navbar blends into the image */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--brand-navy)] to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            <li>
              <a href="/" className="no-underline !text-white/70 transition-colors hover:!text-[var(--brand-orange)]">
                {home}
              </a>
            </li>
            <ChevronRight className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
            <li className="text-[var(--brand-orange)]" aria-current="page">
              {current}
            </li>
          </ol>
        </nav>

        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
          {kickerText}
        </p>
        <h1 className="display-title mt-3 max-w-3xl text-balance text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-[3.5rem]">
          {titleText}
        </h1>
        <p className="script-title mt-2 text-2xl font-semibold text-[var(--brand-orange)] sm:text-3xl">
          {subText}
        </p>
      </div>
    </section>
  )
}
