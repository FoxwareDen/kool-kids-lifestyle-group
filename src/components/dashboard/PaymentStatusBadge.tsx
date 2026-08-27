import { cn } from '#/lib/utils'
import { CheckCircle2, CircleDollarSign } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { PaymentStatus } from '#/lib/payment';


const statusConfig = {
  verified: {
    Icon: CheckCircle2,
    label: 'Paid',
    className:
      'bg-[color-mix(in_oklab,var(--brand-orange)_16%,transparent)] text-[var(--brand-orange-deep)] border-transparent',
  },
  due: {
    Icon: CircleDollarSign,
    label: 'Payment due',
    className:
      'border border-[var(--line)] bg-[var(--dash-panel-muted)] text-[var(--sea-ink-soft)]',
  },
} satisfies Record<PaymentStatus, { Icon: React.ElementType; label: string; className: string }>

/**
 * Theme-aware select communicating whether a booking's payment has settled.
 * Allows the user to toggle between `due` and `verified`.
 *
 * @param status   - Current payment status.
 * @param onChange - Called with the new status when the user makes a selection.
 */
export function PaymentStatusBadge({
  status,
  onChange,
}: {
  status: PaymentStatus
  onChange: (status: PaymentStatus) => void
}) {
  const { Icon, label, className } = statusConfig[status]

  return (
    <Select value={status} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          'inline-flex h-auto items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-semibold capitalize shadow-none',
          className,
        )}
      >
        <Icon className="size-3.5" aria-hidden="true" />
        <SelectValue>{label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(Object.entries(statusConfig) as [PaymentStatus, typeof statusConfig[PaymentStatus]][]).map(
          ([value, { Icon: OptionIcon, label: optionLabel }]) => (
            <SelectItem key={value} value={value}>
              <OptionIcon className="size-3.5" aria-hidden="true" />
              {optionLabel}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  )
}