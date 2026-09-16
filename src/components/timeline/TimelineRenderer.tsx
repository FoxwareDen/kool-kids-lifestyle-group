import type { TimelineEntry, TimelineEntryKind } from '#/lib/timeline'
import { TimelineHero } from './TimelineHero'
import { TimelineFeed } from './TimelineFeed'
import { resolveTranslatable, type Language } from '#/lib/experiences'

/**
 * Per-section hero copy and breadcrumb configuration. The blogs route and the
 * events route share the same components and only differ in this framing.
 */
const SECTION_CONFIG: Record<
  TimelineEntryKind,
  {
    crumbLabel: { default: string; translations?: Partial<Record<Language, string>> }
    crumbHref: string
    eyebrow: { default: string; translations?: Partial<Record<Language, string>> }
    title: { default: string; translations?: Partial<Record<Language, string>> }
    subtitle: { default: string; translations?: Partial<Record<Language, string>> }
    emptyMessage: { default: string; translations?: Partial<Record<Language, string>> }
  }
> = {
  blog: {
    crumbLabel: { default: 'Blog', translations: { af: 'Blog' } },
    crumbHref: '/blogs',
    eyebrow: { default: 'Stories & Reflections', translations: { af: 'Stories & Refleksies' } },
    title: { default: 'The Blog Timeline', translations: { af: 'Die Blog-tydlyn' } },
    subtitle: { default: 'Every story, newest first.', translations: { af: 'Elke verhaal, nuutste eerste.' } },
    emptyMessage: {
      default: 'There’s nothing here just yet. Check back soon for new stories from Prieska.',
      translations: { af: 'Daar is nog niks hier nie. Kom gou weer terug vir nuwe stories van Prieska.' },
    },
  },
  event: {
    crumbLabel: { default: 'Events', translations: { af: 'Gebeure' } },
    crumbHref: '/events',
    eyebrow: { default: 'Gatherings & Happenings', translations: { af: 'Byeenkomste & Gebeure' } },
    title: { default: 'The Events Timeline', translations: { af: 'Die Gebeurtenis-tydlyn' } },
    subtitle: { default: 'Every event, newest first.', translations: { af: 'Elke gebeurtenis, nuutste eerste.' } },
    emptyMessage: {
      default: 'No events have been scheduled yet. Check back soon for upcoming happenings.',
      translations: { af: 'Daar is nog geen gebeurtenisse beplan nie. Kom gou weer terug vir komende gebeure.' },
    },
  },
}

/**
 * Props for the {@link TimelineRenderer} component.
 * @typedef {Object} TimelineRendererProps
 * @property {TimelineEntryKind} section - Which content kind is being shown.
 * @property {TimelineEntry[]} entries - The pre-sorted (newest-first) entries.
 * @property {boolean} [isLoading] - Whether the entries are still loading.
 */

/**
 * The shared page body for the `/blogs` and `/events` index routes. Composes
 * the {@link TimelineHero} and {@link TimelineFeed} so both routes render an
 * identical chronological feed, with only the hero framing and empty-state copy
 * varying per section.
 *
 * @param {TimelineRendererProps} props - Component props.
 * @returns {JSX.Element} The rendered timeline page body.
 */
export function TimelineRenderer({
  section,
  entries,
  isLoading = false,
  lang = 'en',
}: {
  section: TimelineEntryKind
  entries: TimelineEntry[]
  isLoading?: boolean
  lang?: Language
}) {
  const config = SECTION_CONFIG[section]

  return (
    <main>
      <TimelineHero
        crumbLabel={resolveTranslatable(config.crumbLabel, lang)}
        crumbHref={config.crumbHref}
        eyebrow={resolveTranslatable(config.eyebrow, lang)}
        title={resolveTranslatable(config.title, lang)}
        subtitle={resolveTranslatable(config.subtitle, lang)}
        lang={lang}
      />
      <TimelineFeed
        entries={entries}
        isLoading={isLoading}
        emptyMessage={resolveTranslatable(config.emptyMessage, lang)}
      />
    </main>
  )
}
