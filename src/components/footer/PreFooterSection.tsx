// TODO:NO CMS MANAGING

import { TestimonialsCard } from './TestimonialsCard'
import { EventsCard } from './EventsCard'
import { ExploreCtaCard } from './ExploreCtaCard'

/**
 * Static placeholder testimonials. Replace with CMS-driven content when wiring
 * up live data.
 * @type {{ quote: string; author: string }[]}
 */
const TESTIMONIALS = [
  {
    quote:
      'Prieska exceeded all our expectations. The people, the landscapes and the stories make it a truly special place.',
    author: 'Sarah & Mark, Cape Town',
  },
  {
    quote:
      'A hidden gem in the Northern Cape. We loved every moment on the river and exploring the heritage sites.',
    author: 'Thabo M., Johannesburg',
  },
  {
    quote:
      'Warm hospitality and unforgettable sunsets. We are already planning our next trip back to Prieska.',
    author: 'The Daniels Family, Durban',
  },
]

/**
 * Static placeholder events shown in the {@link EventsCard}.
 * @type {{ day: string; month: string; title: string; meta: string }[]}
 */
const EVENTS = [
  {
    day: '24',
    month: 'May',
    title: 'Heritage Walk & Storytelling Tour',
    meta: '10:00 AM • Prieska',
  },
]

/**
 * The pre-footer band that sits above the {@link SiteFooter}. A three-column
 * layout on a navy background pairing visitor testimonials, an upcoming-events
 * card and a "ready to explore" call-to-action block.
 *
 * @returns {JSX.Element} The rendered pre-footer section.
 */
export function PreFooterSection() {
  return (
    <section className="bg-[var(--brand-navy)] py-16">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
          <TestimonialsCard
            eyebrow="Testimonials"
            title="What Visitors Say"
            testimonials={TESTIMONIALS}
          />

          <EventsCard
            image="/images/sections/heritage-tour.png"
            imageAlt="Historic church in Prieska"
            eyebrow="Upcoming Events"
            title="What's Happening in Prieska"
            events={EVENTS}
          />

          <ExploreCtaCard
            eyebrow="Ready to Explore?"
            title="Ready to Experience Prieska?"
            description="Whether you're looking for adventure, heritage, relaxation or discovery, your next experience starts here."
          />
        </div>
      </div>
    </section>
  )
}
