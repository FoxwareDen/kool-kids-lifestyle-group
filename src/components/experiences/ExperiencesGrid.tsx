import { SectionHeading } from '#/components/sections/SectionHeading'
import { ExperienceCard } from '#/components/sections/ExperienceCard'
import { EXPERIENCES } from '#/data/experiences'

/**
 * The main content section of the "/experiences" page. Renders an intro
 * {@link SectionHeading} on the cream background followed by a responsive grid
 * of every {@link ExperienceCard}, sourced from the shared {@link EXPERIENCES}
 * data so it stays in sync with the home page section.
 *
 * @returns {JSX.Element} The rendered experiences grid section.
 */
export function ExperiencesGrid() {
  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What We Offer"
          title="Explore Our Experiences"
          theme="light"
        />

        <p className="mx-auto mt-4 max-w-2xl text-center text-pretty leading-relaxed text-[var(--brand-navy)]/70">
          From scenic rides and guided hikes to heritage tours and community
          events, every experience is crafted to help you discover the beauty,
          history and adventure of Prieska.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((experience) => (
            <ExperienceCard key={experience.title} {...experience} />
          ))}
        </div>
      </div>
    </section>
  )
}
