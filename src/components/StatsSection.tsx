// src/components/StatsSection.tsx

import { Sun, Compass, Star, Calendar } from 'lucide-react'

const stats = [
  {
    icon: Sun,
    value: '340+',
    label: 'SUNNY DAYS',
  },
  {
    icon: Compass,
    value: '12',
    label: 'EXPERIENCES',
  },
  {
    icon: Star,
    value: '4.9',
    label: 'RATING',
  },
  {
    icon: Calendar,
    value: '1864',
    label: 'FOUNDED',
  },
]

export function StatsSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] px-4 py-12 lg:px-8 lg:py-20">
      {/* Subtle shadow overlay at the top to blend with hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
      
      <div className="relative mx-auto max-w-4xl">
        <div className="grid grid-cols-2 gap-4 lg:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-2xl bg-white/95 px-4 py-8 shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02] lg:rounded-3xl lg:px-8 lg:py-12"
            >
              {/* Icon Container */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 lg:mb-6 lg:h-16 lg:w-16">
                <stat.icon
                  className="h-7 w-7 text-amber-500 lg:h-8 lg:w-8"
                  strokeWidth={2}
                  fill={stat.icon === Star ? 'currentColor' : 'none'}
                />
              </div>
              
              {/* Value */}
              <span className="mb-1 text-3xl font-bold text-amber-500 lg:mb-2 lg:text-5xl">
                {stat.value}
              </span>
              
              {/* Label */}
              <span className="text-xs font-semibold tracking-wider text-gray-500 lg:text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
