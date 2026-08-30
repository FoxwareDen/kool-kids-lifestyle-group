import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ContactInfoItem } from './ContactInfoItem'
import { resolveTranslatable, type Language } from '#/lib/experiences'

/**
 * The contact detail entries rendered as {@link ContactInfoItem} rows.
 * @type {Array<{ icon: LucideIcon, label: string, lines: string[], href?: string }>}
 */
const CONTACT_DETAILS: {
  icon: LucideIcon
  label: string
  lines: string[]
  href?: string
}[] = [
  {
    icon: MapPin,
    label: 'Visit Us',
    lines: ['Victoria Street', 'Prieska, 8940', 'Northern Cape, South Africa'],
  },
  {
    icon: Phone,
    label: 'Call Us',
    lines: ['+27 53 353 1111'],
    href: 'tel:+27533531111',
  },
  {
    icon: Mail,
    label: 'Email Us',
    lines: ['hello@visitprieska.co.za'],
    href: 'mailto:hello@visitprieska.co.za',
  },
  {
    icon: Clock,
    label: 'Office Hours',
    lines: ['Mon – Fri: 08:00 – 17:00', 'Sat: 09:00 – 13:00', 'Sun & Public Holidays: Closed'],
  },
]

/**
 * The social media links shown beneath the contact details.
 * @type {Array<{ icon: LucideIcon, label: string, href: string }>}
 */
const SOCIAL_LINKS: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
]

/**
 * The contact details panel shown beside the {@link ContactForm}. Lists the
 * physical address, phone, email and opening hours via {@link ContactInfoItem}
 * rows, followed by a set of circular social media links.
 *
 * @returns {JSX.Element} The rendered contact details panel.
 */
export function ContactDetails({ lang = 'en' }: { lang?: Language }) {
  const labels = {
    title: resolveTranslatable({ default: 'Contact Information', translations: { af: 'Kontak Inligting' } }, lang),
    subtitle: resolveTranslatable({ default: 'Reach Out Directly', translations: { af: 'Kom Direk In Kontak' } }, lang),
    intro: resolveTranslatable({ default: 'Whether you\'re planning a visit, booking a tour or just have a question, our friendly team is here to help you make the most of Prieska.', translations: { af: 'Of jy ’n besoek beplan, ’n toer bespreek of bloot ’n vraag het, ons vriendelike span is hier om jou te help om die beste van Prieska te kry.' } }, lang),
    follow: resolveTranslatable({ default: 'Follow Us', translations: { af: 'Volg Ons' } }, lang),
    details: [
      resolveTranslatable({ default: 'Visit Us', translations: { af: 'Besoek Ons' } }, lang),
      resolveTranslatable({ default: 'Call Us', translations: { af: 'Bel Ons' } }, lang),
      resolveTranslatable({ default: 'Email Us', translations: { af: 'E-pos Ons' } }, lang),
      resolveTranslatable({ default: 'Office Hours', translations: { af: 'Kantoorure' } }, lang),
    ],
  }
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
        {labels.title}
      </p>
      <h2 className="display-title mt-2 text-2xl font-medium text-[var(--brand-navy)] sm:text-3xl">
        {labels.subtitle}
      </h2>
      <p className="mt-3 max-w-md text-pretty leading-relaxed text-[var(--brand-navy)]/70">
        {labels.intro}
      </p>

      <div className="mt-8 space-y-6">
        {CONTACT_DETAILS.map((detail, index) => (
          <ContactInfoItem
            key={detail.label}
            icon={detail.icon}
            label={labels.details[index] ?? detail.label}
            lines={detail.lines}
            href={detail.href}
          />
        ))}
      </div>

      <div className="mt-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55">
          {labels.follow}
        </p>
        <div className="mt-3 flex items-center gap-3">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-navy)] !text-white transition-colors hover:bg-[var(--brand-orange)]"
            >
              <social.icon className="h-4.5 w-4.5" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
