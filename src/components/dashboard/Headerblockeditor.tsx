import type { HeaderBlock, Language } from '#/lib/experiences'
import { resolveTranslatable } from '#/lib/experiences'
import { setTranslated } from '#/lib/utils';
import { Field } from './Field';
import { inputCls } from './Styles';

export const HeaderBlockEditor = ({
  block, lang, onChange,
}: {
  block: HeaderBlock; lang: Language; onChange: (b: HeaderBlock) => void
}) => (
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