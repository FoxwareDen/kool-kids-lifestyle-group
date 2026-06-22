import { createFileRoute } from '@tanstack/react-router'
import { ExperiencesHero } from '#/components/experiences/ExperiencesHero'
import { ExperiencesGrid } from '#/components/experiences/ExperiencesGrid'
import { ExperiencesCta } from '#/components/experiences/ExperiencesCta'

/**
 * The public "Experiences" page route. Composes the page-level sections in
 * order: hero, the full grid of experiences and a closing call-to-action. The
 * shared site footer is rendered globally by the root route.
 */
export const Route = createFileRoute('/experiences/')({
  head: () => ({
    meta: [
      {
        title: 'Experiences | 360 Experiences',
      },
      {
        name: 'description',
        content:
          'Explore guided cycling, hiking, quad adventures, heritage and photography tours, events and more in Prieska, Northern Cape with 360 Experiences.',
      },
    ],
  }),
  component: ExperiencesPage,
})

/**
 * Renders the full Experiences page by stacking its section components.
 *
 * @returns {JSX.Element} The rendered page.
 */
function ExperiencesPage() {
  return (
    <main>
      <ExperiencesHero />
      <ExperiencesGrid />
      <ExperiencesCta />
    </main>
  )
}
