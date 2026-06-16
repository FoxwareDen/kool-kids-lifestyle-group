import { createFileRoute } from '@tanstack/react-router'
import { HeritageHero } from '#/components/heritage/HeritageHero'
import { HeritageIntro } from '#/components/heritage/HeritageIntro'
import { HeritageTimeline } from '#/components/heritage/HeritageTimeline'
import { HeritageSites } from '#/components/heritage/HeritageSites'
import { CulturalTraditions } from '#/components/heritage/CulturalTraditions'
import { HeritageCta } from '#/components/heritage/HeritageCta'
import { SiteFooter } from '#/components/footer/SiteFooter'

/**
 * The "Heritage" page route. Composes the page-level sections in order: hero,
 * historical intro, milestones timeline, heritage sites to explore, cultural
 * traditions, a closing call-to-action and the shared footer.
 */
export const Route = createFileRoute('/heritage')({
  head: () => ({
    meta: [
      {
        title: 'Heritage | 360 Experiences',
      },
      {
        name: 'description',
        content:
          'Discover the living heritage of Prieska — the history, landmarks and cultural traditions of this Northern Cape town on the banks of the Orange River.',
      },
    ],
  }),
  component: HeritagePage,
})

/**
 * Renders the full Heritage page by stacking its section components.
 *
 * @returns {JSX.Element} The rendered page.
 */
function HeritagePage() {
  return (
    <main>
      <HeritageHero />
      <HeritageIntro />
      <HeritageTimeline />
      <HeritageSites />
      <CulturalTraditions />
      <HeritageCta />
      <SiteFooter />
    </main>
  )
}
