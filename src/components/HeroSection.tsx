export function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
      >
        {/* Gradient overlay - stronger on left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1a2b]/85 via-[#0f1a2b]/50 to-transparent" />
        {/* Subtle bottom gradient for dots visibility */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex w-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-32 lg:px-8 lg:pb-20 lg:pt-36">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Welcome badge */}
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-[#ED9029]">
              WELCOME TO 360 EXPERIENCES
            </p>

            {/* Main heading - using system fonts for now */}
            <h1 className="mb-3 text-[2.75rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              Experience the
              <br />
              Heart of the
              <br />
              Northern Cape
            </h1>

            {/* Italic tagline - golden/orange script style */}
            <p className="mb-6 font-serif text-2xl italic text-[#E8A849] sm:text-3xl lg:text-[2rem]">
              Where the Karoo Breathes.
            </p>

            {/* Description */}
            <p className="mb-8 max-w-md text-sm leading-relaxed text-white/75 lg:text-[0.9375rem]">
              {"Discover Prieska's heritage, landscapes, culture and unforgettable experiences through tourism, adventure and recreation."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a
                href="/experiences"
                className="group inline-flex items-center justify-center gap-2 rounded bg-[#ED9029] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#d6821f]"
              >
                EXPLORE EXPERIENCES
                <svg 
                  className="h-4 w-4 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/plan"
                className="group inline-flex items-center justify-center gap-2 rounded border-2 border-white bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10"
              >
                PLAN YOUR VISIT
                <svg 
                  className="h-4 w-4 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel dots indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 lg:bottom-8">
        <button className="h-2.5 w-8 rounded-full bg-white transition-colors" aria-label="Slide 1" />
        <button className="h-2.5 w-2.5 rounded-full bg-white/40 transition-colors hover:bg-white/60" aria-label="Slide 2" />
        <button className="h-2.5 w-2.5 rounded-full bg-white/40 transition-colors hover:bg-white/60" aria-label="Slide 3" />
      </div>

      {/* Info/Scroll circle indicator - bottom right */}
      <div className="absolute bottom-6 right-6 z-10 hidden lg:bottom-8 lg:right-8 lg:block">
        <button 
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/60 text-white/60 transition-colors hover:border-white hover:text-white"
          aria-label="More info"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  )
}
