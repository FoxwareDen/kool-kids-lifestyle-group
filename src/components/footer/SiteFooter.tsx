import { Facebook, Instagram, MessageCircle, ArrowRight, } from 'lucide-react'
import logo from "../../images/logo-2.png"

/**
 * A navigation link shown in a footer link column.
 * @typedef {Object} FooterLink
 * @property {string} label - Visible link text.
 * @property {string} href - Link target.
 */

/**
 * A titled column of footer links.
 * @typedef {Object} FooterLinkColumn
 * @property {string} title - Column heading. Only the first column renders it
 *   visibly; subsequent columns align beneath the shared "Quick Links" header.
 * @property {FooterLink[]} links - Links in the column.
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


const QUICK_LINKS: { label: string; href: string }[][] = [
  [
    { label: 'Home', href: '#' },
    { label: 'About Prieska', href: '#' },
    { label: 'Experiences', href: '#' },
    { label: 'Heritage', href: '#' },
    { label: 'Gallery', href: '#' },
  ],
  [
    { label: 'Events', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Book Now', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
]

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'WhatsApp', href: '#', icon: WhatsAppIcon },
]

/**
 * The site footer. Renders the "360 Experiences" brand mark with tagline and
 * social icons, two columns of quick links, and a newsletter sign-up form,
 * followed by a centered copyright line. Sits on the darkest navy background.
 *
 * @returns {JSX.Element} The rendered site footer.
 */
export function SiteFooter() {
  const year = new Date().getFullYear()


  return (
    <footer className="bg-[#081225] text-white">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.2fr_1.1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="360 Experiences logo"
                className="h-12 w-12 object-contain"
              />
              <div className="leading-tight">
                <p className="display-title text-xl font-semibold">360</p>
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/70">
                  Experiences
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Explore more. Experience more.
            </p>
            <p className="mt-1 text-xs text-white/55">
              Prieska • Northern Cape • South Africa
            </p>

            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 !text-white transition-colors hover:border-[var(--brand-orange)] hover:bg-[var(--brand-orange)]"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
              Quick Links
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {QUICK_LINKS.flat().map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm !text-white/70 no-underline transition-colors hover:!text-[var(--brand-orange)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">
              Stay Connected
            </h2>
            <p className="mt-5 text-sm text-white/70">
              Subscribe to our newsletter for updates on events, experiences and
              special offers.
            </p>
            <form
              className="mt-5 flex"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Your email address"
                className="w-full min-w-0 bg-white/95 px-4 py-3 text-sm text-[var(--brand-navy)] outline-none placeholder:text-[var(--brand-navy)]/45"
              />
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center gap-2 bg-[var(--brand-orange)] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--brand-orange-deep)]"
              >
                Subscribe
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          {`© ${year} 360 Experiences. All Rights Reserved.`}
        </div>
      </div>
    </footer>
  )
}
