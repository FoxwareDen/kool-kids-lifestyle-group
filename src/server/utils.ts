import { createServerFn } from "@tanstack/react-start";


export const generatePaymentReference = createServerFn().handler(()=>{    
    return `REF_${Date.now()}_${crypto.randomUUID()}`
})

export const generateUniqueCode = createServerFn().handler(()=>{
    return `CODE_${Date.now()}_${crypto.randomUUID()}`
});


export const initializePayment = createServerFn()
    .inputValidator((input: { email: string; amount: number }) => ({email:input.email, amount: input.amount}))
    .handler(async ({ data: {amount, email} }): Promise<{access_code?: string}> => {
    const res = await fetch("https://api.paystack.co/transaction/initialize",{
        method: "POST",
        headers: {
            "Authorization": "Bearer YOUR_SECRET_KEY",
            "Content-Type": "application/json",
            body: JSON.stringify({
                // Convert Rand to kobo
                amount: amount * 100,
                currency: "ZAR",
                email,
            })
        },
    })

    return await res.json()
});