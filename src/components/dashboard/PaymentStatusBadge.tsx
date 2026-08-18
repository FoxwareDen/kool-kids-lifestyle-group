import { cn } from '#/lib/utils'
import { CheckCircle2, CircleDollarSign } from 'lucide-react'

type PaymentStatus = 'due' | 'verified'

/**
 * Theme-aware pill communicating whether a booking's payment has settled.
 *
 * Reuses the dashboard's existing accent/neutral tokens so no new colors are
 * introduced. Presentational only.
 *
 * @param status - `verified` when payment has been received, otherwise `due`.
 */
export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const verified = status === 'verified'
  const Icon = verified ? CheckCircle2 : CircleDollarSign
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold capitalize',
        verified
          ? 'bg-[color-mix(in_oklab,var(--brand-orange)_16%,transparent)] text-[var(--brand-orange-deep)]'
          : 'border border-[var(--line)] bg-[var(--dash-panel-muted)] text-[var(--sea-ink-soft)]',
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {verified ? 'Paid' : 'Payment due'}
    </span>
  )
}
