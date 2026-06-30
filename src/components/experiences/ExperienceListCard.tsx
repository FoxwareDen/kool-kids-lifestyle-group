import { ArrowRight } from 'lucide-react'
import {
  parseCategories,
  resolveTranslatable,
  type HydratedBookingPage,
  type Language,
} from '#/lib/experiences'

/**
 * Title-case a raw category string for display.
 * @param {string} category - The raw category label.
 * @returns {string} The display label.
 */
function tagLabel(category: string): string {
  return category
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * A landscape content card for the experiences index grid. Shows the cover
 * image, visible category tags (the internal "featured" flag is hidden), the
 * title and a truncated description, linking through to the experience detail
 * page.
 *
 * @param {{ experience: HydratedBookingPage, lang: Language }} props - Props.
 * @returns {JSX.Element} The rendered card.
 */
export function ExperienceListCard({
  experience,
  lang,
}: {
  experience: HydratedBookingPage
  lang: Language
}) {
  const title = resolveTranslatable(experience.title, lang)
  const description = experience.description
    ? resolveTranslatable(experience.description, lang)
    : ''
  const tags = parseCategories(experience.category).filter(
    (c) => c.toLowerCase() !== 'featured',
  )

  return (
    <a
      href={`/experiences/${experience.id}`}
      className="group flex flex-col overflow-hidden border border-[var(--brand-navy)]/10 bg-white no-underline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--brand-navy)]/10"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={experience.coverImage || '/placeholder.svg'}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {tags.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--brand-navy)]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm"
              >
                {tagLabel(tag)}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="display-title text-xl font-medium leading-tight text-[var(--brand-navy)]">
          {title}
        </h3>
        {description && (
          <p className="text-sm leading-relaxed text-[var(--brand-navy)]/65">
            {description.length > 120 ? `${description.slice(0, 120)}…` : description}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-orange)]">
          View experience
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  )
}
