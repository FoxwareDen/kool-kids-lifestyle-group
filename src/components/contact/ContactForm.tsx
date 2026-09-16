import { useState, type FormEvent } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { resolveTranslatable, type Language } from '#/lib/experiences'

/**
 * Shared Tailwind classes for the form text inputs and textarea so every field
 * stays visually consistent.
 * @type {string}
 */
const FIELD_CLASSES =
  'w-full rounded-md border border-[var(--brand-navy)]/15 bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none transition-colors placeholder:text-[var(--brand-navy)]/40 focus:border-[var(--brand-orange)] focus:ring-2 focus:ring-[var(--brand-orange)]/20'

/**
 * The contact form card. Renders accessible, labelled fields for name, email,
 * subject and message with a primary submit button. Submission is handled
 * client-side (no backend) and shows a success confirmation message; wire the
 * `handleSubmit` body to a real endpoint or server action when available.
 *
 * @returns {JSX.Element} The rendered contact form.
 */
export function ContactForm({ lang = 'en' }: { lang?: Language }) {
  const [submitted, setSubmitted] = useState(false)
  const labels = {
    heading: resolveTranslatable({ default: 'Send a Message', translations: { af: 'Stuur ’n Boodskap' } }, lang),
    subheading: resolveTranslatable({ default: 'Drop Us a Line', translations: { af: 'Stuur Ons ’n Boodskap' } }, lang),
    success: resolveTranslatable({ default: 'Thank you!', translations: { af: 'Baie dankie!' } }, lang),
    successMessage: resolveTranslatable({ default: 'Your message has been received. Our team will get back to you within one business day.', translations: { af: 'Jou boodskap is ontvang. Ons span sal binne een besigheidsdag terugkom.' } }, lang),
    name: resolveTranslatable({ default: 'Full Name', translations: { af: 'Volle Naam' } }, lang),
    email: resolveTranslatable({ default: 'Email Address', translations: { af: 'E-posadres' } }, lang),
    subject: resolveTranslatable({ default: 'Subject', translations: { af: 'Onderwerp' } }, lang),
    message: resolveTranslatable({ default: 'Message', translations: { af: 'Boodskap' } }, lang),
    button: resolveTranslatable({ default: 'Send Message', translations: { af: 'Stuur Boodskap' } }, lang),
    placeholder: {
      name: resolveTranslatable({ default: 'Jane Doe', translations: { af: 'Jan van der Merwe' } }, lang),
      email: resolveTranslatable({ default: 'jane@example.com', translations: { af: 'jan@example.com' } }, lang),
      subject: resolveTranslatable({ default: 'Booking enquiry, tour information…', translations: { af: 'Besprekingsnavraag, toerinligting…' } }, lang),
      message: resolveTranslatable({ default: 'Tell us how we can help…', translations: { af: 'Vertel ons hoe ons kan help…' } }, lang),
    },
  }

  /**
   * Handles the form submission. Prevents the default page reload and toggles
   * the local success state.
   *
   * @param {FormEvent<HTMLFormElement>} event - The form submit event.
   * @returns {void}
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-white p-7 shadow-xl shadow-[var(--brand-navy)]/5 sm:p-9">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
        {labels.heading}
      </p>
      <h2 className="display-title mt-2 text-2xl font-medium text-[var(--brand-navy)] sm:text-3xl">
        {labels.subheading}
      </h2>

      {submitted ? (
        <div
          role="status"
          className="mt-8 flex flex-col items-center gap-3 rounded-md bg-[var(--brand-orange)]/10 px-6 py-12 text-center"
        >
          <CheckCircle2 className="h-12 w-12 text-[var(--brand-orange)]" aria-hidden="true" />
          <h3 className="display-title text-xl font-medium text-[var(--brand-navy)]">
            {labels.success}
          </h3>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--brand-navy)]/70">
            {labels.successMessage}
          </p>
        </div>
      ) : (
        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55"
              >
                {labels.name}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder={labels.placeholder.name}
                className={FIELD_CLASSES}
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55"
              >
                {labels.email}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={labels.placeholder.email}
                className={FIELD_CLASSES}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="contact-subject"
              className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55"
            >
              {labels.subject}
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              required
              placeholder={labels.placeholder.subject}
              className={FIELD_CLASSES}
            />
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="mb-1.5 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55"
            >
              {labels.message}
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              placeholder={labels.placeholder.message}
              className={`${FIELD_CLASSES} resize-y`}
            />
          </div>

          <button
            type="submit"
            className="group inline-flex w-full items-center justify-center gap-3 bg-[var(--brand-orange)] px-7 py-3.5 text-xs font-bold uppercase tracking-widest !text-white shadow-lg shadow-black/10 transition-colors hover:bg-[var(--brand-orange-deep)] sm:w-auto"
          >
            {labels.button}
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </form>
      )}
    </div>
  )
}
