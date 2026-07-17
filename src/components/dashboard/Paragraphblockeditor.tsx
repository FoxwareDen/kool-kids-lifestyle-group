import type { ParagraphBlock, Language } from '#/lib/experiences'
import { resolveTranslatable } from '#/lib/experiences'
import { setTranslated } from '#/lib/utils';
import { Field } from './Field';
import { inputCls } from './Styles';

export const ParagraphBlockEditor = ({
  block, lang, onChange,
}: {
  block: ParagraphBlock; lang: Language; onChange: (b: ParagraphBlock) => void
}) => (
  <Field label="Text">
    <textarea
      className={`${inputCls} min-h-20 resize-y`}
      value={resolveTranslatable(block.text, lang)}
      placeholder="Paragraph text…"
      onChange={(e) => onChange({ ...block, text: setTranslated(block.text, lang, e.target.value) })}
    />
  </Field>
)