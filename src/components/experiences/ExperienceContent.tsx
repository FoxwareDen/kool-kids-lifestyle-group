import { useQuery } from '@tanstack/react-query'
import { resolveTranslatable, type FlatBookingPage, type Language } from '#/lib/experiences'

// The blocks on a hydrated experience are "flat": media blocks reference an
// asset by id (resolved lazily on the client) rather than carrying a File.
type FlatBlock = FlatBookingPage['blocks'][number]

/**
 * Renders a single flat media block (image or video). The underlying asset id
 * is resolved into a file URL via React Query so there is no raw useEffect
 * fetching. While resolving, a skeleton placeholder keeps the layout stable.
 *
 * @param {{ block: Extract<FlatBlock, { asset_id: string }>, lang: Language }} props
 * @returns {JSX.Element} The rendered media figure.
 */
function FlatMediaBlock({
  block,
}: {
  block: Extract<FlatBlock, { asset_id: string }>
}) {
  const { data: url, isLoading } = useQuery({
    queryKey: ['asset', block.asset_id],
    queryFn: () => ()=>"",//TODO: fix the crack smoking AI code
    staleTime: 10 * 60 * 1000,
  })

  if (isLoading) {
    return <div className="h-80 w-full animate-pulse rounded-xl bg-[var(--brand-navy)]/5" />
  }

  if (!url) {
    return (
      <div className="flex h-56 w-full items-center justify-center rounded-xl border border-dashed border-[var(--brand-navy)]/20 bg-[#f1ede6]">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-navy)]/40">
          Media unavailable
        </span>
      </div>
    )
  }

  return (
    <figure className="flex flex-col gap-2">
      {block.type === 'video' ? (
        <video
          src={url}
          controls
          className="w-full rounded-xl shadow-lg shadow-[var(--brand-navy)]/10"
        />
      ) : (
        <img
          src={url || '/placeholder.svg'}
          alt={block.alt ?? ''}
          className="mx-auto max-h-[28rem] w-full rounded-xl object-cover shadow-lg shadow-[var(--brand-navy)]/10"
        />
      )}
      {block.caption && (
        <figcaption className="text-center text-xs italic text-[var(--brand-navy)]/50">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Renders the rich content blocks of a hydrated experience (header, paragraph,
 * selectable and media). Selectable blocks are shown read-only here since the
 * detail page is informational — choices are made during booking.
 *
 * @param {{ blocks: FlatBlock[], lang: Language }} props - Component props.
 * @returns {JSX.Element} The rendered content stack.
 */
export function ExperienceContent({
  blocks,
  lang,
}: {
  blocks: FlatBlock[]
  lang: Language
}) {
  const sorted = [...blocks].sort((a, b) => a.index - b.index)

  return (
    <div className="flex flex-col gap-6">
      {sorted.map((block) => {
        // Media blocks are the only ones carrying an asset_id.
        if ('asset_id' in block) {
          return <FlatMediaBlock key={block.index} block={block} />
        }

        switch (block.type) {
          case 'header': {
            const text = resolveTranslatable(block.text, lang)
            const cls = { 1: 'text-2xl', 2: 'text-xl', 3: 'text-lg' }[block.level]
            const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3'
            return (
              <Tag
                key={block.index}
                className={`display-title font-medium tracking-tight text-balance text-[var(--brand-navy)] ${cls}`}
              >
                {text}
              </Tag>
            )
          }
          case 'paragraph':
            return (
              <p
                key={block.index}
                className="text-[15px] leading-relaxed text-pretty text-[var(--brand-navy)]/75"
              >
                {resolveTranslatable(block.text, lang)}
              </p>
            )
          // case 'selectable':
          //   return (
          //     <div key={block.index} className="flex flex-col gap-3">
          //       <span className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]">
          //         {resolveTranslatable(block.prompt, lang)}
          //       </span>
          //       <div className="flex flex-row flex-wrap gap-3">
          //         {block.options.map((opt) => (
          //           <div
          //             key={opt.id}
          //             className="flex min-w-32 flex-1 flex-col gap-1 rounded-xl border border-[var(--brand-navy)]/15 bg-white p-3.5"
          //           >
          //             <span className="text-sm font-semibold text-[var(--brand-navy)]">
          //               {resolveTranslatable(opt.label, lang)}
          //             </span>
          //             {opt.description && (
          //               <span className="text-xs leading-relaxed text-[var(--brand-navy)]/55">
          //                 {resolveTranslatable(opt.description, lang)}
          //               </span>
          //             )}
          //           </div>
          //         ))}
          //       </div>
          //     </div>
          //   )
          default:
            return null
        }
      })}
    </div>
  )
}
