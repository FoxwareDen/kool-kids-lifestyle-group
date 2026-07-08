import { useObjectUrl } from '#/hooks/Useobjecturl';
import type { VideoBlock, ImageBlock, Language } from '#/lib/experiences'
import { resolveTranslatable } from '#/lib/experiences'
import { setTranslated } from '#/lib/utils';
import { Field } from './Field';
import { inputCls } from './Styles';

export const ImageBlockEditor = ({
  block, lang, onChange,
}: {
  block: ImageBlock; lang: Language; onChange: (b: ImageBlock) => void
}) => {
  const previewUrl = useObjectUrl(block.file)

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

export const VideoBlockEditor = ({
  block, lang, onChange,
}: {
  block: VideoBlock; lang: Language; onChange: (b: VideoBlock) => void
}) => {
  const previewUrl = useObjectUrl(block.file)
 
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
