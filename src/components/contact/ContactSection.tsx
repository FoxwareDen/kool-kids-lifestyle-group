import { ContactForm } from './ContactForm'
import { ContactDetails } from './ContactDetails'
import type { Language } from '#/lib/experiences'

/**
 * The main contact section. Places the {@link ContactDetails} panel beside the
 * {@link ContactForm} in a two-column layout on large screens, stacking them on
 * smaller viewports. Sits on the site's cream background for contrast against
 * the white form card.
 *
 * @returns {JSX.Element} The rendered contact section.
 */
export function ContactSection({ lang = 'en' }: { lang?: Language }) {
  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <ContactDetails lang={lang} />
          <ContactForm lang={lang} />
        </div>
      </div>
    </section>
  )
}
