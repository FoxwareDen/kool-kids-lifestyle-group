import { useEffect, useMemo, useState } from 'react'
import { Calendar, Check, Clock, Users, X } from 'lucide-react'
import { formatDayLabel } from '#/lib/slots'
import type { BookingResponse, TransformedCalendarSchedule } from '#/lib/booking'

interface BookingSlotModalProps {
  open: boolean
  onClose: () => void
  experienceTitle: string
  calendarSchedule: TransformedCalendarSchedule[] | null
  existingBookings: BookingResponse[] | null
  loading: boolean
  error: string | null
}

/** Group slots by date for the day‑picker. */
type DayGroup = {
  date: string
  slots: any[]
}

export function BookingSlotModal({
  open,
  onClose,
  experienceTitle,
  calendarSchedule,
  existingBookings,
}: BookingSlotModalProps) {
  // Generate flat slot list and group by date
  const days = useMemo<DayGroup[]>(() => {
    if (true) return []

    // const now = new Date()
    // const thisMonth = now.toISOString().split('T')[0]
    // now.setMonth(now.getMonth() + 1)
    // const nextMonth = now.toISOString().split('T')[0]

    // const slots = []

    // // Group by date
    // const map = new Map<string, any[]>()
    // for (const slot of slots) {
    //   if (!map.has(slot.date)) map.set(slot.date, [])
    //   map.get(slot.date)!.push(slot)
    // }
    // // Sort dates chronologically
    // return Array.from(map.entries())
    //   .sort((a, b) => a[0].localeCompare(b[0]))
    //   .map(([date, slots]) => ({ date, slots }))
  }, [calendarSchedule, existingBookings])

  const [dateKey, setDateKey] = useState<string | null>(null)
  const [slotStart, setSlotStart] = useState<string | null>(null)
  const [unitId, setUnitId] = useState<string | null>(null)
  const [selections, setSelections] = useState<BookingSelection[]>([])
  const [stage, setStage] = useState<'select' | 'confirmed' | 'payment'>('select')

  // Reset all state whenever the modal is (re)opened.
  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setDateKey(null)
      setSlotStart(null)
      setUnitId(null)
      setSelections([])
      setStage('select')
    }
  }, [open])

  // Escape key & body scroll lock
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const selectedDay = days.find((d) => d.date === dateKey)
  const selectedSlot = selectedDay?.slots.find((s) => s.start_time === slotStart)
  const selectedUnit = selectedSlot?.unit_availability.find(
    (u) => u.unit_type_id === unitId
  )

  // Helper: total remaining capacity across all unit types for a slot
  const totalRemaining = (slot: AvailableSlot) =>
    slot.unit_availability.reduce((sum, u) => sum + u.remaining, 0)

  // Handlers
  const handleSelectDate = (key: string) => {
    setDateKey(key)
    setSlotStart(null)
    setUnitId(null)
  }

  const handleSelectSlot = (start: string) => {
    setSlotStart(start)
    setUnitId(null)
  }

  const isDuplicate = (s: { date: string; start_time: string; unit_type_id: string }) =>
    selections.some(
      (sel) =>
        sel.date === s.date && sel.start_time === s.start_time && sel.unit.unit_type_id === s.unit_type_id,
    )

  const handleAddSelection = () => {
    if (!selectedSlot || !selectedUnit) return
    if (
      isDuplicate({
        date: selectedSlot.date,
        start_time: selectedSlot.start_time,
        unit_type_id: selectedUnit.unit_type_id,
      })
    ) {
      return
    }
    setSelections((prev) => [
      ...prev,
      {
        date: selectedSlot.date,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        unit: selectedUnit,
      },
    ])
    // Reset pickers so the visitor can add another day, but keep the date strip.
    setSlotStart(null)
    setUnitId(null)
  }

  const handleRemoveSelection = (index: number) => {
    setSelections((prev) => prev.filter((_, i) => i !== index))
  }

  const handleConfirm = () => {
    if (selections.length === 0) return
    setStage('confirmed')
  }

  const handleProceedToPayment = () => {
    setStage('payment')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--brand-navy)]/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Book ${experienceTitle}`}
      onClick={onClose}
    >
      <div
        className="flex max-h-[92svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--brand-navy)]/10 bg-[var(--brand-navy)] px-6 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]">
              {stage === 'payment' ? 'Complete payment' : 'Book your slot'}
            </p>
            <h2 className="display-title mt-0.5 text-xl font-medium text-white">
              {experienceTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {confirmed && selectedSlot && selectedUnit ? (
          // Confirmation view
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-orange)]/10">
              <Check className="h-8 w-8 text-[var(--brand-orange)]" />
            </span>
            <h3 className="display-title text-2xl font-medium text-[var(--brand-navy)]">
              Booking requested
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--brand-navy)]/65">
              {`You've reserved ${selections.length} ${selections.length === 1 ? 'slot' : 'slots'} for ${experienceTitle}. Proceed to payment to secure your booking.`}
            </p>
            {/* Selection summary */}
            <div className="mt-2 w-full max-w-sm space-y-2 text-left">
              {selections.map((sel, i) => {
                const { weekday, day, month } = formatDayLabel(sel.date)
                return (
                  <div
                    key={`${sel.date}-${sel.start_time}-${sel.unit.unit_type_id}`}
                    className="flex items-center justify-between rounded-lg border border-[var(--brand-navy)]/10 bg-[#f4efe7] px-3 py-2"
                  >
                    <span className="text-xs text-[var(--brand-navy)]/80">
                      <span className="font-semibold">{sel.unit.unit_label}</span>
                      {' · '}
                      {weekday} {day} {month} at {sel.start_time}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--brand-orange-deep)]">
                      #{i + 1}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="inline-flex items-center justify-center gap-2 bg-[var(--brand-orange)] px-6 py-3 text-sm font-bold uppercase tracking-wide !text-white transition-colors hover:bg-[var(--brand-orange-deep)]"
              >
                <CreditCard className="h-4 w-4" />
                Proceed to payment
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center border border-[var(--brand-navy)]/20 px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-navy)] transition-colors hover:bg-[var(--brand-navy)]/5"
              >
                Done
              </button>
            </div>
          </div>
        ) : stage === 'payment' ? (
          <PaymentWindow
            experienceTitle={experienceTitle}
            selections={selections}
            onClose={onClose}
          />
        ) : (
          <>
            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Step 1 – Date */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[var(--brand-orange)]" />
                  <span className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--brand-navy)]">
                    Select a date
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {days.map((day) => {
                    const closed = day.slots.length === 0
                    const active = day.date === dateKey
                    const { weekday, day: dnum, month } = formatDayLabel(day.date)
                    return (
                      <button
                        key={day.date}
                        type="button"
                        disabled={closed}
                        onClick={() => handleSelectDate(day.date)}
                        className={`flex min-w-16 shrink-0 flex-col items-center gap-0.5 rounded-xl border px-3 py-2.5 transition-colors ${
                          active
                            ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)] text-white'
                            : closed
                            ? 'cursor-not-allowed border-[var(--brand-navy)]/10 bg-[var(--brand-navy)]/5 text-[var(--brand-navy)]/30'
                            : 'border-[var(--brand-navy)]/15 bg-white text-[var(--brand-navy)] hover:border-[var(--brand-orange)]'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wide">
                          {weekday}
                        </span>
                        <span className="text-lg font-bold leading-none">{dnum}</span>
                        <span className="text-[10px] uppercase">{month}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 2 – Time */}
              {selectedDay && selectedDay.slots.length > 0 && (
                <div className="mt-7 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[var(--brand-orange)]" />
                    <span className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--brand-navy)]">
                      Select a time
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {selectedDay.slots.map((slot) => {
                      const remaining = totalRemaining(slot)
                      const soldOut = remaining === 0
                      const active = slot.start_time === slotStart
                      return (
                        <button
                          key={slot.start_time}
                          type="button"
                          disabled={soldOut}
                          onClick={() => handleSelectSlot(slot.start_time)}
                          className={`flex flex-col items-start gap-0.5 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                            active
                              ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)]/5'
                              : soldOut
                              ? 'cursor-not-allowed border-[var(--brand-navy)]/10 bg-[var(--brand-navy)]/5'
                              : 'border-[var(--brand-navy)]/15 bg-white hover:border-[var(--brand-orange)]'
                          }`}
                        >
                          <span
                            className={`text-sm font-bold ${
                              soldOut ? 'text-[var(--brand-navy)]/30' : 'text-[var(--brand-navy)]'
                            }`}
                          >
                            {slot.start_time} – {slot.end_time}
                          </span>
                          <span
                            className={`text-[11px] font-semibold ${
                              soldOut ? 'text-[var(--brand-navy)]/30' : 'text-[var(--brand-orange-deep)]'
                            }`}
                          >
                            {soldOut ? 'Sold out' : `${remaining} spaces left`}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 3 – Unit */}
              {selectedSlot && (
                <div className="mt-7 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[var(--brand-orange)]" />
                    <span className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--brand-navy)]">
                      Select a unit
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {selectedSlot.unit_availability.map((unit) => {
                      const soldOut = unit.remaining === 0
                      const active = unit.unit_type_id === unitId
                      const alreadyAdded = isDuplicate({
                        date: selectedSlot.date,
                        start_time: selectedSlot.start_time,
                        unit_type_id: unit.unit_type_id,
                      })
                      return (
                        <button
                          key={unit.unit_type_id}
                          type="button"
                          disabled={soldOut || alreadyAdded}
                          onClick={() => setUnitId(unit.unit_type_id)}
                          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                            active
                              ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)]/5'
                              : soldOut || alreadyAdded
                                ? 'cursor-not-allowed border-[var(--brand-navy)]/10 bg-[var(--brand-navy)]/5'
                                : 'border-[var(--brand-navy)]/15 bg-white hover:border-[var(--brand-orange)]'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`text-sm font-semibold ${
                                soldOut || alreadyAdded
                                  ? 'text-[var(--brand-navy)]/30'
                                  : 'text-[var(--brand-navy)]'
                              }`}
                            >
                              {unit.unit_label}
                            </span>
                            <span className="text-xs text-[var(--brand-navy)]/50">
                              Capacity {unit.capacity}
                            </span>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              soldOut
                                ? 'bg-[var(--brand-navy)]/10 text-[var(--brand-navy)]/40'
                                : alreadyAdded
                                  ? 'bg-[var(--brand-orange)]/10 text-[var(--brand-orange-deep)]'
                                  : 'bg-[var(--brand-orange)]/10 text-[var(--brand-orange-deep)]'
                            }`}
                          >
                            {soldOut ? 'Sold out' : alreadyAdded ? 'Added' : `${unit.remaining} left`}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Cart — selected slots */}
              {selections.length > 0 && (
                <div className="mt-7 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--brand-navy)]">
                      Your selections ({selections.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selections.map((sel, i) => {
                      const { weekday, day, month } = formatDayLabel(sel.date)
                      return (
                        <div
                          key={`${sel.date}-${sel.start_time}-${sel.unit.unit_type_id}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[var(--brand-navy)]/10 bg-[#f4efe7] px-4 py-3"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[var(--brand-navy)]">
                              {sel.unit.unit_label}
                            </span>
                            <span className="text-xs text-[var(--brand-navy)]/60">
                              {weekday} {day} {month} · {sel.start_time}–{sel.end_time}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSelection(i)}
                            aria-label="Remove selection"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--brand-navy)]/40 transition-colors hover:bg-[var(--brand-navy)]/10 hover:text-[var(--brand-navy)]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-[var(--brand-navy)]/10 bg-[#f4efe7] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-[var(--brand-navy)]/70">
                {selections.length > 0 ? (
                  <span>
                    <span className="font-semibold text-[var(--brand-navy)]">
                      {selections.length} {selections.length === 1 ? 'slot' : 'slots'}
                    </span>{' '}
                    selected
                  </span>
                ) : selectedUnit && selectedSlot ? (
                  <span>
                    <span className="font-semibold text-[var(--brand-navy)]">
                      {selectedUnit.unit_label}
                    </span>{' '}
                    · {formatDayLabel(selectedSlot.date).weekday}{' '}
                    {formatDayLabel(selectedSlot.date).day} · {selectedSlot.start_time}
                  </span>
                ) : (
                  <span>Pick a date, time and unit to add to your booking.</span>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  disabled={!selectedUnit}
                  onClick={handleAddSelection}
                  className={`inline-flex items-center justify-center gap-2 border px-5 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                    selectedUnit
                      ? 'border-[var(--brand-orange)] text-[var(--brand-orange-deep)] hover:bg-[var(--brand-orange)]/5'
                      : 'cursor-not-allowed border-[var(--brand-navy)]/15 text-[var(--brand-navy)]/40'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  Add day
                </button>
                <button
                  type="button"
                  disabled={selections.length === 0}
                  onClick={handleConfirm}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                    selections.length > 0
                      ? 'bg-[var(--brand-orange)] !text-white hover:bg-[var(--brand-orange-deep)]'
                      : 'cursor-not-allowed bg-[var(--brand-navy)]/15 text-[var(--brand-navy)]/40'
                  }`}
                >
                  Confirm booking
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Design-only payment window. No payment is processed — this is a visual
 * mockup matching the site's brand styling.
 */
function PaymentWindow({
  experienceTitle,
  selections,
  onClose,
}: {
  experienceTitle: string
  selections: BookingSelection[]
  onClose: () => void
}) {
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  // Derive a deterministic "total" from the number of selections (display only).
  const linePrice = 1200
  const subtotal = selections.length * linePrice
  const serviceFee = Math.round(subtotal * 0.05)
  const total = subtotal + serviceFee

  const formatCardNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }
  const formatExpiry = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Order summary */}
      <div className="border-b border-[var(--brand-navy)]/10 bg-[#f4efe7] px-6 py-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]">
          Order summary
        </p>
        <h3 className="display-title mt-1 text-lg font-medium text-[var(--brand-navy)]">
          {experienceTitle}
        </h3>
        <div className="mt-3 space-y-1.5">
          {selections.map((sel) => {
            const { weekday, day, month } = formatDayLabel(sel.date)
            return (
              <div
                key={`${sel.date}-${sel.start_time}-${sel.unit.unit_type_id}`}
                className="flex items-center justify-between text-xs text-[var(--brand-navy)]/70"
              >
                <span>
                  {sel.unit.unit_label} · {weekday} {day} {month} · {sel.start_time}
                </span>
                <span className="font-semibold text-[var(--brand-navy)]">
                  R {linePrice.toLocaleString('en-ZA')}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-3 space-y-1 border-t border-[var(--brand-navy)]/10 pt-3 text-xs">
          <div className="flex justify-between text-[var(--brand-navy)]/60">
            <span>Subtotal</span>
            <span>R {subtotal.toLocaleString('en-ZA')}</span>
          </div>
          <div className="flex justify-between text-[var(--brand-navy)]/60">
            <span>Service fee (5%)</span>
            <span>R {serviceFee.toLocaleString('en-ZA')}</span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-bold text-[var(--brand-navy)]">
            <span>Total</span>
            <span>R {total.toLocaleString('en-ZA')}</span>
          </div>
        </div>
      </div>

      {/* Payment form */}
      <div className="flex-1 px-6 py-6">
        <div className="mb-5 flex items-center gap-2">
          <Lock className="h-4 w-4 text-[var(--brand-orange)]" />
          <span className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--brand-navy)]">
            Secure payment
          </span>
        </div>

        {/* Cardholder name */}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-navy)]/70">
            Cardholder name
          </span>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Jane Doe"
            className="mt-1.5 w-full rounded-xl border border-[var(--brand-navy)]/15 bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none transition-colors placeholder:text-[var(--brand-navy)]/30 focus:border-[var(--brand-orange)]"
          />
        </label>

        {/* Card number */}
        <label className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-navy)]/70">
            Card number
          </span>
          <div className="relative mt-1.5">
            <input
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="0000 0000 0000 0000"
              className="w-full rounded-xl border border-[var(--brand-navy)]/15 bg-white px-4 py-3 pr-12 text-sm text-[var(--brand-navy)] outline-none transition-colors placeholder:text-[var(--brand-navy)]/30 focus:border-[var(--brand-orange)]"
            />
            <CreditCard className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--brand-navy)]/30" />
          </div>
        </label>

        {/* Expiry + CVC */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-navy)]/70">
              Expiry
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              className="mt-1.5 w-full rounded-xl border border-[var(--brand-navy)]/15 bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none transition-colors placeholder:text-[var(--brand-navy)]/30 focus:border-[var(--brand-orange)]"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-navy)]/70">
              CVC
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="123"
              className="mt-1.5 w-full rounded-xl border border-[var(--brand-navy)]/15 bg-white px-4 py-3 text-sm text-[var(--brand-navy)] outline-none transition-colors placeholder:text-[var(--brand-navy)]/30 focus:border-[var(--brand-orange)]"
            />
          </label>
        </div>

        <p className="mt-4 flex items-center gap-1.5 text-[11px] text-[var(--brand-navy)]/50">
          <Lock className="h-3 w-3" />
          This is a demo payment screen — no real payment is processed.
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-[var(--brand-navy)]/10 bg-[#f4efe7] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-[var(--brand-navy)]/70">
          <span className="font-semibold text-[var(--brand-navy)]">
            R {total.toLocaleString('en-ZA')}
          </span>{' '}
          · {selections.length} {selections.length === 1 ? 'slot' : 'slots'}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center border border-[var(--brand-navy)]/20 px-5 py-3 text-sm font-bold uppercase tracking-wide text-[var(--brand-navy)] transition-colors hover:bg-[var(--brand-navy)]/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 bg-[var(--brand-orange)] px-6 py-3 text-sm font-bold uppercase tracking-wide !text-white transition-colors hover:bg-[var(--brand-orange-deep)]"
          >
            <Lock className="h-4 w-4" />
            Pay R {total.toLocaleString('en-ZA')}
          </button>
        </div>
      </div>
    </div>
  )
}
