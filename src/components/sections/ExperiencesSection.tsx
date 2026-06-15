import {
  Bike,
  Footprints,
  Compass,
  Landmark,
  Camera,
  Users,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { ExperienceCard } from './ExperienceCard'

/**
 * A single entry rendered as an {@link ExperienceCard} within
 * {@link ExperiencesSection}.
 * @typedef {Object} Experience
 * @property {string} image - Background image source path.
 * @property {string} imageAlt - Accessible image description.
 * @property {LucideIcon} icon - Icon for the card's badge.
 * @property {string} title - Experience name.
 * @property {string} description - Short supporting line.
 * @property {string} href - Link target.
 */

/**
 * Static placeholder experiences shown in the section. Replace with CMS-driven
 * content when wiring up live data.
 * @type {Experience[]}
 */
const EXPERIENCES: {
  image: string
  imageAlt: string
  icon: LucideIcon
  title: string
  description: string
  href: string
}[] = [
  {
    image: '/images/sections/cycling.png',
    imageAlt: 'Cyclist riding a scenic Karoo route',
    icon: Bike,
    title: 'Cycling Experiences',
    description: 'Scenic routes and guided rides.',
    href: '#',
  },
  {
    image: '/images/sections/hiking.png',
    imageAlt: 'Hiker walking a trail through the hills',
    icon: Footprints,
    title: 'Hiking Trails',
    description: 'Discover breathtaking landscapes on foot.',
    href: '#',
  },
  {
    image: '/images/sections/quad.png',
    imageAlt: 'Quad bike on a desert trail',
    icon: Compass,
    title: 'Quad Adventures',
    description: 'Explore the Karoo from a new perspective.',
    href: '#',
  },
  {
    image: '/images/sections/heritage-tour.png',
    imageAlt: 'Historic church steeple in Prieska',
    icon: Landmark,
    title: 'Heritage Tours',
    description: "Walk through Prieska's rich history.",
    href: '#',
  },
  {
    image: '/images/sections/photography.png',
    imageAlt: 'Photographer capturing a Karoo sunset',
    icon: Camera,
    title: 'Photography Tours',
    description: 'Capture the beauty of Prieska.',
    href: '#',
  },
  {
    image: '/images/sections/events.png',
    imageAlt: 'People gathered at a community event',
    icon: Users,
    title: 'Events & Recreation',
    description: 'Join community events & outdoor experiences.',
    href: '#',
  },
]

/**
 * The "Choose Your Experience" section. Renders a centered
 * {@link SectionHeading} on a dark navy background, a responsive grid of
 * {@link ExperienceCard}s, and a "View all experiences" call-to-action button.
 *
 * @returns {JSX.Element} The rendered experiences section.
 */
export function ExperiencesSection() {
  return (
    <section className="bg-[var(--brand-navy)] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Adventure Awaits"
          title="Choose Your Experience"
          theme="dark"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {EXPERIENCES.map((experience) => (
            <ExperienceCard key={experience.title} {...experience} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#"
            className="group inline-flex items-center gap-4 bg-transparent border border-white/60 px-7 py-3.5 text-xs font-bold uppercase tracking-widest !text-white no-underline shadow-lg shadow-black/30 transition-colors hover:bg-[var(--brand-orange-deep)]"
          >
            View all experiences
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
