import { fetchCalendarSchedules, deleteCalendarSchedule, fetchUnitTypes, deleteUnitType } from '#/lib/booking'
import { getSessionMiddleware } from '#/routes/__root';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start';
import { CalendarPlus, CalendarX } from 'lucide-react';
import { useState } from 'react';
import { Button, SectionCard } from '#/components/dashboard/form-controls';
import { ScheduleCard } from '#/components/dashboard/ScheduleCard';
import { UnitTypeTile } from '#/components/dashboard/UnitTypeTile';

const getAuth = createServerFn().middleware([getSessionMiddleware]).handler(async ({context})=>{
  if(!context.isAuthed) throw new Error("Not authenticated")
  return { isAuthed: context.isAuthed, language: context.language, cookieString: context.cookieString }
})

export const Route = createFileRoute('/_authed/dashboard/calendars')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
  }),
  loaderDeps: ({ search: {lang} }) => ({lang}),
  loader: async ({deps: { lang }}) => {
    const auth = await getAuth()

    const schedules = await fetchCalendarSchedules(auth.cookieString);
    const units = await fetchUnitTypes(auth.cookieString);

    if (!schedules.success) throw new Error("Failed to fetch schedules")

    if (!units.success) throw new Error("Failed to fetch unit types")

    return { lang, schedules: schedules.value, units: units.value}
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { lang, schedules, units } = Route.useLoaderData();
  const router = useRouter();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deletingUnitId, setDeletingUnitId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCalendarSchedule(id);
      await router.invalidate();
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteUnit = async (id: string) => {
    setDeletingUnitId(id);
    try {
      await deleteUnitType(id);
      await router.invalidate();
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setDeletingUnitId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Schedules</h1>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
            Booking calendars that define when an experience can be reserved.
          </p>
        </div>
        <Link to="/dashboard/create-calendar" search={{ lang: 'en', calId: undefined }}>
          <Button variant="primary">
            <CalendarPlus className="size-4" />
            New schedule
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      {!schedules || schedules.length === 0 ? (
        <SectionCard>
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-sm bg-[var(--dash-panel-muted)]">
              <CalendarX className="size-6 text-[var(--sea-ink-soft)]" />
            </span>
            <p className="text-sm font-semibold text-[var(--sea-ink)]">No schedules yet</p>
            <p className="max-w-sm text-sm text-[var(--sea-ink-soft)]">
              Create your first schedule to start accepting bookings for an experience.
            </p>
            <Link to="/dashboard/create-calendar" search={{ lang: 'en', calId: undefined }}>
              <Button variant="primary">
                <CalendarPlus className="size-4" />
                Create schedule
              </Button>
            </Link>
          </div>
        </SectionCard>
      ) : (
        <div className="space-y-5">
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              lang={lang}
              isDeleting={deletingId === schedule.id}
              confirmingDelete={showDeleteConfirm === schedule.id}
              onRequestDelete={() => setShowDeleteConfirm(schedule.id)}
              onCancelDelete={() => setShowDeleteConfirm(null)}
              onConfirmDelete={() => handleDelete(schedule.id)}
            />
          ))}
        </div>
      )}

      {/* All unit types — managed independently of any single schedule */}
      <div className="mt-8">
        <SectionCard
          title="All unit types"
          description="Reusable inventory (rooms, seats, slots) that schedules draw from."
        >
          {units && units.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {units.map((unit) => (
                <UnitTypeTile
                  key={unit.id}
                  unit={unit}
                  onDelete={handleDeleteUnit}
                  deleting={deletingUnitId === unit.id}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--sea-ink-soft)]">
              No unit types yet — add them while creating a schedule.
            </p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
