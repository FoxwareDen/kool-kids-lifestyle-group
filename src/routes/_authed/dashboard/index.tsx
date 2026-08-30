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
import { fetchExperiences, resolveTranslatable, type Language } from '#/lib/experiences'
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
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
  }),
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  loader: async ({ deps: { lang } }) => {
    const stats = await getDashboardStats()
    return { ...stats, lang }
  },
  component: RouteComponent,
})

// ------------------------------------------------------------------
// Static content: onboarding guides
// ------------------------------------------------------------------
function getGuides(lang: Language): Guide[] {
  return [
    {
      id: 'create-experience',
      title: resolveTranslatable({ default: 'Creating Experiences', translations: { af: 'Skep Ervarings' } }, lang),
      description: resolveTranslatable({ default: 'Build new experiences with blocks, images, and multilingual content.', translations: { af: 'Bou nuwe ervarings met blokke, beelde en veeltalige inhoud.' } }, lang),
      icon: FilePlus2,
      steps: [
        resolveTranslatable({ default: 'Navigate to "Create Experience" in the sidebar.', translations: { af: 'Gaan na "Skep Ervaring" in die kantbalk.' } }, lang),
        resolveTranslatable({ default: 'Select the language (English / Afrikaans) for the content.', translations: { af: 'Kies die taal (Engels / Afrikaans) vir die inhoud.' } }, lang),
        resolveTranslatable({ default: 'Upload a cover image.', translations: { af: 'Laai ’n voorbladprent op.' } }, lang),
        resolveTranslatable({ default: 'Add categories (type and press Enter).', translations: { af: 'Voeg kategorieë by (tik en druk Enter).' } }, lang),
        resolveTranslatable({ default: 'Fill in the title and short description.', translations: { af: 'Vul die titel en kort beskrywing in.' } }, lang),
        resolveTranslatable({ default: 'Add content blocks: header, paragraph, image, video, or selectable.', translations: { af: 'Voeg inhoudblokke by: kop, paragraaf, beeld, video of kiesbaar.' } }, lang),
        resolveTranslatable({ default: 'Click "Create Experience" to save.', translations: { af: 'Klik "Skep Ervaring" om te stoor.' } }, lang),
        resolveTranslatable({ default: 'You can later edit the experience and add translations by switching languages and saving again.', translations: { af: 'Jy kan later die ervaring redigeer en vertalings byvoeg deur die taal te verander en weer te stoor.' } }, lang),
      ],
    },
    {
      id: 'manage-schedules',
      title: resolveTranslatable({ default: 'Managing Schedules', translations: { af: 'Bestuur Skedules' } }, lang),
      description: resolveTranslatable({ default: 'View, edit, or delete existing schedules for experiences.', translations: { af: 'Beskou, wysig of verwyder bestaande skedules vir ervarings.' } }, lang),
      icon: CalendarDays,
      steps: [
        resolveTranslatable({ default: 'Go to "Schedules" in the sidebar.', translations: { af: 'Gaan na "Skedules" in die kantbalk.' } }, lang),
        resolveTranslatable({ default: "You'll see a list of all created schedules.", translations: { af: 'Jy sal ’n lys van alle geskepte skedules sien.' } }, lang),
        resolveTranslatable({ default: 'Each schedule shows its linked experience, date range, days of week, buffer time, and unit types.', translations: { af: 'Elke skedule toon die gekoppelde ervaring, datumbereik, weekdae, buffer tyd en eenheidstipes.' } }, lang),
        resolveTranslatable({ default: 'Click "Edit" to modify the schedule – this opens the creation form with pre-filled data.', translations: { af: 'Klik "Wysig" om die skedule te verander – dit open die vorm met vooraf ingevulde data.' } }, lang),
        resolveTranslatable({ default: 'Click "Delete" to remove the schedule permanently.', translations: { af: 'Klik "Verwyder" om die skedule permanent te verwyder.' } }, lang),
        resolveTranslatable({ default: 'Unit types can also be managed here: add, edit, or remove them.', translations: { af: 'Eenheidstipes kan hier ook bestuur word: voeg by, wysig of verwyder dit.' } }, lang),
      ],
    },
    {
      id: 'create-schedule',
      title: resolveTranslatable({ default: 'Creating Schedules', translations: { af: 'Skep Skedules' } }, lang),
      description: resolveTranslatable({ default: 'Link an experience, set dates, times, and define unit types with prices.', translations: { af: 'Koppel ’n ervaring, stel datums en tye, en definieer eenheidstipes met pryse.' } }, lang),
      icon: CalendarPlus,
      steps: [
        resolveTranslatable({ default: 'Go to "Create Schedule" in the sidebar.', translations: { af: 'Gaan na "Skep Skedule" in die kantbalk.' } }, lang),
        resolveTranslatable({ default: 'First, select an existing experience to link the schedule to.', translations: { af: 'Kies eers ’n bestaande ervaring om aan die skedule te koppel.' } }, lang),
        resolveTranslatable({ default: 'Fill in the title (auto-filled from experience).', translations: { af: 'Vul die titel in (outomaties gevul vanaf die ervaring).' } }, lang),
        resolveTranslatable({ default: 'Set start and end dates.', translations: { af: 'Stel begin- en einddatums.' } }, lang),
        resolveTranslatable({ default: 'Toggle "All-day slot" for full-day bookings (e.g., event, campsite).', translations: { af: 'Skakel "Heeldaggleufte" aan vir volle-dag besprekings (bv. geleentheid, kampeerterrein).' } }, lang),
        resolveTranslatable({ default: 'Otherwise, set start and end times.', translations: { af: 'Andersins, stel begin- en eindtye.' } }, lang),
        resolveTranslatable({ default: 'Select the days of the week the schedule applies to.', translations: { af: 'Kies die weekdae waarop die skedule van toepassing is.' } }, lang),
        resolveTranslatable({ default: 'Set a buffer time between bookings (e.g., cleaning time).', translations: { af: 'Stel ’n buffer tyd tussen besprekings (bv. skoonmaak tyd).' } }, lang),
        resolveTranslatable({ default: 'Add unit types: label, capacity, price per unit. You can add multiple.', translations: { af: 'Voeg eenheidstipes by: etiket, kapasiteit, prys per eenheid. Jy kan meer as een byvoeg.' } }, lang),
        resolveTranslatable({ default: 'Click "Create Calendar" to save.', translations: { af: 'Klik "Skep Kalender" om te stoor.' } }, lang),
        resolveTranslatable({ default: 'Clicking "Edit" later pre-fills the form – just save to update.', translations: { af: 'As jy later "Wysig" klik, word die vorm vooraf ingevul – stoor net om op te dateer.' } }, lang),
      ],
    },
  ]
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
function RouteComponent() {
  const stats = Route.useLoaderData()
  const { lang = 'en' } = Route.useLoaderDeps()
  const guides = getGuides(lang)
  const welcomeTitle = resolveTranslatable({ default: 'Welcome back', translations: { af: 'Welkom terug' } }, lang)
  const welcomeCopy = resolveTranslatable({ default: 'Here\'s a snapshot of your workspace and quick links to get things done.', translations: { af: 'Hier\'s ’n oorsig van jou werkspasie en vinnige skakels om dinge klaar te kry.' } }, lang)
  const labels = {
    stats: resolveTranslatable({ default: 'Workspace stats', translations: { af: 'Werkspasie-statistieke' } }, lang),
    quickAccess: resolveTranslatable({ default: 'Quick access', translations: { af: 'Vinnige toegang' } }, lang),
    guides: resolveTranslatable({ default: 'How-to guides', translations: { af: 'Gidse' } }, lang),
    guidesIntro: resolveTranslatable({ default: 'Step-by-step instructions for common tasks. Tap a guide to expand it.', translations: { af: 'Stapsgewyse instruksies vir algemene take. Tik op ’n gids om dit uit te brei.' } }, lang),
    experiences: resolveTranslatable({ default: 'Experiences', translations: { af: 'Ervarings' } }, lang),
    schedules: resolveTranslatable({ default: 'Schedules', translations: { af: 'Skedules' } }, lang),
    unitTypes: resolveTranslatable({ default: 'Unit Types', translations: { af: 'Eenheidstipes' } }, lang),
    published: resolveTranslatable({ default: 'Published experience pages', translations: { af: 'Gepubliseerde ervaringsbladse' } }, lang),
    active: resolveTranslatable({ default: 'Active booking schedules', translations: { af: 'Aktiewe bespreking-skedules' } }, lang),
    bookable: resolveTranslatable({ default: 'Bookable units across schedules', translations: { af: 'Besprekbare eenhede oor skedules heen' } }, lang),
    createExperience: resolveTranslatable({ default: 'Create Experience', translations: { af: 'Skep Ervaring' } }, lang),
    createSchedule: resolveTranslatable({ default: 'Create Schedule', translations: { af: 'Skep Skedule' } }, lang),
    setCapacity: resolveTranslatable({ default: 'Set capacity & prices', translations: { af: 'Stel kapasiteit & pryse' } }, lang),
    publishedLabel: resolveTranslatable({ default: '{count} published', translations: { af: '{count} gepubliseer' } }, lang),
    createExperienceDescription: resolveTranslatable({ default: 'Compose a new experience page with rich content blocks.', translations: { af: 'Skep ’n nuwe ervaringsbladsy met ryk inhoudblokke.' } }, lang),
    scheduleDescription: resolveTranslatable({ default: 'Review, edit, or remove existing booking schedules.', translations: { af: 'Beskou, wysig of verwyder bestaande bespreking-skedules.' } }, lang),
    createScheduleDescription: resolveTranslatable({ default: 'Link an experience to dates, times, and pricing.', translations: { af: 'Koppel ’n ervaring aan datums, tye en pryse.' } }, lang),
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">{welcomeTitle}</h1>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">{welcomeCopy}</p>
      </div>

      <section aria-label={labels.stats} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label={labels.experiences}
          value={stats.experiences}
          caption={labels.published}
          icon={Layers}
        />
        <StatCard
          label={labels.schedules}
          value={stats.schedules}
          caption={labels.active}
          icon={CalendarClock}
        />
        <StatCard
          label={labels.unitTypes}
          value={stats.units}
          caption={labels.bookable}
          icon={Boxes}
        />
      </section>

      <section aria-label={labels.quickAccess} className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[var(--sea-ink)]">{labels.quickAccess}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAccessCard
            to="/dashboard/experience"
            title={labels.createExperience}
            description={labels.createExperienceDescription}
            icon={FilePlus2}
            meta={[{ icon: FileText, label: labels.publishedLabel.replace('{count}', String(stats.experiences)) }]}
          />
          <QuickAccessCard
            to="/dashboard/calendars"
            search={{ lang }}
            title={labels.schedules}
            description={labels.scheduleDescription}
            icon={CalendarDays}
            meta={[
              { icon: CalendarClock, label: `${stats.schedules} ${labels.schedules.toLowerCase()}` },
              { icon: Boxes, label: `${stats.units} ${labels.unitTypes.toLowerCase()}` },
            ]}
          />
          <QuickAccessCard
            to="/dashboard/create-calendar"
            search={{ lang, calId: undefined }}
            title={labels.createSchedule}
            description={labels.createScheduleDescription}
            icon={CalendarPlus}
            meta={[{ icon: Users, label: labels.setCapacity }]}
          />
        </div>
      </section>

      <section aria-label={labels.guides} className="flex flex-col gap-4">
        <div id="guides">
          <h2 className="text-lg font-bold text-[var(--sea-ink)]">{labels.guides}</h2>
          <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">{labels.guidesIntro}</p>
        </div>
        <GuideAccordion guides={guides} />
      </section>
    </div>
  )
}
