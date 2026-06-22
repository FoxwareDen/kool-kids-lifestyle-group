import { ArrowRight } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { ExperienceCard } from './ExperienceCard'
import { EXPERIENCES } from '#/data/experiences'

/**
 * The "Choose Your Experience" section. Renders a centered
 * {@link SectionHeading} on a dark navy background, a responsive grid of
 * {@link ExperienceCard}s, and a "View all experiences" call-to-action button.
 *
 * @returns {JSX.Element} The rendered experiences section.
 */
export function ExperiencesSection() {
  return (
    <section className="bg-[var(--brand-navy)] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Adventure Awaits"
          title="Choose Your Experience"
          theme="dark"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {EXPERIENCES.map((experience) => (
            <ExperienceCard key={experience.title} {...experience} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="/experiences"
            className="group inline-flex items-center gap-4 bg-transparent border border-white/60 px-7 py-3.5 text-xs font-bold uppercase tracking-widest !text-white no-underline shadow-lg shadow-black/30 transition-colors hover:bg-[var(--brand-orange-deep)]"
          >
            View all experiences
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
