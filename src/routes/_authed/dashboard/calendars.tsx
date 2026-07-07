import { fetchCalendarSchedules, type UnitType, deleteCalendarSchedule } from '#/lib/booking'
import { resolveTranslatable } from '#/lib/experiences';
import { getSessionMiddleware } from '#/routes/__root';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start';
import { useState } from 'react';

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
    
    if (!schedules.success) throw new Error("Failed to fetch schedules")

    return { lang, schedules: schedules.value }
  },  
  component: RouteComponent,
})

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Helper for day names
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function RouteComponent() {
  const { lang, schedules } = Route.useLoaderData();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

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

  if (!schedules || schedules.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 pb-4 border-b border-gray-200">
          Calendars
        </h1>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No calendars found</p>
          <Link
            to="/dashboard/create-calendar"
            search={{ lang: 'en', calId: undefined }}
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Create Calendar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold">Calendars</h1>
        <Link
          to="/dashboard/create-calendar"
          search={{ lang: 'en', calId: undefined }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          + New Calendar
        </Link>
      </div>

      <div className="space-y-6">
        {schedules.map((schedule) => {
          const experience: any[] = schedule.experiences
          const units: any[] = schedule.units
          
          const isDeleting = deletingId === schedule.id;

          return (
            <div 
              key={schedule.id} 
              className={`bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                isDeleting ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {schedule.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {formatDate(schedule.created)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/dashboard/create-calendar"
                      search={{
                        lang: 'en',
                        calId: schedule.id
                      }}
                      {...({ state: { calendar: schedule } } as any)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(schedule.id)}
                      disabled={isDeleting}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Confirmation Dialog */}
              {showDeleteConfirm === schedule.id && (
                <div className="px-6 py-4 bg-red-50 border-b border-red-200">
                  <p className="text-sm text-red-800 mb-3">
                    Are you sure you want to delete "{schedule.title}"? This action cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(schedule.id)}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Date Range</span>
                    <p className="text-gray-900">
                      {formatDate(schedule.start_date)} - {formatDate(schedule.end_date)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Time</span>
                    <p className="text-gray-900">
                      {schedule.start_time} - {schedule.end_time}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Days of Week</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {schedule.days_of_week?.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {DAY_NAMES[day]}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Buffer Time</span>
                  <p className="text-gray-900">{schedule.buffer_minutes} minutes</p>
                </div>

                {experience.map((exp) => (
                  <div key={exp.id}>
                    <hr className="border-gray-200" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Linked Experience
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
                            {exp.coverImage && (
                              <img 
                                src={exp.coverImage} 
                                alt={exp.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {resolveTranslatable(exp.title, lang)}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {resolveTranslatable(exp.title, lang)}
                            </p>
                            {exp.status && (
                              <span className="mt-2 inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                                {exp.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {units.length > 0 && (
                  <>
                    <hr className="border-gray-200" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Unit Types ({units.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {units.map((unit) => (
                          <div key={unit.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{unit.label}</h4>
                                <div className="flex gap-3 mt-1 text-sm text-gray-600">
                                  <span>Capacity: {unit.capacity}</span>
                                  <span>${unit.value}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
                {/* Updated: {formatDate(schedule.updated)} */}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}