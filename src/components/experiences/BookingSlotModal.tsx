import { useEffect, useMemo, useState } from 'react'
import { Calendar, Check, Clock, Users, X } from 'lucide-react'
import { generateSlots, type BookingResponse, type TransformedCalendarSchedule } from '#/lib/booking'
import { formatDayLabel } from '#/lib/slots'
import type { AvailableSlot } from '#/lib/booking' // adjust import path as needed

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
  slots: AvailableSlot[]
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
    if (!calendarSchedule || !existingBookings) return []

    const now = new Date()
    const thisMonth = now.toISOString().split('T')[0]
    now.setMonth(now.getMonth() + 1)
    const nextMonth = now.toISOString().split('T')[0]

    const slots = generateSlots(
      calendarSchedule,
      existingBookings,
      thisMonth,
      nextMonth,
      {
        bufferMinutes: 15,
        maxAdvanceMonths: 1,
        minAdvanceDays: 1,
        preset: {
          durationMinutes: 600,
          id: '2',
          label: 'testing',
        },
      }
    )

    // Group by date
    const map = new Map<string, AvailableSlot[]>()
    for (const slot of slots) {
      if (!map.has(slot.date)) map.set(slot.date, [])
      map.get(slot.date)!.push(slot)
    }
    // Sort dates chronologically
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, slots]) => ({ date, slots }))
  }, [calendarSchedule, existingBookings])

  const [dateKey, setDateKey] = useState<string | null>(null)
  const [slotStart, setSlotStart] = useState<string | null>(null)
  const [unitId, setUnitId] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setDateKey(null)
      setSlotStart(null)
      setUnitId(null)
      setConfirmed(false)
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
              Book your slot
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
              {`${selectedUnit.unit_label} on ${formatDayLabel(selectedSlot.date).weekday} ${
                formatDayLabel(selectedSlot.date).day
              } ${formatDayLabel(selectedSlot.date).month} at ${selectedSlot.start_time}. We'll confirm your slot by email.`}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 inline-flex items-center justify-center bg-[var(--brand-orange)] px-6 py-3 text-sm font-bold uppercase tracking-wide !text-white transition-colors hover:bg-[var(--brand-orange-deep)]"
            >
              Done
            </button>
          </div>
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
                      return (
                        <button
                          key={unit.unit_type_id}
                          type="button"
                          disabled={soldOut}
                          onClick={() => setUnitId(unit.unit_type_id)}
                          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                            active
                              ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)]/5'
                              : soldOut
                              ? 'cursor-not-allowed border-[var(--brand-navy)]/10 bg-[var(--brand-navy)]/5'
                              : 'border-[var(--brand-navy)]/15 bg-white hover:border-[var(--brand-orange)]'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`text-sm font-semibold ${
                                soldOut ? 'text-[var(--brand-navy)]/30' : 'text-[var(--brand-navy)]'
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
                                : 'bg-[var(--brand-orange)]/10 text-[var(--brand-orange-deep)]'
                            }`}
                          >
                            {soldOut ? 'Sold out' : `${unit.remaining} left`}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-3 border-t border-[var(--brand-navy)]/10 bg-[#f4efe7] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-[var(--brand-navy)]/70">
                {selectedUnit && selectedSlot ? (
                  <span>
                    <span className="font-semibold text-[var(--brand-navy)]">
                      {selectedUnit.unit_label}
                    </span>{' '}
                    · {formatDayLabel(selectedSlot.date).weekday}{' '}
                    {formatDayLabel(selectedSlot.date).day} · {selectedSlot.start_time}
                  </span>
                ) : (
                  <span>Pick a date, time and unit to continue.</span>
                )}
              </div>
              <button
                type="button"
                disabled={!selectedUnit}
                onClick={() => setConfirmed(true)}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                  selectedUnit
                    ? 'bg-[var(--brand-orange)] !text-white hover:bg-[var(--brand-orange-deep)]'
                    : 'cursor-not-allowed bg-[var(--brand-navy)]/15 text-[var(--brand-navy)]/40'
                }`}
              >
                Confirm booking
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}