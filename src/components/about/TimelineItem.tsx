/**
 * Props for the {@link TimelineItem} component.
 * @typedef {Object} TimelineItemProps
 * @property {string} year - The era or year label for this milestone.
 * @property {string} title - Short heading describing the milestone.
 * @property {string} description - Supporting paragraph text.
 * @property {boolean} [isLast] - Whether this is the final item, used to hide
 *   the trailing connector line. Defaults to false.
 */

/**
 * A single milestone in the {@link OurStory} vertical timeline. Renders an
 * orange node on a connecting line, a year label and a titled description.
 *
 * @param {TimelineItemProps} props - Component props.
 * @returns {JSX.Element} The rendered timeline entry.
 */
export function TimelineItem({
  year,
  title,
  description,
  isLast = false,
}: {
  year: string
  title: string
  description: string
  isLast?: boolean
}) {
  return (
    <li className="relative flex gap-6 pb-10 last:pb-0">
      {/* Node + connector */}
      <div className="relative flex flex-col items-center">
        <span className="z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--brand-orange)] ring-4 ring-[var(--brand-orange)]/20" />
        {!isLast && (
          <span
            aria-hidden="true"
            className="absolute top-5 h-full w-px bg-[var(--brand-navy)]/15"
          />
        )}
      </div>

      {/* Content */}
      <div className="pb-1">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]">
          {year}
        </p>
        <h3 className="display-title mt-1 text-lg font-medium text-[var(--brand-navy)]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--brand-navy)]/70">
          {description}
        </p>
      </div>
    </li>
  )
}
