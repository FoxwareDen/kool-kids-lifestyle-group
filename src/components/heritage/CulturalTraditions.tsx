import {
  Gem,
  Music,
  UtensilsCrossed,
  Languages,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from '#/components/sections/SectionHeading'

/**
 * A cultural tradition rendered in the {@link CulturalTraditions} grid.
 * @typedef {Object} Tradition
 * @property {LucideIcon} icon - Icon representing the tradition.
 * @property {string} title - Short heading.
 * @property {string} description - Supporting line of text.
 */

/**
 * Static cultural traditions shown in the section. Replace with CMS-driven
 * content when wiring up live data.
 * @type {Tradition[]}
 */
const TRADITIONS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Gem,
    title: 'Stone Craft',
    description:
      "Local artisans shape tiger's-eye and semi-precious stone into jewellery and keepsakes.",
  },
  {
    icon: Music,
    title: 'Music & Storytelling',
    description:
      'Generations of song, dance and oral history keep the spirit of the Northern Cape alive.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Karoo Cuisine',
    description:
      'Hearty traditional dishes and riverside braais rooted in the flavours of the region.',
  },
  {
    icon: Languages,
    title: 'A Meeting of Cultures',
    description:
      'A blend of languages and customs that reflects the many communities who call Prieska home.',
  },
]

/**
 * The "Cultural Traditions" section. A centered {@link SectionHeading} above a
 * responsive grid of icon-led traditions, on a navy background for contrast
 * against the surrounding light sections.
 *
 * @returns {JSX.Element} The rendered cultural traditions section.
 */
export function CulturalTraditions() {
  return (
    <section className="bg-[var(--brand-navy)] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Soul of Our Town"
          title="Culture & Living Traditions"
          theme="dark"
        />

        <div className="mt-14 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {TRADITIONS.map(({ icon: Icon, title, description }) => (
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
