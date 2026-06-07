/**
 * Props for the {@link HeroSlides} dot indicator component.
 * @typedef {Object} HeroSlidesProps
 * @property {number} count - Total number of slides.
 * @property {number} activeIndex - Zero-based index of the active slide.
 * @property {(index: number) => void} onSelect - Callback invoked when a dot is clicked.
 */

/**
 * Carousel dot indicators displayed at the bottom of the hero. Highlights the
 * currently active slide and lets the user jump to a specific slide.
 *
 * @param {HeroSlidesProps} props - Component props.
 * @returns {JSX.Element} The rendered indicator row.
 */
export function HeroSlides({
  count,
  activeIndex,
  onSelect,
}: {
  count: number
  activeIndex: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="flex items-center justify-center gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === activeIndex}
          className={`h-2.5 rounded-full transition-all ${
            i === activeIndex
              ? 'w-6 bg-[var(--brand-orange)]'
              : 'w-2.5 bg-white/50 hover:bg-white/80'
          }`}
        />
      ))}
    </div>
  )
}
