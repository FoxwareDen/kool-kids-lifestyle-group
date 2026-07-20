import { buildImageUrl, createResult, getPBSession, Result, type MetaData } from "./pocketbase";
import type { UnitType as U, Calendar as C, Booking as B } from "booking-api-extended";

export type UnitType = U & {
    value: number;
};

export type UnitTypeResponse = UnitType & MetaData;

export type Calendar = Omit<C, "user_id" | "units"> & {
    title: string;
    units: string[];
    experiences: string[];
};

export type CalendarResponse = Calendar & MetaData;

// Type definition for an individual experience after custom property resolution
export type TransformedExperience = {
    id: string;
    category: any; 
    defaultLanguage: any;
    enabledLanguages: any;
    title: any; 
    description?: any;
    createdAt: string;
    updatedAt: string;
    coverImage: string;
};

// Main return payload representing a fully populated schedule row
export type TransformedCalendarSchedule = Omit<CalendarResponse, "units" | "experiences"> & {
    units: UnitTypeResponse[];
    experiences: TransformedExperience[];
};

// We omit days_of_week here so we can redefine it safely without parent-type collision errors
interface CalendarScheduleRecord extends Omit<CalendarResponse, "units" | "experiences" | "days_of_week"> {
    units: string[];
    experiences: string[];
    days_of_week: Array<string | number>; 
    expand?: {
        units?: UnitTypeResponse[];
        experiences?: Array<{
            id: string;
            category: any;
            defaultLanguage: any;
            enabledLanguages: any;
            title: string | any;
            description?: string | any;
            createdAt: string;
            updatedAt: string;
            expand: {
                coverImage: {
                    collectionId: string;
                    id: string;
                    file: string;
                };
            };
        }>;
    };
}

export async function createUnit(label: string, capacity: number, value: number, cookieHeader?: string): Promise<Result<string, string>> {
    const client = getPBSession(cookieHeader);

    try {
        const result = await client.collection("UnitType").create<UnitTypeResponse>({
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

export async function fetchUnitTypes(cookieHeader?: string): Promise<Result<UnitTypeResponse[], string>> {
    const client = getPBSession(cookieHeader);

    try {
        const records = await client.collection("UnitType").getFullList<UnitTypeResponse>({
            sort: "label",
        });
        return createResult(records, null);
    } catch (error) {
        console.error(error);
        return createResult(null, "Failed to fetch unit types");
    }
}

export async function deleteUnitType(id: string, cookieHeader?: string): Promise<Result<null, string>> {
    const client = getPBSession(cookieHeader);
    try {
        await client.collection("UnitType").delete(id);
        return createResult(null, null);
    } catch (error) {
        console.error(error);
        return createResult(null, "Failed to delete unit type");
    }
}

export async function createCalendarSchedule(data: Calendar, cookieHeader?: string): Promise<Result<CalendarResponse, string>> {
    const client = getPBSession(cookieHeader);

    try {
        const result = await client.collection("CalendarSchedules").create<CalendarResponse>({
            start_date: data.start_date,
            end_date: data.end_date,
            start_time: data.start_time,
            end_time: data.end_time,
            days_of_week: data.days_of_week,
            buffer_minutes: data.buffer_minutes, 
            units: data.units,                   
            experiences: data.experiences,
            title: data.title,
        });

        return createResult(result, null);
    } catch (error) {
        console.error(error);
        return createResult(null, "Failed to create calendar schedule");
    }
}

/**
 * Fetches all calendar schedules sorted by start date.
 */
export async function fetchCalendarSchedules(cookieHeader?: string): Promise<Result<TransformedCalendarSchedule[], string>> {
    const client = getPBSession(cookieHeader);
    
    try {
        const rawRecords = await client.collection("CalendarSchedules").getFullList<CalendarScheduleRecord>({
            sort: "start_date",
            expand: "units, experiences, experiences.coverImage"
        });

        const result: TransformedCalendarSchedule[] = rawRecords.map((record) => {
            const experiences: TransformedExperience[] = record.expand?.experiences ? (
                record.expand.experiences.map((obj) => {
                    const image = obj.expand["coverImage"];
                    return {
                        id: obj.id,
                        category: obj.category,
                        defaultLanguage: obj.defaultLanguage,
                        enabledLanguages: obj.enabledLanguages,
                        title: typeof obj.title === "string" ? JSON.parse(obj.title) : obj.title,
                        description: obj.description
                            ? (typeof obj.description === "string" ? JSON.parse(obj.description) : obj.description)
                            : undefined,
                        createdAt: obj.createdAt,
                        updatedAt: obj.updatedAt,
                        coverImage: buildImageUrl(image.collectionId, image.id, image.file),
                    };
                })
            ) : [];

            const units = record.expand?.units ? record.expand.units : [];
            
            // Map strings perfectly into standard numbers to satisfy TransformedCalendarSchedule
            const daysOfWeekNumbers = record.days_of_week 
                ? record.days_of_week.map(day => typeof day === "string" ? parseInt(day, 10) : day)
                : [];

            return {
                buffer_minutes: record.buffer_minutes,
                collectionId: record.collectionId,
                collectionName: record.collectionName,
                created: record.created,
                days_of_week: daysOfWeekNumbers,
                end_date: record.end_date,
                end_time: record.end_time,
                id: record.id,
                start_date: record.start_date,
                start_time: record.start_time,
                title: record.title,
                updated: record.updated,
                units,
                experiences,
            };
        });

        return createResult(result, null);
    } catch (error) {
        console.error(error);
        return createResult(null, "Failed to fetch calendar schedules");
    }
}

/**
 * Fetches calendar schedules filtered by experience IDs.
 **/
export async function fetchCalendarScheduleByExperiencesIds(filter: string | string[], cookieHeader?: string): Promise<Result<TransformedCalendarSchedule[], string>> {
    const client = getPBSession(cookieHeader);

    try {
        const filterQuery = Array.isArray(filter) 
            ? filter.map(id => `experiences ~ "${id}"`).join(" || ")
            : `experiences ~ "${filter}"`;

        const rawRecords = await client.collection("CalendarSchedules").getFullList<CalendarScheduleRecord>({
            filter: filterQuery,
            sort: "start_date",
            expand: "units, experiences, experiences.coverImage"
        });

        const result: TransformedCalendarSchedule[] = rawRecords.map((record) => {
            const experiences: TransformedExperience[] = record.expand?.experiences ? (
                record.expand.experiences.map((obj) => {
                    const image = obj.expand["coverImage"];
                    return {
                        id: obj.id,
                        category: obj.category,
                        defaultLanguage: obj.defaultLanguage,
                        enabledLanguages: obj.enabledLanguages,
                        title: typeof obj.title === "string" ? JSON.parse(obj.title) : obj.title,
                        description: obj.description
                            ? (typeof obj.description === "string" ? JSON.parse(obj.description) : obj.description)
                            : undefined,
                        createdAt: obj.createdAt,
                        updatedAt: obj.updatedAt,
                        coverImage: buildImageUrl(image.collectionId, image.id, image.file),
                    };
                })
            ) : [];

            const units = record.expand?.units ? record.expand.units : [];
            
            const daysOfWeekNumbers = record.days_of_week 
                ? record.days_of_week.map(day => typeof day === "string" ? parseInt(day, 10) : day)
                : [];

            return {
                buffer_minutes: record.buffer_minutes,
                collectionId: record.collectionId,
                collectionName: record.collectionName,
                created: record.created,
                days_of_week: daysOfWeekNumbers,
                end_date: record.end_date,
                end_time: record.end_time,
                id: record.id,
                start_date: record.start_date,
                start_time: record.start_time,
                title: record.title,
                updated: record.updated,
                units,
                experiences,
            };
        });

        return createResult(result, null);
    } catch (error) {
        console.error(error);
        return createResult(null, "Failed to fetch calendar schedules");        
    }
}

export async function updateCalendarSchedule(id: string, data: Calendar, cookieHeader?: string): Promise<Result<CalendarResponse, string>> {
    const client = getPBSession(cookieHeader);

    try {
        const result = await client.collection("CalendarSchedules").update<CalendarResponse>(id, {
            start_date: data.start_date,
            end_date: data.end_date,
            start_time: data.start_time,
            end_time: data.end_time,
            days_of_week: data.days_of_week,
            buffer_minutes: data.buffer_minutes,
            units: data.units,
            experiences: data.experiences,
            title: data.title,
        });

        return createResult(result, null);
    } catch (error) {
        console.error(error);
        return createResult(null, "Failed to update calendar schedule");
    }
}

export async function deleteCalendarSchedule(id: string, cookieHeader?: string): Promise<Result<boolean, string>> {
    const client = getPBSession(cookieHeader);

    try {
        const result = await client.collection("CalendarSchedules").delete(id);
        return createResult(result, null);
    } catch (error) {
        console.error(error);
        return createResult(null, "Failed to delete calendar schedule");        
    }
}


export interface Booking extends B {
    schedule_id: string
}

export interface BookingResponse extends Omit<Booking, "id"> , MetaData {
    expanded: {
        schedule_id?: CalendarResponse
    }
}


export async function createBooking(
    data:Omit<Booking, "id" | "created" | "updated" | "collectionId" | "collectionName">,
    cookieHeader?: string
): Promise<Result<BookingResponse, string>> {
    const client = getPBSession(cookieHeader)

    try {
        const record = await client.collection("Bookings").create<BookingResponse>(data);

        return createResult(record, null)
    } catch (error) {
        console.error(error);
        return createResult(null, "Failed to create client booking");                
    }
}

export async function fetchBookingsByScheduleId(
  scheduleId: string,
  cookieHeader?: string
): Promise<Result<BookingResponse[], string>> {
  const client = getPBSession(cookieHeader);
  const filter = `schedule_id = "${scheduleId}"` ;
  try {
    const records = await client.collection("Bookings").getFullList<BookingResponse>({
      filter,
      sort: "date, start_time",
    });
    return createResult(records, null);
  } catch (error) {
    console.error(error);
    return createResult(null, "Failed to fetch bookings");
  }
}

export async function updateBooking(
  id: string,
  data: Partial<Omit<Booking, "id" | "created" | "updated">>,
  cookieHeader?: string
): Promise<Result<BookingResponse, string>> {
  const client = getPBSession(cookieHeader);
  try {
    const record = await client.collection("Bookings").update<BookingResponse>(id, data);
    return createResult(record, null);
  } catch (error) {
    console.error(error);
    return createResult(null, "Failed to update booking");
  }
}

// Delete a booking
export async function deleteBooking(
  id: string,
  cookieHeader?: string
): Promise<Result<boolean, string>> {
  const client = getPBSession(cookieHeader);
  try {
    const result = await client.collection("Bookings").delete(id);
    return createResult(result, null);
  } catch (error) {
    console.error(error);
    return createResult(null, "Failed to delete booking");
  }
}