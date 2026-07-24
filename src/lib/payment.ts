import { create, createResult, getPBSession, Result, type MetaData } from '@/lib/pocketbase';
import { z } from "zod";

export interface Payment {
  status: "due" | "verified",
  email: string,
  name?: string,
  phone: string,
  reference: string
}

const payloadSchema = z.object({
  email: z.email(),
  name: z.string().optional(),
  phone: z.e164(),
});

export interface PaymentResponse extends MetaData {
}

export function generatePaymentReference() {
  return "string"
}

export async function createPayment({
  email,
  phone,
  name
}: {
  email: string,
  phone?: string,
  name?: string
}, cookieHeader?: string) {
  const validData = payloadSchema.parse({
    email,
    phone,
    name
  });

  const data: Payment = {
    name: validData.name,
    phone: validData.phone,
    email: validData.email,
    status: "due",
    reference: generatePaymentReference()
  };

  return await create("Payments", data, cookieHeader);
}
