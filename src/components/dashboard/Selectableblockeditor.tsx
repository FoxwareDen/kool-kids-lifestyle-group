import type { SelectableBlock, SelectableOption, Language } from '#/lib/experiences'
import { resolveTranslatable } from '#/lib/experiences'
import { setTranslated } from '#/lib/utils';
import { Field } from '.';
import { inputCls } from './Styles';

export const SelectableBlockEditor = ({
  block, lang, onChange,
}: {
  block: SelectableBlock; lang: Language; onChange: (b: SelectableBlock) => void
}) => {
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