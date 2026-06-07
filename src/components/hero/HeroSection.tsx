import { useEffect, useState } from 'react'
import { Mouse } from 'lucide-react'
import { SiteHeader } from './SiteHeader'
import { HeroButton } from './HeroButton'
import { HeroSlides } from './HeroSlides'

/**
 * A background image used by the hero carousel.
 * @typedef {Object} HeroSlide
 * @property {string} src - Image source path.
 * @property {string} alt - Accessible description of the image.
 */

/**
 * Background slides cycled through behind the hero content.
 * @type {Array<{ src: string, alt: string }>}
 */
const SLIDES = [
  { src: '/hero-karoo-river.png', alt: 'Orange River winding through the Karoo at sunset' },
  { src: '/hero-karoo-landscape.png', alt: 'Open Karoo plains at golden hour' },
  { src: '/hero-karoo-heritage.png', alt: 'Historic church tower in Prieska at sunset' },
]

/** Milliseconds between automatic slide transitions. */
const AUTOPLAY_MS = 6000

/**
 * The full-viewport hero section for the 360 Experiences site. Combines an
 * auto-advancing background image carousel, an overlaid {@link SiteHeader},
 * headline copy, two {@link HeroButton} CTAs, {@link HeroSlides} indicators
 * and a scroll hint. Replicates the Northern Cape tourism hero design.
 *
 * @returns {JSX.Element} The rendered hero section.
 */
export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % SLIDES.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-[var(--brand-navy)]">
      {/* Background carousel */}
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src || '/placeholder.svg'}
          alt={slide.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-navy)]/90 via-[var(--brand-navy)]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)]/70 via-transparent to-[var(--brand-navy)]/30" />

      <SiteHeader />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold tracking-[0.25em] text-[var(--brand-orange)]">
              WELCOME TO 360 EXPERIENCES
            </p>

            <h1 className="display-title text-balance text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Experience the Heart of the Northern Cape
            </h1>

            <p className="display-title mt-4 text-2xl italic text-[var(--brand-orange)] sm:text-3xl">
              Where the Karoo Breathes.
            </p>

            <p className="mt-6 max-w-md text-pretty leading-relaxed text-white/80">
              Discover Prieska&apos;s heritage, landscapes, culture and unforgettable
              experiences through tourism, adventure and recreation.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <HeroButton variant="primary">Explore Experiences</HeroButton>
              <HeroButton variant="outline">Plan Your Visit</HeroButton>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute inset-x-0 bottom-8 z-10">
        <HeroSlides
          count={SLIDES.length}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 right-6 z-10 hidden text-white/70 sm:block">
        <Mouse className="h-6 w-6 animate-bounce" />
      </div>
    </section>
  )
}
