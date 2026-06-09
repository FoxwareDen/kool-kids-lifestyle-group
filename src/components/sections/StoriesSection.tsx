import { Landmark, Waves, Mountain, type LucideIcon } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { StoryCard } from './StoryCard'

/**
 * A single entry rendered as a {@link StoryCard} within {@link StoriesSection}.
 * @typedef {Object} Story
 * @property {string} image - Banner image source path.
 * @property {string} imageAlt - Accessible image description.
 * @property {LucideIcon} icon - Icon for the card's badge.
 * @property {string} title - Card heading.
 * @property {string} description - Supporting text.
 * @property {string} href - Learn-more link target.
 */

/**
 * Static placeholder stories shown in the section. Replace with CMS-driven
 * content when wiring up live data.
 * @type {Story[]}
 */
const STORIES: {
  image: string
  imageAlt: string
  icon: LucideIcon
  title: string
  description: string
  href: string
}[] = [
  {
    image: '/images/sections/heritage.png',
    imageAlt: 'Historic white church with a steeple in Prieska',
    icon: Landmark,
    title: 'Heritage',
    description:
      'Explore the rich history, architecture and stories that have shaped Prieska for generations.',
    href: '#',
  },
  {
    image: '/images/sections/orange-river.png',
    imageAlt: 'The Orange River flowing through the Karoo landscape',
    icon: Waves,
    title: 'Orange River',
    description:
      'Experience the life-giving river that flows through the heart of our town and defines its identity.',
    href: '#',
  },
  {
    image: '/images/sections/karoo-landscape.png',
    imageAlt: 'Karoo landscape at sunset with open plains',
    icon: Mountain,
    title: 'Karoo Landscapes',
    description:
      'Wide open spaces, spectacular sunsets and unforgettable natural beauty.',
    href: '#',
  },
]

/**
 * The "Discover the Stories, Landscapes and Experiences" section. Renders a
 * centered {@link SectionHeading} followed by a responsive grid of
 * {@link StoryCard}s on a light cream background. Designed to sit directly
 * below the hero.
 *
 * @returns {JSX.Element} The rendered stories section.
 */
export function StoriesSection() {
  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="A Destination Like No Other"
          title="Discover the Stories, Landscapes and Experiences of Prieska"
          theme="light"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STORIES.map((story) => (
            <StoryCard key={story.title} {...story} />
          ))}
        </div>
      </div>
    </section>
  )
}
