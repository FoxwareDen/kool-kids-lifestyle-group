import {
  Bike,
  Footprints,
  Compass,
  Landmark,
  Camera,
  Users,
  type LucideIcon,
} from 'lucide-react'

/**
 * A single experience offered by 360 Experiences. Shared between the home page
 * {@link ExperiencesSection} and the dedicated `/experiences` page so both stay
 * in sync from one source of truth.
 *
 * @typedef {Object} Experience
 * @property {string} image - Background image source path.
 * @property {string} imageAlt - Accessible image description.
 * @property {LucideIcon} icon - Icon for the card's badge.
 * @property {string} title - Experience name.
 * @property {string} description - Short supporting line.
 * @property {string} href - Link target. Currently a placeholder until
 *   per-experience detail pages exist.
 */
export interface Experience {
  image: string
  imageAlt: string
  icon: LucideIcon
  title: string
  description: string
  href: string
}

/**
 * The canonical list of experiences shown across the site. Replace with
 * CMS-driven content when wiring up live data.
 *
 * @type {Experience[]}
 */
export const EXPERIENCES: Experience[] = [
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
