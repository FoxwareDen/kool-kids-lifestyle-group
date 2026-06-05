// src/routes/index.tsx

import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Header } from '../components/Header'
import { HeroSection } from '../components/HeroSection'
import { DiscoverSection } from '../components/DiscoverSection'
import { ExperiencesSection } from '../components/ExperiencesSection'
import { StorySection } from '../components/StorySection'
import { GallerySection } from '../components/GallerySection'
import { CTASection } from '../components/CTASection'
import { Footer } from '../components/Footer'

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
      <Header />
      <main>
        <HeroSection />
        <DiscoverSection />
        <ExperiencesSection />
        <StorySection />
        <GallerySection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
