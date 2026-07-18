import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '#/lib/utils'

/**
 * A how-to guide made up of an ordered list of steps.
 */
export type Guide = {
  /** Stable unique id. */
  id: string
  /** Guide heading. */
  title: string
  /** One-line summary shown in the collapsed row. */
  description: string
  /** Icon shown at the start of the row. */
  icon: LucideIcon
  /** Ordered steps revealed when the guide is expanded. */
  steps: string[]
}

/**
 * Inline, single-open accordion of onboarding guides.
 *
 * Replaces stacked modal dialogs: instructions expand in place so users keep
 * their context and can scan every guide without opening/closing overlays. Only
 * one guide is open at a time to keep the panel compact.
 *
 * @param guides - The guides to render.
 */
export function GuideAccordion({ guides }: { guides: Guide[] }) {
  const [openId, setOpenId] = useState<string | null>(guides[0]?.id ?? null)

  const toggle = (id: string) => setOpenId((current) => (current === id ? null : id))

  return (
    <div className="divide-y divide-[var(--line)] overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--surface-strong)]">
      {guides.map((guide) => {
        const Icon = guide.icon
        const isOpen = openId === guide.id
        const panelId = `guide-panel-${guide.id}`

        return (
          <div key={guide.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(guide.id)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--link-bg-hover)]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-[var(--sand)] text-[var(--brand-orange)]">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-bold text-[var(--sea-ink)]">
                  {guide.title}
                </span>
                <span className="block text-sm text-[var(--sea-ink-soft)]">
                  {guide.description}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  'size-5 shrink-0 text-[var(--sea-ink-soft)] transition-transform',
                  isOpen && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </button>

            {isOpen && (
              <div id={panelId} className="px-5 pb-5 pl-[4.5rem]">
                <ol className="flex flex-col gap-2">
                  {guide.steps.map((step, index) => (
                    <li key={index} className="flex gap-3 text-sm text-[var(--sea-ink)]">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-[var(--sand)] text-xs font-bold text-[var(--brand-orange)]">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
