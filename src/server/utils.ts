import { createServerFn } from "@tanstack/react-start";


export const generatePaymentReference = createServerFn().handler(()=>{    
    return `REF_${Date.now()}_${crypto.randomUUID()}`
})

export const generateUniqueCode = createServerFn().handler(()=>{
    return `CODE_${Date.now()}_${crypto.randomUUID()}`
});


export const initializePayment = createServerFn()
    .inputValidator((input: { email: string; amount: number, phone: string, name?: string }) => ({email:input.email, amount: input.amount, phone: input.phone, name: input.name}))
    .handler(async ({ data: {amount, email} }): Promise<{access_code?: string}> => {
    const PAYSTACK_SECRET_KEY: string = process.env.PAYMENT_SERVER_KEY!;

    const completeAmount = amount * 100; // Convert Rand to kobo 
    
    const res = await fetch("https://api.paystack.co/transaction/initialize",{
        method: "POST",
        headers: {
            "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // Convert Rand to kobo
            amount: completeAmount,
            currency: "ZAR",
            email,
        })
    })
    const {status, data }: {
        status: boolean,
        message: string,
        data: {
            authorization_url: string,
            access_code: string,
            reference: string
        }
    } = await res.json()

    if (status == false) {
        throw new Error("Failed to initialize payment")
    }

    return {
        access_code: data.access_code
    }
});