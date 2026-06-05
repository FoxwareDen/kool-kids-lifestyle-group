const destinations = [
  {
    title: 'Heritage',
    description: 'Explore the rich history, architecture and stories that have shaped Prieska for generations.',
    image: '/images/placeholder-heritage.jpg',
  },
  {
    title: 'Orange River',
    description: 'Experience the life-giving river that flows through the heart of our town and defines its identity.',
    image: '/images/placeholder-river.jpg',
  },
  {
    title: 'Karoo Landscapes',
    description: 'Wide open spaces, spectacular sunsets and unforgettable natural beauty.',
    image: '/images/placeholder-landscape.jpg',
  },
]

export function DiscoverSection() {
  return (
    <section className="bg-[#f5f5f5] px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#ED9029]">
            A DESTINATION LIKE NO OTHER
          </p>
          <h2 className="display-title text-3xl font-bold text-[#0f1a2b] md:text-4xl lg:text-5xl">
            Discover the Stories, Landscapes
            <br className="hidden md:block" />
            and Experiences of Prieska
          </h2>
        </div>

        {/* Destination cards */}
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {destinations.map((dest) => (
            <div
              key={dest.title}
              className="group overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl"
            >
              {/* Image container with icon overlay */}
              <div className="relative h-48 overflow-hidden lg:h-56">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f1a2b] to-[#1a2d4a]">
                  {/* Placeholder pattern */}
                  <div className="flex h-full items-center justify-center">
                    <svg className="h-16 w-16 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                {/* Icon overlay */}
                <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ED9029]/90">
                  {dest.title === 'Heritage' && (
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                  {dest.title === 'Orange River' && (
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  )}
                  {dest.title === 'Karoo Landscapes' && (
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-[#0f1a2b]">{dest.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {dest.description}
                </p>
                <a
                  href={`/${dest.title.toLowerCase().replace(' ', '-')}`}
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#ED9029] transition-colors hover:text-[#d17a1f]"
                >
                  LEARN MORE
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
