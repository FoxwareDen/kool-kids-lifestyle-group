import { ArrowRight } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { GalleryItem } from './GalleryItem'
import koppieImg from "../../images/koppie.jpeg"
import orangeRiverImg from "../../images/orange-river.jpeg"
import church2Img from "../../images/church.jpeg"
import riverImg3 from "../../images/river3.jpeg"
import priskaImg from "../../images/prieska.jpeg"
import trailImg from "../../images/trail.jpeg"

/**
 * A single photo rendered as a {@link GalleryItem} within {@link GallerySection}.
 * @typedef {Object} GalleryPhoto
 * @property {string} image - Photo source path.
 * @property {string} imageAlt - Accessible image description.
 * @property {string} href - Link target.
 */

/**
 * Static placeholder gallery photos. Replace with CMS-driven content when
 * wiring up live data.
 * @type {GalleryPhoto[]}
 */
const GALLERY_PHOTOS: { image: string; imageAlt: string; href: string }[] = [
  {
    image: orangeRiverImg,
    imageAlt: 'Orange River lined with palm trees',
    href: '#',
  },
  {
    image: church2Img,
    imageAlt: 'Church steeple framed by palm trees',
    href: '#',
  },
  {
    image: riverImg3,
    imageAlt: 'the river',
    href: '#',
  },
  {
    image: koppieImg,
    imageAlt: 'Koppie hill over the Karoo plains',
    href: '#',
  },
  {
    image: priskaImg,
    imageAlt: 'The town of prieska',
    href: '#',
  },
  {
    image: trailImg,
    imageAlt: 'Hiking trail',
    href: '#',
  },
]

/**
 * The "Moments Worth Experiencing" gallery section. Renders a centered
 * {@link SectionHeading} above a responsive row of {@link GalleryItem}s and a
 * "View full gallery" call-to-action link. Sits on a light cream background.
 *
 * @returns {JSX.Element} The rendered gallery section.
 */
export function GallerySection() {
  return (
    <section className="bg-[#f1ede6] pb-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments Worth Experiencing"
          theme="light"
        />

        <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {GALLERY_PHOTOS.map((photo) => (
            <GalleryItem key={photo.image} {...photo} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/gallery"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest !text-[var(--brand-orange)] no-underline hover:!text-[var(--brand-orange-deep)]"
          >
            View full gallery
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
