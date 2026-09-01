import { BookOpen, CalendarDays } from 'lucide-react'
import type { TimelineEntryKind } from '#/lib/timeline'
import { resolveTranslatable, type Language } from '#/lib/experiences'

/**
 * Props for the {@link TimelineBadge} component.
 * @typedef {Object} TimelineBadgeProps
 * @property {TimelineEntryKind} kind - Whether the entry is a blog or an event.
 */

/**
 * A small pill that labels a timeline entry as either a "Blog" or an "Event".
 * Blogs use the navy brand colour and events use the orange accent so the two
 * content types are easy to distinguish at a glance.
 *
 * @param {TimelineBadgeProps} props - Component props.
 * @returns {JSX.Element} The rendered badge.
 */
export function TimelineBadge({ kind, lang = 'en' }: { kind: TimelineEntryKind; lang?: Language }) {
  const isEvent = kind === 'event'
  const Icon = isEvent ? CalendarDays : BookOpen
  const label = isEvent
    ? resolveTranslatable({ default: 'Event', translations: { af: 'Gebeurtenis' } }, lang)
    : resolveTranslatable({ default: 'Blog', translations: { af: 'Blog' } }, lang)

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] ${
        isEvent
          ? 'bg-[var(--brand-orange)]/12 text-[var(--brand-orange-deep)]'
          : 'bg-[var(--brand-navy)]/8 text-[var(--brand-navy)]'
      }`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  )
}
