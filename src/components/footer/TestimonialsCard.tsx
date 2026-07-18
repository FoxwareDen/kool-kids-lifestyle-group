import { Quote } from 'lucide-react'

/**
 * A single testimonial entry.
 * @typedef {Object} Testimonial
 * @property {string} quote - The visitor's testimonial text.
 * @property {string} author - Attribution line, e.g. "Sarah & Mark, Cape Town".
 */

/**
 * Props for the {@link TestimonialsCard} component.
 * @typedef {Object} TestimonialsCardProps
 * @property {string} eyebrow - Small uppercase kicker shown above the title.
 * @property {string} title - The serif heading text.
 * @property {Testimonial[]} testimonials - Testimonials to cycle through; the
 *   first is displayed and one carousel dot is rendered per entry.
 */

/**
 * The left column of the pre-footer band. Shows an orange eyebrow, a serif
 * heading, a large decorative quote mark, the first testimonial with its
 * attribution, and a row of static carousel dots (one per testimonial).
 *
 * @param {TestimonialsCardProps} props - Component props.
 * @returns {JSX.Element} The rendered testimonials card.
 */
export function TestimonialsCard({
  eyebrow,
  title,
  testimonials,
}: {
  eyebrow: string
  title: string
  testimonials: { quote: string; author: string }[]
}) {
  const active = testimonials[0]

  return (
    <div className="flex flex-col">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
        {eyebrow}
      </p>
      <h2 className="display-title mt-3 text-balance text-3xl font-medium leading-[1.15] text-white sm:text-[2rem]">
        {title}
      </h2>

      <Quote
        className="mt-6 h-9 w-9 rotate-180 fill-[var(--brand-orange)] text-[var(--brand-orange)]"
        aria-hidden="true"
      />

      <blockquote className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
        {active.quote}
      </blockquote>
      <p className="mt-5 text-sm font-semibold text-white">{`– ${active.author}`}</p>

      <div className="mt-6 flex items-center gap-2" role="tablist" aria-label="Testimonials">
        {testimonials.map((t, i) => (
          <span
            key={t.author}
            aria-label={`Testimonial ${i + 1}`}
            className={`h-2 w-2 rounded-full ${
              i === 0 ? 'bg-[var(--brand-orange)]' : 'bg-white/25'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
