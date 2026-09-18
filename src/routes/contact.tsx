// TODO:NO CMS MANAGING

import { createFileRoute } from '@tanstack/react-router'
import { ContactHero } from '#/components/contact/ContactHero'
import { ContactSection } from '#/components/contact/ContactSection'
import { LocationMap } from '#/components/contact/LocationMap'
import { ContactCta } from '#/components/contact/ContactCta'
import { SiteFooter } from '#/components/footer/SiteFooter'
import type { Language } from '#/lib/experiences'

/**
 * The "Contact" page route. Composes the page-level sections in order: hero,
 * the contact details + form section, the location map, a closing
 * call-to-action and the shared footer.
 */
export const Route = createFileRoute('/contact')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as Language) ?? undefined,
  }),
  loaderDeps: ({ search: { lang } }) => ({ lang: lang || "en" }),
  head: () => ({
    meta: [
      {
        title: 'Contact | 360 Experiences',
      },
      {
        name: 'description',
        content:
          'Get in touch with the Prieska tourism team — find our address, phone, email and opening hours, send us a message or locate us on the map.',
      },
      {
        property: 'og:title',
        content: 'Contact | 360 Experiences',
      },
      {
        property: 'og:description',
        content:
          'Get in touch with the Prieska tourism team — find our address, phone, email and opening hours, send us a message or locate us on the map.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'twitter:title',
        content: 'Contact | 360 Experiences',
      },
      {
        name: 'twitter:description',
        content:
          'Get in touch with the Prieska tourism team — find our address, phone, email and opening hours, send us a message or locate us on the map.',
      },
    ],
  }),
  component: ContactPage,
})

/**
 * Renders the full Contact page by stacking its section components.
 *
 * @returns {JSX.Element} The rendered page.
 */
function ContactPage() {
  const { lang } = Route.useLoaderDeps()

  return (
    <main>
      <ContactHero lang={lang} />
      <ContactSection lang={lang} />
      <LocationMap lang={lang} />
      <ContactCta lang={lang} />
    </main>
  )
}
