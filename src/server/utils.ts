import { createServerFn } from "@tanstack/react-start";


export const generatePaymentReference = createServerFn().handler(()=>{    
    return `REF_${Date.now()}_${crypto.randomUUID()}`
})

export const generateUniqueCode = createServerFn().handler(()=>{
    return `CODE_${Date.now()}_${crypto.randomUUID()}`
});


export const initializePayment = createServerFn()
  .inputValidator((input: { email: string; amount: number; phone: string; name?: string }) => ({
    email: input.email,
    amount: input.amount,
    phone: input.phone,
    name: input.name
  }))
  // 1. Destructure phone and name from data
  .handler(async ({ data: { amount, email, phone, name } }): Promise<{ access_code?: string }> => {
    const PAYSTACK_SECRET_KEY: string = process.env.PAYMENT_SERVER_KEY!;
    const completeAmount = amount * 100; // Convert Rand to cents

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: completeAmount,
        currency: "ZAR",
        email,
        // 2. Pass name, phone, or custom dashboard fields inside metadata
        metadata: {
          phone,
          name,
          custom_fields: [
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: phone,
            },
            ...(name ? [{
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: name,
            }] : []),
          ],
        },
      }),
    });

    const { status, data }: {
      status: boolean;
      message: string;
      data: {
        authorization_url: string;
        access_code: string;
        reference: string;
      };
    } = await res.json();

    if (!status) {
      throw new Error("Failed to initialize payment");
    }

    return {
      access_code: data.access_code,
    };
  });