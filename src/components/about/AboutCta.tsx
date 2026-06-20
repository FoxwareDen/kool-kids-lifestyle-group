import storyImg from '../../images/karoo-2.jpeg'
import type { Content } from '#/lib/pocketbase'
import { mapIcon } from '#/lib/utils'


interface AboutCta {
  kicker: string,
  title: string,
  description: string,
  buttons: {
    label: string,
    style: string,
    icon: string,
    href: string
  }[]
}

/**
 * A full-width call-to-action band that closes the About page. A Karoo
 * background sits behind a navy overlay holding a serif headline, a short
 * supporting line and two calls to action — a primary "Book an Experience"
 * button and an outlined "Contact Us" button.
 *
 * @returns {JSX.Element} The rendered call-to-action section.
 */
export function AboutCta({data}: {data: Content<Partial<AboutCta>>}) {
  const { content: { kicker, title, description, buttons } } = data;

  return (
    <section className="relative overflow-hidden">
      <img
        src={storyImg}
        alt="Karoo landscape at sunset near Prieska"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[var(--brand-navy)]/85" />

      <div className="relative mx-auto w-full max-w-[1180px] px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
          {kicker ?? "Ready to Explore?"}
        </p>
        <h2 className="display-title mx-auto mt-3 max-w-2xl text-balance text-3xl font-medium leading-[1.15] text-white sm:text-4xl">
          {title ?? "Come Experience Prieska for Yourself"}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-white/75">
          {description??"Let our team help you plan a journey filled with heritage, adventure and the unmistakable warmth of the Northern Cape."}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {buttons?.map(({label, style,icon,href}:{label:string, style:string,icon:string,href:string})=>{
            const Icon = mapIcon(icon);

            return (
              <a
                href={href}
                className={`group inline-flex items-center gap-3 border border-white/60 px-7 py-3.5 text-xs font-bold uppercase tracking-widest !text-white no-underline transition-colors  ${style=="primary"?"bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-deep)]":"hover:bg-white/10"}`}
              >
              {label}
                <Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            )  
          })}
        </div>
      </div>
    </section>
  )
}
