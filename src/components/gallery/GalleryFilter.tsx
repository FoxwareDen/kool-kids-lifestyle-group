import { GALLERY_FILTERS, type GalleryCategory } from './gallery-data'

/**
 * Props for the {@link GalleryFilter} component.
 * @typedef {Object} GalleryFilterProps
 * @property {GalleryCategory} active - Currently selected category.
 * @property {(category: GalleryCategory) => void} onChange - Called with the
 *   newly selected category when a filter button is pressed.
 */

/**
 * A horizontal row of category filter buttons for the gallery. The active
 * filter is filled with the brand orange while inactive filters use a subtle
 * navy outline. Rendered above the {@link GalleryGrid}.
 *
 * @param {GalleryFilterProps} props - Component props.
 * @returns {JSX.Element} The rendered filter bar.
 */
export function GalleryFilter({
  active,
  onChange,
}: {
  active: GalleryCategory
  onChange: (category: GalleryCategory) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter gallery by category"
      className="flex flex-wrap items-center justify-center gap-2.5"
    >
      {GALLERY_FILTERS.map((filter) => {
        const isActive = filter.value === active
        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.value)}
            className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
              isActive
                ? 'bg-[var(--brand-orange)] text-white shadow-md shadow-black/10 hover:bg-[var(--brand-orange-deep)]'
                : 'border border-[var(--brand-navy)]/15 bg-white text-[var(--brand-navy)]/70 hover:border-[var(--brand-orange)]/40 hover:text-[var(--brand-navy)]'
            }`}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
