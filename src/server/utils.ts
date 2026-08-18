import { createServerFn } from "@tanstack/react-start";


export const generatePaymentReference = createServerFn().handler(()=>{    
    return `REF_${Date.now()}_${crypto.randomUUID()}`
})

export const generateUniqueCode = createServerFn().handler(()=>{
    return `CODE_${Date.now()}_${crypto.randomUUID()}`
});


export const initializePayment = createServerFn()
  .inputValidator((input: { email: string; amount: number; phone: string; name?: string; code: string; reference: string }) => ({
    email: input.email,
    amount: input.amount,
    phone: input.phone,
    name: input.name,
    reference: input.reference,
    code: input.code
  }))
  .handler(async ({ data: { amount, email, phone, name, code, reference } }): Promise<{ access_code?: string }> => {
    const PAYSTACK_SECRET_KEY: string = process.env.PAYMENT_SERVER_KEY!;
    const completeAmount = amount * 100;

    // Dynamically append timestamp to input email so every test execution creates a unique test customer
    const [username, domain] = email.split("@");
    const testEmail = domain ? `${username}+test_${Date.now()}@${domain}` : `test_${Date.now()}@example.com`;

    const nameParts = (name || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const headers = {
      "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    };

    // 1. Explicitly create customer profile with testEmail
    const createCustomerRes = await fetch("https://api.paystack.co/customer", {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: testEmail,
        first_name: firstName,
        last_name: lastName,
        phone,
      }),
    });

    // 2. If testEmail already exists, update profile using testEmail
    if (!createCustomerRes.ok) {
      await fetch(`https://api.paystack.co/customer/${encodeURIComponent(testEmail)}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone,
        }),
      });
    }

    // 3. Initialize transaction using the exact same testEmail
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers,
      body: JSON.stringify({
        amount: completeAmount,
        currency: "ZAR",
        email: testEmail,
        reference,
        metadata: {
          code,
          custom_fields: [
            { display_name: "Full Name", variable_name: "full_name", value: name ?? "" },
            { display_name: "Phone Number", variable_name: "phone_number", value: phone },
            { display_name: "Code", variable_name: "code", value: code },
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