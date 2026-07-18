import { Compass, Eye, FileQuestion, HeartHandshake, type LucideIcon } from 'lucide-react'
import { SectionHeading } from '#/components/sections/SectionHeading'
import { ValueCard } from './ValueCard'
import type { Asset } from '#/lib/pocketbase'

interface MissionVisionValues {
    id: string,
    collectionId: string,
    collectionName: string,
    content: {
      kicker: string,
      title: string,
      cards: {icon: string, title: string, description: string}[]      
    }
    media: Record<string, Asset>
    pages: string
  
}

/**
 * The mission, vision and values presented as {@link ValueCard}s. Replace with
 * CMS-driven content when wiring up live data.
 * @type {{ icon: LucideIcon, title: string, description: string }[]}
 */
const PILLARS: { icon: string; title: string; description: string }[] = [
  {
    icon: "Compass",
    title: 'Our Mission',
    description:
      'To deliver authentic, professionally guided tourism and recreation experiences that celebrate Prieska, support our community and create lasting memories for every visitor.',
  },
  {
    icon: "Eye",
    title: 'Our Vision',
    description:
      'To establish Prieska and the Northern Cape as a leading destination for heritage, adventure and recreation, recognised for quality, sustainability and genuine hospitality.',
  },
  {
    icon: "HeartHandshake",
    title: 'Our Values',
    description:
      'Integrity, community, and respect for the land guide everything we do. We operate responsibly, partner locally and treat every guest as part of our story.',
  },
]

const iconMap = (icon:string): LucideIcon => {
  switch (icon.toLocaleLowerCase()) {
    case "compass":
      return Compass
    case "eye":
      return Eye
    case "hearthandshake":
      return HeartHandshake  
    default:
      return FileQuestion;
  }
}

/**
 * The "What Drives Us" section. Presents the company's mission, vision and
 * values in a three-column grid of {@link ValueCard}s beneath a centered
 * {@link SectionHeading}, on a white background.
 *
 * @returns {JSX.Element} The rendered mission/vision/values section.
 */
export function MissionVisionValues({data}: {data: MissionVisionValues}) {
  const {content: {kicker, title, cards}} = data;
  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={kicker? kicker: "What Drives Us"}
          title={title ? title:"Our Mission, Vision &amp; Values"}
          theme="light"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {(cards ? cards : PILLARS).map((pillar) => (
            <ValueCard key={pillar.title} {...pillar} icon={iconMap(pillar.icon)}  />
          ))}
        </div>
      </div>
    </section>
  )
}
