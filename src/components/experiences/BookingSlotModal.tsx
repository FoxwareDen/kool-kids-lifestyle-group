import { useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import {
  generateSlots,
  type Booking,
  type BookingResponse,
  type PaymentContinueFunc,
  type TransformedCalendarSchedule,
} from '#/lib/booking'
import { type AvailableRange } from '#/lib/system'
import {
  Booker,
  BookerStep,
  BookingUnitSelect,
  BookingCalendar,
  BookingTimeSelect,
  BookingView,
  BookingPagingButtonGroup,
} from '@/components/booking/calendar'
import { PaymentForm } from '../payment'

interface BookingSlotModalProps {
  open: boolean
  onClose: () => void
  experienceTitle: string
  calendarSchedule: TransformedCalendarSchedule[] | null
  existingBookings: BookingResponse[] | null
  loading: boolean
  error: string | null
}

export function BookingSlotModal({
  open,
  onClose,
  experienceTitle,
  calendarSchedule,
  existingBookings,
}: BookingSlotModalProps) {
  const schedule = useMemo<AvailableRange[]>(() => {
    if (!calendarSchedule || !existingBookings || calendarSchedule.length === 0)
      return []
    return generateSlots(calendarSchedule, existingBookings)
  }, [calendarSchedule, existingBookings])

  const [isBookingComplete, setIsBookingComplete] = useState(false)

  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState<string | null>(null)
  const paymentContinueFunc = useRef<PaymentContinueFunc | null>(null)

  const bookingFormCompletion = async (booking: Booking) => {
    setBooking(booking)
    setIsBookingComplete(true)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-[var(--brand-navy)]/70 p-0 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[calc(100svh-0.75rem)] w-full flex-col overflow-hidden rounded-t-[1.75rem] bg-[var(--foam)] shadow-2xl sm:max-h-[min(92svh,760px)] sm:rounded-2xl lg:max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 bg-[var(--brand-navy)] px-5 pb-5 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pt-5">
          <div
            className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/25 sm:hidden"
            aria-hidden="true"
          />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]">
                Book your slot
              </p>
              <h2
                id="booking-modal-title"
                className="display-title mt-1 truncate text-xl font-medium text-white sm:text-2xl"
              >
                {experienceTitle}
              </h2>
              <p className="mt-2 text-xs text-white/65">
                Choose a time that works for you.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close booking"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-navy)]"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain lg:flex lg:overflow-hidden">
          <section
            aria-label="Choose a booking time"
            className="min-w-0 flex-1 border-b border-[var(--line)] px-5 pb-8 pt-6 sm:px-6 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:py-7"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-orange)] text-sm font-bold text-white">
                1
              </span>
              <div>
                <h3 className="font-semibold text-[var(--sea-ink)]">
                  Choose your time
                </h3>
                <p className="text-xs text-[var(--sea-ink-soft)]">
                  Select a date and available slot.
                </p>
              </div>
            </div>
            {schedule.length > 0 && (
              <Booker
                schedule={schedule}
                type={schedule[0].type}
                onSubmit={bookingFormCompletion}
              >
                <BookerStep name="unit_select">
                  <BookingUnitSelect />
                </BookerStep>
                <BookerStep name="calendar">
                  <BookingCalendar />
                </BookerStep>
                <BookerStep name="time_picker">
                  <BookingTimeSelect />
                </BookerStep>
                <BookerStep name="view_booking">
                  <BookingView />
                </BookerStep>
                <BookingPagingButtonGroup />
              </Booker>
            )}
          </section>

          <section
            aria-label="Payment details"
            className="min-w-0 flex-1 bg-white/55 px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 lg:overflow-y-auto lg:py-7"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--brand-orange)]/40 text-sm font-bold text-[var(--brand-orange)]">
                2
              </span>
              <div>
                <h3 className="font-semibold text-[var(--sea-ink)]">
                  Payment details
                </h3>
                <p className="text-xs text-[var(--sea-ink-soft)]">
                  Complete your booking securely.
                </p>
              </div>
            </div>
            <PaymentForm
              toggleModel={onClose}
              disabled={!isBookingComplete}
              booking={booking}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
