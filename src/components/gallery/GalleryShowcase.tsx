import { useMemo, useState } from 'react'
import { SectionHeading } from '#/components/sections/SectionHeading'
import { GalleryFilter } from './GalleryFilter'
import { GalleryPhotoTile } from './GalleryPhotoTile'
import { GalleryLightbox } from './GalleryLightbox'
import { GALLERY_PHOTOS, type GalleryCategory } from './gallery-data'

/**
 * The main gallery experience: a centered {@link SectionHeading}, a
 * {@link GalleryFilter} bar, a responsive CSS-columns masonry of
 * {@link GalleryPhotoTile}s and a {@link GalleryLightbox} for full-size viewing.
 *
 * Owns all interactive state — the active category filter and the index of the
 * photo currently open in the lightbox — and derives the visible photo set from
 * the selected category. Sits on the cream background to match the rest of the
 * site's secondary pages.
 *
 * @returns {JSX.Element} The rendered gallery showcase section.
 */
export function GalleryShowcase() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const visiblePhotos = useMemo(
    () =>
      activeCategory === 'all'
        ? GALLERY_PHOTOS
        : GALLERY_PHOTOS.filter((photo) => photo.category === activeCategory),
    [activeCategory],
  )

  /**
   * Switches the active category and closes any open lightbox so the index
   * never points at a photo outside the new filtered set.
   * @param {GalleryCategory} category - The category to activate.
   */
  function handleFilterChange(category: GalleryCategory) {
    setActiveCategory(category)
    setActiveIndex(null)
  }

  const showNext = () =>
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % visiblePhotos.length,
    )

  const showPrev = () =>
    setActiveIndex((current) =>
      current === null
        ? current
        : (current - 1 + visiblePhotos.length) % visiblePhotos.length,
    )

  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Explore the Collection"
          title="A Town Captured in Light"
          theme="light"
        />

        <div className="mt-10">
          <GalleryFilter active={activeCategory} onChange={handleFilterChange} />
        </div>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {visiblePhotos.map((photo, index) => (
            <GalleryPhotoTile
              key={photo.id}
              photo={photo}
              onOpen={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <GalleryLightbox
          photos={visiblePhotos}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </section>
  )
}
