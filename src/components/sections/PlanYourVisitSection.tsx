// TODO:NO CMS MANAGING

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
import type { Language } from '#/lib/experiences'

/**
 * A single planning resource rendered as a {@link PlanTile}.
 * @typedef {Object} PlanResource
 * @property {LucideIcon} icon - Icon shown in the tile.
 * @property {string} labelKey - Key used to look up the translated tile caption.
 * @property {string} href - Link target.
 */

/**
 * Static placeholder planning resources shown in the grid.
 */
const PLAN_RESOURCES: { icon: LucideIcon; labelKey: keyof typeof TRANSLATIONS['en']['resources']; href: string }[] = [
  { icon: BedDouble, labelKey: 'accommodation', href: '#' },
  { icon: UtensilsCrossed, labelKey: 'dining', href: '#' },
  { icon: Camera, labelKey: 'attractions', href: '#' },
  { icon: MapPin, labelKey: 'maps', href: '#' },
  { icon: CalendarDays, labelKey: 'calendar', href: '#' },
  { icon: Users, labelKey: 'guided', href: '#' },
]

const TRANSLATIONS = {
  en: {
    story: {
      imageAlt: "Historic church steeple in the Karoo landscape",
      eyebrow: "Our Story",
      title: "A Town Built on Stories",
      description: "Prieska is a place where history, heritage and nature come together. From the Orange River that sustains life to the historic landmarks that define our identity, every corner of Prieska has a story waiting to be discovered.",
      ctaLabel: "Learn more"
    },
    visit: {
      eyebrow: "Plan Your Visit",
      title: "Everything You Need for Your Journey",
      bookCta: "Book Your Experience"
    },
    resources: {
      accommodation: 'Accommodation',
      dining: 'Dining',
      attractions: 'Attractions',
      maps: 'Maps & Routes',
      calendar: 'Events Calendar',
      guided: 'Guided Experiences'
    }
  },
  af: {
    story: {
      imageAlt: "Historiese kerktoring in die Karoolandskap",
      eyebrow: "Ons Storie",
      title: "'n Dorp Gebou op Verhale",
      description: "Prieska is 'n plek waar geskiedenis, erfenis en die natuur saamkom. Van die Oranjerivier wat lewe gee tot die historiese landmerke wat ons identiteit bepaal, het elke hoek van Prieska 'n storie wat wag om ontdek te word.",
      ctaLabel: "Verken meer"
    },
    visit: {
      eyebrow: "Beplan Jou Besoek",
      title: "Alles Wat Jy Nodig Het vir Jou Reis",
      bookCta: "Bespreek Jou Ervaring"
    },
    resources: {
      accommodation: 'Akkommodasie',
      dining: 'Eetplekke',
      attractions: 'Besienswaardighede',
      maps: 'Kaarte & Roetes',
      calendar: 'Gebeurekalender',
      guided: 'Begeleide Ervarings'
    }
  }
}

/**
 * The "Plan Your Visit" section. A two-column layout that pairs a
 * {@link StorySpotlight} feature card on the left with a heading, a responsive
 * grid of {@link PlanTile}s and a primary call-to-action button on the right.
 * Sits on a light cream background.
 *
 * @returns {JSX.Element} The rendered plan-your-visit section.
 */
export function PlanYourVisitSection({ lang = "en" }: { lang?: Language }) {
  // Fallback to 'en' if the passed lang is missing from the dictionary
  const t = TRANSLATIONS[lang === 'af' ? 'af' : 'en'];

  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          {/* Left: story spotlight */}
          <StorySpotlight
            image="/images/sections/story-spotlight.png"
            imageAlt={t.story.imageAlt}
            eyebrow={t.story.eyebrow}
            title={t.story.title}
            description={t.story.description}
            ctaLabel={t.story.ctaLabel}
          />

          {/* Right: planning resources */}
          <div className="flex flex-col">
            <SectionHeading
              eyebrow={t.visit.eyebrow}
              title={t.visit.title}
              theme="light"
              align="left"
            />

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PLAN_RESOURCES.map((resource) => (
                <PlanTile 
                  key={resource.labelKey} 
                  icon={resource.icon}
                  href={resource.href}
                  label={t.resources[resource.labelKey]} 
                />
              ))}
            </div>

            <a
              href="/experiences"
              className="group mt-3 inline-flex items-center justify-center gap-4 bg-[var(--sea-ink)] px-7 py-4 text-xs font-bold uppercase tracking-widest !text-white no-underline transition-colors hover:bg-[var(--brand-orange)]"
            >
              {t.visit.bookCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}