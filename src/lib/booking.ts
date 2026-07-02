import type { SlotPreset, UnitType, Calendar as C, Booking as B } from "booking-api-extended";
import { fetchExperienceById, type HydratedBookingPage } from "./experiences";

//  SlotPreset {
//   id: string;
//   label: string;
//   durationMinutes: number;
// }

//  UnitType {
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

export type Calendar = Omit<C, "user_id"> & {
//  C
//   start_date: string;
//   end_date?: string;
//   start_time: string;        // "HH:mm"
//   end_time: string;          // "HH:mm"
//   days_of_week: number[];    // 0 = Sunday … 6 = Saturday
//   buffer_minutes?: number;
//   user_id?: string;
//   units?: UnitType[];
    experiences: string,
}

export async function bobTheBob(finder: String) {
    try {
    } catch (error) {
        
    }
}