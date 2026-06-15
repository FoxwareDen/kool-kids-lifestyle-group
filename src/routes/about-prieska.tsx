import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '#/components/about/AboutHero'
import { AboutIntro } from '#/components/about/AboutIntro'
import { StatsBand } from '#/components/about/StatsBand'
import { MissionVisionValues } from '#/components/about/MissionVisionValues'
import { OurStory } from '#/components/about/OurStory'
import { WhyVisitPrieska } from '#/components/about/WhyVisitPrieska'
import { AboutCta } from '#/components/about/AboutCta'
import { SiteFooter } from '#/components/footer/SiteFooter'

/**
 * The "About Prieska" page route. Composes the page-level sections in order:
 * hero, company intro, trust-building stats, mission/vision/values, the story
 * timeline, reasons to visit, a closing call-to-action and the shared footer.
 */
export const Route = createFileRoute('/about-prieska')({
  head: () => ({
    meta: [
      {
        title: 'About Prieska | 360 Experiences',
      },
      {
        name: 'description',
        content:
          '360 Experiences is a tourism and recreation company sharing the heritage, landscapes and adventure of Prieska in the Northern Cape.',
      },
    ],
  }),
  component: AboutPrieskaPage,
})

/**
 * Renders the full About Prieska page by stacking its section components.
 *
 * @returns {JSX.Element} The rendered page.
 */
function AboutPrieskaPage() {
  return (
    <main>
      <AboutHero />
      <AboutIntro />
      <StatsBand />
      <MissionVisionValues />
      <OurStory />
      <WhyVisitPrieska />
      <AboutCta />
      <SiteFooter />
    </main>
  )
}
