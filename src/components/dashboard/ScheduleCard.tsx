import { Link } from '@tanstack/react-router'
import { CalendarClock, Clock, Timer } from 'lucide-react'
import type { UnitType } from '#/lib/booking'
import { resolveTranslatable, type Language } from '#/lib/experiences'
import { Button, Pill } from './form-controls'
import { UnitTypeTile } from './UnitTypeTile'

const DAY_NAMES: Record<Language, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  af: ['So', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Sa'],
}

/** Formats an ISO date string as e.g. "Jan 5, 2026". */
function formatDate(dateString: string, lang: Language = 'en'): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(lang === 'af' ? 'en-ZA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
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
  const strings = {
    created: resolveTranslatable({ default: 'Created', translations: { af: 'Geskep' } }, lang ?? 'en'),
    edit: resolveTranslatable({ default: 'Edit', translations: { af: 'Wysig' } }, lang ?? 'en'),
    delete: resolveTranslatable({ default: 'Delete', translations: { af: 'Verwyder' } }, lang ?? 'en'),
    deleting: resolveTranslatable({ default: 'Deleting…', translations: { af: 'Verwyder…' } }, lang ?? 'en'),
    confirmDelete: resolveTranslatable({ default: 'Confirm delete', translations: { af: 'Bevestig verwydering' } }, lang ?? 'en'),
    cancel: resolveTranslatable({ default: 'Cancel', translations: { af: 'Kanselleer' } }, lang ?? 'en'),
    deletePrompt: resolveTranslatable({ default: 'Delete', translations: { af: 'Verwyder' } }, lang ?? 'en'),
    cannotUndo: resolveTranslatable({ default: 'This cannot be undone.', translations: { af: 'Dit kan nie ongedaan gemaak word nie.' } }, lang ?? 'en'),
    dateRange: resolveTranslatable({ default: 'Date range', translations: { af: 'Datumbereik' } }, lang ?? 'en'),
    time: resolveTranslatable({ default: 'Time', translations: { af: 'Tyd' } }, lang ?? 'en'),
    buffer: resolveTranslatable({ default: 'Buffer', translations: { af: 'Buffer' } }, lang ?? 'en'),
    minutes: resolveTranslatable({ default: 'minutes', translations: { af: 'minute' } }, lang ?? 'en'),
    days: resolveTranslatable({ default: 'Days of week', translations: { af: 'Weekdae' } }, lang ?? 'en'),
    linked: resolveTranslatable({ default: 'Linked experiences', translations: { af: 'Gekoppelde ervarings' } }, lang ?? 'en'),
    unitTypes: resolveTranslatable({ default: 'Unit types', translations: { af: 'Eenheidstipes' } }, lang ?? 'en'),
  }

  return (
    <article
      className={`overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--surface-strong)] ${
        isDeleting ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] bg-[var(--dash-panel-muted)] px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--sea-ink)]">{schedule.title}</h2>
          <p className="mt-0.5 text-xs text-[var(--sea-ink-soft)]">
            {strings.created} {formatDate(schedule.created, lang ?? 'en')}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/dashboard/create-calendar"
            search={{ lang: lang ?? 'en', calId: schedule.id }}
            {...({ state: { calendar: schedule } } as any)}
          >
            <Button variant="ghost">{strings.edit}</Button>
          </Link>
          <Button variant="danger" onClick={onRequestDelete} disabled={isDeleting}>
            {isDeleting ? strings.deleting : strings.delete}
          </Button>
        </div>
      </header>

      {confirmingDelete && (
        <div className="border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-5 py-4">
          <p className="mb-3 text-sm text-[var(--sea-ink)]">
            {strings.deletePrompt} <strong>{schedule.title}</strong>? {strings.cannotUndo}
          </p>
          <div className="flex gap-2">
            <Button variant="danger" onClick={onConfirmDelete} disabled={isDeleting}>
              {isDeleting ? strings.deleting : strings.confirmDelete}
            </Button>
            <Button variant="ghost" onClick={onCancelDelete} disabled={isDeleting}>
              {strings.cancel}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-5 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DetailRow icon={CalendarClock} label={strings.dateRange}>
            {formatDate(schedule.start_date, lang ?? 'en')} – {formatDate(schedule.end_date, lang ?? 'en')}
          </DetailRow>
          <DetailRow icon={Clock} label={strings.time}>
            {schedule.start_time} – {schedule.end_time}
          </DetailRow>
          <DetailRow icon={Timer} label={strings.buffer}>
            {schedule.buffer_minutes} {strings.minutes}
          </DetailRow>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
            {strings.days}
          </p>
          <div className="flex flex-wrap gap-2">
            {schedule.days_of_week?.map((day: number) => (
              <Pill key={day} tone="accent">
                {DAY_NAMES[lang ?? 'en'][day]}
              </Pill>
            ))}
          </div>
        </div>

        {experiences.length > 0 && (
          <div className="border-t border-[var(--line)] pt-4">
            <h3 className="mb-2 text-sm font-bold text-[var(--sea-ink)]">{strings.linked}</h3>
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
              {strings.unitTypes} ({schedule.units.length})
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
