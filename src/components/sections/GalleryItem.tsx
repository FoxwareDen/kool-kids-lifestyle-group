/**
 * Props for the {@link GalleryItem} component.
 * @typedef {Object} GalleryItemProps
 * @property {string} image - Source path of the gallery photo.
 * @property {string} imageAlt - Accessible description of the photo.
 * @property {string} [href] - Link target for the item. Defaults to "#".
 */

/**
 * A single square gallery photo with a subtle zoom-on-hover effect. Used by
 * {@link GallerySection} to build the row of "Moments Worth Experiencing".
 *
 * @param {GalleryItemProps} props - Component props.
 * @returns {JSX.Element} The rendered gallery item.
 */
export function GalleryItem({
  imageAlt,
  href = '#',
}: {
  imageAlt: string
  href?: string
}) {
  return (
    <a
      href={href}
      className="group relative block aspect-square overflow-hidden"
    >
      <img
        src={href || '/placeholder.svg'}
        alt={imageAlt}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <span className="absolute inset-0 bg-[var(--brand-navy)]/0 transition-colors duration-300 group-hover:bg-[var(--brand-navy)]/20" />
    </a>
  )
}
