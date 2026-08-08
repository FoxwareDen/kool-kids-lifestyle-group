import { useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { generateSlots, type Booking, type BookingResponse, type PaymentContinueFunc, type TransformedCalendarSchedule } from '#/lib/booking'
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
import { initializePayment } from '#/server/utils'

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
    if (!calendarSchedule || !existingBookings) return []
    console.log("calendarSchedule");
    console.log(calendarSchedule);
    const slots = generateSlots(calendarSchedule, existingBookings)
    
    console.log("slots");
    console.log(slots);
    return slots
  }, [calendarSchedule, existingBookings])
  const [isBookingComplete, setIsBookingComplete] = useState(false);

  const [booking, setBooking] = useState<Booking| null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string|null>(null);
  const paymentContinueFunc = useRef<PaymentContinueFunc | null>(null)
  
  
  const onSubmit = async () => {
    if (!booking) return;

    if (!paymentContinueFunc.current) {
      const amount = booking.duration * booking.unit_id
      const access_code = initializePayment({data: {amount, email}})
    }

    setIsLoading(true);
    try {
      
    } catch (error) {
      
    }finally {
      setIsLoading(false);
    }

  };

  const bookingFormCompletion = async (booking: Booking) => {
    setBooking(booking)
    setIsBookingComplete(true)        
  }
  
  if (!open) return null

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

        {/* Body */}
        <div className="flex flex-wrap justify-center gap-2 px-6 py-6">
          <Booker schedule={schedule} type={schedule[0].type} onSubmit={bookingFormCompletion}>
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
          <div>

          </div>
        </div>
      </div>
    </div>
  )
}