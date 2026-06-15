import { Check } from 'lucide-react'
import prieskaImg from '../../images/prieska.jpeg'
import riverImg from '../../images/orange-river.jpeg'

/**
 * Short bullet points highlighting what makes the destination distinctive.
 * @type {string[]}
 */
const HIGHLIGHTS: string[] = [
  'Locally owned and proudly rooted in the Northern Cape',
  'Guided tourism, adventure and recreation experiences',
  'A gateway to the Orange River and the open Karoo',
  'Authentic heritage, hospitality and storytelling',
]

/**
 * The introductory "Welcome" section of the About page. Pairs a stacked photo
 * collage on the left with a company overview, a list of highlights and a
 * signature line on the right. Establishes who the company is and the place it
 * represents, on a light cream background.
 *
 * @returns {JSX.Element} The rendered intro section.
 */
export function AboutIntro() {
  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Image collage */}
        <div className="relative">
          <img
            src={prieskaImg}
            alt="The town of Prieska nestled against the Karoo hills"
            className="h-[26rem] w-full object-cover shadow-lg"
          />
          <img
            src={riverImg}
            alt="The Orange River winding past Prieska"
            className="absolute -bottom-8 -right-4 hidden h-44 w-56 border-4 border-[#f1ede6] object-cover shadow-xl sm:block"
          />
          <span className="absolute -left-4 top-8 hidden bg-[var(--brand-orange)] px-5 py-4 text-white shadow-lg lg:block">
            <span className="display-title block text-3xl font-semibold leading-none">10+</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em]">Years of Experiences</span>
          </span>
        </div>

        {/* Copy */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
            Welcome to Prieska
          </p>
          <h2 className="display-title mt-3 text-balance text-3xl font-medium leading-[1.15] text-[var(--brand-navy)] sm:text-4xl">
            A Tourism &amp; Recreation Company Built on Place and People
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-[var(--brand-navy)]/75">
            360 Experiences is a tourism and recreational company dedicated to
            showcasing the very best of Prieska and the wider Northern Cape.
            From the life-giving Orange River to the wide, open Karoo, we craft
            experiences that connect visitors with the landscapes, heritage and
            warm hospitality that define our region.
          </p>
          <p className="mt-4 text-pretty leading-relaxed text-[var(--brand-navy)]/75">
            Whether you are seeking adventure, relaxation, culture or discovery,
            our team brings local knowledge and professional care to every
            journey we guide.
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)]">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed text-[var(--brand-navy)]/80">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
