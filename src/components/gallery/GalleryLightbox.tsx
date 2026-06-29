import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryPhoto } from './gallery-data'

/**
 * Props for the {@link GalleryLightbox} component.
 * @typedef {Object} GalleryLightboxProps
 * @property {GalleryPhoto[]} photos - The currently visible set of photos the
 *   lightbox can page through.
 * @property {number} index - Index into {@link photos} of the active photo.
 * @property {() => void} onClose - Closes the lightbox.
 * @property {() => void} onPrev - Moves to the previous photo (wraps around).
 * @property {() => void} onNext - Moves to the next photo (wraps around).
 */

/**
 * A full-screen lightbox overlay for viewing a single gallery photo at a time.
 * Renders a navy backdrop, the active photograph, its title and previous/next
 * controls. Supports closing on backdrop click or Escape, and arrow-key
 * navigation while open. Locks body scroll while mounted.
 *
 * @param {GalleryLightboxProps} props - Component props.
 * @returns {JSX.Element | null} The rendered lightbox, or null when there is no
 *   active photo.
 */
export function GalleryLightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: GalleryPhoto[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  // Keyboard navigation + body scroll lock while the lightbox is open.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, onPrev, onNext])

  const photo = photos[index]
  if (!photo) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--brand-navy)]/95 p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery viewer"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-white/80 transition-colors hover:text-[var(--brand-orange)]"
      >
        <X className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Previous */}
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onPrev()
        }}
        aria-label="Previous photo"
        className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/80 transition-colors hover:text-[var(--brand-orange)] sm:left-6"
      >
        <ChevronLeft className="h-8 w-8" aria-hidden="true" />
      </button>

      {/* Image + caption */}
      <figure
        className="flex max-h-full w-full max-w-4xl flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={photo.image || '/placeholder.svg'}
          alt={photo.alt}
          className="max-h-[78svh] w-auto max-w-full object-contain shadow-2xl shadow-black/40"
        />
        <figcaption className="mt-4 text-center">
          <span className="block text-sm font-bold uppercase tracking-widest text-[var(--brand-orange)]">
            {photo.title}
          </span>
          <span className="mt-1 block text-xs text-white/60">
            {index + 1} / {photos.length}
          </span>
        </figcaption>
      </figure>

      {/* Next */}
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onNext()
        }}
        aria-label="Next photo"
        className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/80 transition-colors hover:text-[var(--brand-orange)] sm:right-6"
      >
        <ChevronRight className="h-8 w-8" aria-hidden="true" />
      </button>
    </div>
  )
}
