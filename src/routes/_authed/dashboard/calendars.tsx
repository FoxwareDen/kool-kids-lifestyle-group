import { fetchCalendarSchedules } from '#/lib/booking'
import { getSessionMiddleware } from '#/routes/__root';
import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start';

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

function RouteComponent() {
  const { lang, schedules } = Route.useLoaderData()

  return <div>
    {(schedules?? []).map((schedule) => (
      <Link 
        to="/dashboard/create-calendar" 
        search={() => ({
          lang: lang,
          calId: schedule.id, // Or pass a real ID if your schedule loop has one!
        })}
        {...({ state: { calendar: schedule } } as any)}
        >
          {schedule.title}
        </Link>
    ))}
  </div>
}
