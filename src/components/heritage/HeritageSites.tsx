import { SectionHeading } from '#/components/sections/SectionHeading'
import { LandmarkCard } from './LandmarkCard'
import churchImg from '../../images/church-2.jpeg'
import riverImg from '../../images/orange-river.jpeg'
import koppieImg from '../../images/koppie.jpeg'
import trailImg from '../../images/trail.jpeg'

/**
 * A heritage site shown in the {@link HeritageSites} grid.
 * @typedef {Object} HeritageSite
 * @property {string} image - Photograph of the site.
 * @property {string} name - Name of the landmark.
 * @property {string} description - Short description of its significance.
 * @property {string} location - Location label for the site.
 */

/**
 * Static heritage sites shown in the section. Replace with CMS-driven content
 * when wiring up live data.
 * @type {{ image: string, name: string, description: string, location: string }[]}
 */
const SITES: { image: string; name: string; description: string; location: string }[] = [
  {
    image: riverImg,
    name: 'The Orange River Crossing',
    description:
      'The historic ford and bridge that made Prieska a vital meeting point for travellers and traders.',
    location: 'Riverfront',
  },
  {
    image: koppieImg,
    name: "Tiger's-Eye Hills",
    description:
      "The koppies that gave Prieska its mining fame, still rich with the prized tiger's-eye stone.",
    location: 'Town Outskirts',
  },
  {
    image: churchImg,
    name: 'Historic Church & Buildings',
    description:
      'Stone architecture from the early settlement era that still anchors the town centre today.',
    location: 'Town Centre',
  },
  {
    image: trailImg,
    name: 'The Riverside Fort',
    description:
      "A wartime blockhouse built from local rock, standing as a monument to the region's strategic past.",
    location: 'River Ridge',
  },
]

/**
 * The "Heritage Sites" section. A centered {@link SectionHeading} above a
 * responsive grid of {@link LandmarkCard} entries highlighting the landmarks
 * visitors can explore, on the cream background.
 *
 * @returns {JSX.Element} The rendered heritage sites section.
 */
export function HeritageSites() {
  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Landmarks Worth the Journey"
          title="Heritage Sites to Explore"
          theme="light"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SITES.map((site) => (
            <LandmarkCard key={site.name} {...site} />
          ))}
        </div>
      </div>
    </section>
  )
}
