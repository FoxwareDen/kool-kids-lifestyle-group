// app/routes/_authed/dashboard/create-post.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useCallback, useEffect, type ChangeEvent, type ReactNode, useMemo } from 'react'
import type {
  PageBlock,
  HeaderBlock,
  ParagraphBlock,
  ImageBlock,
  VideoBlock,
  Translatable,
  Language,
} from '#/lib/experiences'
import {
  resolveTranslatable,
  createEmptyBlock,
} from '#/lib/experiences'
import { setTranslated } from '#/lib/utils'
import { createBlogPage, createEvent } from '#/lib/blog'
import { BookingPageRenderer } from '#/components/BookingPageRenderer'

// Max sizes (same as example)
const MAX_SIZE = 5242880
const MAX_VIDEO_SIZE = 52428800

// ---------- useObjectUrl hook (copied from example) ----------
function useObjectUrl(file: File | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!file) {
      setUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])
  return url
}

// ---------- Field & input classes (same as example) ----------
const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55">{label}</label>
    {children}
  </div>
)

const inputCls =
  "w-full rounded-md border border-[var(--brand-navy)]/15 bg-white px-3 py-2 text-sm text-[var(--brand-navy)] outline-none transition-colors placeholder:text-[var(--brand-navy)]/40 focus:border-[var(--brand-orange)] focus:ring-2 focus:ring-[var(--brand-orange)]/20"

// ---------- Block Editors (exactly as in example, all w-full) ----------
const HeaderBlockEditor = ({ block, lang, onChange }: { block: HeaderBlock; lang: Language; onChange: (b: HeaderBlock) => void }) => (
  <div className="flex flex-col gap-3 w-full">
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
  const previewUrl = useObjectUrl(block.file)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-3 w-full">
      <Field label="Image">
        <input
          type="file"
          accept="image/*"
          className={inputCls}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            if (file.size > MAX_SIZE) {
              setError('Image exceeds the maximum allowed size of 5MB.')
              e.target.value = ''
              return
            }
            setError(null)
            onChange({ ...block, file })
          }}
        />
        {error && <p className="mt-1 text-xs font-medium text-[var(--brand-orange-deep)]">{error}</p>}
        {previewUrl && !error && (
          <img src={previewUrl} alt="preview" className="mt-1 rounded-md max-h-48 object-cover w-full" />
        )}
      </Field>
    </div>
  )
}

const VideoBlockEditor = ({ block, lang, onChange }: { block: VideoBlock; lang: Language; onChange: (b: VideoBlock) => void }) => {
  const previewUrl = useObjectUrl(block.file)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-3 w-full">
      <Field label="Video">
        <input
          type="file"
          accept="video/*"
          className={inputCls}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            if (file.size > MAX_VIDEO_SIZE) {
              setError('Video exceeds the maximum allowed size of 50MB.')
              e.target.value = ''
              return
            }
            setError(null)
            onChange({ ...block, file })
          }}
        />
        {error && <p className="mt-1 text-xs font-medium text-[var(--brand-orange-deep)]">{error}</p>}
        {previewUrl && !error && (
          <video src={previewUrl} controls className="mt-1 rounded-md max-h-48 w-full" />
        )}
      </Field>
    </div>
  )
}

// ---------- BlockEditor wrapper (full width, same styling) ----------
const BlockEditor = ({
  block,
  lang,
  onChange,
  onDelete,
}: {
  block: PageBlock
  lang: Language
  onChange: (u: PageBlock) => void
  onDelete: () => void
}) => (
  <div className="flex flex-col gap-3 rounded-lg border border-[var(--brand-navy)]/15 bg-white p-3.5 shadow-sm shadow-[var(--brand-navy)]/5 w-full">
    <div className="flex items-center justify-between border-b border-[var(--brand-navy)]/10 pb-2.5">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-orange)]">{block.type}</span>
      <button type="button" onClick={onDelete} className="text-xs text-[var(--brand-navy)]/30 hover:text-[var(--brand-orange)]">
        ✕
      </button>
    </div>

    {block.type === 'header' && <HeaderBlockEditor block={block} lang={lang} onChange={onChange} />}
    {block.type === 'paragraph' && <ParagraphBlockEditor block={block} lang={lang} onChange={onChange} />}
    {block.type === 'image' && <ImageBlockEditor block={block} lang={lang} onChange={onChange} />}
    {block.type === 'video' && <VideoBlockEditor block={block} lang={lang} onChange={onChange} />}
  </div>
)

// ---------- useBlocks hook (same) ----------
function useBlocks() {
  const [entries, setEntries] = useState<{ id: string; block: PageBlock }[]>([])

  const addBlock = useCallback((type: PageBlock['type']) => {
    setEntries((prev) => [...prev, { id: crypto.randomUUID(), block: createEmptyBlock(type, prev.length) }])
  }, [])

  const updateBlock = useCallback((id: string, updated: PageBlock) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, block: updated } : e)))
  }, [])

  const deleteBlock = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const blocks = useMemo(() => entries.map((e) => e.block), [entries])

  const serialize = useCallback((): PageBlock[] => entries.map((e, i) => ({ ...e.block, index: i })), [entries])

  return { entries, blocks, addBlock, updateBlock, deleteBlock, serialize }
}

// ---------- Route ----------
export const Route = createFileRoute('/_authed/dashboard/create-post')({
  component: RouteComponent,
})

const BLOCK_TYPES: PageBlock['type'][] = ['header', 'paragraph', 'image', 'video']

function RouteComponent() {
  const navigate = useNavigate()
  const [lang, setLang] = useState<Language>('en')
  const [postType, setPostType] = useState<'blog' | 'event'>('blog')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [title, setTitle] = useState<Translatable>({ default: '' })
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const { entries, blocks, addBlock, updateBlock, deleteBlock, serialize } = useBlocks()

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle((prev) => setTranslated(prev, lang, value))
  }

  const getTitle = (): string => resolveTranslatable(title, lang)

  const handleSubmit = async () => {
    setSubmitError(null)
    if (!getTitle().trim()) {
      setSubmitError('Title is required.')
      return
    }
    if (postType === 'event') {
      if (!startDate || !endDate) {
        setSubmitError('Start and end dates are required for events.')
        return
      }
      if (endDate < startDate) {
        setSubmitError('End date must be after start date.')
        return
      }
    }

    setSubmitting(true)
    const serializedBlocks = serialize()
    let result
    if (postType === 'blog') {
      result = await createBlogPage({ title, content: serializedBlocks })
    } else {
      result = await createEvent({ title, content: serializedBlocks, startDate: startDate!, endDate: endDate! })
    }
    setSubmitting(false)

    if (!result.success) {
      setSubmitError(result.error ?? 'Something went wrong.')
    } else {
      navigate({ to: '/dashboard', search: { lang } })
    }
  }

  return (
  <div className="flex w-full h-full bg-[#f1ede6]">
    {/* Left: preview */}
    <div className="flex-2 flex justify-center min-h-0 border-r border-[var(--brand-navy)]/15 p-6 overflow-y-auto">
      <div className="w-11/12 overflow-hidden rounded-2xl border border-[var(--brand-navy)]/10 shadow-2xl shadow-[var(--brand-navy)]/15">
        <BookingPageRenderer
          page={{ blocks }}
          lang={lang}
        />
      </div>
    </div>

    {/* Right: editor */}
    <div className="flex-[1.2] p-5 flex flex-col gap-4 overflow-y-auto bg-white">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--brand-orange)]">Dashboard</p>
        <h1 className="display-title mt-1.5 text-2xl font-medium text-[var(--brand-navy)]">Create Post</h1>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-1.5 text-sm text-[var(--brand-navy)]/80 cursor-pointer">
          <input type="radio" name="postType" value="blog" checked={postType === 'blog'} onChange={() => setPostType('blog')} className="accent-[var(--brand-orange)]" />
          Blog
        </label>
        <label className="flex items-center gap-1.5 text-sm text-[var(--brand-navy)]/80 cursor-pointer">
          <input type="radio" name="postType" value="event" checked={postType === 'event'} onChange={() => setPostType('event')} className="accent-[var(--brand-orange)]" />
          Event
        </label>
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

      <Field label="Title">
        <input className={inputCls} value={getTitle()} onChange={handleTitleChange} placeholder="Post title" />
      </Field>

      {postType === 'event' && (
        <div className="flex gap-4">
          <Field label="Start Date">
            <input
              type="date"
              className={inputCls}
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
            />
          </Field>
          <Field label="End Date">
            <input
              type="date"
              className={inputCls}
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
            />
          </Field>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55">Content Blocks</span>
        {entries.map(({ id, block }) => (
          <BlockEditor
            key={id}
            block={block}
            lang={lang}
            onChange={(updated) => updateBlock(id, updated)}
            onDelete={() => deleteBlock(id)}
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
        <p className="rounded-md bg-[var(--brand-orange)]/10 px-3 py-2 text-xs font-medium text-[var(--brand-orange-deep)]">
          {submitError}
        </p>
      )}

      <button
        type="button"
        disabled={submitting}
        onClick={handleSubmit}
        className="mt-auto inline-flex items-center justify-center gap-2 bg-[var(--brand-orange)] px-7 py-3 text-xs font-bold uppercase tracking-widest !text-white shadow-lg shadow-black/10 transition-colors hover:bg-[var(--brand-orange-deep)] disabled:opacity-50"
      >
        {submitting ? 'Creating…' : `Create ${postType === 'blog' ? 'Blog' : 'Event'}`}
      </button>
    </div>
  </div>
)
}