import { Expand } from 'lucide-react'
import type { GalleryPhoto } from './gallery-data'

/**
 * Props for the {@link GalleryPhotoTile} component.
 * @typedef {Object} GalleryPhotoTileProps
 * @property {GalleryPhoto} photo - The photo to render.
 * @property {() => void} onOpen - Called when the tile is activated, opening
 *   the photo in the lightbox.
 */

/**
 * A single masonry gallery tile. Renders the photograph with a zoom-on-hover
 * effect, a navy gradient overlay, the photo title and an expand affordance.
 * Acts as a button that opens the photo in the {@link GalleryLightbox}.
 *
 * @param {GalleryPhotoTileProps} props - Component props.
 * @returns {JSX.Element} The rendered gallery tile.
 */
export function GalleryPhotoTile({
  photo,
  onOpen,
}: {
  photo: GalleryPhoto
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View ${photo.title}`}
      className="group relative mb-4 block w-full overflow-hidden break-inside-avoid bg-[var(--brand-navy)]/5 text-left"
    >
      <img
        src={photo.image || '/placeholder.svg'}
        alt={photo.alt}
        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Hover overlay */}
      <span className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)]/80 via-[var(--brand-navy)]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Expand icon */}
      <span className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center bg-[var(--brand-orange)] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <Expand className="h-4 w-4" aria-hidden="true" />
      </span>

      {/* Title */}
      <span className="absolute inset-x-0 bottom-0 translate-y-1 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="block text-sm font-bold uppercase tracking-wide text-white">
          {photo.title}
        </span>
      </span>
    </button>
  )
}
