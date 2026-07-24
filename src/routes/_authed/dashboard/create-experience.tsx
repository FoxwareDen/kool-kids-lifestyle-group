import type { BookingPage, Translatable, Language, ExperienceStatus } from '#/lib/experiences'
import {
  resolveTranslatable,
  createBookingPage,
  parseCategories,
  serializeCategories,
} from '#/lib/experiences'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { setTranslated } from '#/lib/utils'
import { BookingPageRenderer } from '#/components/BookingPageRenderer'
import {
  SectionCard,
  TextField,
  controlClass,
  Button,
  Pill,
} from '#/components/dashboard/form-controls'
import {
  PostFormShell,
  BlocksSection,
  BlockEditor,
  BlockAddButtons,
  StatusSelect,
  FormRow,
  ErrorBanner,
  useBlocks,
  useObjectUrl,
  MAX_IMAGE_SIZE,
} from '#/components/dashboard/post-form'

export const Route = createFileRoute('/_authed/dashboard/create-experience')({
  component: RouteComponent,
})

/** The metadata portion of a booking page held in local form state. */
type SkeletonPageData = Omit<
  BookingPage,
  'blocks' | 'createdAt' | 'updatedAt' | 'id' | 'slug' | 'status'
>

/**
 * Owns the comma-separated `category` string on `pageData` plus the chip
 * add/remove/parse logic, so the route component doesn't need to know how
 * categories are encoded.
 */
function useCategories(
  pageData: SkeletonPageData,
  setPageData: React.Dispatch<React.SetStateAction<SkeletonPageData>>,
) {
  const [input, setInput] = useState('')
  const categories = parseCategories(pageData.category)

  const add = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return
      e.preventDefault()
      const val = input.trim()
      if (!val) return
      setPageData((prev) => {
        const existing = parseCategories(prev.category)
        if (existing.includes(val)) return prev
        return { ...prev, category: serializeCategories([...existing, val]) }
      })
      setInput('')
    },
    [input, setPageData],
  )

  const remove = useCallback(
    (val: string) => {
      setPageData((prev) => ({
        ...prev,
        category: serializeCategories(parseCategories(prev.category).filter((c) => c !== val)),
      }))
    },
    [setPageData],
  )

  return { categories, input, setInput, add, remove }
}

function RouteComponent() {
  const navigate = useNavigate()
  const [lang, setLang] = useState<Language>('en')
  const [status, setStatus] = useState<ExperienceStatus>('Draft')
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
  const [selection, setSelection] = useState<Record<number, string[]>>({})

  const { entries, blocks, addBlock, updateBlock, deleteBlock, serialize } = useBlocks()
  const categories = useCategories(pageData, setPageData)
  const coverPreviewUrl = useObjectUrl(pageData.coverImage)

  const handleMetaChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      if (name !== 'title' && name !== 'description') return
      setPageData((prev) => ({
        ...prev,
        [name]: setTranslated(prev[name] as Translatable, lang, value),
      }))
    },
    [lang],
  )

  const getMetaValue = (key: 'title' | 'description'): string => {
    const field = pageData[key]
    return field ? resolveTranslatable(field, lang) : ''
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
    const result = await createBookingPage({
      slug: pageData.title.default.toLowerCase().replace(/\s+/g, '-'),
      title: pageData.title,
      description: pageData.description,
      coverImage: pageData.coverImage,
      category: pageData.category,
      defaultLanguage: pageData.defaultLanguage,
      enabledLanguages: pageData.enabledLanguages,
      blocks: serialize(),
      status,
    })
    setSubmitting(false)

    if (!result.success) {
      setSubmitError(result.error ?? 'Something went wrong.')
    } else {
      navigate({ to: '/dashboard', search: { lang } })
    }
  }

  return (
    <PostFormShell
      title="Create Experience"
      lang={lang}
      onLangChange={setLang}
      preview={
        <BookingPageRenderer
          page={{ blocks }}
          lang={lang}
          selection={selection}
          onSelectionChange={(blockIndex, ids) =>
            setSelection((prev) => ({ ...prev, [blockIndex]: ids }))
          }
        />
      }
    >
      <SectionCard title="Details">
        <div className="flex flex-col gap-4">
          <StatusSelect value={status} onChange={setStatus} />

          <FormRow label="Cover Image">
            <input
              type="file"
              accept="image/*"
              className={controlClass}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                if (file.size > MAX_IMAGE_SIZE) {
                  setSubmitError('Cover image exceeds the maximum allowed size of 5MB.')
                  e.target.value = ''
                  return
                }
                setSubmitError(null)
                setPageData((prev) => ({ ...prev, coverImage: file }))
              }}
            />
            {coverPreviewUrl && (
              <img
                src={coverPreviewUrl}
                alt="Cover preview"
                className="mt-2 rounded-sm max-h-40 object-cover w-full"
              />
            )}
          </FormRow>

          <FormRow label="Categories" hint="Type a category and press Enter">
            <input
              className={controlClass}
              value={categories.input}
              onChange={(e) => categories.setInput(e.target.value)}
              onKeyDown={categories.add}
              placeholder="e.g. featured, tours…"
            />
            {categories.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {categories.categories.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1">
                    <Pill tone="accent">{c}</Pill>
                    <button
                      type="button"
                      onClick={() => categories.remove(c)}
                      aria-label={`Remove ${c}`}
                      className="text-xs leading-none text-[var(--sea-ink-soft)] hover:text-[var(--destructive)]"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </FormRow>

          <TextField
            label="Title"
            name="title"
            value={getMetaValue('title')}
            onChange={handleMetaChange}
            placeholder="Page title"
          />

          <FormRow label="Description">
            <textarea
              name="description"
              className={`${controlClass} min-h-16 resize-y`}
              value={getMetaValue('description')}
              onChange={handleMetaChange}
              placeholder="Short description…"
            />
          </FormRow>
        </div>
      </SectionCard>

      <SectionCard title="Content">
        <BlocksSection label="Blocks" addButtons={<BlockAddButtons onAdd={addBlock} />}>
          {entries.map(({ id, block }) => (
            <BlockEditor
              key={id}
              block={block}
              lang={lang}
              onChange={(updated) => updateBlock(id, updated)}
              onDelete={() => deleteBlock(id)}
            />
          ))}
        </BlocksSection>
      </SectionCard>

      {submitError && <ErrorBanner message={submitError} />}

      <Button
        type="button"
        disabled={submitting}
        onClick={handleSubmit}
        className="mt-auto w-full py-3 uppercase tracking-widest"
      >
        {submitting ? 'Creating…' : 'Create Experience'}
      </Button>
    </PostFormShell>
  )
}
