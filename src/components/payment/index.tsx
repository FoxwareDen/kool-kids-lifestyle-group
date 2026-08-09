import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Booking } from "#/lib/system";
import { createPackage, fetchUnitTypes } from "#/lib/booking";
import { useEffect, useState } from "react";
import { initializePayment } from "#/server/utils";
import PaystackPop from "@paystack/inline-js";

const payloadSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().optional(),
  phone: z.string(),
  amount: z.number().nonnegative(),
});

type PaymentFormValues = z.infer<typeof payloadSchema>;

interface PaymentFormProps {
  /** True until the booking step is complete — locks and dims the form. */
  disabled?: boolean;
  booking: Booking | null;
}

const fieldLabelClass =
  "text-xs font-semibold uppercase tracking-wide text-[var(--brand-navy)]/70";

const inputClass =
  "border-[var(--brand-navy)]/15 focus-visible:border-[var(--brand-orange)] focus-visible:ring-[var(--brand-orange)]/30";

export function PaymentForm({ disabled = false, booking }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAmountError, setIsAmountError] = useState<string | null>(null);

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
      try {
        packageResult = await createPackage(booking);
        console.log("[Payment] createPackage response:", packageResult);
      } catch (err) {
        console.error("[Payment] createPackage threw an exception:", err);
        return;
      }

      if (packageResult.value == null || packageResult.error) {
        console.error("[Payment] Package creation failed:", {
          error: packageResult.error,
          value: packageResult.value,
        });
        return;
      }

      const func = packageResult.value;
      console.log("[Payment] Extracted package value:", func);

      if (typeof func === "function") {
        console.log("[Payment] Executing package closure with contact details...");
        try {
          await func({
            name: value?.name || undefined,
            email: value.email,
            phone: value.phone,
          });
        } catch (err) {
          console.error("[Payment] Error running package function:", err);
          return;
        }
      }

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
          email: value.email,
        },
      };

      console.log("[Payment] Initializing payment with payload:", paymentPayload);

      let res;
      try {
        res = await initializePayment(paymentPayload);
        console.log("[Payment] Received access_code:", res);
      } catch (err) {
        console.error("[Payment] initializePayment threw an error:", err);
        return;
      }

      if (!res?.access_code) {
        console.error("[Payment] access_code is missing or falsy:", res);
        return;
      }

      try {
        console.log("[Payment] Instantiating PaystackPop...");
        const popup = new PaystackPop();

        console.log("[Payment] Resuming Paystack transaction with code:", res);
        popup.resumeTransaction(res.access_code);
        console.log("[Payment] Transaction resumed successfully");
      } catch (err) {
        console.error("[Payment] PaystackPop execution failed:", err);
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
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="w-full bg-[var(--brand-navy)] text-white hover:bg-[var(--brand-navy)]/90"
                  disabled={disabled || !canSubmit}
                >
                  {isSubmitting ? "Processing..." : "Pay now"}
                </Button>
              )}
            </form.Subscribe>
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