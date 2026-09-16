import { MapPin, ExternalLink } from 'lucide-react'
import { SectionHeading } from '#/components/sections/SectionHeading'
import { resolveTranslatable, type Language } from '#/lib/experiences'

/**
 * The location / map section. Renders a section heading above an embedded
 * OpenStreetMap view centred on Prieska, framed to match the site's card
 * styling. A pinned address label and a "View on Google Maps" link sit beside
 * the map so the location is always actionable even if the embed fails to load.
 * Uses a keyless embed so no map provider configuration is required.
 *
 * @returns {JSX.Element} The rendered location section.
 */
export function LocationMap({ lang = 'en' }: { lang?: Language }) {
  const heading = resolveTranslatable({ default: 'Find Us', translations: { af: 'Vind Ons' } }, lang)
  const title = resolveTranslatable({ default: 'Where to Find Prieska', translations: { af: 'Waar om Prieska te Vind' } }, lang)
  const cta = resolveTranslatable({ default: 'View on Google Maps', translations: { af: 'Beskou op Google Maps' } }, lang)
  const place = resolveTranslatable({ default: 'Prieska, Northern Cape', translations: { af: 'Prieska, Noord-Kaap' } }, lang)
  const addressLine1 = resolveTranslatable({ default: 'Victoria Street, Prieska, 8940', translations: { af: 'Victoriaweg, Prieska, 8940' } }, lang)
  const addressLine2 = resolveTranslatable({ default: 'On the banks of the Orange River, South Africa.', translations: { af: 'Aan die oewers van die Oranjerivier, Suid-Afrika.' } }, lang)

  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={heading}
          title={title}
          theme="light"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_2fr]">
          {/* Address card */}
          <div className="flex flex-col justify-center rounded-lg bg-[#f1ede6] p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)]">
              <MapPin className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="display-title mt-5 text-xl font-medium text-[var(--brand-navy)]">
              {place}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--brand-navy)]/70">
              {addressLine1}
              <br />
              {addressLine2}
            </p>
            <a
              href="https://www.google.com/maps/place/Prieska"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest !text-[var(--brand-orange)] no-underline transition-colors hover:!text-[var(--brand-orange-deep)]"
            >
              {cta}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          {/* Map embed */}
          <div className="overflow-hidden rounded-lg border border-[var(--brand-navy)]/10 bg-[#f1ede6] shadow-lg shadow-[var(--brand-navy)]/5">
            <iframe
              title="Map showing the location of Prieska in the Northern Cape, South Africa"
              src="https://www.openstreetmap.org/export/embed.html?bbox=22.68%2C-29.71%2C22.78%2C-29.64&layer=mapnik&marker=-29.6694%2C22.7461"
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
