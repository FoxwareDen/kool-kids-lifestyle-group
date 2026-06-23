import type { PageBlock, BookingPage, Language } from '#/lib/experiences'
import { resolveTranslatable } from '#/lib/experiences'



const HeaderRenderer = ({ block, lang }: { block: Extract<PageBlock, { type: 'header' }>; lang: Language }) => {
  const text = resolveTranslatable(block.text, lang)
  const cls =  { 1: 'text-2xl', 2: 'text-xl', 3: 'text-lg' }[block.level]
  const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3'
  return <Tag className={`font-semibold ${cls}`}>{text}</Tag>
}

const ParagraphRenderer = ({ block, lang }: { block: Extract<PageBlock, { type: 'paragraph' }>; lang: Language }) => (
  <p className="text-sm leading-relaxed text-neutral-700">
    {resolveTranslatable(block.text, lang)}
  </p>
)

const ImageRenderer = ({ block, lang }: { block: Extract<PageBlock, { type: 'image' }>; lang: Language }) => {
  const src = block.file ? URL.createObjectURL(block.file) : null
  return (
    <figure className="flex flex-col gap-1.5">
      {src
        ? <img src={src} alt={resolveTranslatable(block.alt, lang)} className="w-full mx-auto h-96 object-cover rounded-md" />
        : <div className="w-full h-56 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center">
            <span className="text-xs text-neutral-400">No image uploaded</span>
          </div>
      }
      {block.caption && (
        <figcaption className="text-xs text-neutral-400 text-center">
          {resolveTranslatable(block.caption, lang)}
        </figcaption>
      )}
    </figure>
  )
}

const VideoRenderer = ({ block, lang }: { block: Extract<PageBlock, { type: 'video' }>; lang: Language }) => {
  const src = block.file ? URL.createObjectURL(block.file) : null
  return (
    <figure className="flex flex-col gap-1.5">
      {src
        ? <video src={src} controls className="w-full rounded-lg" />
        : <div className="w-full h-44 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center">
            <span className="text-xs text-neutral-400">No video uploaded</span>
          </div>
      }
      {block.title && (
        <figcaption className="text-xs text-neutral-400">
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
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">
        {resolveTranslatable(block.prompt, lang)}
        {block.required && <span className="text-red-400 ml-0.5">*</span>}
      </span>
      <div className="flex flex-row flex-wrap gap-2">
        {block.options.map((opt) => (
          <label
            key={opt.id}
            className="flex flex-col gap-0.5 flex-1 min-w-32 border border-neutral-200 rounded-md p-2.5 cursor-pointer hover:border-neutral-400 has-[:checked]:border-neutral-800 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm">{resolveTranslatable(opt.label, lang)}</span>
              <input
                type="checkbox"
                className="shrink-0"
                checked={value.includes(opt.id)}
                onChange={() => toggle(opt.id)}
              />
            </div>
            {opt.description && (
              <span className="text-xs text-neutral-400">
                {resolveTranslatable(opt.description, lang)}
              </span>
            )}
            {opt.priceModifier != null && (
              <span className="text-xs text-neutral-500 mt-auto pt-1">
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
  <div className="w-full h-full overflow-y-auto">
    <div className="flex flex-col gap-5 p-4">
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