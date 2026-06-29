import { useEffect, useState } from 'react'
import { Mouse } from 'lucide-react'
import { SiteHeader } from './SiteHeader'
import { HeroButton } from './HeroButton'
import { HeroSlides } from './HeroSlides'
import { buildImageUrl, type Asset } from '#/lib/pocketbase'

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
  { name: 'hero-karoo-river', },
  { name: 'hero-karoo-landscape', },
  { name: 'hero-karoo-heritage',},
]

/** Milliseconds between automatic slide transitions. */
const AUTOPLAY_MS = 6000

interface HeroSectionProps{
  collectionId: string
  eyebrow: string | null,
  headline: string| null,
  tagline: string | null,
  description: string | null,
  buttons: {
    label: string,
    src: string,
    icon: string
  }[],
  media?: Record<string,Asset>
}

/**
 * The full-viewport hero section for the 360 Experiences site. Combines an
 * auto-advancing background image carousel, an overlaid {@link SiteHeader},
 * headline copy, two {@link HeroButton} CTAs, {@link HeroSlides} indicators
 * and a scroll hint. Replicates the Northern Cape tourism hero design.
 *
 * @returns {JSX.Element} The rendered hero section.
 */
export function HeroSection({data}:{data: any|null}) {
  const {content, media}:{content: HeroSectionProps, components: string,media:Record<string,Asset>}= data;
  
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
          // key={media[slide.name].name}
          src={media[slide.name] ? (buildImageUrl(media[slide.name].collectionId, media[slide.name].id, media[slide.name].file)): ('/placeholder.svg')}
          alt={media[slide.name]? media[slide.name].alt : ""}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-navy)]/100 via-[var(--brand-navy)]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)]/70 via-transparent to-[var(--brand-navy)]/30" />
      {/* Top fade so the solid navy navbar blends into the hero image */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--brand-navy)] to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mt-12 text-xs font-bold tracking-[0.25em] text-[var(--brand-orange)]">
              {content? content.eyebrow :"WELCOME TO 360 EXPERIENCES"}
            </p>

            <h1 className="display-title text-balance text-5xl font-medium leading-[1.08] text-white sm:text-6xl lg:text-[4.25rem]">
              {content? content.headline:"Experience the Heart of the Northern Cape"}
            </h1>

            <p className="script-title mt-3 text-3xl font-semibold text-[var(--brand-orange)] sm:text-4xl lg:text-5xl">
              {content? content.tagline:"Where the Karoo Breathes."}
            </p>

            <p className="mt-6 max-w-md text-pretty leading-relaxed text-white/80">
              {content? content.description: "Discover Prieska&apos;s heritage, landscapes, culture and unforgettable experiences through tourism, adventure and recreation."}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {
                content.buttons.map((button, index)=>
                  <HeroButton key={`${content.collectionId}${index}`} href={button.src} variant={index %2 == 0? "primary": "outline"}>{button.label}</HeroButton>
                )
              }
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
