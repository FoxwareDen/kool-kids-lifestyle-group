import * as z from "zod";
import { useForm } from "@tanstack/react-form"


const payloadSchema = z.object({
  email: z.email(),
  name: z.string().optional(),
  phone: z.string(),
  bookingId: z.string(),
  code: z.string()
});

export function PaymentForm() {
    const form = useForm({
        defaultValues: {
            email: '',
            phone: '',
            bookingId: '',
            code: ''
        },
        validators: {
            onSubmit: payloadSchema,
        },
        onSubmit: async ({ value }) => {
            alert(`Payment form submitted with values: ${JSON.stringify(value)}`);
        }
    })

    return null
}