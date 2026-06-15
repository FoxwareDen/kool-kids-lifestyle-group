import { CalendarClock, Map, Users, Star, type LucideIcon } from 'lucide-react'
import { StatItem } from './StatItem'

/**
 * Static trust-building figures shown in the band. Replace with CMS-driven
 * content when wiring up live data.
 * @type {{ icon: LucideIcon, value: string, label: string }[]}
 */
const STATS: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: CalendarClock, value: '10+', label: 'Years of Experience' },
  { icon: Map, value: '25+', label: 'Curated Experiences' },
  { icon: Users, value: '5,000+', label: 'Happy Visitors' },
  { icon: Star, value: '4.9', label: 'Average Rating' },
]

/**
 * A navy statistics band that reinforces credibility on the About page.
 * Renders a responsive row of {@link StatItem}s with key figures about the
 * company and its experiences.
 *
 * @returns {JSX.Element} The rendered stats band.
 */
export function StatsBand() {
  return (
    <section className="bg-[var(--brand-navy)] py-16">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
