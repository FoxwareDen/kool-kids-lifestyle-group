import { ArrowRight, Phone } from 'lucide-react'

/**
 * A full-width call-to-action band that closes the "/experiences" page. A Karoo
 * background sits behind a navy overlay holding a serif headline, a short
 * supporting line and two calls to action — a primary "Book an Experience"
 * button and an outlined "Contact Us" button. Mirrors {@link HeritageCta} for a
 * consistent closing format across secondary pages.
 *
 * @returns {JSX.Element} The rendered call-to-action section.
 */
export function ExperiencesCta() {
  return (
    <section className="relative overflow-hidden">
      <img
        src="/images/sections/hiking.png"
        alt="A guided hike through the hills around Prieska"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[var(--brand-navy)]/85" />

      <div className="relative mx-auto w-full max-w-[1180px] px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
          Ready When You Are
        </p>
        <h2 className="display-title mx-auto mt-3 max-w-2xl text-balance text-3xl font-medium leading-[1.15] text-white sm:text-4xl">
          Start Planning Your Next Adventure
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-white/75">
          Tell us what you&apos;re looking for and our team will help you put
          together the perfect experience in and around Prieska.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#"
            className="group inline-flex items-center gap-3 bg-[var(--brand-orange)] px-7 py-3.5 text-xs font-bold uppercase tracking-widest !text-white no-underline shadow-lg shadow-black/30 transition-colors hover:bg-[var(--brand-orange-deep)]"
          >
            Book an Experience
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/contact"
            className="group inline-flex items-center gap-3 border border-white/60 px-7 py-3.5 text-xs font-bold uppercase tracking-widest !text-white no-underline transition-colors hover:bg-white/10"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}
