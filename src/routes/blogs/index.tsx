import BlogRenderer from '#/components/BlogRenderer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blogs/')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
  }),
  loaderDeps: ({ search: { lang } }) => ({ lang }),
  loader: async ({ location }) => {
    return { slug: location.pathname }
  },
  component: () => {
    const { slug } = Route.useLoaderData();
    const { lang } = Route.useLoaderDeps();
    return <BlogRenderer slug={slug} lang={lang ?? 'en'} />
  },
})
