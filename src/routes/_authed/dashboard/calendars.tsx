import { fetchCalendarSchedules, type UnitType } from '#/lib/booking'
import { getSessionMiddleware } from '#/routes/__root';
import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start';

interface Experience {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  status: string;
  category: string;
  enabledLanguages: string[];
}


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


// Static data (for now)
const STATIC_CALENDARS = [
  {
    id: "8i8431z8drd7472",
    title: "Redrock calendar",
    start_date: "2026-07-01 00:00:00.000Z",
    end_date: "2026-09-30 00:00:00.000Z",
    start_time: "00:00",
    end_time: "23:59",
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    buffer_minutes: 300,
    experiences: ["qu6ei9n74072hio"],
    units: ["1r33970z25ejmdy"],
    created: "2026-07-07 02:56:15.371Z",
    updated: "2026-07-07 04:06:16.439Z",
    collectionId: "pbc_721883598",
    collectionName: "CalendarSchedules"
  }
];

const STATIC_EXPERIENCES: Record<string, Experience> = {
  "qu6ei9n74072hio": {
    id: "qu6ei9n74072hio",
    title: "Welcome to the Red Rocket",
    description: "Appalachia is the name given to a geographic expanse which covers the pre-War state of West Virginia and parts of other states, including Virginia and Ohio.",
    coverImage: "6c0s442prh1l28y",
    status: "Published",
    category: "featured,bar,fallout",
    enabledLanguages: ["en"]
  }
};

const STATIC_UNITS: Record<string, UnitType> = {
  "1r33970z25ejmdy": {
    id: "1r33970z25ejmdy",
    label: "1 Bedroom",
    capacity: 2,
    value: 200
  }
};

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
  // const { lang, schedules } = Route.useLoaderData()

  const schedules = STATIC_CALENDARS;
  const experiencesMap = STATIC_EXPERIENCES;
  const unitsMap = STATIC_UNITS;

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
          // Get related experience (first one for now)
          const experienceId = schedule.experiences?.[0];
          const experience = experienceId ? experiencesMap[experienceId] : null;
          
          // Get related units
          const units = schedule.units?.map(id => unitsMap[id]).filter(Boolean) || [];

          return (
            <div key={schedule.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                  <Link
                    to="/dashboard/create-calendar"
                    search={{
                      lang: 'en',
                      calId: schedule.id
                    }}
                    // state={{ calendar: schedule }}
                    {...({ state: { calendar: schedule } } as any)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>

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

                {experience && (
                  <>
                    <hr className="border-gray-200" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Linked Experience
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0 overflow-hidden">
                            {experience.coverImage && (
                              <img 
                                src={experience.coverImage} 
                                alt={experience.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {experience.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {experience.description}
                            </p>
                            {experience.status && (
                              <span className="mt-2 inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                                {experience.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

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
