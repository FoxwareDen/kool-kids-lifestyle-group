import { useState, useEffect } from 'react'
import { ChevronDown, Menu, Calendar, X, ArrowRight } from 'lucide-react'
import { useExperienceCategories } from '#/hooks/useExperiences'

/**
 * The WhatsApp brand glyph. lucide-react does not ship a WhatsApp icon,
 * so it is provided as an inline SVG.
 *
 * @param {{ className?: string }} props - Optional class names for sizing/color.
 * @returns {JSX.Element} The WhatsApp icon.
 */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/**
 * A single top-level navigation entry.
 * @typedef {Object} NavItem
 * @property {string} label - Visible text of the link.
 * @property {string} href - Link target for the item.
 * @property {boolean} [hasDropdown] - Whether the item shows a dropdown caret.
 */

/**
 * The navigation items rendered in the desktop and mobile menus.
 * @type {Array<{ label: string, href: string, hasDropdown?: boolean }>}
 */
const NAV_ITEMS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT PRIESKA', href: '/about-prieska' },
  { label: 'EXPERIENCES', href: '/experiences', hasDropdown: true },
  { label: 'HERITAGE', href: '/heritage' },
  { label: 'GALLERY', href: '/gallery' },
  { label: 'EVENTS', href: '/events' },
  { label: 'BLOG', href: '/blogs' },
  { label: 'CONTACT', href: '/contact' },
]

/**
 * Build the experiences index URL filtered to a single category.
 * @param {string} category - The raw category label.
 * @returns {string} A link to the experiences index pre-filtered by category.
 */
function categoryHref(category: string): string {
  return `/experiences?category=${encodeURIComponent(category)}`
}

/**
 * Title-case a raw category string for display, e.g. "heritage" -> "Heritage".
 * @param {string} category - The raw category label.
 * @returns {string} The display label.
 */
function categoryLabel(category: string): string {
  return category
    .split(/[\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * The fixed, transparent site header that overlays the hero section.
 * Contains the brand logo, primary navigation, a WhatsApp contact icon
 * and the "Book Now" call to action. Collapses into a hamburger menu
 * on smaller screens.
 *
 * @returns {JSX.Element} The rendered header element.
 */
export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpOpen, setMobileExpOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { categories } = useExperienceCategories()

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 80)
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}, [])

  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-[var(--brand-navy)] overflow-visible">
      {/* Brand */}
        <a href="/" className="absolute left-0 top-0 z-10 flex items-center no-underline" aria-label="360 Experiences home">
          <img
            src="/logo-2.png"
            alt="360 Experiences logo"
            className={`
                       w-auto object-contain transition-all duration-500 ease-in-out
                        ${mobileOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                        ${scrolled ? 'h-13 mb-0' : 'h-25 mb-[-3rem]'}
                      `}
                      />
        </a>
        <div className="mx-auto flex max-w-[1280px] py-2 items-center justify-end px-4 sm:px-6 lg:px-8 ">

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) =>
            item.hasDropdown ? (
              <div key={item.label} className="group relative">
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-xs font-semibold tracking-wide !text-white/85 no-underline transition-colors hover:!text-[var(--brand-orange)] group-hover:!text-[var(--brand-orange)]"
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                </a>

                {/* Dropdown panel */}
                <div className="invisible absolute left-1/2 top-full z-40 w-60 -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="overflow-hidden border border-white/10 bg-[var(--brand-navy)] shadow-2xl shadow-black/40">
                    <a
                      href="/experiences"
                      className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-wide !text-white no-underline transition-colors hover:bg-white/5 hover:!text-[var(--brand-orange)]"
                    >
                      All Experiences
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                    {categories.length === 0 ? (
                      <span className="block px-4 py-3 text-xs text-white/50">
                        Loading categories…
                      </span>
                    ) : (
                      categories.map((cat) => (
                        <a
                          key={cat}
                          href={categoryHref(cat)}
                          className="block px-4 py-2.5 text-sm font-medium !text-white/80 no-underline transition-colors hover:bg-white/5 hover:!text-[var(--brand-orange)]"
                        >
                          {categoryLabel(cat)}
                        </a>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1 text-xs font-semibold tracking-wide !text-white/85 no-underline transition-colors hover:!text-[var(--brand-orange)]"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-30">
          <a
            href="#"
            aria-label="Contact us on WhatsApp"
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#25D366] !text-white no-underline shadow-lg shadow-black/20 transition-colors hover:bg-[#1ebe5b] sm:flex"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[var(--brand-orange)] px-4 py-2.5 text-xs font-bold tracking-wide !text-white no-underline shadow-lg shadow-black/20 transition-colors hover:bg-[var(--brand-orange-deep)]"
          >
            <Calendar className="h-4 w-4" />
            BOOK NOW
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md text-white lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          className="border-t border-white/10 bg-[var(--brand-navy)]/95 px-4 py-4 backdrop-blur lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) =>
              item.hasDropdown ? (
                <li key={item.label}>
                  <div className="flex items-center justify-between rounded-md pr-1 transition-colors hover:bg-white/10">
                    <a
                      href={item.href}
                      className="flex-1 rounded-md px-3 py-2.5 text-sm font-semibold !text-white/85 no-underline"
                    >
                      {item.label}
                    </a>
                    <button
                      type="button"
                      onClick={() => setMobileExpOpen((v) => !v)}
                      aria-label="Toggle experience categories"
                      aria-expanded={mobileExpOpen}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-white"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${mobileExpOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>

                  {mobileExpOpen && (
                    <ul className="mb-1 ml-3 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                      {categories.length === 0 ? (
                        <li className="px-3 py-2 text-xs text-white/50">Loading categories…</li>
                      ) : (
                        categories.map((cat) => (
                          <li key={cat}>
                            <a
                              href={categoryHref(cat)}
                              className="block rounded-md px-3 py-2 text-sm font-medium !text-white/75 no-underline transition-colors hover:bg-white/10 hover:!text-[var(--brand-orange)]"
                            >
                              {categoryLabel(cat)}
                            </a>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold !text-white/85 no-underline transition-colors hover:bg-white/10"
                  >
                    {item.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
