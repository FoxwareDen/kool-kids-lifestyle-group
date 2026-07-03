// Has CMS MANAGING

import { Landmark, Waves, Mountain, type LucideIcon } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { StoryCard } from './StoryCard'
import { buildImageUrl, type Content } from '#/lib/pocketbase'
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
const STORIES = []

export interface StoriesSectionProps {
  kicker: string,
  title: string
  stories: {
    imageName: string
    imageAlt: string,
    description: string,
    title: string
  }[]
}

/**
 * The "Discover the Stories, Landscapes and Experiences" section. Renders a
 * centered {@link SectionHeading} followed by a responsive grid of
 * {@link StoryCard}s on a light cream background. Designed to sit directly
 * below the hero.
 *
 * @returns {JSX.Element} The rendered stories section.
 */
export function StoriesSection({data}:{data: Content<StoriesSectionProps>}) {
  const { content: {kicker, title, stories}, media } = data;
  
  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={kicker}
          title={title}
          theme="light"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {(stories).map((story) => {
            const image = media[story.imageName];
            return <StoryCard key={story.title} {...story} href='#' image={buildImageUrl(image.collectionId, image.id, image.file)} />
          })}
        </div>
      </div>
    </section>
  )
}
