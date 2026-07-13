import { createResult } from "#/lib/pocketbase";
import { getSessionMiddleware } from "#/routes/__root";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const initializePaymentSeverFn = createServerFn()
    .middleware([getSessionMiddleware])
    .inputValidator((data: { email: string, amount: number, fullName: string, phone?: string }) => data)
    .handler(async ({ data}) => {
        const validData = PaymentInitializationData.parse(data);
        
        const token = process.env.PAYMENT_SERVER_KEY;
        
        if (!token) throw new Error("Missing PAYMENT_SERVER_KEY");

        const headers = new Headers();
        headers.append("Authorization", `Bearer ${token}`)
        headers.append("Content-Type", "application/json")

        const options: RequestInit = {
            method: "POST",
            headers,
            body: JSON.stringify(validData)
        };
        
        try {
            const res = await fetch("https://api.paystack.co/transaction/initialize", options);

            if (!res.ok) throw Error("Failed to initialize payment system");

            const data: {access_code?: string} = await res.json();

            if (!data.access_code) throw Error("Failed to get access code for payment system server error");
            
            return createResult(data.access_code, null);
        } catch (error) {
            return createResult(null, error instanceof Error ? error.message : String(error));
        }
    })

const PaymentInitializationData = z.object({
  email: z.email("Invalid email address"),

  amount: z.number().positive("Amount must be greater than 0"),

  fullName: z.string().regex(/ /, "Must contain a space"),

  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional()
});