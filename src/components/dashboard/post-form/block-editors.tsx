import { useState } from 'react'
import type {
  PageBlock,
  HeaderBlock,
  ParagraphBlock,
  ImageBlock,
  VideoBlock,
  Language,
} from '#/lib/experiences'
import { resolveTranslatable } from '#/lib/experiences'
import { setTranslated } from '#/lib/utils'
import { controlClass, Button } from '#/components/dashboard/form-controls'
import { FormRow } from './fields'
import { useObjectUrl, MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from './hooks'

/** The block types users can add, in display order. */
export const BLOCK_TYPES: PageBlock['type'][] = ['header', 'paragraph', 'image', 'video']

/**
 * Editor for a heading block: picks a level (H1–H3) and its translatable text.
 *
 * @param block - The header block being edited.
 * @param lang - Active authoring language; edits write into this language.
 * @param onChange - Called with the updated block.
 */
function HeaderBlockEditor({
  block,
  lang,
  onChange,
}: {
  block: HeaderBlock
  lang: Language
  onChange: (b: HeaderBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <FormRow label="Level">
        <select
          className={controlClass}
          value={block.level}
          onChange={(e) => onChange({ ...block, level: parseInt(e.target.value, 10) as 1 | 2 | 3 })}
        >
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
        </select>
      </FormRow>
      <FormRow label="Text">
        <input
          className={controlClass}
          value={resolveTranslatable(block.text, lang)}
          placeholder="Heading text…"
          onChange={(e) => onChange({ ...block, text: setTranslated(block.text, lang, e.target.value) })}
        />
      </FormRow>
    </div>
  )
}

/**
 * Editor for a paragraph block: a single translatable multi-line text area.
 *
 * @param block - The paragraph block being edited.
 * @param lang - Active authoring language; edits write into this language.
 * @param onChange - Called with the updated block.
 */
function ParagraphBlockEditor({
  block,
  lang,
  onChange,
}: {
  block: ParagraphBlock
  lang: Language
  onChange: (b: ParagraphBlock) => void
}) {
  return (
    <FormRow label="Text">
      <textarea
        className={`${controlClass} min-h-20 resize-y`}
        value={resolveTranslatable(block.text, lang)}
        placeholder="Paragraph text…"
        onChange={(e) => onChange({ ...block, text: setTranslated(block.text, lang, e.target.value) })}
      />
    </FormRow>
  )
}

/**
 * Editor for an image block: file picker (with a 5MB guard + live preview),
 * plus translatable alt text and optional caption.
 *
 * @param block - The image block being edited.
 * @param lang - Active authoring language; edits write into this language.
 * @param onChange - Called with the updated block.
 */
function ImageBlockEditor({
  block,
  lang,
  onChange,
}: {
  block: ImageBlock
  lang: Language
  onChange: (b: ImageBlock) => void
}) {
  const previewUrl = useObjectUrl(block.file)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <FormRow label="Image">
        <input
          type="file"
          accept="image/*"
          className={controlClass}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            if (file.size > MAX_IMAGE_SIZE) {
              setError('Image exceeds the maximum allowed size of 5MB.')
              e.target.value = ''
              return
            }
            setError(null)
            onChange({ ...block, file })
          }}
        />
        {error && <p className="mt-1 text-xs font-medium text-[var(--destructive)]">{error}</p>}
        {previewUrl && !error && (
          <img src={previewUrl} alt="preview" className="mt-2 rounded-sm max-h-48 object-cover w-full" />
        )}
      </FormRow>
      <FormRow label="Alt text">
        <input
          className={controlClass}
          value={resolveTranslatable(block.alt, lang)}
          placeholder="Alt text…"
          onChange={(e) => onChange({ ...block, alt: setTranslated(block.alt, lang, e.target.value) })}
        />
      </FormRow>
      <FormRow label="Caption">
        <input
          className={controlClass}
          value={block.caption ? resolveTranslatable(block.caption, lang) : ''}
          placeholder="Caption (optional)…"
          onChange={(e) =>
            onChange({ ...block, caption: setTranslated(block.caption ?? { default: '' }, lang, e.target.value) })
          }
        />
      </FormRow>
    </div>
  )
}

/**
 * Editor for a video block: file picker (with a 50MB guard + live preview)
 * and an optional translatable title.
 *
 * @param block - The video block being edited.
 * @param lang - Active authoring language; edits write into this language.
 * @param onChange - Called with the updated block.
 */
function VideoBlockEditor({
  block,
  lang,
  onChange,
}: {
  block: VideoBlock
  lang: Language
  onChange: (b: VideoBlock) => void
}) {
  const previewUrl = useObjectUrl(block.file)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <FormRow label="Video">
        <input
          type="file"
          accept="video/*"
          className={controlClass}
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
        {error && <p className="mt-1 text-xs font-medium text-[var(--destructive)]">{error}</p>}
        {previewUrl && !error && (
          <video src={previewUrl} controls className="mt-2 rounded-sm max-h-48 w-full" />
        )}
      </FormRow>
      <FormRow label="Title">
        <input
          className={controlClass}
          value={block.title ? resolveTranslatable(block.title, lang) : ''}
          placeholder="Video title (optional)…"
          onChange={(e) =>
            onChange({ ...block, title: setTranslated(block.title ?? { default: '' }, lang, e.target.value) })
          }
        />
      </FormRow>
    </div>
  )
}

/**
 * A single content block card that renders the correct editor for the block's
 * type and a delete control, in the shared admin surface style.
 *
 * @param block - The block to edit.
 * @param lang - Active authoring language.
 * @param onChange - Called with the updated block.
 * @param onDelete - Called when the user removes this block.
 */
export function BlockEditor({
  block,
  lang,
  onChange,
  onDelete,
}: {
  block: PageBlock
  lang: Language
  onChange: (u: PageBlock) => void
  onDelete: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-sm border border-[var(--line)] bg-[var(--surface-strong)] p-3.5">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-orange)]">
          {block.type}
        </span>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Remove ${block.type} block`}
          className="text-xs text-[var(--sea-ink-soft)] hover:text-[var(--destructive)]"
        >
          Remove
        </button>
      </div>

      {block.type === 'header' && <HeaderBlockEditor block={block} lang={lang} onChange={onChange} />}
      {block.type === 'paragraph' && <ParagraphBlockEditor block={block} lang={lang} onChange={onChange} />}
      {block.type === 'image' && <ImageBlockEditor block={block} lang={lang} onChange={onChange} />}
      {block.type === 'video' && <VideoBlockEditor block={block} lang={lang} onChange={onChange} />}
    </div>
  )
}

/**
 * Row of "+ type" buttons for appending new content blocks.
 *
 * @param onAdd - Called with the block type the user wants to add.
 * @param types - Block types to offer. Defaults to {@link BLOCK_TYPES}.
 */
export function BlockAddButtons({
  onAdd,
  types = BLOCK_TYPES,
}: {
  onAdd: (type: PageBlock['type']) => void
  types?: PageBlock['type'][]
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {types.map((type) => (
        <Button key={type} type="button" variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => onAdd(type)}>
          + {type}
        </Button>
      ))}
    </div>
  )
}
