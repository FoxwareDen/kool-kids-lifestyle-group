import BlogRenderer from '#/components/BlogRenderer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/')({
  component: BlogRenderer,
})

