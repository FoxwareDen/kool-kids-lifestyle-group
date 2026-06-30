import { Link } from '@tanstack/react-router'

/**
 * Title-case a raw category string for display.
 * @param {string} category - The raw category label.
 * @returns {string} The display label.
 */
function label(category: string): string {
  return category
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * A horizontal row of category filter chips for the experiences index. The
 * active category is highlighted; selecting a chip navigates to the index with
 * the matching `?category` search param (or clears it for "All").
 *
 * @param {{ categories: string[], active?: string }} props - Component props.
 * @returns {JSX.Element} The rendered filter row.
 */
export function CategoryFilter({
  categories,
  active,
}: {
  categories: string[]
  active?: string
}) {
  const isActive = (cat?: string) =>
    (cat ?? '').toLowerCase() === (active ?? '').toLowerCase()

  const chipClass = (selected: boolean) =>
    `inline-flex items-center whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] no-underline transition-colors ${
      selected
        ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)] !text-white'
        : 'border-[var(--brand-navy)]/15 bg-white !text-[var(--brand-navy)] hover:border-[var(--brand-orange)] hover:!text-[var(--brand-orange)]'
    }`

  return (
    <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filter experiences by category">
      <Link
        to="/experiences"
        search={{ lang: 'en', category: undefined }}
        className={chipClass(!active)}
        role="tab"
        aria-selected={!active}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          to="/experiences"
          search={{ lang: 'en', category: cat }}
          className={chipClass(isActive(cat))}
          role="tab"
          aria-selected={isActive(cat)}
        >
          {label(cat)}
        </Link>
      ))}
    </div>
  )
}
