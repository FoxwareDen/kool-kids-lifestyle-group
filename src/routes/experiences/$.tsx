import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/experiences/$')({
  component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/experiences/page"!</div>
}
