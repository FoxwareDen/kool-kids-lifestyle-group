const planItems = [
  { title: 'Accommodation', icon: 'bed' },
  { title: 'Dining', icon: 'utensils' },
  { title: 'Attractions', icon: 'compass' },
  { title: 'Maps & Routes', icon: 'map' },
  { title: 'Events Calendar', icon: 'calendar' },
  { title: 'Guided Experiences', icon: 'users' },
]

function PlanIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    bed: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    utensils: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    compass: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    map: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    calendar: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    users: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  }
  return icons[type] || null
}

export function StorySection() {
  return (
    <section className="overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Our Story - Left side */}
        <div className="relative flex flex-col justify-center bg-[#0f1a2b] px-6 py-16 lg:w-1/2 lg:px-12 lg:py-24">
          {/* Background image overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f1a2b] via-[#0f1a2b]/90 to-[#0f1a2b]/80">
            <div className="absolute inset-0 opacity-30">
              <div className="h-full w-full bg-gradient-to-br from-[#1a2d4a] to-transparent" />
            </div>
          </div>

          <div className="relative z-10 max-w-lg">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#ED9029]">
              OUR STORY
            </p>
            <h2 className="display-title mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              A Town Built
              <br />
              on Stories
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-white/70 md:text-base">
              Prieska is a place where history, heritage and nature come together. From the Orange River that sustains life to the historic landmarks that define our identity, every corner of Prieska has a story waiting to be discovered.
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-md bg-[#ED9029] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#d17a1f]"
            >
              LEARN MORE
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Plan Your Visit - Right side */}
        <div className="bg-white px-6 py-16 lg:w-1/2 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-lg">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#ED9029]">
              PLAN YOUR VISIT
            </p>
            <h2 className="display-title mb-8 text-2xl font-bold text-[#0f1a2b] md:text-3xl lg:text-4xl">
              Everything You Need
              <br />
              for Your Journey
            </h2>

            {/* Plan items grid */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              {planItems.map((item) => (
                <a
                  key={item.title}
                  href={`/${item.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                  className="group flex flex-col items-center rounded-xl border border-gray-200 p-4 text-center transition-all hover:border-[#ED9029] hover:shadow-md"
                >
                  <div className="mb-2 text-[#ED9029]">
                    <PlanIcon type={item.icon} />
                  </div>
                  <span className="text-xs font-medium text-[#0f1a2b] lg:text-sm">{item.title}</span>
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="/book"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#ED9029] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#d17a1f]"
            >
              BOOK YOUR EXPERIENCE
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
