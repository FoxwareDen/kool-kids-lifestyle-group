/**
 * Color themes for {@link SectionHeading}, matching the two backgrounds the
 * heading appears on across the site.
 * @typedef {'light' | 'dark'} SectionHeadingTheme
 */

/**
 * Props for the {@link SectionHeading} component.
 * @typedef {Object} SectionHeadingProps
 * @property {string} eyebrow - Small uppercase kicker shown above the title.
 * @property {string} title - The main section heading text.
 * @property {SectionHeadingTheme} [theme] - Color theme. "light" for cream
 *   backgrounds, "dark" for the navy background. Defaults to "light".
 * @property {'center' | 'left'} [align] - Text alignment. Defaults to "center".
 */

/**
 * A centered section heading consisting of an orange uppercase eyebrow and a
 * large serif display title. Shared by the Stories and Experiences sections so
 * their headers stay visually consistent.
 *
 * @param {SectionHeadingProps} props - Component props.
 * @returns {JSX.Element} The rendered heading block.
 */
export function SectionHeading({
  eyebrow,
  title,
  theme = 'light',
  align = 'center',
}: {
  eyebrow: string
  title: string
  theme?: 'light' | 'dark'
  align?: 'center' | 'left'
}) {
  return (
    <div
      className={
        align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl text-left'
      }
    >
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
        {eyebrow}
      </p>
      <h2
        className={`display-title mt-3 text-balance text-3xl font-medium leading-[1.15] sm:text-4xl lg:text-[2.75rem] ${
          theme === 'dark' ? 'text-white' : 'text-[var(--brand-navy)]'
        }`}
      >
        {title}
      </h2>
    </div>
  )
}
