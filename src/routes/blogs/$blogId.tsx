import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blogs/$blogId')({
  loader: async ({params}) =>{
    return {
      blogId: params.blogId
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { blogId } = Route.useLoaderData();
  
  return <div>Hello "/blogs/{blogId}"!</div>
}
