import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/experiences/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello experiences list!</div>
}
