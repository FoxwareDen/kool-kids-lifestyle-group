import { Facebook, Instagram, MessageCircle, ArrowRight } from 'lucide-react'

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
  { label: 'WhatsApp', href: '#', icon: MessageCircle },
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
                src="/images/brand/360-logo.png"
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
