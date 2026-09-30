import { useMemo, useState } from 'react'
import { SectionHeading } from '#/components/sections/SectionHeading'
import { GalleryFilter } from './GalleryFilter'
import { GalleryPhotoTile } from './GalleryPhotoTile'
import { GalleryLightbox } from './GalleryLightbox'
import { GALLERY_PHOTOS, type GalleryCategory } from './gallery-data'
import { resolveTranslatable, type Language } from '#/lib/experiences'
import { useQuery } from '@tanstack/react-query'
import { buildImageUrl, getAssets } from '#/lib/pocketbase'


  // {
  //   id: 'orange-river',
  //   image: orangeRiverImg,
  //   alt: 'Orange River lined with palm trees at golden hour',
  //   title: 'Orange River at Golden Hour',
  //   category: 'river',
  // },

interface ImageBlock {
  id: string,
  image: string,
  alt: string,
  title: string,
  category: string
}

async function getImages(): Promise<ImageBlock[]> {
  try {
    const data = await getAssets();

    if (!data.success || !data.value) return [];
    
    const dih: ImageBlock[] = data.value.map(image => ({
      id: image.id,
      image: buildImageUrl(image.collectionId, image.id, image.file),
      title: image.name,
      alt: image.alt,
      category: "",
    }));

    return dih
  } catch (error) {
    console.error(error);
    return [];
  }
}

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
export function GalleryShowcase({ lang = 'en' }: { lang?: Language }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: getImages,
  })

  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>('all')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const eyebrow = resolveTranslatable(
    {
      default: 'Explore the Collection',
      translations: { af: 'Verken die Versameling' },
    },
    lang,
  )

  const title = resolveTranslatable(
    {
      default: 'A Town Captured in Light',
      translations: { af: 'n Dorpie Vasgevang in Lig' },
    },
    lang,
  )

  const visiblePhotos = useMemo(
    () =>
      activeCategory === 'all'
        ? (data ?? [])
        : (data ?? []).filter(
            (photo) => photo.category === activeCategory,
          ),
    [activeCategory, data],
  )

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

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Failed to load gallery.</div>
  }

  return (
    <section className="bg-[#f1ede6] py-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={eyebrow} title={title} theme="light" />

        <div className="mt-12 grid grid-cols-3 gap-1 sm:block sm:columns-2 sm:gap-4 lg:columns-3">
          {visiblePhotos.map((photo, index) => (
            <GalleryPhotoTile
              key={photo.id}
              photo={photo}
              onOpen={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      {activeIndex !== null && visiblePhotos.length > 0 && (
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
