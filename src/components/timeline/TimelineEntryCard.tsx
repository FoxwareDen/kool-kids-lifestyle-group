import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { TimelineEntry } from '#/lib/timeline'
import { TimelineBadge } from './TimelineBadge'
import { resolveTranslatable, type Language } from '#/lib/experiences'

/**
 * Formats an ISO date string as a readable long-form date (e.g. "5 March 2025").
 * Returns an empty string for missing or invalid dates.
 *
 * @param {string | undefined} iso - The ISO date string.
 * @returns {string} The formatted date, or an empty string.
 */
function formatDate(iso: string | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Builds the human-readable date label for an entry. Events with a start and
 * end date render as a range; everything else shows a single date.
 *
 * @param {TimelineEntry} entry - The timeline entry.
 * @returns {string} The date label.
 */
function getDateLabel(entry: TimelineEntry): string {
  if (entry.kind === 'event' && entry.startDate) {
    const start = formatDate(entry.startDate)
    const end = formatDate(entry.endDate)
    return end && end !== start ? `${start} – ${end}` : start
  }
  return formatDate(entry.date)
}

/**
 * Props for the {@link TimelineEntryCard} component.
 * @typedef {Object} TimelineEntryCardProps
 * @property {TimelineEntry} entry - The timeline entry to render.
 * @property {boolean} [isLast] - Whether this is the final entry, used to hide
 *   the trailing connector line. Defaults to false.
 */

/**
 * A single entry on the timeline rail. Renders an orange node connected to the
 * vertical line, a date, a type badge, the title and a short excerpt, plus a
 * "Read more" link to the relevant blog or event detail route.
 *
 * @param {TimelineEntryCardProps} props - Component props.
 * @returns {JSX.Element} The rendered timeline entry.
 */
export function TimelineEntryCard({
  entry,
  isLast = false,
  lang = 'en',
}: {
  entry: TimelineEntry
  isLast?: boolean
  lang?: Language
}) {
  const dateLabel = getDateLabel(entry)
  const detailLink =
    entry.kind === 'event'
      ? { to: '/events/$eventId', params: { eventId: entry.id } }
      : { to: '/blogs/$blogId', params: { blogId: entry.id } }
  const readMore = resolveTranslatable({ default: 'Read more', translations: { af: 'Lees meer' } }, lang)

  return (
    <li className="relative flex gap-6 pb-12 last:pb-0">
      {/* Node + connector */}
      <div className="relative flex flex-col items-center">
        <span className="z-10 mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--brand-orange)] ring-4 ring-[var(--brand-orange)]/20" />
        {!isLast && (
          <span
            aria-hidden="true"
            className="absolute top-5 h-full w-px bg-[var(--brand-navy)]/15"
          />
        )}
      </div>

      {/* Content card */}
      <article className="flex-1 rounded-xl border border-[var(--line)] bg-white p-5 shadow-sm shadow-black/5 transition-transform duration-300 hover:-translate-y-0.5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          {dateLabel && (
            <time
              dateTime={entry.date}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]"
            >
              {dateLabel}
            </time>
          )}
          <TimelineBadge kind={entry.kind} lang={lang} />
        </div>

        <h3 className="display-title mt-3 text-balance text-xl font-medium leading-snug text-[var(--brand-navy)] sm:text-2xl">
          {entry.title}
        </h3>

        {entry.excerpt && (
          <p className="mt-2 text-pretty text-sm leading-relaxed text-[var(--brand-navy)]/70">
            {entry.excerpt}
          </p>
        )}

        <Link
          {...detailLink}
          className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest !text-[var(--brand-orange)] no-underline hover:!text-[var(--brand-orange-deep)]"
        >
          {readMore}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </article>
    </li>
  )
}
