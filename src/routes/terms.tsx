import { FlatPageRenderer } from '#/components/BookingPageRenderer'
import { fetchTos, type HydratedBookingPage, type Language } from '#/lib/experiences'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
validateSearch: (search: Record<string, unknown>) => ({
    lang: search.lang as Language,
  }),
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  loader: async ({ location, deps: { lang } }): Promise<{
    data: HydratedBookingPage[]
    lang: Language
  }> => {
    const tos = await fetchTos();

    if (!tos.success || !tos.value) throw Error("Failed to find Terms of service");

    const data = tos.value
    
    return { data, lang: lang || "en" }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data, lang } = Route.useLoaderData()

  return (
    <div className="w-full bg-white pt-24">
      {data.map((page) => (
        <section key={page.id} className="relative z-10">
          <div className="mx-auto max-w-2xl px-6 pt-10 md:px-10">
            <time className="text-2xl font-semibold tracking-tight text-gray-900">
              {(page as any).created}
            </time>
          </div>
          <div className="h-auto">
            <FlatPageRenderer lang={lang} data={page} />
          </div>
        </section>
      ))}
    </div>
  )
}
