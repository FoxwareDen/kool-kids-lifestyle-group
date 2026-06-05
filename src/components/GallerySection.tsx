const galleryImages = [
  { id: 1, alt: 'Karoo sunset landscape' },
  { id: 2, alt: 'Historic church tower' },
  { id: 3, alt: 'Orange River view' },
  { id: 4, alt: 'Mountain silhouette' },
  { id: 5, alt: 'Desert vegetation' },
  { id: 6, alt: 'Starry night sky' },
]

export function GallerySection() {
  return (
    <section className="bg-[#f5f5f5] px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#ED9029]">
            GALLERY
          </p>
          <h2 className="display-title text-3xl font-bold text-[#0f1a2b] md:text-4xl lg:text-5xl">
            Moments Worth Experiencing
          </h2>
        </div>

        {/* Gallery grid */}
        <div className="mb-8 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-4">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-[#1a2d4a] to-[#0f1a2b]"
            >
              {/* Placeholder */}
              <div className="flex h-full items-center justify-center">
                <svg className="h-8 w-8 text-white/10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                <svg className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* View full gallery link */}
        <div className="text-center">
          <a
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#ED9029] transition-colors hover:text-[#d17a1f]"
          >
            VIEW FULL GALLERY
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
