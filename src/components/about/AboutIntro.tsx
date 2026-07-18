import { Check } from "lucide-react"
import riverImg from "../../images/orange-river.jpeg"
import trailImg from "../../images/trail.jpeg"
import type { Asset } from "#/lib/pocketbase"

/**
 * Short bullet points highlighting what makes the destination distinctive.
 * @type {string[]}
 */
const HIGHLIGHTS: string[] = [
  "Locally owned and proudly rooted in the Northern Cape",
  "Guided tourism, adventure and recreation experiences",
  "A gateway to the Orange River and the open Karoo",
  "Authentic heritage, hospitality and storytelling",
]

interface AboutIntro {
  id: string,
  collectionId: string,
  collectionName: string,
  content:{
    badge: string
    body_1: string
    body_2: string
    features: string[],
    highlights: string[]
    image_order: string[]
    kicker: string,
    title: string
  }
  media: Record<string, Asset>
  pages: string
}

/**
 * The introductory "Welcome" section of the About page. Pairs a stacked photo
 * collage on the left with a company overview, a list of highlights and a
 * signature line on the right. Establishes who the company is and the place it
 * represents, on a light cream background.
 *
 * @returns {JSX.Element} The rendered intro section.
 */
export function AboutIntro({data}:{data: AboutIntro}) {
  const {content: {features, title, kicker, badge, body_1, body_2, image_order} , media} = data;

  return (
    <section id="about-intro" className="bg-[#f1ede6] py-20">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Image collage */}
        <div className="relative">
          <img
            src={trailImg}
            alt="The town of Prieska nestled against the Karoo hills"
            className="h-[26rem] w-full object-cover shadow-lg"
          />
          <img
            src={riverImg}
            alt="The Orange River winding past Prieska"
            className="absolute -bottom-8 -right-4 hidden h-44 w-56 border-4 border-[#f1ede6] object-cover shadow-xl sm:block"
          />
          <span className="absolute -left-4 top-8 hidden bg-[var(--brand-orange)] px-5 py-4 text-white shadow-lg lg:block">
            <span className="display-title block text-3xl font-semibold leading-none">{
              badge.split(" ")[0].trim().length > 0 ? badge.split(" ")[0].trim(): "10+"
              }</span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em]">{
              badge.slice(3, badge.length).length > 0 ? badge.slice(3, badge.length) :"Years of Experiences"
              }</span>
          </span>
        </div>

        {/* Copy */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
            {kicker ? kicker : "Welcome to Prieska"}
          </p>
          <h2 className="display-title mt-3 text-balance text-3xl font-medium leading-[1.15] text-[var(--brand-navy)] sm:text-4xl">
            {title ? title : "A Tourism &amp; Recreation Company Built on Place and People"}
          </h2>
          <p className="mt-5 text-pretty leading-relaxed text-[var(--brand-navy)]/75">
            {body_1 ? body_1 : "360 Experiences is a tourism and recreational company dedicated to showcasing the very best of Prieska and the wider Northern Cape. From the life-giving Orange River to the wide, open Karoo, we craft experiences that connect visitors with the landscapes, heritage and warm hospitality that define our region."}
          </p>
          <p className="mt-4 text-pretty leading-relaxed text-[var(--brand-navy)]/75">
            {body_2 ? body_2 : "Whether you are seeking adventure, relaxation, culture or discovery, our team brings local knowledge and professional care to every journey we guide."}
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {(features ? features: HIGHLIGHTS).map((item) => (
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
