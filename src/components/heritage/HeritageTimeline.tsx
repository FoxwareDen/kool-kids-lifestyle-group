import { SectionHeading } from '#/components/sections/SectionHeading'
import { TimelineItem } from '#/components/about/TimelineItem'
import koppieImg from '../../images/koppie.jpeg'
import { resolveTranslatable, type Language } from '#/lib/experiences'

/**
 * Historical milestones rendered in the heritage timeline. Replace with
 * CMS-driven content when wiring up live data.
 * @type {{ year: string, title: string, description: string }[]}
 */
const MILESTONES: { year: string; title: string; description: string }[] = [
  {
    year: 'Early Days',
    title: 'Life Along the Orange River',
    description:
      'Long before formal settlement, the riverbanks sustained communities who fished, farmed and traded across the Northern Cape.',
  },
  {
    year: '1882',
    title: 'The Town Is Established',
    description:
      'Prieska is formally founded, growing into a vital crossing point and trading post on the road through the Karoo.',
  },
  {
    year: 'Early 1900s',
    title: "The Tiger's-Eye Boom",
    description:
      "The surrounding hills become famous for tiger's-eye stone, drawing miners and traders and shaping the local economy.",
  },
  {
    year: 'Wartime Era',
    title: 'The Riverside Fort',
    description:
      "A stone blockhouse and fort built from local rock still stand today as a landmark of the town's strategic past.",
  },
  {
    year: 'Today',
    title: 'Preserving the Legacy',
    description:
      'Heritage sites are protected and celebrated, welcoming visitors to experience the history that defines our region.',
  },
]

/**
 * The "Heritage Timeline" section. A two-column layout pairing a vertical
 * timeline of {@link TimelineItem} milestones with a Karoo koppie photograph,
 * communicating the chronological history of Prieska on a light background.
 *
 * @returns {JSX.Element} The rendered timeline section.
 */
export function HeritageTimeline({ lang = 'en' }: { lang?: Language }) {
  const eyebrow = resolveTranslatable({ default: 'Through the Years', translations: { af: 'Deur die Jare' } }, lang)
  const title = resolveTranslatable({ default: 'Milestones in Our History', translations: { af: 'Mylpale in Ons Geskiedenis' } }, lang)
  const caption = resolveTranslatable({ default: 'Carved by time', translations: { af: 'Uitgesny deur die tyd' } }, lang)
  const subcaption = resolveTranslatable({ default: 'Hills of the Northern Cape', translations: { af: 'Heuwels van die Noord-Kaap' } }, lang)
  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto grid w-full max-w-[1180px] items-start gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Timeline */}
        <div>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
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

        {/* Image */}
        <div className="relative lg:sticky lg:top-28">
          <img
            src={koppieImg}
            alt="Rocky koppie overlooking Prieska, source of the region's tiger's-eye stone"
            className="h-full max-h-[34rem] w-full object-cover shadow-lg"
          />
          <span className="absolute bottom-0 right-0 bg-[var(--brand-navy)] px-6 py-4 text-right text-white">
            <span className="script-title block text-2xl text-[var(--brand-orange)]">{caption}</span>
            <span className="text-xs uppercase tracking-[0.2em] text-white/70">{subcaption}</span>
          </span>
        </div>
      </div>
    </section>
  )
}
