// app/routes/_authed/dashboard/create-post.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, type ChangeEvent } from 'react'
import type { Translatable, Language } from '#/lib/experiences'
import { resolveTranslatable } from '#/lib/experiences'
import { setTranslated } from '#/lib/utils'
import { createBlogPage, createEvent, type PostStatus } from '#/lib/blog'
import { BookingPageRenderer } from '#/components/BookingPageRenderer'
import {
  SectionCard,
  TextField,
  Button,
} from '#/components/dashboard/form-controls'
import {
  PostFormShell,
  BlocksSection,
  BlockEditor,
  BlockAddButtons,
  StatusSelect,
  ErrorBanner,
  useBlocks,
} from '#/components/dashboard/post-form'

export const Route = createFileRoute('/_authed/dashboard/create-post')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [lang, setLang] = useState<Language>('en')
  const [postType, setPostType] = useState<'blog' | 'event'>('blog')
  const [status, setStatus] = useState<PostStatus>('Draft')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [title, setTitle] = useState<Translatable>({ default: '' })
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const { entries, blocks, addBlock, updateBlock, deleteBlock, serialize } = useBlocks()

  const getTitle = (): string => resolveTranslatable(title, lang)

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle((prev) => setTranslated(prev, lang, e.target.value))
  }

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
    const result =
      postType === 'blog'
        ? await createBlogPage({ title, content: serializedBlocks, status })
        : await createEvent({
            title,
            content: serializedBlocks,
            startDate: startDate!,
            endDate: endDate!,
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
      title="Create Post"
      lang={lang}
      onLangChange={setLang}
      preview={<BookingPageRenderer page={{ blocks }} lang={lang} />}
    >
      <SectionCard title="Details">
        <div className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-semibold text-[var(--sea-ink)]">Type</legend>
            <div className="flex gap-4">
              {(['blog', 'event'] as const).map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-1.5 text-sm text-[var(--sea-ink)] cursor-pointer capitalize"
                >
                  <input
                    type="radio"
                    name="postType"
                    value={t}
                    checked={postType === t}
                    onChange={() => setPostType(t)}
                    className="accent-[var(--brand-orange)]"
                  />
                  {t}
                </label>
              ))}
            </div>
          </fieldset>

          <StatusSelect value={status} onChange={setStatus} />

          <TextField
            label="Title"
            value={getTitle()}
            onChange={handleTitleChange}
            placeholder="Post title"
          />

          {postType === 'event' && (
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Start Date"
                type="date"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
              />
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Content">
        <BlocksSection addButtons={<BlockAddButtons onAdd={addBlock} />}>
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
        {submitting ? 'Creating…' : `Create ${postType === 'blog' ? 'Blog' : 'Event'}`}
      </Button>
    </PostFormShell>
  )
}
