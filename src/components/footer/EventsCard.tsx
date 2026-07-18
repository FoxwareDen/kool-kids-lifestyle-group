import { ArrowRight } from 'lucide-react'

/**
 * A single upcoming event row.
 * @typedef {Object} EventItem
 * @property {string} day - Day number shown in the date badge, e.g. "24".
 * @property {string} month - Short month shown in the date badge, e.g. "MAY".
 * @property {string} title - Event title.
 * @property {string} meta - Secondary line, e.g. "10:00 AM • Prieska".
 */

/**
 * Props for the {@link EventsCard} component.
 * @typedef {Object} EventsCardProps
 * @property {string} image - Background photo source path.
 * @property {string} imageAlt - Accessible description of the background photo.
 * @property {string} eyebrow - Small uppercase kicker shown above the title.
 * @property {string} title - The serif heading text.
 * @property {EventItem[]} events - Events listed inside the card.
 * @property {string} [ctaLabel] - Button text. Defaults to "View all events".
 * @property {string} [ctaHref] - Button link target. Defaults to "#".
 */

/**
 * The center column of the pre-footer band: a photo card with a dark overlay,
 * a heading, a list of upcoming events (each with a date badge) and a primary
 * call-to-action button.
 *
 * @param {EventsCardProps} props - Component props.
 * @returns {JSX.Element} The rendered events card.
 */
export function EventsCard({
  image,
  imageAlt,
  eyebrow,
  title,
  events,
  ctaLabel = 'View all events',
  ctaHref = '#',
}: {
  image: string
  imageAlt: string
  eyebrow: string
  title: string
  events: { day: string; month: string; title: string; meta: string }[]
  ctaLabel?: string
  ctaHref?: string
}) {
  return (
    <article className="relative flex min-h-[20rem] flex-col justify-between overflow-hidden p-7">
      <img
        src={image || '/placeholder.svg'}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[var(--brand-navy)]/78" />

      <header className="relative">
        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
          {eyebrow}
        </p>
        <h3 className="display-title mt-2 text-balance text-center text-2xl font-medium leading-tight text-white sm:text-[1.75rem]">
          {title}
        </h3>
      </header>

      <div className="relative mt-6 space-y-3">
        {events.map((event) => (
          <div
            key={event.title}
            className="flex items-center gap-4 bg-white/95 p-3"
          >
            <div className="flex flex-col items-center justify-center bg-[var(--brand-navy)] px-3 py-2 text-center leading-none text-white">
              <span className="display-title text-2xl font-semibold">{event.day}</span>
              <span className="mt-1 text-[0.6rem] font-bold uppercase tracking-widest">
                {event.month}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight text-[var(--brand-navy)]">
                {event.title}
              </p>
              <p className="mt-1 text-xs text-[var(--brand-navy)]/65">{event.meta}</p>
            </div>
          </div>
        ))}
      </div>

      <a
        href={ctaHref}
        className="group relative mx-auto mt-6 inline-flex items-center gap-3 bg-[var(--brand-navy)] px-6 py-3 text-xs font-bold uppercase tracking-widest !text-white no-underline transition-colors hover:bg-[var(--brand-orange)]"
      >
        {ctaLabel}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </a>
    </article>
  )
}
