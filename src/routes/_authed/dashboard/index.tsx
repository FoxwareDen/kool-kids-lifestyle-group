// app/routes/_authed/dashboard/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {
  FilePlus2,
  CalendarDays,
  CalendarPlus,
  Layers,
  CalendarClock,
  Boxes,
  FileText,
  Users,
} from 'lucide-react'
import { getSessionMiddleware } from '#/routes/__root'
import { fetchExperiences } from '#/lib/experiences'
import { fetchCalendarSchedules, fetchUnitTypes } from '#/lib/booking'
import { StatCard } from '#/components/dashboard/StatCard'
import { QuickAccessCard } from '#/components/dashboard/QuickAccessCard'
import { GuideAccordion, type Guide } from '#/components/dashboard/GuideAccordion'

// ------------------------------------------------------------------
// Server data: real counts for the stats row
// ------------------------------------------------------------------
const getDashboardStats = createServerFn()
  .middleware([getSessionMiddleware])
  .handler(async ({ context }) => {
    if (!context.isAuthed) throw new Error('Not authenticated')

    const cookie = context.cookieString
    const [experiences, schedules, units] = await Promise.all([
      fetchExperiences(cookie),
      fetchCalendarSchedules(cookie),
      fetchUnitTypes(cookie),
    ])

    return {
      experiences: experiences.success ? (experiences.value?.length ?? 0) : 0,
      schedules: schedules.success ? (schedules.value?.length ?? 0) : 0,
      units: units.success ? (units.value?.length ?? 0) : 0,
    }
  })

export const Route = createFileRoute('/_authed/dashboard/')({
  loader: async () => await getDashboardStats(),
  component: RouteComponent,
})

// ------------------------------------------------------------------
// Static content: onboarding guides
// ------------------------------------------------------------------
const GUIDES: Guide[] = [
  {
    id: 'create-experience',
    title: 'Creating Experiences',
    description: 'Build new experiences with blocks, images, and multilingual content.',
    icon: FilePlus2,
    steps: [
      'Navigate to "Create Experience" in the sidebar.',
      'Select the language (English / Afrikaans) for the content.',
      'Upload a cover image.',
      'Add categories (type and press Enter).',
      'Fill in the title and short description.',
      'Add content blocks: header, paragraph, image, video, or selectable.',
      'Click "Create Experience" to save.',
      'You can later edit the experience and add translations by switching languages and saving again.',
    ],
  },
  {
    id: 'manage-schedules',
    title: 'Managing Schedules',
    description: 'View, edit, or delete existing schedules for experiences.',
    icon: CalendarDays,
    steps: [
      'Go to "Schedules" in the sidebar.',
      "You'll see a list of all created schedules.",
      'Each schedule shows its linked experience, date range, days of week, buffer time, and unit types.',
      'Click "Edit" to modify the schedule – this opens the creation form with pre-filled data.',
      'Click "Delete" to remove the schedule permanently.',
      'Unit types can also be managed here: add, edit, or remove them.',
    ],
  },
  {
    id: 'create-schedule',
    title: 'Creating Schedules',
    description: 'Link an experience, set dates, times, and define unit types with prices.',
    icon: CalendarPlus,
    steps: [
      'Go to "Create Schedule" in the sidebar.',
      'First, select an existing experience to link the schedule to.',
      'Fill in the title (auto-filled from experience).',
      'Set start and end dates.',
      'Toggle "All-day slot" for full-day bookings (e.g., event, campsite).',
      'Otherwise, set start and end times.',
      'Select the days of the week the schedule applies to.',
      'Set a buffer time between bookings (e.g., cleaning time).',
      'Add unit types: label, capacity, price per unit. You can add multiple.',
      'Click "Create Calendar" to save.',
      'Clicking "Edit" later pre-fills the form – just save to update.',
    ],
  },
]

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
function RouteComponent() {
  const stats = Route.useLoaderData()

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">Welcome back</h1>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          Here&apos;s a snapshot of your workspace and quick links to get things done.
        </p>
      </div>

      {/* Stats row */}
      <section aria-label="Workspace stats" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Experiences"
          value={stats.experiences}
          caption="Published experience pages"
          icon={Layers}
        />
        <StatCard
          label="Schedules"
          value={stats.schedules}
          caption="Active booking schedules"
          icon={CalendarClock}
        />
        <StatCard
          label="Unit Types"
          value={stats.units}
          caption="Bookable units across schedules"
          icon={Boxes}
        />
      </section>

      {/* Quick access */}
      <section aria-label="Quick access" className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[var(--sea-ink)]">Quick access</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAccessCard
            to="/dashboard/experience"
            title="Create Experience"
            description="Compose a new experience page with rich content blocks."
            icon={FilePlus2}
            meta={[{ icon: FileText, label: `${stats.experiences} published` }]}
          />
          <QuickAccessCard
            to="/dashboard/calendars"
            search={{ lang: 'en' }}
            title="Schedules"
            description="Review, edit, or remove existing booking schedules."
            icon={CalendarDays}
            meta={[
              { icon: CalendarClock, label: `${stats.schedules} schedules` },
              { icon: Boxes, label: `${stats.units} units` },
            ]}
          />
          <QuickAccessCard
            to="/dashboard/create-calendar"
            search={{ lang: 'en', calId: undefined }}
            title="Create Schedule"
            description="Link an experience to dates, times, and pricing."
            icon={CalendarPlus}
            meta={[{ icon: Users, label: 'Set capacity & prices' }]}
          />
        </div>
      </section>

      {/* Onboarding guides */}
      <section aria-label="How-to guides" className="flex flex-col gap-4">
        <div id="guides">
          <h2 className="text-lg font-bold text-[var(--sea-ink)]">How-to guides</h2>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
            Step-by-step instructions for common tasks. Tap a guide to expand it.
          </p>
        </div>
        <GuideAccordion guides={GUIDES} />
      </section>
    </div>
  )
}
