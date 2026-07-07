import type { PageBlock, BookingPage, Language } from '#/lib/experiences'
import { resolveTranslatable } from '#/lib/experiences'

const HeaderRenderer = ({ block, lang }: { block: Extract<PageBlock, { type: 'header' }>; lang: Language }) => {
  const text = resolveTranslatable(block.text, lang)
  const cls =  { 1: 'text-2xl', 2: 'text-xl', 3: 'text-lg' }[block.level]
  const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3'
  return <Tag className={`display-title font-medium tracking-tight text-balance text-[var(--brand-navy)] ${cls}`}>{text}</Tag>
}

const ParagraphRenderer = ({ block, lang }: { block: Extract<PageBlock, { type: 'paragraph' }>; lang: Language }) => (
  <p className="text-[15px] leading-relaxed text-pretty text-[var(--brand-navy)]/75">
    {resolveTranslatable(block.text, lang)}
  </p>
)

const ImageRenderer = ({ block, lang }: { block: Extract<PageBlock, { type: 'image' }>; lang: Language }) => {
  const src = block.file ? URL.createObjectURL(block.file) : null
  return (
    <figure className="flex flex-col gap-2">
      {src
        ? <img src={src} alt={resolveTranslatable(block.alt, lang)} className="w-full mx-auto h-96 object-cover rounded-xl shadow-lg shadow-[var(--brand-navy)]/10" />
        : <div className="flex h-56 w-full items-center justify-center rounded-xl border border-dashed border-[var(--brand-navy)]/20 bg-[#f1ede6]">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-navy)]/40">No image uploaded</span>
          </div>
      }
      {block.caption && (
        <figcaption className="text-center text-xs italic text-[var(--brand-navy)]/50">
          {resolveTranslatable(block.caption, lang)}
        </figcaption>
      )}
    </figure>
  )
}

const VideoRenderer = ({ block, lang }: { block: Extract<PageBlock, { type: 'video' }>; lang: Language }) => {
  const src = block.file ? URL.createObjectURL(block.file) : null
  return (
    <figure className="flex flex-col gap-2">
      {src
        ? <video src={src} controls className="w-full rounded-xl shadow-lg shadow-[var(--brand-navy)]/10" />
        : <div className="flex h-44 w-full items-center justify-center rounded-xl border border-dashed border-[var(--brand-navy)]/20 bg-[#f1ede6]">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-navy)]/40">No video uploaded</span>
          </div>
      }
      {block.title && (
        <figcaption className="text-center text-xs italic text-[var(--brand-navy)]/50">
          {resolveTranslatable(block.title, lang)}
        </figcaption>
      )}
    </figure>
  )
}

const SelectableRenderer = ({
  block,
  lang,
  value,
  onChange,
}: {
  block: Extract<PageBlock, { type: 'selectable' }>
  lang: Language
  value: string[]
  onChange: (ids: string[]) => void
}) => {
  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]">
        {resolveTranslatable(block.prompt, lang)}
        {block.required && <span className="text-[var(--brand-orange)] ml-1">*</span>}
      </span>
      <div className="flex flex-row flex-wrap gap-3">
        {block.options.map((opt) => (
          <label
            key={opt.id}
            className="group flex flex-1 min-w-32 cursor-pointer flex-col gap-1 rounded-xl border border-[var(--brand-navy)]/15 bg-white p-3.5 transition-all hover:border-[var(--brand-orange)]/60 hover:shadow-md hover:shadow-[var(--brand-orange)]/10 has-[:checked]:border-[var(--brand-orange)] has-[:checked]:bg-[var(--brand-orange)]/5 has-[:checked]:shadow-md has-[:checked]:shadow-[var(--brand-orange)]/15"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[var(--brand-navy)]">{resolveTranslatable(opt.label, lang)}</span>
              <input
                type="checkbox"
                className="shrink-0 accent-[var(--brand-orange)]"
                checked={value.includes(opt.id)}
                onChange={() => toggle(opt.id)}
              />
            </div>
            {opt.description && (
              <span className="text-xs leading-relaxed text-[var(--brand-navy)]/55">
                {resolveTranslatable(opt.description, lang)}
              </span>
            )}
            {opt.priceModifier != null && (
              <span className="mt-auto inline-flex w-fit items-center rounded-full bg-[var(--brand-orange)]/10 px-2.5 py-0.5 pt-1 text-xs font-bold text-[var(--brand-orange-deep)]">
                {opt.priceModifier >= 0 ? '+' : ''}{opt.priceModifier}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  )
}

type SelectionState = Record<number, string[]>

type BookingPageRendererProps = {
  page: Pick<BookingPage, 'blocks'>
  lang: Language
  selection?: SelectionState
  onSelectionChange?: (blockIndex: number, ids: string[]) => void
}

export const BookingPageRenderer = ({
  page,
  lang,
  selection = {},
  onSelectionChange,
}: BookingPageRendererProps) => (
  <div className="w-full h-full overflow-y-auto bg-white">
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10 md:px-10 md:py-14">
      {page.blocks.map((block) => {
        switch (block.type) {
          case 'header':
            return <HeaderRenderer key={block.index} block={block} lang={lang} />
          case 'paragraph':
            return <ParagraphRenderer key={block.index} block={block} lang={lang} />
          case 'image':
            return <ImageRenderer key={block.index} block={block} lang={lang} />
          case 'video':
            return <VideoRenderer key={block.index} block={block} lang={lang} />
          case 'selectable':
            return (
              <SelectableRenderer
                key={block.index}
                block={block}
                lang={lang}
                value={selection[block.index] ?? []}
                onChange={(ids) => onSelectionChange?.(block.index, ids)}
              />
            )
        }
      })}
    </div>
  </div>
)
