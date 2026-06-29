/**
 * Props for the {@link TimelineSkeleton} component.
 * @typedef {Object} TimelineSkeletonProps
 * @property {number} [count=3] - Number of placeholder rows to render.
 */

/**
 * A lightweight loading placeholder that mirrors the timeline rail layout while
 * CMS data is being fetched. Keeps the page from flashing an empty state during
 * the initial load.
 *
 * @param {TimelineSkeletonProps} props - Component props.
 * @returns {JSX.Element} The rendered skeleton.
 */
export function TimelineSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ol aria-hidden="true" className="animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="relative flex gap-6 pb-12 last:pb-0">
          <div className="relative flex flex-col items-center">
            <span className="z-10 mt-1.5 h-4 w-4 shrink-0 rounded-full bg-[var(--brand-navy)]/15" />
            {index !== count - 1 && (
              <span className="absolute top-5 h-full w-px bg-[var(--brand-navy)]/10" />
            )}
          </div>

          <div className="flex-1 rounded-xl border border-[var(--line)] bg-white p-5 sm:p-6">
            <div className="h-3 w-28 rounded bg-[var(--brand-navy)]/10" />
            <div className="mt-4 h-5 w-3/4 rounded bg-[var(--brand-navy)]/10" />
            <div className="mt-3 h-3 w-full rounded bg-[var(--brand-navy)]/10" />
            <div className="mt-2 h-3 w-5/6 rounded bg-[var(--brand-navy)]/10" />
          </div>
        </li>
      ))}
    </ol>
  )
}
