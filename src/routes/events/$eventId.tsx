import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId')({
  loader: async ({params}) =>{
    return {eventId: params.eventId}
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { eventId } = Route.useLoaderData();
  
  return <div>Hello "/events/{eventId}"!</div>
}
