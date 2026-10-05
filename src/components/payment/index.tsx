import * as z from 'zod'
import type { Booking } from '#/lib/system'
import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Input } from '@/components/ui/input'
import PaystackPop from '@paystack/inline-js'
import { Label } from '@/components/ui/label'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import {
  Lock,
  CheckCircle2,
  Download,
  Mail,
  CalendarDays,
  Clock3,
  MapPin,
  Copy,
} from 'lucide-react'
import { createPackage, deleteBooking, fetchUnitTypes } from '#/lib/booking'
import {
  generatePaymentReference,
  generateUniqueCode,
  initializePayment,
} from '#/server/utils'

const payloadSchema = z.object({
  email: z.email('Invalid email address'),
  name: z.string().optional(),
  phone: z.string(),
  amount: z.number().nonnegative(),
})

type PaymentFormValues = z.infer<typeof payloadSchema>

interface PaymentFormProps {
  disabled?: boolean
  booking: Booking | null
  toggleModel: () => void
}

type PaymentStatus = {
  type: 'success' | 'error' | 'cancelled' | 'conflict'
  message: string
  reference?: string
  code?: string
  amount?: number
}

const fieldLabelClass =
  'text-xs font-semibold uppercase tracking-wide text-[var(--brand-navy)]/70'

const inputClass =
  'border-[var(--brand-navy)]/15 focus-visible:border-[var(--brand-orange)] focus-visible:ring-[var(--brand-orange)]/30'

function BookingConfirmation({
  reference,
  code,
  amount,
  booking,
  onClose,
}: {
  reference: string
  code?: string
  amount?: number
  booking: Booking | null
  onClose: () => void
}) {
  const bookingDate = booking?.date
    ? format(parseISO(booking.date), 'EEEE, d MMMM yyyy')
    : 'Date to be confirmed'
  const bookingTime = booking
    ? `${booking.start_time} – ${booking.end_time}`
    : 'Time to be confirmed'
  const handleDownload = () => {
    const content = [
      'KOOL KIDS LIFESTYLE GROUP',
      'BOOKING CONFIRMATION',
      '========================',
      '',
      `Booking reference: ${reference}`,
      ...(code ? [`Confirmation code: ${code}`] : []),
      `Date: ${bookingDate}`,
      `Time: ${bookingTime}`,
      `Experience / unit: ${booking?.unit_label ?? 'To be confirmed'}`,
      ...(amount ? [`Amount paid: R${amount.toFixed(2)}`] : []),
      '',
      'WHAT TO DO NEXT',
      'Keep this reference and confirmation code handy when you arrive.',
      'A confirmation email will be sent once your payment has been verified.',
      'If you need help, reply to your confirmation email with this reference.',
      '',
      'Thank you for booking with us.',
    ].join('\\n')
    const url = URL.createObjectURL(
      new Blob([content], { type: 'text/plain;charset=utf-8' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `kool-kids-booking-${reference}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyReference = async () => {
    await navigator.clipboard.writeText(reference)
  }

  return (
    <div className="flex flex-col gap-5 py-2 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--brand-orange)]/12">
        <CheckCircle2 className="size-8 text-[var(--brand-orange)]" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]">
          Confirmed
        </p>
        <h3 className="display-title mt-1 text-2xl font-medium text-[var(--brand-navy)]">
          You&apos;re all booked
        </h3>
        <p className="mt-1 text-sm text-[var(--brand-navy)]/60">
          Save these details for your visit.
        </p>
      </div>

      <div className="grid gap-2 rounded-xl border border-[var(--brand-navy)]/10 bg-[var(--foam)] p-4 text-left sm:grid-cols-2">
        <div className="flex gap-3">
          <CalendarDays className="size-4 shrink-0 text-[var(--brand-orange)]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-navy)]/45">
              Date
            </p>
            <p className="mt-0.5 text-sm font-medium text-[var(--brand-navy)]">
              {bookingDate}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Clock3 className="size-4 shrink-0 text-[var(--brand-orange)]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-navy)]/45">
              Time
            </p>
            <p className="mt-0.5 text-sm font-medium text-[var(--brand-navy)]">
              {bookingTime}
            </p>
          </div>
        </div>
        <div className="flex gap-3 sm:col-span-2">
          <MapPin className="size-4 shrink-0 text-[var(--brand-orange)]" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-navy)]/45">
              Booking
            </p>
            <p className="mt-0.5 text-sm font-medium text-[var(--brand-navy)]">
              {booking?.unit_label ?? 'Your selected experience'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[var(--brand-navy)] px-4 py-3 text-left text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">
          Reference number
        </p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="font-mono text-sm font-semibold tracking-wide">
            {reference}
          </p>
          <button
            type="button"
            onClick={copyReference}
            aria-label="Copy booking reference"
            className="rounded-md p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <Copy className="size-4" />
          </button>
        </div>
        {code && (
          <p className="mt-2 border-t border-white/15 pt-2 text-xs text-white/70">
            Confirmation code:{' '}
            <span className="font-semibold text-white">{code}</span>
          </p>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-[var(--brand-orange)]/20 bg-[var(--brand-orange)]/8 px-4 py-3 text-left">
        <Mail className="mt-0.5 size-4 shrink-0 text-[var(--brand-orange)]" />
        <p className="text-xs leading-relaxed text-[var(--brand-navy)]/75">
          Your payment is being verified. Keep this reference handy and check
          your email for the final confirmation.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <Button
          type="button"
          className="w-full bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange)]/90"
          onClick={handleDownload}
        >
          <Download data-icon="inline-start" />
          Download booking reference
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border-[var(--brand-navy)]/20 text-[var(--brand-navy)]"
          onClick={onClose}
        >
          Done
        </Button>
      </div>
    </div>
  )
}

export function PaymentForm({
  disabled = false,
  booking,
  toggleModel,
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAmountError, setIsAmountError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      email: '',
      phone: '',
      amount: 0,
    } satisfies PaymentFormValues,
    validators: {
      onSubmit: payloadSchema,
    },
    onSubmitInvalid: ({ formApi }) => {
      console.error(
        '[Payment] Form validation failed on submit:',
        formApi.state.errors,
      )
    },
    onSubmit: async ({ value }) => {
      setPaymentStatus(null)

      if (disabled || booking == null) {
        console.warn('[Payment] Submission aborted:', {
          reason: disabled ? 'Form is disabled' : 'Booking is null/undefined',
          disabled,
          booking,
        })
        return
      }

      let packageResult
      let reference
      let code
      try {
        reference = await generatePaymentReference()
        code = await generateUniqueCode()

        packageResult = await createPackage(booking, code, reference)
      } catch (err) {
        console.error('[Payment] createPackage threw an exception:', err)
        setPaymentStatus({
          type: 'error',
          message: "Couldn't create your booking package. Please try again.",
        })
        return
      }

      if (packageResult.value == null || packageResult.error) {
        console.error('[Payment] Package creation failed:', {
          error: packageResult.error,
          value: packageResult.value,
        })

        if (packageResult.error === 'blop') {
          setPaymentStatus({
            type: 'conflict',
            message:
              'This booking is no longer available. Please refresh the page.',
          })
          return
        }

        setPaymentStatus({
          type: 'error',
          message: "Couldn't create your booking package. Please try again.",
        })
        return
      }

      const [func, booking_confirmed] = packageResult.value

      const amountInSubunits = value.amount

      if (!Number.isInteger(amountInSubunits) || amountInSubunits <= 0) {
        console.error('Invalid payment amount:', {
          valueAmount: value.amount,
          amountInSubunits,
        })
        setIsAmountError('Payment amount must be greater than 0')
        return
      }

      const paymentPayload = {
        data: {
          amount: amountInSubunits,
          // @ts-ignore
          name: value.name,
          email: value.email,
          phone: value.phone,
          reference,
          code,
        },
      }

      let res
      try {
        res = await initializePayment(paymentPayload)
      } catch (err) {
        console.error('[Payment] initializePayment threw an error:', err)
        setPaymentStatus({
          type: 'error',
          message: "Couldn't start the payment. Please try again.",
        })
        return
      }

      if (!res?.access_code) {
        console.error('[Payment] access_code is missing or falsy:', res)
        setPaymentStatus({
          type: 'error',
          message: "Couldn't start the payment. Please try again.",
        })
        return
      }

      try {
        const popup = new PaystackPop()
        setIsPopupOpen(true)

        popup.resumeTransaction(res.access_code, {
          onSuccess: async (transaction) => {
            setIsPopupOpen(false)

            if (typeof func === 'function') {
              try {
                const res = await func({
                  // @ts-ignore
                  name: value?.name || undefined,
                  email: value.email,
                  phone: value.phone,
                })
              } catch (err) {
                console.error('[Payment] Error running package function:', err)
                setPaymentStatus({
                  type: 'error',
                  message: 'Something went wrong finalizing your booking.',
                })
                return
              }
            }

            setPaymentStatus({
              type: 'success',
              message: 'Payment successful! Your booking is confirmed.',
              reference,
              code,
              amount: amountInSubunits,
            })
          },
          onCancel: async () => {
            const res = await deleteBooking(booking_confirmed.id)

            if (!res) await deleteBooking(booking_confirmed.id)

            setIsPopupOpen(false)
            setPaymentStatus({
              type: 'cancelled',
              message:
                "Payment was cancelled. You can try again whenever you're ready.",
              reference,
            })
            // toggleModel()
          },
          onError: async (error) => {
            const res = await deleteBooking(booking_confirmed.id)

            if (!res) await deleteBooking(booking_confirmed.id)

            console.error('[Payment] Paystack transaction error:', error)
            setIsPopupOpen(false)
            setPaymentStatus({
              type: 'error',
              message:
                error?.message || 'Something went wrong with the payment.',
            })
            toggleModel()
          },
        })
      } catch (err) {
        console.error('[Payment] PaystackPop execution failed:', err)
        setIsPopupOpen(false)
        setPaymentStatus({
          type: 'error',
          message: "Couldn't open the payment popup.",
        })
      }
    },
  })

  useEffect(() => {
    ;(async () => {
      if (!booking) return
      const unitId = booking.unit_id

      setIsLoading(true)
      setIsAmountError(null)

      try {
        const res = await fetchUnitTypes()

        if (res.value == null || !res.success) {
          throw new Error(res.error || 'Failed to load unit types')
        }

        const unit = res.value.find((u) => u.id == unitId)

        if (!unit) {
          throw new Error('No matching unit type found for this booking')
        }

        const amount = unit.value * booking.duration
        form.setFieldValue('amount', amount)
      } catch (error) {
        console.error(error)
        setIsAmountError(
          error instanceof Error
            ? error.message
            : "Couldn't calculate the payment amount",
        )
      } finally {
        setIsLoading(false)
      }
    })()
  }, [booking])

  if (paymentStatus?.type === 'success') {
    return (
      <BookingConfirmation
        reference={paymentStatus.reference!}
        code={paymentStatus.code}
        amount={paymentStatus.amount}
        booking={booking}
        onClose={toggleModel}
      />
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]">
          Payment
        </p>
        <h3 className="display-title mt-0.5 text-xl font-medium text-[var(--brand-navy)]">
          Complete payment
        </h3>
        <p className="mt-1 text-sm text-[var(--brand-navy)]/60">
          {disabled
            ? 'Finish your booking on the left to unlock payment.'
            : 'Enter your booking details to confirm payment.'}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (disabled) return
          form.handleSubmit()
        }}
        className="relative flex flex-1 flex-col"
        aria-disabled={disabled}
      >
        <fieldset
          disabled={disabled}
          className={`flex flex-1 flex-col transition-opacity duration-200 ${
            disabled ? 'opacity-40' : 'opacity-100'
          }`}
        >
          <div className="flex-1 space-y-4">
            <form.Field
              name="email"
              validators={{ onChange: payloadSchema.shape.email }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className={fieldLabelClass}>
                    Email
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="you@example.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={field.state.meta.errors.length > 0}
                    className={inputClass}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors
                        .map((err) => err?.message ?? String(err))
                        .join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-2 gap-4">
              {/* @ts-ignore */}
              <form.Field name="name">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name} className={fieldLabelClass}>
                      Name
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      placeholder="Jane Doe"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="phone"
                validators={{ onChange: payloadSchema.shape.phone }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name} className={fieldLabelClass}>
                      Phone
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="tel"
                      placeholder="+27 71 234 5678"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={field.state.meta.errors.length > 0}
                      className={inputClass}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors
                          .map((err) => err?.message ?? String(err))
                          .join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="amount"
                validators={{ onChange: payloadSchema.shape.amount }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name} className={fieldLabelClass}>
                      Amount
                    </Label>
                    <div className="relative flex h-9 items-center rounded-md border border-[var(--brand-navy)]/15 bg-transparent px-3">
                      <span className="pointer-events-none text-sm text-[var(--brand-navy)]/50">
                        R
                      </span>
                      <span className="ml-1 text-sm text-[var(--brand-navy)]">
                        {isLoading ? 'Calculating...' : field.state.value}
                      </span>
                    </div>
                    {isAmountError && (
                      <p className="text-xs text-destructive">
                        {isAmountError}
                      </p>
                    )}
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors
                          .map((err) => err?.message ?? String(err))
                          .join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          <div className="mt-6 border-t border-[var(--brand-navy)]/10 pt-4">
            <form.Subscribe
              selector={(state) =>
                [state.canSubmit, state.isSubmitting] as const
              }
            >
              {([canSubmit, isSubmitting]) => {
                const isLocked =
                  disabled ||
                  !canSubmit ||
                  isSubmitting ||
                  isLoading ||
                  isPopupOpen
                const isBusy = isSubmitting || isPopupOpen

                return (
                  <Button
                    type="submit"
                    className="w-full bg-[var(--brand-navy)] text-white hover:bg-[var(--brand-navy)]/90 disabled:opacity-60"
                    disabled={isLocked}
                  >
                    {isBusy ? (
                      <span className="flex items-center justify-center gap-2">
                        <Lock className="h-4 w-4" />
                        Processing...
                      </span>
                    ) : (
                      'Pay now'
                    )}
                  </Button>
                )
              }}
            </form.Subscribe>

            {paymentStatus && (
              <div className="mt-3 text-center">
                <p
                  className={`text-sm font-medium ${
                    paymentStatus.type === 'cancelled' ||
                    paymentStatus.type === 'conflict'
                      ? 'text-amber-600'
                      : 'text-destructive'
                  }`}
                >
                  {paymentStatus.message}
                </p>
                {paymentStatus.type === 'conflict' && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2 border-[var(--brand-navy)]/20 text-[var(--brand-navy)]"
                    onClick={() => window.location.reload()}
                  >
                    Refresh page
                  </Button>
                )}
              </div>
            )}
          </div>
        </fieldset>

        {disabled && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-navy)]/10">
              <Lock className="h-4 w-4 text-[var(--brand-navy)]" />
            </div>
            <p className="text-sm font-medium text-[var(--brand-navy)]">
              Finish your booking first
            </p>
            <p className="text-xs text-[var(--brand-navy)]/60">
              Payment unlocks once you confirm your dates.
            </p>
          </div>
        )}
      </form>
    </div>
  )
}
