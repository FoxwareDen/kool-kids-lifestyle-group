import type { SlotPreset, UnitType as U, Calendar as C, Booking as B } from "booking-api-extended";
import { fetchExperienceById, type HydratedBookingPage } from "./experiences";
import { createResult, getPBSession, Result } from "./pocketbase";

//  SlotPreset {
//   id: string;
//   label: string;
//   durationMinutes: number;
// }

export type UnitType = U & {
    value: number
}
// {
//   id: string;
//   label: string;
//   capacity: number;
// }

//  Booking {
//   id: number;
//   status: "pending" | "completed" | "rescheduled" | "cancelled";
//   date: string;              // "YYYY-MM-DD"
//   start_time: string;        // "HH:mm"
//   end_time: string;          // "HH:mm"
//   updated_at: string | null;
//   duration: number;          // minutes
//   unit_type: string;
//   slot_preset_id: string;
// }

export type Calendar = Omit<C, "user_id" | "units"> & {
//  C
//   start_date: string;
//   end_date?: string;
//   start_time: string;        // "HH:mm"
//   end_time: string;          // "HH:mm"
//   days_of_week: number[];    // 0 = Sunday … 6 = Saturday
//   buffer_minutes?: number;
//   user_id?: string;
    units: string[];
    experiences: string,
}

export async function createUnit(label:string, capacity: number, value:number, cookieHeader?:string): Promise<Result<string,String>> {
    const client = getPBSession(cookieHeader);

    try {
        const result = await client.collection("UnitType").create({
            label,
            capacity,
            value
        });
        return createResult(result.id, null);
    } catch (error) {
        console.error(error);
        return createResult(null, "Failed to create unit");                
    }
}

export async function fetchUnitTypes(cookieHeader?: string): Promise<Result<UnitType[], String>> {
    const client = getPBSession(cookieHeader);

    try {
        const records = await client.collection("UnitType").getFullList<UnitType>({
            sort: "label",
        });
        return createResult(records, null);
    } catch (error) {
        console.error(error);
        return createResult(null, "Failed to fetch unit types");
    }
}

export async function bobTheBob(finder: String) {
    try {

    } catch (error) {
        
    }
}