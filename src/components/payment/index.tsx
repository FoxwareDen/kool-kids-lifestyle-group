import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { Lock, CheckCircle2, Download, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Booking } from "#/lib/system";
import { createPackage, deleteBooking, fetchUnitTypes } from "#/lib/booking";
import { useEffect, useState } from "react";
import { generatePaymentReference, generateUniqueCode, initializePayment } from "#/server/utils";
import PaystackPop from "@paystack/inline-js";

const payloadSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().optional(),
  phone: z.string(),
  amount: z.number().nonnegative(),
});

type PaymentFormValues = z.infer<typeof payloadSchema>;

interface PaymentFormProps {
  disabled?: boolean;
  booking: Booking | null;
  toggleModel: () => void;
}

type PaymentStatus = {
  type: "success" | "error" | "cancelled" | "conflict";
  message: string;
  reference?: string;
};

const fieldLabelClass =
  "text-xs font-semibold uppercase tracking-wide text-[var(--brand-navy)]/70";

const inputClass =
  "border-[var(--brand-navy)]/15 focus-visible:border-[var(--brand-orange)] focus-visible:ring-[var(--brand-orange)]/30";

function BookingConfirmation({ reference, onClose }: { reference: string; onClose: () => void }) {
  const handleDownload = () => {
    const content = [
      "BOOKING CONFIRMATION",
      "====================",
      "",
      `Payment Reference: ${reference}`,
      "",
      "Your payment has been received and is being verified.",
      "A confirmation email will be sent to you shortly.",
      "",
      "====================",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-${reference}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-orange)]">
          Confirmed
        </p>
        <h3 className="mt-0.5 text-xl font-medium text-[var(--brand-navy)]">
          Booking confirmed!
        </h3>
        <p className="mt-1 text-sm text-[var(--brand-navy)]/60">
          Your payment was successful.
        </p>
      </div>

      <div className="w-full rounded-lg border border-[var(--brand-navy)]/10 bg-[var(--brand-navy)]/[0.02] px-4 py-3 text-left">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-navy)]/50">
          Payment Reference
        </p>
        <p className="mt-1 font-mono text-sm font-semibold text-[var(--brand-navy)]">
          {reference}
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-left">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-xs text-amber-700">
          Expect a confirmation email once your payment has been verified. Please keep your reference number handy.
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 border-[var(--brand-navy)]/20 text-[var(--brand-navy)]"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        Download reference
      </Button>

      <Button
        type="button"
        className="w-full bg-[var(--brand-navy)] text-white hover:bg-[var(--brand-navy)]/90"
        onClick={onClose}
      >
        Done
      </Button>
    </div>
  );
}

export function PaymentForm({ disabled = false, booking, toggleModel }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAmountError, setIsAmountError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      phone: "",
      amount: 0,
    } satisfies PaymentFormValues,
    validators: {
      onSubmit: payloadSchema,
    },
    onSubmitInvalid: ({ formApi }) => {
      console.error("[Payment] Form validation failed on submit:", formApi.state.errors);
    },
    onSubmit: async ({ value }) => {
      console.log("[Payment] Submission triggered:", { value, disabled, booking });
      setPaymentStatus(null);

      if (disabled || booking == null) {
        console.warn("[Payment] Submission aborted:", {
          reason: disabled ? "Form is disabled" : "Booking is null/undefined",
          disabled,
          booking,
        });
        return;
      }

      console.log("[Payment] Calling createPackage with booking:", booking);
      let packageResult;
      let reference;
      let code;
      try {
        reference = await generatePaymentReference();
        code = await generateUniqueCode();

        packageResult = await createPackage(booking, code, reference);

        console.log("[Payment] createPackage response:", packageResult);
      } catch (err) {
        console.error("[Payment] createPackage threw an exception:", err);
        setPaymentStatus({ type: "error", message: "Couldn't create your booking package. Please try again." });
        return;
      }

      if (packageResult.value == null || packageResult.error) {
        console.error("[Payment] Package creation failed:", {
          error: packageResult.error,
          value: packageResult.value,
        });

        if (packageResult.error === "blop") {
          setPaymentStatus({
            type: "conflict",
            message: "This booking is no longer available. Please refresh the page.",
          });
          return;
        }

        setPaymentStatus({ type: "error", message: "Couldn't create your booking package. Please try again." });
        return;
      }

      const [func, booking_confirmed] = packageResult.value;
      console.log("[Payment] Extracted package value:", func);

      const amountInSubunits = value.amount;

      if (!Number.isInteger(amountInSubunits) || amountInSubunits <= 0) {
        console.error("Invalid payment amount:", {
          valueAmount: value.amount,
          amountInSubunits,
        });
        setIsAmountError("Payment amount must be greater than 0");
        return;
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
      };

      let res;
      try {
        res = await initializePayment(paymentPayload);
      } catch (err) {
        console.error("[Payment] initializePayment threw an error:", err);
        setPaymentStatus({ type: "error", message: "Couldn't start the payment. Please try again." });
        return;
      }

      if (!res?.access_code) {
        console.error("[Payment] access_code is missing or falsy:", res);
        setPaymentStatus({ type: "error", message: "Couldn't start the payment. Please try again." });
        return;
      }

      try {
        const popup = new PaystackPop();
        setIsPopupOpen(true);

        popup.resumeTransaction(res.access_code, {
          onSuccess: async (transaction) => {
            console.log("[Payment] Transaction successful:", transaction);
            setIsPopupOpen(false);

            if (typeof func === "function") {
              console.log("[Payment] Executing package closure with contact details...");
              try {
                const res = await func({
                  // @ts-ignore
                  name: value?.name || undefined,
                  email: value.email,
                  phone: value.phone,
                });

                console.log(res);
              } catch (err) {
                console.error("[Payment] Error running package function:", err);
                setPaymentStatus({ type: "error", message: "Something went wrong finalizing your booking." });
                return;
              }
            }

            setPaymentStatus({
              type: "success",
              message: "Payment successful! Your booking is confirmed.",
              reference,
            });
          },
          onCancel: async () => {
            console.log("payment was canceled removing booking...");

            const res = await deleteBooking(booking_confirmed.id);

            console.log(res);

            if (!res) await deleteBooking(booking_confirmed.id);

            console.log("[Payment] Transaction cancelled by user");
            setIsPopupOpen(false);
            setPaymentStatus({
              type: "cancelled",
              message: "Payment was cancelled. You can try again whenever you're ready.",
              reference,
            });
            // toggleModel()
          },
          onError: async (error) => {
            console.log("payment was failed removing booking...");

            const res = await deleteBooking(booking_confirmed.id);

            console.log(res);

            if (!res) await deleteBooking(booking_confirmed.id);

            console.error("[Payment] Paystack transaction error:", error);
            setIsPopupOpen(false);
            setPaymentStatus({
              type: "error",
              message: error?.message || "Something went wrong with the payment.",
            });
            toggleModel();
          },
        });
      } catch (err) {
        console.error("[Payment] PaystackPop execution failed:", err);
        setIsPopupOpen(false);
        setPaymentStatus({ type: "error", message: "Couldn't open the payment popup." });
      }
    },
  });

  useEffect(() => {
    (async () => {
      if (!booking) return;
      const unitId = booking.unit_id;

      setIsLoading(true);
      setIsAmountError(null);

      try {
        const res = await fetchUnitTypes();

        if (res.value == null || !res.success) {
          throw new Error(res.error || "Failed to load unit types");
        }

        const unit = res.value.find((u) => u.id == unitId);

        if (!unit) {
          throw new Error("No matching unit type found for this booking");
        }

        const amount = unit.value * booking.duration;
        form.setFieldValue("amount", amount);
      } catch (error) {
        console.log(error);
        setIsAmountError(
          error instanceof Error
            ? error.message
            : "Couldn't calculate the payment amount"
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [booking]);

  if (paymentStatus?.type === "success") {
    return <BookingConfirmation reference={paymentStatus.reference!} onClose={toggleModel} />;
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
            ? "Finish your booking on the left to unlock payment."
            : "Enter your booking details to confirm payment."}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (disabled) return;
          form.handleSubmit();
        }}
        className="relative flex flex-1 flex-col"
        aria-disabled={disabled}
      >
        <fieldset
          disabled={disabled}
          className={`flex flex-1 flex-col transition-opacity duration-200 ${
            disabled ? "opacity-40" : "opacity-100"
          }`}
        >
          <div className="flex-1 space-y-4">
            <form.Field name="email" validators={{ onChange: payloadSchema.shape.email }}>
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
                      {field.state.meta.errors.map((err) => err?.message ?? String(err)).join(", ")}
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

              <form.Field name="phone" validators={{ onChange: payloadSchema.shape.phone }}>
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
                        {field.state.meta.errors.map((err) => err?.message ?? String(err)).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <form.Field name="amount" validators={{ onChange: payloadSchema.shape.amount }}>
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
                        {isLoading ? "Calculating..." : field.state.value}
                      </span>
                    </div>
                    {isAmountError && (
                      <p className="text-xs text-destructive">
                        {isAmountError}
                      </p>
                    )}
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors.map((err) => err?.message ?? String(err)).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          <div className="mt-6 border-t border-[var(--brand-navy)]/10 pt-4">
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
              {([canSubmit, isSubmitting]) => {
                const isLocked = disabled || !canSubmit || isSubmitting || isLoading || isPopupOpen;
                const isBusy = isSubmitting || isPopupOpen;

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
                      "Pay now"
                    )}
                  </Button>
                );
              }}
            </form.Subscribe>

            {paymentStatus && (
              <div className="mt-3 text-center">
                <p
                  className={`text-sm font-medium ${
                    paymentStatus.type === "cancelled" || paymentStatus.type === "conflict"
                      ? "text-amber-600"
                      : "text-destructive"
                  }`}
                >
                  {paymentStatus.message}
                </p>
                {paymentStatus.type === "conflict" && (
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
            <p className="text-sm font-medium text-[var(--brand-navy)]">Finish your booking first</p>
            <p className="text-xs text-[var(--brand-navy)]/60">
              Payment unlocks once you confirm your dates.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}