import { Trash2 } from 'lucide-react'
import type { UnitType } from '#/lib/booking'

/**
 * Compact tile describing a single unit type (label, capacity, price).
 *
 * Purely presentational — deletion is delegated to the parent via `onDelete`.
 * When `onDelete` is omitted the trash affordance is hidden, so the same tile
 * can be reused in read-only contexts.
 *
 * @param unit - The unit type to display.
 * @param onDelete - Optional handler invoked with the unit id when deleting.
 * @param deleting - When true, dims the tile and disables the delete button.
 */
export function UnitTypeTile({
  unit,
  onDelete,
  deleting = false,
}: {
  unit: UnitType
  onDelete?: (id: string) => void
  deleting?: boolean
}) {
  return (
    <div
      className={`flex items-start justify-between rounded-sm border border-[var(--line)] bg-[var(--dash-panel-muted)] p-3 ${
        deleting ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <div>
        <h4 className="text-sm font-semibold text-[var(--sea-ink)]">{unit.label}</h4>
        <div className="mt-1 flex gap-3 text-xs text-[var(--sea-ink-soft)]">
          <span>Capacity: {unit.capacity}</span>
          <span>${unit.value}</span>
        </div>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(unit.id)}
          disabled={deleting}
          aria-label={`Delete unit type ${unit.label}`}
          className="rounded-sm p-1 text-[var(--sea-ink-soft)] transition-colors hover:bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] hover:text-[var(--destructive)]"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  )
}
