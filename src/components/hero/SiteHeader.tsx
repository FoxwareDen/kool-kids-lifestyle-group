import { useState } from 'react'
import { ChevronDown, Menu, Phone, Calendar, X } from 'lucide-react'

/**
 * A single top-level navigation entry.
 * @typedef {Object} NavItem
 * @property {string} label - Visible text of the link.
 * @property {boolean} [hasDropdown] - Whether the item shows a dropdown caret.
 */

/**
 * The navigation items rendered in the desktop and mobile menus.
 * @type {Array<{ label: string, hasDropdown?: boolean }>}
 */
const NAV_ITEMS = [
  { label: 'HOME' },
  { label: 'ABOUT PRIESKA' },
  { label: 'EXPERIENCES', hasDropdown: true },
  { label: 'HERITAGE' },
  { label: 'GALLERY' },
  { label: 'EVENTS' },
  { label: 'BLOG' },
  { label: 'CONTACT' },
]

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

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <a href="/" className="flex items-center no-underline" aria-label="360 Experiences home">
          <img
            src="/logo.jpg"
            alt="360 Experiences logo"
            className="h-12 w-auto rounded-md object-contain"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-1 text-xs font-semibold tracking-wide !text-white/85 no-underline transition-colors hover:!text-[var(--brand-orange)]"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="h-3 w-3" />}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            aria-label="Contact us on WhatsApp"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/25 !text-white no-underline transition-colors hover:bg-white/10 sm:flex"
          >
            <Phone className="h-4 w-4" />
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--brand-orange)] px-4 py-2.5 text-xs font-bold tracking-wide !text-white no-underline shadow-lg shadow-black/20 transition-colors hover:bg-[var(--brand-orange-deep)]"
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
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
