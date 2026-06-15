import { SectionHeading } from '#/components/sections/SectionHeading'
import { TimelineItem } from './TimelineItem'
import heritageImg from '../../images/church.jpeg'

/**
 * The milestones rendered in the story timeline. Replace with CMS-driven
 * content when wiring up live data.
 * @type {{ year: string, title: string, description: string }[]}
 */
const MILESTONES: { year: string; title: string; description: string }[] = [
  {
    year: 'The Beginning',
    title: 'A Town Shaped by the River',
    description:
      'Prieska grew along the banks of the Orange River, its history woven from the cultures, trades and landscapes of the Northern Cape.',
  },
  {
    year: 'Our Founding',
    title: 'Sharing Prieska with the World',
    description:
      '360 Experiences was founded to open the doors of our region to visitors, turning local knowledge into unforgettable guided experiences.',
  },
  {
    year: 'Today',
    title: 'A Trusted Destination Partner',
    description:
      'We now offer a full range of tourism and recreation experiences, working hand in hand with the community we proudly call home.',
  },
  {
    year: 'Looking Ahead',
    title: 'Growing Responsibly',
    description:
      'Our focus remains on sustainable tourism that protects our heritage and landscapes while creating opportunity for generations to come.',
  },
]

/**
 * The "Our Story" section. A two-column layout pairing a heritage photograph
 * with a vertical timeline of {@link TimelineItem} milestones, on a light cream
 * background. Communicates the company's history and direction.
 *
 * @returns {JSX.Element} The rendered story section.
 */
export function OurStory() {
  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto grid w-full max-w-[1180px] items-start gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Image */}
        <div className="relative lg:sticky lg:top-28">
          <img
            src={heritageImg}
            alt="Historic church reflecting Prieska's rich heritage"
            className="h-full max-h-[34rem] w-full object-cover shadow-lg"
          />
          <span className="absolute bottom-0 left-0 bg-[var(--brand-navy)] px-6 py-4 text-white">
            <span className="script-title block text-2xl text-[var(--brand-orange)]">Since the river first ran</span>
            <span className="text-xs uppercase tracking-[0.2em] text-white/70">Heritage of the Northern Cape</span>
          </span>
        </div>

        {/* Timeline */}
        <div>
          <SectionHeading
            eyebrow="Our Story"
            title="A Journey Rooted in Place"
            theme="light"
            align="left"
          />
          <ol className="mt-10">
            {MILESTONES.map((milestone, index) => (
              <TimelineItem
                key={milestone.title}
                {...milestone}
                isLast={index === MILESTONES.length - 1}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
