import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getBlogPage } from '#/lib/blog'
import { resolveTranslatable, type Language } from '#/lib/experiences'
import { BookingPageRenderer } from '#/components/BookingPageRenderer'
import { TimelineHero } from '#/components/timeline/TimelineHero'

export const Route = createFileRoute('/blogs/$blogId')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: search.lang as Language,
  }),
  loaderDeps: ({ search: { lang } }) => ({ lang: lang || 'en' }),
  loader: async ({ params: { blogId }, deps: { lang } }) => {
    const result = await getBlogPage(blogId)
    if (!result.success || !result.value)
      throw Error('Failed to fetch event page data')

    return { blogId, lang, data: result.value }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { data, lang } = loaderData
    const title = resolveTranslatable(data.title, lang)
    const seoTitle = `${title} | 360 Experiences`

    return {
      meta: [
        {
          title: seoTitle,
        },
        {
          name: 'description',
          content: `Read ${title} on the 360 Experiences blog.`,
        },
        {
          property: 'og:title',
          content: seoTitle,
        },
        {
          property: 'og:description',
          content: `Read ${title} on the 360 Experiences blog.`,
        },
        {
          property: 'og:type',
          content: 'article',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:title',
          content: seoTitle,
        },
        {
          name: 'twitter:description',
          content: `Read ${title} on the 360 Experiences blog.`,
        },
      ],
    }
  },
  errorComponent: () => {
    return (
      <main className="flex min-h-[70svh] flex-col items-center justify-center bg-[#f4efe7] px-6 text-center">
        <h1 className="text-2xl font-medium text-[var(--brand-navy)]">
          Blog not found
        </h1>
        <p className="mt-2 max-w-md text-sm text-[var(--brand-navy)]/60">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <a
          href="/blogs"
          className="mt-6 inline-block bg-[var(--brand-orange)] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--brand-orange-deep)]"
        >
          Back to blogs
        </a>
      </main>
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data, lang } = Route.useLoaderData()

  const title = resolveTranslatable(data.title, lang)

  return (
    <main className="bg-[#f4efe7]">
      <TimelineHero
        crumbLabel="Blog"
        crumbHref="/blogs"
        eyebrow="Blog Post"
        title={title}
        subtitle="Read our latest stories"
      />

      <section className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr]">
          <article className="flex flex-col gap-8">
            {data.content.length > 0 ? (
              <BookingPageRenderer
                page={{ blocks: data.content }}
                lang={lang}
              />
            ) : (
              <p className="text-sm text-[var(--brand-navy)]/50">
                No content yet.
              </p>
            )}
          </article>
        </div>
      </section>
    </main>
  )
}
