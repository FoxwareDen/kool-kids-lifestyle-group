const experiences = [
  {
    title: 'Cycling Experiences',
    description: 'Scenic routes and guided rides.',
    icon: 'cycling',
  },
  {
    title: 'Hiking Trails',
    description: 'Discover breathtaking landscapes on foot.',
    icon: 'hiking',
  },
  {
    title: 'Quad Adventures',
    description: 'Explore the Karoo from a new perspective.',
    icon: 'quad',
  },
  {
    title: 'Heritage Tours',
    description: "Walk through Prieska's rich history.",
    icon: 'heritage',
  },
  {
    title: 'Photography Tours',
    description: 'Capture the beauty of Prieska.',
    icon: 'photo',
  },
  {
    title: 'Events & Recreation',
    description: 'Join community events & outdoor experiences.',
    icon: 'events',
  },
]

function ExperienceIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    cycling: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="5" cy="18" r="3" strokeWidth={2} />
        <circle cx="19" cy="18" r="3" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18V9m0 0l3-3m-3 3L9 6m3 3h6m-6 0H6" />
      </svg>
    ),
    hiking: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    quad: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m16 0V6a1 1 0 00-1-1h-4" />
      </svg>
    ),
    heritage: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
      </svg>
    ),
    photo: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <circle cx="12" cy="13" r="3" strokeWidth={2} />
      </svg>
    ),
    events: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  }
  return icons[type] || null
}

export function ExperiencesSection() {
  return (
    <section className="bg-[#0f1a2b] px-4 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#ED9029]">
            ADVENTURE AWAITS
          </p>
          <h2 className="display-title text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Choose Your Experience
          </h2>
        </div>

        {/* Experience cards grid */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {experiences.map((exp) => (
            <div
              key={exp.title}
              className="group cursor-pointer"
            >
              {/* Image placeholder */}
              <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2d4a] to-[#0f1a2b]">
                <div className="flex h-full items-center justify-center">
                  <svg className="h-12 w-12 text-white/10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Icon */}
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#ED9029]/20 text-[#ED9029]">
                <ExperienceIcon type={exp.icon} />
              </div>

              {/* Title */}
              <h3 className="mb-1 text-sm font-bold text-white lg:text-base">{exp.title}</h3>

              {/* Description */}
              <p className="text-xs text-white/60 lg:text-sm">{exp.description}</p>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center">
          <a
            href="/experiences"
            className="inline-flex items-center gap-2 rounded-md border-2 border-white bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
          >
            VIEW ALL EXPERIENCES
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
