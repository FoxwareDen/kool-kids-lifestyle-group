import {
  BedDouble,
  UtensilsCrossed,
  Camera,
  MapPin,
  CalendarDays,
  Users,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { StorySpotlight } from './StorySpotlight'
import { PlanTile } from './PlanTile'

/**
 * A single planning resource rendered as a {@link PlanTile}.
 * @typedef {Object} PlanResource
 * @property {LucideIcon} icon - Icon shown in the tile.
 * @property {string} label - Tile caption.
 * @property {string} href - Link target.
 */

/**
 * Static placeholder planning resources shown in the grid. Replace with
 * CMS-driven content when wiring up live data.
 * @type {PlanResource[]}
 */
const PLAN_RESOURCES: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: BedDouble, label: 'Accommodation', href: '#' },
  { icon: UtensilsCrossed, label: 'Dining', href: '#' },
  { icon: Camera, label: 'Attractions', href: '#' },
  { icon: MapPin, label: 'Maps & Routes', href: '#' },
  { icon: CalendarDays, label: 'Events Calendar', href: '#' },
  { icon: Users, label: 'Guided Experiences', href: '#' },
]

/**
 * The "Plan Your Visit" section. A two-column layout that pairs a
 * {@link StorySpotlight} feature card on the left with a heading, a responsive
 * grid of {@link PlanTile}s and a primary call-to-action button on the right.
 * Sits on a light cream background.
 *
 * @returns {JSX.Element} The rendered plan-your-visit section.
 */
export function PlanYourVisitSection() {
  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          {/* Left: story spotlight */}
          <StorySpotlight
            image="/images/sections/story-spotlight.png"
            imageAlt="Historic church steeple in the Karoo landscape"
            eyebrow="Our Story"
            title="A Town Built on Stories"
            description="Prieska is a place where history, heritage and nature come together. From the Orange River that sustains life to the historic landmarks that define our identity, every corner of Prieska has a story waiting to be discovered."
            ctaLabel="Learn more"
          />

          {/* Right: planning resources */}
          <div className="flex flex-col">
            <SectionHeading
              eyebrow="Plan Your Visit"
              title="Everything You Need for Your Journey"
              theme="light"
              align="left"
            />

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PLAN_RESOURCES.map((resource) => (
                <PlanTile key={resource.label} {...resource} />
              ))}
            </div>

            <a
              href="#"
              className="group mt-3 inline-flex items-center justify-center gap-4 bg-[var(--sea-ink)] px-7 py-4 text-xs font-bold uppercase tracking-widest !text-white no-underline transition-colors hover:bg-[var(--brand-orange)]"
            >
              Book Your Experience
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
