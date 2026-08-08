import { createServerFn } from "@tanstack/react-start";


export const generatePaymentReference = createServerFn().handler(()=>{    
    return `REF_${Date.now()}_${crypto.randomUUID()}`
})

export const generateUniqueCode = createServerFn().handler(()=>{
    return `CODE_${Date.now()}_${crypto.randomUUID()}`
});