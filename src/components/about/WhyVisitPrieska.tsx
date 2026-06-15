import {
  Waves,
  Mountain,
  Landmark,
  Tent,
  Sun,
  HandHeart,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from '#/components/sections/SectionHeading'

/**
 * A single reason-to-visit rendered in the {@link WhyVisitPrieska} grid.
 * @typedef {Object} Reason
 * @property {LucideIcon} icon - Icon for the reason.
 * @property {string} title - Short heading.
 * @property {string} description - Supporting line of text.
 */

/**
 * Static reasons-to-visit shown in the section. Replace with CMS-driven content
 * when wiring up live data.
 * @type {Reason[]}
 */
const REASONS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Waves,
    title: 'The Orange River',
    description: "Boating, fishing and riverside calm along South Africa's longest river.",
  },
  {
    icon: Mountain,
    title: 'Open Karoo Landscapes',
    description: 'Endless plains, dramatic koppies and some of the clearest night skies anywhere.',
  },
  {
    icon: Landmark,
    title: 'Living Heritage',
    description: 'Historic landmarks and stories that span generations of the Northern Cape.',
  },
  {
    icon: Tent,
    title: 'Adventure & Recreation',
    description: 'Hiking, cycling, quad trails and guided outdoor experiences for every pace.',
  },
  {
    icon: Sun,
    title: 'Unforgettable Sunsets',
    description: "Golden-hour views that turn the Karoo into a photographer's dream.",
  },
  {
    icon: HandHeart,
    title: 'Genuine Hospitality',
    description: 'Warm, community-driven service that makes every visitor feel at home.',
  },
]

/**
 * The "Why Visit Prieska" section. A centered {@link SectionHeading} above a
 * responsive grid of icon-led reasons to choose the destination, on a navy
 * background for contrast against the surrounding light sections.
 *
 * @returns {JSX.Element} The rendered why-visit section.
 */
export function WhyVisitPrieska() {
  return (
    <section className="bg-[var(--brand-navy)] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="A Destination Like No Other"
          title="Why Visit Prieska"
          theme="dark"
        />

        <div className="mt-14 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col gap-3 bg-[var(--brand-navy)] p-8 transition-colors hover:bg-white/[0.04]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] transition-colors group-hover:bg-[var(--brand-orange)] group-hover:text-white">
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="display-title text-lg font-medium text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
