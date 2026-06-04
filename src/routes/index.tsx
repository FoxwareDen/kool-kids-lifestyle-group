// src/routes/index.tsx

import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { HeroSection } from '../components/HeroSection'
import { StatsSection } from '../components/StatsSection'

export const getPageData = createServerFn().handler(async () => {
  // TODO: Do api request to get page data from CMS
  return {}
})

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
    </>
  )
}
