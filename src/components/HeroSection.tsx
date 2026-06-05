export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-32 lg:px-8 lg:pt-40">
        <div className="max-w-2xl">
          {/* Welcome badge */}
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#ED9029]">
            WELCOME TO 360 EXPERIENCES
          </p>

          {/* Main heading */}
          <h1 className="display-title mb-2 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            Experience the
            <br />
            Heart of the
            <br />
            Northern Cape
          </h1>

          {/* Italic tagline */}
          <p className="display-title mb-6 text-2xl italic text-[#ED9029] md:text-3xl lg:text-4xl">
            Where the Karoo Breathes.
          </p>

          {/* Description */}
          <p className="mb-8 max-w-lg text-sm leading-relaxed text-white/80 md:text-base">
            {"Discover Prieska's heritage, landscapes, culture and unforgettable experiences through tourism, adventure and recreation."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href="/experiences"
              className="flex items-center gap-2 rounded-md bg-[#ED9029] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#d17a1f]"
            >
              EXPLORE EXPERIENCES
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a
              href="/plan"
              className="flex items-center gap-2 rounded-md border-2 border-white bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
            >
              PLAN YOUR VISIT
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Carousel dots indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        <button className="h-2 w-8 rounded-full bg-[#ED9029]" aria-label="Slide 1" />
        <button className="h-2 w-2 rounded-full bg-white/50" aria-label="Slide 2" />
        <button className="h-2 w-2 rounded-full bg-white/50" aria-label="Slide 3" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-10 hidden lg:block">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/50 text-white/50">
          <svg className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
