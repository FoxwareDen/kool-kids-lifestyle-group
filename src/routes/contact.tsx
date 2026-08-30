// TODO:NO CMS MANAGING

import { createFileRoute } from '@tanstack/react-router'
import { ContactHero } from '#/components/contact/ContactHero'
import { ContactSection } from '#/components/contact/ContactSection'
import { LocationMap } from '#/components/contact/LocationMap'
import { ContactCta } from '#/components/contact/ContactCta'
import { SiteFooter } from '#/components/footer/SiteFooter'

/**
 * The "Contact" page route. Composes the page-level sections in order: hero,
 * the contact details + form section, the location map, a closing
 * call-to-action and the shared footer.
 */
export const Route = createFileRoute('/contact')({
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
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
  }),
  loaderDeps: ({ search: { lang } }) => ({ lang }),
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
      <ContactHero lang={lang ?? 'en'} />
      <ContactSection lang={lang ?? 'en'} />
      <LocationMap lang={lang ?? 'en'} />
      <ContactCta lang={lang ?? 'en'} />
    </main>
  )
}
