import storyImg from '../../images/karoo-2.jpeg'
import type { Content } from '#/lib/pocketbase'
import { ArrowRight, Phone } from 'lucide-react'
import { resolveTranslatable, type Language } from '#/lib/experiences'


interface AboutCta {
  kicker: string,
  title: string,
  description: string,
  buttons: {
    label: string,
    style: string,
    icon: string,
    href: string
  }[]
}

/**
 * A full-width call-to-action band that closes the About page. A Karoo
 * background sits behind a navy overlay holding a serif headline, a short
 * supporting line and two calls to action — a primary "Book an Experience"
 * button and an outlined "Contact Us" button.
 *
 * @returns {JSX.Element} The rendered call-to-action section.
 */
export function AboutCta({data, lang = 'en'}: {data: Content<Partial<AboutCta>>; lang?: Language}) {
  const { content: { kicker, title, description } } = data;
  const defaultKicker = resolveTranslatable({ default: 'Ready to Explore?', translations: { af: 'Klaar om te Verken?' } }, lang)
  const defaultTitle = resolveTranslatable({ default: 'Come Experience Prieska for Yourself', translations: { af: 'Kom Beleef Prieska Self' } }, lang)
  const defaultDescription = resolveTranslatable({ default: 'Let our team help you plan a journey filled with heritage, adventure and the unmistakable warmth of the Northern Cape.', translations: { af: 'Laat ons span jou help om ’n reis te beplan vol erfenis, avontuur en die onmiskenbare warmte van die Noord-Kaap.' } }, lang)
  const primaryLabel = resolveTranslatable({ default: 'Book an experience', translations: { af: 'Bespreek ’n ervaring' } }, lang)
  const secondaryLabel = resolveTranslatable({ default: 'Contact Us', translations: { af: 'Kontak Ons' } }, lang)

  return (
    <section className="relative overflow-hidden">
      <img
        src={storyImg}
        alt="Karoo landscape at sunset near Prieska"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[var(--brand-navy)]/85" />

      <div className="relative mx-auto w-full max-w-[1180px] px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
          {kicker ?? defaultKicker}
        </p>
        <h2 className="display-title mx-auto mt-3 max-w-2xl text-balance text-3xl font-medium leading-[1.15] text-white sm:text-4xl">
          {title ?? defaultTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-white/75">
          {description ?? defaultDescription}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/experiences"
            className="group inline-flex items-center gap-3 bg-[var(--brand-orange)] px-7 py-3.5 text-xs font-bold uppercase tracking-widest !text-white no-underline shadow-lg shadow-black/30 transition-colors hover:bg-[var(--brand-orange-deep)]"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/contact"
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
