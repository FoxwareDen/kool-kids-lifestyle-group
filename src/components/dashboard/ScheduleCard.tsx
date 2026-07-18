import { Link } from '@tanstack/react-router'
import { CalendarClock, Clock, Timer } from 'lucide-react'
import type { UnitType } from '#/lib/booking'
import { resolveTranslatable } from '#/lib/experiences'
import { Button, Pill } from './form-controls'
import { UnitTypeTile } from './UnitTypeTile'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Formats an ISO date string as e.g. "Jan 5, 2026". */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * A single detail row: an icon, a label, and a value stacked underneath.
 */
function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Clock
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-[var(--brand-orange)]" aria-hidden="true" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
          {label}
        </p>
        <p className="text-sm text-[var(--sea-ink)]">{children}</p>
      </div>
    </div>
  )
}

/**
 * Displays one calendar schedule: its meta (dates, times, days, buffer), any
 * linked experiences, and its selected unit types. Delete uses an inline
 * confirmation strip rather than a stacked modal, keeping the flow on-page.
 *
 * All state and side effects are owned by the parent; this component only
 * reflects props and calls back on user intent.
 *
 * @param schedule - The schedule record to render.
 * @param lang - Active language for translatable experience fields.
 * @param isDeleting - Whether a delete is in-flight for this schedule.
 * @param confirmingDelete - Whether the inline delete confirmation is open.
 * @param onRequestDelete - Called to open the inline confirmation.
 * @param onCancelDelete - Called to dismiss the inline confirmation.
 * @param onConfirmDelete - Called to perform the delete.
 */
export function ScheduleCard({
  schedule,
  lang,
  isDeleting,
  confirmingDelete,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  schedule: any
  lang: 'en' | 'af' | undefined
  isDeleting: boolean
  confirmingDelete: boolean
  onRequestDelete: () => void
  onCancelDelete: () => void
  onConfirmDelete: () => void
}) {
  const experiences: any[] = schedule.experiences ?? []

  return (
    <article
      className={`overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--surface-strong)] ${
        isDeleting ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] bg-[var(--dash-panel-muted)] px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--sea-ink)]">{schedule.title}</h2>
          <p className="mt-0.5 text-xs text-[var(--sea-ink-soft)]">
            Created {formatDate(schedule.created)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/dashboard/create-calendar"
            search={{ lang: 'en', calId: schedule.id }}
            {...({ state: { calendar: schedule } } as any)}
          >
            <Button variant="ghost">Edit</Button>
          </Link>
          <Button variant="danger" onClick={onRequestDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </header>

      {/* Inline delete confirmation (no stacked modal) */}
      {confirmingDelete && (
        <div className="border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-5 py-4">
          <p className="mb-3 text-sm text-[var(--sea-ink)]">
            Delete <strong>{schedule.title}</strong>? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button variant="danger" onClick={onConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting…' : 'Confirm delete'}
            </Button>
            <Button variant="ghost" onClick={onCancelDelete} disabled={isDeleting}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="space-y-5 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DetailRow icon={CalendarClock} label="Date range">
            {formatDate(schedule.start_date)} – {formatDate(schedule.end_date)}
          </DetailRow>
          <DetailRow icon={Clock} label="Time">
            {schedule.start_time} – {schedule.end_time}
          </DetailRow>
          <DetailRow icon={Timer} label="Buffer">
            {schedule.buffer_minutes} minutes
          </DetailRow>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
            Days of week
          </p>
          <div className="flex flex-wrap gap-2">
            {schedule.days_of_week?.map((day: number) => (
              <Pill key={day} tone="accent">
                {DAY_NAMES[day]}
              </Pill>
            ))}
          </div>
        </div>

        {experiences.length > 0 && (
          <div className="border-t border-[var(--line)] pt-4">
            <h3 className="mb-2 text-sm font-bold text-[var(--sea-ink)]">Linked experiences</h3>
            <div className="space-y-2">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-start gap-4 rounded-sm border border-[var(--line)] bg-[var(--dash-panel-muted)] p-3"
                >
                  <div className="size-16 shrink-0 overflow-hidden rounded-sm bg-[var(--line)]">
                    {exp.coverImage && (
                      <img src={exp.coverImage} alt="" className="size-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[var(--sea-ink)]">
                      {resolveTranslatable(exp.title, lang ?? 'en')}
                    </h4>
                    {exp.status && (
                      <span className="mt-2 inline-block">
                        <Pill tone="neutral">{exp.status}</Pill>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {schedule.units.length > 0 && (
          <div className="border-t border-[var(--line)] pt-4">
            <h3 className="mb-2 text-sm font-bold text-[var(--sea-ink)]">
              Unit types ({schedule.units.length})
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {schedule.units.map((unit: UnitType) => (
                <UnitTypeTile key={unit.id} unit={unit} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
