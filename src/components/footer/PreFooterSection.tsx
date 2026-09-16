// TODO:NO CMS MANAGING

import { TestimonialsCard } from './TestimonialsCard'
import { EventsCard } from './EventsCard'
import { ExploreCtaCard } from './ExploreCtaCard'


import { resolveTranslatable, type Language, type Translatable } from '#/lib/experiences'

const data: Record<string, Translatable> = {
  testimonials_eyebrow: {
    default: "Testimonials",
    translations: { af: "Getuigskrifte" },
  },
  testimonials_title: {
    default: "What Visitors Say",
    translations: { af: "Wat Besoekers Sê" },
  },
  events_eyebrow: {
    default: "Upcoming Events",
    translations: { af: "Komende Gebeure" },
  },
  events_title: {
    default: "What's Happening in Prieska",
    translations: { af: "Wat Gebeur in Prieska" },
  },
  events_cta: {
    default: "View all events",
    translations: {
      af: "Bekyk alle gebeure"
    }
  },
  explore_eyebrow: {
    default: "Ready to Explore?",
    translations: { af: "Gereed om te Verken?" },
  },
  explore_title: {
    default: "Ready to Experience Prieska?",
    translations: { af: "Gereed om Prieska te Beleef?" },
  },
  explore_description: {
    default: "Whether you're looking for adventure, heritage, relaxation or discovery, your next experience starts here.",
    translations: { af: "Of jy nou avontuur, erfenis, ontspanning of ontdekking soek — jou volgende belewenis begin hier." },
  },
}

const TESTIMONIALS: { quote: Translatable; author: string }[] = [
  {
    quote: {
      default: 'Prieska exceeded all our expectations. The people, the landscapes and the stories make it a truly special place.',
      translations: { af: 'Prieska het al ons verwagtinge oortref. Die mense, die landskap en die stories maak dit \'n werklik besondere plek.' },
    },
    author: 'Sarah & Mark, Cape Town',
  },
  {
    quote: {
      default: 'A hidden gem in the Northern Cape. We loved every moment on the river and exploring the heritage sites.',
      translations: { af: '\'n Verborge juweeltjie in die Noord-Kaap. Ons het elke oomblik op die rivier en by die erfenisplekke geniet.' },
    },
    author: 'Thabo M., Johannesburg',
  },
  {
    quote: {
      default: 'Warm hospitality and unforgettable sunsets. We are already planning our next trip back to Prieska.',
      translations: { af: 'Warm gasvryheid en onvergeetlike sonsondergange. Ons beplan al ons volgende besoek aan Prieska.' },
    },
    author: 'The Daniels Family, Durban',
  },
]

const EVENTS = [
  {
    day: '24',
    month: 'May',
    title: 'Heritage Walk & Storytelling Tour',
    meta: '10:00 AM • Prieska',
  },
]

export function PreFooterSection({ lang }: { lang: Language }) {


  return (
    <section className="bg-[var(--brand-navy)] py-16">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
          <TestimonialsCard
            eyebrow={resolveTranslatable(data["testimonials_eyebrow"], lang)}
            title={resolveTranslatable(data["testimonials_title"], lang)}
            testimonials={TESTIMONIALS}
            lang={lang}
          />

          <EventsCard
            image="/images/sections/heritage-tour.png"
            imageAlt="Historic church in Prieska"
            eyebrow={resolveTranslatable(data["events_eyebrow"], lang)}
            title={resolveTranslatable(data["events_title"], lang)}
            events={EVENTS}
            ctaLabel={resolveTranslatable(data["events_cta"], lang)}
          />

          <ExploreCtaCard
            eyebrow={resolveTranslatable(data["explore_eyebrow"], lang)}
            title={resolveTranslatable(data["explore_title"], lang)}
            description={resolveTranslatable(data["explore_description"], lang)}
          />
        </div>
      </div>
    </section>
  )
}