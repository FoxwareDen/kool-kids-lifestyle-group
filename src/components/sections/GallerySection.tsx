// TODO:NO CMS MANAGING

import { ArrowRight } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { GalleryItem } from './GalleryItem'
import { resolveTranslatable, type Language, type Translatable } from '#/lib/experiences'
import { useEffect, useState } from 'react'
import { buildImageUrl, fetchCollection, type Asset } from '#/lib/pocketbase'

export function GallerySection({ lang }: { lang: Language }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gallery, setGallery] = useState<{ image: string; imageAlt: string; href: string }[]>([])

  const data: Record<string, Translatable> = {
    eyebrow: {
      default: "Gallery",
      translations: { af: "Galery" },
    },
    title: {
      default: "Moments Worth Experiencing",
      translations: { af: "Oomblikke werd om te beleef" },
    },
    button: {
      default: "View full gallery",
      translations: { af: "Bekyk volledige galery" },
    },
  }

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      setLoading(true)
      setError(null)

      const result = await fetchCollection<Asset>("assets")

      if (controller.signal.aborted) return

      if (!result.success || result.value == null) {
        setError("Failed to load gallery images.")
        setLoading(false)
        return
      }

      const shuffled = [...result.value]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        
        console.log(buildImageUrl(shuffled[0].collectionId, shuffled[0].id, shuffled[0].name));
        console.log(shuffled[0]);

      const images = shuffled.map((item) => ({
        href: buildImageUrl(item.collectionId, item.id, item.file),
        imageAlt: item.alt,
        image: item.name,
      }))

      setGallery(images)
      setLoading(false)
    })()

    return () => controller.abort()
  }, [])

  return (
    <section className="bg-[#f1ede6] pb-20">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={resolveTranslatable(data["eyebrow"], lang)}
          title={resolveTranslatable(data["title"], lang)}
          theme="light"
        />

        <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-md bg-[#e0d9d0]"
              />
            ))}

          {error && !loading && (
            <p className="col-span-full text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {!loading && !error &&
            gallery.map((photo) => (
              <GalleryItem key={photo.image} imageAlt={photo.imageAlt} href={photo.href} />
            ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/gallery"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest !text-[var(--brand-orange)] no-underline hover:!text-[var(--brand-orange-deep)]"
          >
            {resolveTranslatable(data["button"], lang)}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}