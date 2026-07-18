import { MapPin } from 'lucide-react'

/**
 * Props for the {@link LandmarkCard} component.
 * @typedef {Object} LandmarkCardProps
 * @property {string} image - Source URL for the landmark photograph.
 * @property {string} name - Name of the heritage site or landmark.
 * @property {string} description - Short description of its significance.
 * @property {string} [location] - Optional location label shown with a pin.
 */

/**
 * A heritage landmark card used in the {@link HeritageSites} grid. Renders a
 * photograph with a navy gradient overlay, an optional location label, the
 * landmark name and a short description beneath the image.
 *
 * @param {LandmarkCardProps} props - Component props.
 * @returns {JSX.Element} The rendered landmark card.
 */
export function LandmarkCard({
  image,
  name,
  description,
  location,
}: {
  image: string
  name: string
  description: string
  location?: string
}) {
  return (
    <article className="group flex flex-col overflow-hidden bg-white shadow-md transition-shadow hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-navy)]/70 via-transparent to-transparent" />
        {location && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-[var(--brand-navy)]/85 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            <MapPin className="h-3.5 w-3.5 text-[var(--brand-orange)]" aria-hidden="true" />
            {location}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="display-title text-xl font-medium text-[var(--brand-navy)]">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--brand-navy)]/70">{description}</p>
      </div>
    </article>
  )
}
