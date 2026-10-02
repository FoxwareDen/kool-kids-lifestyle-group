import { createFileRoute } from '@tanstack/react-router'

const sections = [
  {
    title: '1. Overview',
    content: (
      <>
        <p>We respect your privacy and are committed to keeping your personal information secure.</p>
        <p>
          This website is designed to collect as little information as possible. We do <strong>not</strong> use the website to build user profiles, sell personal information, or collect personal information for advertising or tracking purposes.
        </p>
        <p>The only personal information we may temporarily process is information that you voluntarily provide when making a booking.</p>
      </>
    ),
  },
  {
    title: '2. Information We Collect',
    content: (
      <>
        <h3>Website visitors</h3>
        <p>When you visit this website, we do not intentionally collect or store personal information about you.</p>
        <p>We do not use:</p>
        <ul>
          <li>Advertising trackers</li>
          <li>User profiling</li>
          <li>Marketing databases</li>
          <li>Behavioural tracking</li>
          <li>Analytics designed to identify individual visitors</li>
          <li>The sale or sharing of visitor information for advertising purposes</li>
        </ul>
        <p>Technical information that may be processed automatically by hosting, security, or infrastructure providers, such as IP addresses or server logs, may still exist as part of operating and securing the website. Such information is handled according to the policies of the relevant infrastructure providers.</p>
        <h3>Booking information</h3>
        <p>If you make a booking through the website, we may need to collect information necessary to provide the requested service. Depending on the service, this may include:</p>
        <ul>
          <li>Name</li>
          <li>Contact details</li>
          <li>Booking date and time</li>
          <li>Service requested</li>
          <li>Information necessary to communicate with you about your booking</li>
          <li>Other information you voluntarily provide that is reasonably necessary to complete the booking</li>
        </ul>
        <p>We only use this information for purposes related to your booking and the service you requested.</p>
      </>
    ),
  },
  {
    title: '3. How We Use Booking Information',
    content: (
      <>
        <p>Booking information is used only as necessary to:</p>
        <ol>
          <li>Receive and manage your booking.</li>
          <li>Contact you regarding your booking.</li>
          <li>Provide the booked service.</li>
          <li>Handle necessary booking-related administration.</li>
          <li>Complete the service you requested.</li>
        </ol>
        <p>We do not use booking information to create advertising profiles or sell your personal information.</p>
      </>
    ),
  },
  {
    title: '4. How Long We Keep Your Information',
    content: (
      <>
        <p>We follow a limited-retention approach.</p>
        <p>Your booking information is retained only for as long as reasonably necessary to manage your booking and provide the requested service.</p>
        <p>Once:</p>
        <ul>
          <li>the booking has been completed, <strong>and</strong></li>
          <li>the requested service has been provided,</li>
        </ul>
        <p>the booking information will be scheduled for deletion.</p>
        <p>An automated deletion system will remove the relevant booking information after the applicable retention period.</p>
      </>
    ),
  },
  {
    title: '5. Automated Deletion',
    content: <p>Our system is designed to automatically delete eligible booking information after the booking and associated service have been completed. Automated deletion helps reduce the amount of personal information we retain and limits the period for which your information remains in our systems. Some information may temporarily remain in technical backups or security systems where immediate deletion is not technically possible. Where this occurs, the information will be removed or overwritten in accordance with the applicable backup and retention processes.</p>,
  },
  {
    title: '6. Sharing of Information',
    content: <p>We do not sell your personal information. Your booking information may only be accessible to people or service providers who need it to operate the booking system, communicate with you, provide the requested service, or maintain the technical systems used to operate the website. Where third-party services are required to process booking information, those providers may process information on our behalf and may have their own privacy policies.</p>,
  },
  {
    title: '7. Data Security',
    content: <p>We take reasonable technical and organisational measures to protect information provided through the booking system. However, no online system can be guaranteed to be completely secure. We therefore cannot guarantee absolute security of information transmitted over the internet.</p>,
  },
  {
    title: '8. Your Privacy Rights',
    content: <><p>Depending on where you live, you may have rights relating to your personal information, which can include the right to:</p><ul><li>Ask what personal information we hold about you.</li><li>Request correction of inaccurate information.</li><li>Request deletion of your personal information.</li><li>Ask how your information is being used.</li><li>Object to certain types of processing.</li><li>Withdraw consent where processing is based on consent.</li></ul><p>Because our system is designed to automatically delete completed booking information, information may no longer be available when a request is received.</p></>,
  },
  {
    title: "9. Children's Privacy",
    content: <p>This website is not intended to knowingly collect personal information from children without appropriate permission where such permission is required by law.</p>,
  },
  {
    title: '10. Changes to This Privacy Policy',
    content: <p>We may update this Privacy Policy when our website, booking system, services, or legal obligations change. Any updated version will be published on this page with a revised “Last updated” date.</p>,
  },
  {
    title: '11. Contact',
    content: <p>If you have questions about this Privacy Policy or how your information is handled, please contact us through the contact details provided on the website.</p>,
  },
]

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy | 360 Experiences' },
      { name: 'description', content: 'Read the 360 Experiences privacy policy and learn how booking information is collected, used, retained, and deleted.' },
      { property: 'og:title', content: 'Privacy Policy | 360 Experiences' },
      { property: 'og:description', content: 'Learn how 360 Experiences handles booking information and protects your privacy.' },
      { property: 'og:type', content: 'website' },
    ],
  }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <main className="bg-[var(--bg-base)] text-[var(--sea-ink)]">
      <header className="bg-[var(--brand-navy)] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[900px]">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--brand-orange)]">Your privacy matters</p>
          <h1 className="display-title mt-4 text-4xl font-semibold sm:text-6xl">Privacy Policy</h1>
          <p className="mt-5 text-sm text-white/65">Last updated: 30 September 2026</p>
        </div>
      </header>
      <article className="mx-auto max-w-[900px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-[var(--sea-ink)] prose-p:text-[var(--sea-ink-soft)] prose-li:text-[var(--sea-ink-soft)] prose-strong:text-[var(--sea-ink)] prose-a:text-[var(--brand-orange-deep)]">
          <p className="lead">We respect your privacy and are committed to keeping your personal information secure.</p>
          {sections.map((section) => (
            <section key={section.title} className="mt-12 first:mt-10">
              <h2>{section.title}</h2>
              {section.content}
            </section>
          ))}
          <aside className="mt-14 border-l-4 border-[var(--brand-orange)] bg-white/60 px-6 py-5 not-prose">
            <p className="text-sm font-semibold leading-7 text-[var(--sea-ink)]">Privacy principle: We aim to collect only the information necessary to provide a requested booking and service, keep it only for as long as necessary, and automatically delete eligible booking information after the service has been completed.</p>
          </aside>
        </div>
      </article>
    </main>
  )
}
