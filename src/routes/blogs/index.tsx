import BlogRenderer from '#/components/BlogRenderer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blogs/')({
 loader: async ({location}) => {
    return {slug: location.pathname}
  },
  component: ()=>{
    const { slug } = Route.useLoaderData(); 
    return <BlogRenderer slug={slug} />
  }, 
})
