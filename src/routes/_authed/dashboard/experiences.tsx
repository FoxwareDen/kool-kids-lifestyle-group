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
import { resolveTranslatable, createEmptyBlock, createBookingPage, parseCategories, serializeCategories } from '#/lib/experiences'
import { createFileRoute } from '@tanstack/react-router'
import { useState, useCallback, type ChangeEvent } from 'react'
import { BookingPageRenderer } from '#/components/BookingPageRenderer'

export const Route = createFileRoute('/_authed/dashboard/experiences')({
  component: RouteComponent,
})

type SkeletonPageData = Omit<BookingPage, 'blocks' | 'createdAt' | 'updatedAt' | 'id' | 'slug'>

const BLOCK_TYPES: PageBlock['type'][] = ['header', 'paragraph', 'image', 'video', 'selectable']

function setTranslated<T>(field: Translatable<T>, lang: Language, value: T): Translatable<T> {
  if (lang === 'en') return { ...field, default: value }
  return { ...field, translations: { ...field.translations, [lang]: value } }
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55">{label}</label>
    {children}
  </div>
)

const inputCls = "w-full rounded-md border border-[var(--brand-navy)]/15 bg-white px-3 py-2 text-sm text-[var(--brand-navy)] outline-none transition-colors placeholder:text-[var(--brand-navy)]/40 focus:border-[var(--brand-orange)] focus:ring-2 focus:ring-[var(--brand-orange)]/20"

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

const ImageBlockEditor = ({ block, lang, onChange }: { block: ImageBlock; lang: Language; onChange: (b: ImageBlock) => void }) => {
  const previewUrl = block.file ? URL.createObjectURL(block.file) : null
  return (
    <div className="flex flex-col gap-3">
      <Field label="Image">
        <input
          type="file"
          accept="image/*"
          className={inputCls}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            onChange({ ...block, file })
          }}
        />
        {previewUrl && (
          <img src={previewUrl} alt="preview" className="mt-1 rounded-md max-h-36 object-cover w-full" />
        )}
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
}

const VideoBlockEditor = ({ block, lang, onChange }: { block: VideoBlock; lang: Language; onChange: (b: VideoBlock) => void }) => {
  const previewUrl = block.file ? URL.createObjectURL(block.file) : null
  return (
    <div className="flex flex-col gap-3">
      <Field label="Video">
        <input
          type="file"
          accept="video/*"
          className={inputCls}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            onChange({ ...block, file })
          }}
        />
        {previewUrl && (
          <video src={previewUrl} controls className="mt-1 rounded-md max-h-36 w-full" />
        )}
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
}

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

      <label className="flex items-center gap-2 text-sm text-[var(--brand-navy)]/70 cursor-pointer">
        <input
          type="checkbox"
          checked={block.required}
          className="accent-[var(--brand-orange)]"
          onChange={(e) => onChange({ ...block, required: e.target.checked })}
        />
        Required
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55">Options</span>
        {block.options.map((opt, i) => (
          <div key={opt.id} className="flex flex-col gap-1.5 rounded-md border border-[var(--brand-navy)]/15 bg-[#f1ede6]/50 p-2.5">
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
                className="ml-auto text-xs font-semibold uppercase tracking-wide text-[var(--brand-navy)]/40 hover:text-[var(--brand-orange)]"
                onClick={() => removeOption(i)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="text-left text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-orange)] hover:text-[var(--brand-orange-deep)]"
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
  <div className="flex flex-col gap-3 rounded-lg border border-[var(--brand-navy)]/15 bg-white p-3.5 shadow-sm shadow-[var(--brand-navy)]/5">
    <div className="flex items-center justify-between border-b border-[var(--brand-navy)]/10 pb-2.5">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-orange)]">{block.type}</span>
      <button type="button" onClick={onDelete} className="text-xs text-[var(--brand-navy)]/30 hover:text-[var(--brand-orange)]">✕</button>
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
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [pageData, setPageData] = useState<SkeletonPageData>({
    defaultLanguage: 'en',
    enabledLanguages: ['en'],
    category: '',
    coverImage: undefined as unknown as File,
    title: { default: '' },
    description: { default: '' },
  })
  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [selection, setSelection] = useState<Record<number, string[]>>({})

  // `pageData.category` is stored as a single comma-separated string (that's
  // the actual PocketBase field type). `categories` is just that string
  // parsed out for rendering as chips below — always derived, never a
  // separate source of truth.
  const categories = parseCategories(pageData.category)

  const handleMetaChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const fieldLang: Language = (e.target.dataset.lang as Language) ?? 'en'
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
    e.preventDefault()
    const val = categoryInput.trim()
    if (!val) return
    setPageData((prev) => {
      const existing = parseCategories(prev.category)
      if (existing.includes(val)) return prev
      return { ...prev, category: serializeCategories([...existing, val]) }
    })
    setCategoryInput('')
  }

  const removeCategory = (val: string) => {
    setPageData((prev) => ({
      ...prev,
      category: serializeCategories(parseCategories(prev.category).filter((c) => c !== val)),
    }))
  }

  const addBlock = (type: PageBlock['type']) => {
    setBlocks((prev) => [...prev, createEmptyBlock(type, prev.length)])
  }

  const updateBlock = (index: number, updated: PageBlock) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? updated : b)))
  }

  const deleteBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setSubmitError(null)

    if (!pageData.coverImage) {
      setSubmitError('Cover image is required.')
      return
    }
    if (!pageData.title.default.trim()) {
      setSubmitError('Title is required.')
      return
    }

    setSubmitting(true)

    const blocksWithIndex: PageBlock[] = blocks.map((b, i) => ({ ...b, index: i }))

    const result = await createBookingPage({
      slug: pageData.title.default.toLowerCase().replace(/\s+/g, '-'),
      title: pageData.title,
      description: pageData.description,
      coverImage: pageData.coverImage,
      category: pageData.category,
      defaultLanguage: pageData.defaultLanguage,
      enabledLanguages: pageData.enabledLanguages,
      blocks: blocksWithIndex,
    })

    setSubmitting(false)

    if (!result.success) {
      setSubmitError(result.error ?? 'Something went wrong.')
    } else {
      console.log('Created:', result.value)
    }
  }

  return (
    <div className='flex w-full h-full bg-[#f1ede6]'>
      <div id='left' className='flex-2 flex justify-center min-h-0 border-r border-[var(--brand-navy)]/15 p-6'>
        <div className='w-11/12 shadow-2xl shadow-[var(--brand-navy)]/10'>
          <BookingPageRenderer
            page={{ blocks }}
            lang={lang}
            selection={selection}
            onSelectionChange={(blockIndex, ids) =>
              setSelection((prev) => ({ ...prev, [blockIndex]: ids }))
            }
          />
        </div>
      </div>

      <div id='right' className='flex-1 p-5 flex flex-col gap-4 overflow-y-auto bg-white'>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">
            Dashboard
          </p>
          <h1 className="display-title mt-1.5 text-2xl font-medium text-[var(--brand-navy)]">
            Create Experience
          </h1>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55">Language</span>
          <div className="flex gap-4">
            {(['en', 'af'] as const).map((l) => (
              <label key={l} className="flex items-center gap-1.5 text-sm text-[var(--brand-navy)]/80 cursor-pointer">
                <input type="radio" name="lang_group" value={l} checked={lang === l} className="accent-[var(--brand-orange)]" onChange={() => setLang(l)} />
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
                setPageData((prev) => ({ ...prev, coverImage: file }))
              }}
            />
            {pageData.coverImage && (
              <img
                src={URL.createObjectURL(pageData.coverImage)}
                alt="Cover preview"
                className="mt-1 rounded-md max-h-36 object-cover w-full"
              />
            )}
          </Field>

          <Field label="Categories">
            <input
              className={inputCls}
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={addCategory}
              placeholder="Type a category and press Enter…"
            />
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {categories.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-orange)]/10 py-0.5 pl-2.5 pr-1.5 text-xs font-semibold text-[var(--brand-navy)]"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => removeCategory(c)}
                      className="leading-none text-[var(--brand-navy)]/40 hover:text-[var(--brand-orange)]"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
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
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55">Blocks</span>

          {blocks.map((block, i) => (
            <BlockEditor
              key={block.index}
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
                className="rounded-md border border-[var(--brand-navy)]/15 px-2.5 py-1 text-xs font-semibold text-[var(--brand-navy)]/70 transition-colors hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange)]"
              >
                + {type}
              </button>
            ))}
          </div>
        </div>

        {submitError && (
          <p className="rounded-md bg-[var(--brand-orange)]/10 px-3 py-2 text-xs font-medium text-[var(--brand-orange-deep)]">{submitError}</p>
        )}

        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="mt-auto inline-flex items-center justify-center gap-2 bg-[var(--brand-orange)] px-7 py-3 text-xs font-bold uppercase tracking-widest !text-white shadow-lg shadow-black/10 transition-colors hover:bg-[var(--brand-orange-deep)] disabled:opacity-50"
        >
          {submitting ? 'Creating…' : 'Create Experience'}
        </button>

      </div>
    </div>
  )
}
