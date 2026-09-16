import { ArrowRight, Phone } from 'lucide-react'
import riverImg from '../../images/orange-river.jpeg'
import { resolveTranslatable, type Language } from '#/lib/experiences'

/**
 * A full-width call-to-action band that closes the Contact page. A river photo
 * sits behind a navy overlay holding a serif headline, a short supporting line
 * and two calls to action — a primary "Explore Experiences" button and an
 * outlined "Call Us" button. Mirrors the Heritage CTA for visual consistency.
 *
 * @returns {JSX.Element} The rendered call-to-action section.
 */
export function ContactCta({ lang = 'en' }: { lang?: Language }) {
  const kicker = resolveTranslatable({ default: 'Ready When You Are', translations: { af: 'Klaar Wanneer Jy Is' } }, lang)
  const title = resolveTranslatable({ default: 'Start Planning Your Visit to Prieska', translations: { af: 'Begin Om Jou Besoek aan Prieska te Beplan' } }, lang)
  const description = resolveTranslatable({ default: 'From riverside adventures to rich heritage, our team is ready to help you craft the perfect Northern Cape getaway.', translations: { af: 'Van rivier-avonture tot ryk erfenis, ons span is gereed om jou te help om die perfekte Noord-Kaap-ontsnapping te skep.' } }, lang)
  const primaryLabel = resolveTranslatable({ default: 'Explore Experiences', translations: { af: 'Verken Ervarings' } }, lang)
  const secondaryLabel = resolveTranslatable({ default: 'Call Us', translations: { af: 'Bel Ons' } }, lang)
  return (
    <section className="relative overflow-hidden">
      <img
        src={riverImg}
        alt="The Orange River winding past Prieska"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[var(--brand-navy)]/85" />

      <div className="relative mx-auto w-full max-w-[1180px] px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
          {kicker}
        </p>
        <h2 className="display-title mx-auto mt-3 max-w-2xl text-balance text-3xl font-medium leading-[1.15] text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-white/75">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/about-prieska"
            className="group inline-flex items-center gap-3 bg-[var(--brand-orange)] px-7 py-3.5 text-xs font-bold uppercase tracking-widest !text-white no-underline shadow-lg shadow-black/30 transition-colors hover:bg-[var(--brand-orange-deep)]"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="tel:+27533531111"
            className="group inline-flex items-center gap-3 border border-white/60 px-7 py-3.5 text-xs font-bold uppercase tracking-widest !text-white no-underline transition-colors hover:bg-white/10"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
