import { generatePaymentReference, generateUniqueCode } from '#/server/utils';
import { create, createResult, getPBSession, Result, type MetaData } from '@/lib/pocketbase';
import { z } from "zod";

export interface Payment {
  status: "due" | "verified",
  email: string,
  name?: string,
  phone: string,
  reference: string
  booking_id: string
  code?: string
}

const payloadSchema = z.object({
  email: z.email(),
  name: z.string().optional(),
  phone: z.string(),
});

export interface PaymentResponse extends MetaData, Payment {
  expand: {
    booking_id: string
  }
}

export async function createPayment({
  email,
  phone,
  name,
  bookingId,
  reference,
  code
}: {
  email: string,
  phone: string,
  name?: string,
  bookingId: string,
  reference: string,
  code: string
}, cookieHeader?: string): Promise<Result<PaymentResponse, string>> {
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
    booking_id: bookingId,
    reference,
    code
  };

  return await create("Payments", data, cookieHeader);
}
