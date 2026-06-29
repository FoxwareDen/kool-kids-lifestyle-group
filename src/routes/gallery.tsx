import { createFileRoute } from '@tanstack/react-router'
import { GalleryHero } from '#/components/gallery/GalleryHero'
import { GalleryShowcase } from '#/components/gallery/GalleryShowcase'
import { GalleryCta } from '#/components/gallery/GalleryCta'

/**
 * The "Gallery" page route. Composes the page-level sections in order: hero,
 * the filterable photo showcase with lightbox, and a closing call-to-action.
 * The shared site footer is rendered globally by the root document.
 */
export const Route = createFileRoute('/gallery')({
  head: () => ({
    meta: [
      {
        title: 'Gallery | 360 Experiences',
      },
      {
        name: 'description',
        content:
          'Browse the Prieska gallery — photographs of the Orange River, the Karoo landscape, heritage landmarks and adventure trails of this Northern Cape town.',
      },
    ],
  }),
  component: GalleryPage,
})

/**
 * Renders the full Gallery page by stacking its section components.
 *
 * @returns {JSX.Element} The rendered page.
 */
function GalleryPage() {
  return (
    <main>
      <GalleryHero />
      <GalleryShowcase />
      <GalleryCta />
    </main>
  )
}
