import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Bell, Menu, MapPin, Compass, Calendar } from 'lucide-react'


export const getPageData = createServerFn().handler(async () =>{
  // TODO:Do api request to get page data from cms

  return {}
});


export const Route = createFileRoute('/')({
  component: Home 
})

function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
      />
      
      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
      
      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 lg:px-12 lg:py-6">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-white/90 lg:h-7 lg:w-7" strokeWidth={1.5} />
            <span className="text-lg font-semibold tracking-tight text-white lg:text-xl">
              Prieska Karoo Horizons
            </span>
          </div>
          <button 
            className="flex flex-col gap-1.5 p-2"
            aria-label="Open menu"
          >
            <span className="block h-0.5 w-7 bg-white lg:w-8" />
            <span className="block h-0.5 w-7 bg-white lg:w-8" />
            <span className="block h-0.5 w-7 bg-white lg:w-8" />
          </button>
        </header>

        {/* Hero Content */}
        <main className="flex flex-1 flex-col justify-center px-6 pb-32 lg:px-12 lg:pb-40">
          {/* Location Badge */}
          <div className="mb-4 flex items-center gap-2 lg:mb-6">
            <MapPin className="h-4 w-4 text-[var(--lagoon)] lg:h-5 lg:w-5" fill="currentColor" strokeWidth={0} />
            <span className="text-sm font-medium tracking-wide text-white/90 lg:text-base">
              Northern Cape , SOUTH AFRICA
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mb-4 text-balance lg:mb-6">
            <span className="display-title block text-4xl font-bold leading-tight text-white lg:text-6xl xl:text-7xl">
              Where the Karoo
            </span>
            <span className="display-title block text-4xl font-medium italic text-[var(--lagoon)] lg:text-6xl xl:text-7xl">
              Breathes
            </span>
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-xl text-base leading-relaxed text-white/85 lg:mb-10 lg:max-w-2xl lg:text-lg">
            Ancient land of vast skies remember Kalahari sunsets, and untouched wilderness.Every horizon tells a story millions of years in the making
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[var(--lagoon-deep)] hover:shadow-xl lg:px-8 lg:py-3.5 lg:text-base">
              <Compass className="h-4 w-4 lg:h-5 lg:w-5" />
              Explore
            </button>
            <button className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 lg:px-8 lg:py-3.5 lg:text-base">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
              Book Now
            </button>
          </div>
        </main>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 lg:p-6">
          <button className="mx-auto flex w-full max-w-lg items-center justify-center gap-3 rounded-full bg-[var(--lagoon)] px-6 py-4 text-base font-semibold text-white shadow-2xl transition-all hover:bg-[var(--lagoon-deep)] lg:max-w-xl lg:py-5 lg:text-lg">
            <Calendar className="h-5 w-5 lg:h-6 lg:w-6" />
            Book your stay now
          </button>
        </div>
      </div>
    </div>
  )
}
