import type { PageBlock, Language } from '#/lib/experiences'
import { HeaderBlockEditor } from './HeaderBlockEditor'
import { ParagraphBlockEditor } from './ParagraphBlockEditor'
import { ImageBlockEditor } from './ImageBlockEditor'
import { VideoBlockEditor } from './VideoBlockEditor'
import { SelectableBslockEditor } from './SelectableBlockEditor'

export const BLOCK_TYPES: PageBlock['type'][] = ['header', 'paragraph', 'image', 'video', 'selectable']

export const BlockEditor = ({
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