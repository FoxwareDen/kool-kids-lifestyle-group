// src/components/HeroSection.tsx

import { Bell, Menu, MapPin, Compass, Calendar } from 'lucide-react'

interface HeroSectionProps{
  eyebrow: string,
  headline: string,
  tagline: string,
  description: string,
}

// export function HeroSection() {
//   return (
//     <div className="relative min-h-screen w-full overflow-hidden">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-no-repeat bg-right md:bg-center"
//         style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
//       />

//       {/* Dark Overlay for text readability */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

//       {/* Content Container */}
//       <div className="relative z-10 flex min-h-screen flex-col">
//         {/* Header */}
//         <header className="flex items-center justify-between px-6 py-5 lg:px-12 lg:py-6">
//           <div className="flex items-center gap-3">
//             <Bell className="h-6 w-6 text-white/90 lg:h-7 lg:w-7" strokeWidth={2}  fill='white'/>
//             <span className="text-lg font-semibold tracking-tight text-white lg:text-xl">
//               Prieska Karoo Horizons
//             </span>
//           </div>
//           <button className="flex flex-col gap-1.5 p-2 cursor-pointer" aria-label="Open menu">
//             <Menu className="h-10 w-8 text-white/90 lg:h-12 lg:w-10" strokeWidth={2.5}/>
//           </button>
//         </header>

//         {/* Hero Content */}
//         <main className="flex flex-1 flex-col justify-center px-6 pb-32 lg:px-12 lg:pb-40">
//           {/* Location Badge */}
//           <div className="mb-4 flex items-center gap-2 lg:mb-6">
//             <MapPin
//               className="h-4 w-4 text-[var(--lagoon)] lg:h-5 lg:w-5"
//               fill="currentColor"
//               strokeWidth={2}
//             />
//             <span className="text-sm font-medium tracking-wide text-white/90 lg:text-base">
//               Northern Cape , SOUTH AFRICA
//             </span>
//           </div>

//           {/* Main Title */}
//           <h1 className="mb-4 text-balance lg:mb-6">
//             <span className="display-title block text-4xl font-bold leading-tight text-white lg:text-6xl xl:text-7xl">
//               Where the Karoo
//             </span>
//             <span className="display-title block text-4xl font-medium italic text-[var(--lagoon)] lg:text-6xl xl:text-7xl">
//               Breathes
//             </span>
//           </h1>

//           {/* Description */}
//           <p className="mb-8 max-w-xl text-base leading-relaxed text-white/85 lg:mb-10 lg:max-w-2xl lg:text-lg">
//             Ancient land of vast skies, amber Kalahari sunsets, and untouched
//             wilderness. Every horizon tells a story millions of years in the making
//           </p>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap items-center gap-4">
//             <button className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[var(--lagoon-deep)] hover:shadow-xl lg:px-8 lg:py-3.5 lg:text-base cursor-pointer">
//               <Compass className="h-4 w-4 lg:h-5 lg:w-5" />
//               Explore
//             </button>
//             <button className="flex items-center gap-2 rounded-full border-2 border-white/60 bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 lg:px-8 lg:py-3.5 lg:text-base cursor-pointer">
//               <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
//               Book Now
//             </button>
//           </div>
//         </main>

//         {/* Bottom CTA */}
//         <div className="fixed bottom-0 left-0 right-0 z-20 p-4 lg:p-6">
//           <button className="mx-auto flex w-full max-w-lg items-center justify-center gap-3 rounded-full bg-[var(--lagoon)] px-6 py-4 text-base font-semibold text-white shadow-2xl transition-all hover:bg-[var(--lagoon-deep)] lg:max-w-xl lg:py-5 lg:text-lg cursor-pointer">
//             <Calendar className="h-5 w-5 lg:h-6 lg:w-6" />
//             Book your stay now
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }