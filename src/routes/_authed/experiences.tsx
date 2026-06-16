import type {
  PageBlock,
  BookingPage,
  Translatable,
  HeaderBlock,
  ParagraphBlock,
  ImageBlock,
  VideoBlock,
  SelectableBlock,
  SelectableOption,
  Language,
} from '#/lib/experiences'
import { resolveTranslatable, createEmptyBlock } from '#/lib/experiences'
import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, type ChangeEvent } from 'react'
import { BookingPageRenderer } from '#/components/BookingPageRenderer'

export const Route = createFileRoute('/_authed/experiences')({
  component: RouteComponent,
})

type SkeletonPageData = Omit<BookingPage, 'blocks' | 'createdAt' | 'updatedAt' | 'id' | 'slug'>

const BLOCK_TYPES: PageBlock['type'][] = ['header', 'paragraph', 'image', 'video', 'selectable']

function setTranslated<T>(field: Translatable<T>, lang: Language, value: T): Translatable<T> {
  if (lang === 'en') return { ...field, default: value }
  return { ...field, translations: { ...field.translations, [lang]: value } }
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-neutral-500">{label}</label>
    {children}
  </div>
)

const inputCls = "border border-neutral-200 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-neutral-400"

const HeaderBlockEditor = ({ block, lang, onChange }: { block: HeaderBlock; lang: Language; onChange: (b: HeaderBlock) => void }) => (
  <div className="flex flex-col gap-3">
    <Field label="Level">
      <select
        className={inputCls}
        value={block.level}
        onChange={(e) => onChange({ ...block, level: parseInt(e.target.value, 10) as 1 | 2 | 3 })}
      >
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
      </select>
    </Field>
    <Field label="Text">
      <input
        className={inputCls}
        value={resolveTranslatable(block.text, lang)}
        placeholder="Heading text…"
        onChange={(e) => onChange({ ...block, text: setTranslated(block.text, lang, e.target.value) })}
      />
    </Field>
  </div>
)

const ParagraphBlockEditor = ({ block, lang, onChange }: { block: ParagraphBlock; lang: Language; onChange: (b: ParagraphBlock) => void }) => (
  <Field label="Text">
    <textarea
      className={`${inputCls} min-h-20 resize-y`}
      value={resolveTranslatable(block.text, lang)}
      placeholder="Paragraph text…"
      onChange={(e) => onChange({ ...block, text: setTranslated(block.text, lang, e.target.value) })}
    />
  </Field>
)

const ImageBlockEditor = ({ block, lang, onChange }: { block: ImageBlock; lang: Language; onChange: (b: ImageBlock) => void }) => (
  <div className="flex flex-col gap-3">
    <Field label="Image">
      <input
        type="file"
        accept="image/*"
        className={inputCls}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          onChange({ ...block, url: URL.createObjectURL(file) })
        }}
      />
    </Field>
    <Field label="Alt text">
      <input
        className={inputCls}
        value={resolveTranslatable(block.alt, lang)}
        placeholder="Alt text…"
        onChange={(e) => onChange({ ...block, alt: setTranslated(block.alt, lang, e.target.value) })}
      />
    </Field>
    <Field label="Caption">
      <input
        className={inputCls}
        value={block.caption ? resolveTranslatable(block.caption, lang) : ''}
        placeholder="Caption (optional)…"
        onChange={(e) =>
          onChange({ ...block, caption: setTranslated(block.caption ?? { default: '' }, lang, e.target.value) })
        }
      />
    </Field>
  </div>
)

const VideoBlockEditor = ({ block, lang, onChange }: { block: VideoBlock; lang: Language; onChange: (b: VideoBlock) => void }) => (
  <div className="flex flex-col gap-3">
    <Field label="Video">
      <input
        type="file"
        accept="video/*"
        className={inputCls}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          onChange({ ...block, url: URL.createObjectURL(file) })
        }}
      />
    </Field>
    <Field label="Title">
      <input
        className={inputCls}
        value={block.title ? resolveTranslatable(block.title, lang) : ''}
        placeholder="Video title (optional)…"
        onChange={(e) =>
          onChange({ ...block, title: setTranslated(block.title ?? { default: '' }, lang, e.target.value) })
        }
      />
    </Field>
  </div>
)

const SelectableBlockEditor = ({ block, lang, onChange }: { block: SelectableBlock; lang: Language; onChange: (b: SelectableBlock) => void }) => {
  const updateOption = (index: number, updated: SelectableOption) => {
    onChange({ ...block, options: block.options.map((o, i) => (i === index ? updated : o)) })
  }
  const addOption = () => {
    onChange({ ...block, options: [...block.options, { id: crypto.randomUUID(), label: { default: '' } }] })
  }
  const removeOption = (index: number) => {
    onChange({ ...block, options: block.options.filter((_, i) => i !== index) })
  }

  return (
    <div className="flex flex-col gap-3">
      <Field label="Prompt">
        <input
          className={inputCls}
          value={resolveTranslatable(block.prompt, lang)}
          placeholder="Choose an option…"
          onChange={(e) => onChange({ ...block, prompt: setTranslated(block.prompt, lang, e.target.value) })}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
        <input
          type="checkbox"
          checked={block.required}
          onChange={(e) => onChange({ ...block, required: e.target.checked })}
        />
        Required
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-neutral-500">Options</span>
        {block.options.map((opt, i) => (
          <div key={opt.id} className="flex flex-col gap-1.5 p-2 border border-neutral-200 rounded-md">
            <input
              className={inputCls}
              value={resolveTranslatable(opt.label, lang)}
              placeholder="Label…"
              onChange={(e) => updateOption(i, { ...opt, label: setTranslated(opt.label, lang, e.target.value) })}
            />
            <input
              className={inputCls}
              value={opt.description ? resolveTranslatable(opt.description, lang) : ''}
              placeholder="Description (optional)…"
              onChange={(e) =>
                updateOption(i, { ...opt, description: setTranslated(opt.description ?? { default: '' }, lang, e.target.value) })
              }
            />
            <div className="flex gap-2 items-center">
              <input
                type="number"
                className={`${inputCls} w-28`}
                value={opt.priceModifier ?? ''}
                placeholder="Price modifier"
                onChange={(e) =>
                  updateOption(i, { ...opt, priceModifier: e.target.value === '' ? undefined : parseFloat(e.target.value) })
                }
              />
              <button
                type="button"
                className="ml-auto text-xs text-neutral-400 hover:text-red-400"
                onClick={() => removeOption(i)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="text-xs text-neutral-500 hover:text-neutral-800 text-left"
          onClick={addOption}
        >
          + Add option
        </button>
      </div>
    </div>
  )
}

const BlockEditor = ({
  block, lang, onChange, onDelete,
}: {
  block: PageBlock; lang: Language; onChange: (u: PageBlock) => void; onDelete: () => void
}) => (
  <div className="border border-neutral-200 rounded-lg p-3 flex flex-col gap-3 bg-white">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">{block.type}</span>
      <button type="button" onClick={onDelete} className="text-xs text-neutral-300 hover:text-red-400">✕</button>
    </div>

    {block.type === 'header'     && <HeaderBlockEditor     block={block} lang={lang} onChange={onChange} />}
    {block.type === 'paragraph'  && <ParagraphBlockEditor  block={block} lang={lang} onChange={onChange} />}
    {block.type === 'image'      && <ImageBlockEditor      block={block} lang={lang} onChange={onChange} />}
    {block.type === 'video'      && <VideoBlockEditor      block={block} lang={lang} onChange={onChange} />}
    {block.type === 'selectable' && <SelectableBlockEditor block={block} lang={lang} onChange={onChange} />}
  </div>
)

function RouteComponent() {
  const [lang, setLang] = useState<Language>('en')
  const [categoryInput, setCategoryInput] = useState('')
  const [pageData, setPageData] = useState<SkeletonPageData>({
    defaultLanguage: 'en',
    enabledLanguages: ['en'],
    category: [],
    coverImage: undefined,
    title: { default: '' },
    description: { default: '' },
  })
  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [selection, setSelection] = useState<Record<string, string[]>>({})

  const handleMetaChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const fieldLang: Language = e.target.dataset.lang ?? 'en'
    if (name !== 'title' && name !== 'description') return
    setPageData((prev) => ({
      ...prev,
      [name]: setTranslated(prev[name] as Translatable, fieldLang, value),
    }))
  }, [])

  const getMetaValue = (key: 'title' | 'description'): string => {
    const field = pageData[key]
    if (!field) return ''
    return resolveTranslatable(field, lang)
  }

  const addCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const val = categoryInput.trim()
    if (!val || pageData.category.includes(val)) return
    setPageData((prev) => ({ ...prev, category: [...prev.category, val] }))
    setCategoryInput('')
  }

  const removeCategory = (cat: string) => {
    setPageData((prev) => ({ ...prev, category: prev.category.filter((c) => c !== cat) }))
  }

  const addBlock = (type: PageBlock['type']) => {
    setBlocks((prev) => [...prev, createEmptyBlock(type, crypto.randomUUID())])
  }

  const updateBlock = (index: number, updated: PageBlock) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? updated : b)))
  }

  const deleteBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className='flex w-full h-full'>

      <div id='left' className='flex-2 flex justify-center min-h-0 border-r border-neutral-200'>
        <div className='w-11/12 shadow-2xl'>
          <BookingPageRendereroc
            page={{ title: pageData.title, description: pageData.description, blocks }}
            lang={lang}
            selection={selection}
            onSelectionChange={(blockId, ids) =>
              setSelection((prev) => ({ ...prev, [blockId]: ids }))
            }
          />
        </div>
      </div>

      <div id='right' className='flex-1 p-4 flex flex-col gap-4 overflow-y-auto'>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-neutral-500">Language</span>
          <div className="flex gap-4">
            {(['en', 'af'] as const).map((l) => (
              <label key={l} className="flex items-center gap-1.5 text-sm text-neutral-700 cursor-pointer">
                <input type="radio" name="lang_group" value={l} checked={lang === l} onChange={() => setLang(l)} />
                {l === 'en' ? 'English' : 'Afrikaans'}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">

          <Field label="Cover Image">
            <input
              type="file"
              accept="image/*"
              className={inputCls}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setPageData((prev) => ({ ...prev, coverImage: URL.createObjectURL(file) }))
              }}
            />
            {pageData.coverImage && (
              <img src={pageData.coverImage} alt="Cover preview" className="mt-1 rounded-md max-h-36 object-cover w-full" />
            )}
          </Field>

          <Field label="Category">
            <div className="flex flex-wrap gap-1.5 mb-1">
              {pageData.category.map((cat) => (
                <span key={cat} className="flex items-center gap-1 text-xs bg-neutral-100 border border-neutral-200 rounded-full px-2.5 py-1">
                  {cat}
                  <button type="button" onClick={() => removeCategory(cat)} className="text-neutral-400 hover:text-red-400">✕</button>
                </span>
              ))}
            </div>
            <input
              className={inputCls}
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={addCategory}
              placeholder="Type a category and press Enter…"
            />
          </Field>

          <Field label="Title">
            <input
              name="title"
              data-lang={lang}
              className={inputCls}
              value={getMetaValue('title')}
              onChange={handleMetaChange}
              placeholder="Page title"
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              data-lang={lang}
              className={`${inputCls} min-h-16 resize-y`}
              value={getMetaValue('description')}
              onChange={handleMetaChange}
              placeholder="Short description…"
            />
          </Field>

        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-neutral-500">Blocks</span>

          {blocks.map((block, i) => (
            <BlockEditor
              key={block.id}
              block={block}
              lang={lang}
              onChange={(updated) => updateBlock(i, updated)}
              onDelete={() => deleteBlock(i)}
            />
          ))}

          <div className="flex gap-1 flex-wrap mt-1">
            {BLOCK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addBlock(type)}
                className="text-xs border border-neutral-200 rounded px-2 py-1 text-neutral-500 hover:border-neutral-400 hover:text-neutral-700"
              >
                + {type}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}