import type { UnitType as U, Calendar as C } from "booking-api-extended";
import { buildImageUrl, createResult, getPBSession, Result, type MetaData } from "./pocketbase";

export type UnitType = U & {
    value: number
}

export type UnitTypeResponse = UnitType & MetaData;

export type Calendar = Omit<C, "user_id" | "units"> & {
    title: string;
    units: string[];
    experiences: string[];
}

export type CalendarResponse = Calendar & MetaData;

export async function createUnit(label: string, capacity: number, value: number, cookieHeader?: string): Promise<Result<string, String>> {
    const client = getPBSession(cookieHeader);

    try {
        const result = await client.collection("UnitType").create<UnitType>({
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

export async function fetchUnitTypes(cookieHeader?: string): Promise<Result<UnitTypeResponse[], String>> {
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

export async function deleteUnitType(id: string, cookieHeader?: string): Promise<Result<null, String>> {
    const client = getPBSession(cookieHeader);
    try {
        await client.collection("UnitType").delete(id);
        return createResult(null, null);
    } catch (error) {
        console.error(error);
        return createResult(null, "Failed to delete unit type");
    }
}

export async function createCalendarSchedule(data: Calendar, cookieHeader?: string) {
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
export async function fetchCalendarSchedules(cookieHeader?: string) {
    const client = getPBSession(cookieHeader);
    
    try {
        const result = (await client.collection("CalendarSchedules").getFullList({
            sort: "start_date",
            expand: "units, experiences, experiences.coverImage"
        })).map((record) => {
            return {
                buffer_minutes: record.buffer_minutes,
                collectionId: record.collectionId,
                collectionName: record.collectionName,
                created: record.created,
                days_of_week: record.days_of_week,
                end_date: record.end_date,
                end_time: record.end_time,
                id: record.id,
                start_date: record.start_date,
                start_time: record.start_time,
                title: record.title,
                updated: record.updated,
                units: record.expand?.units || [],
                experiences: record.expand?.experiences.map((obj)=>{
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
                    }
                }) || [],
            }
        })

        return createResult(result, null);
    } catch (error) {
        return createResult(null, "Failed to fetch calendar schedules");
    }
}

/**
 * Fetches calendar schedules filtered by experience IDs.
 **/
export async function fetchCalendarScheduleByExperiencesIds(filter: string | string[], cookieHeader?: string) {
    const client = getPBSession(cookieHeader);

    try {
        // If an array of IDs is supplied, join them safely or ensure 
        // string queries evaluate properly depending on your filtration logic
        const filterQuery = Array.isArray(filter) 
            ? filter.map(id => `experiences ~ "${id}"`).join(" || ")
            : `experiences ~ "${filter}"`;

        const result = (await client.collection("CalendarSchedules").getFullList({
            filter: filterQuery,
            sort: "start_date",
            expand: "units, experiences, experiences.coverImage"
        })).map((record) => {
            return {
                buffer_minutes: record.buffer_minutes,
                collectionId: record.collectionId,
                collectionName: record.collectionName,
                created: record.created,
                days_of_week: record.days_of_week,
                end_date: record.end_date,
                end_time: record.end_time,
                id: record.id,
                start_date: record.start_date,
                start_time: record.start_time,
                title: record.title,
                updated: record.updated,
                units: record.expand?.units || [],
                experiences: record.expand?.experiences.map((obj)=>{
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
                    }
                }) || [],
            }
        })

        return createResult(result, null);
    } catch (error) {
        return createResult(null, "Failed to fetch calendar schedules");        
    }
}

export async function updateCalendarSchedule(id:string, data: Calendar, cookieHeader?: string) {
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
        return createResult(null, "Failed to update calendar schedule");
    }
}

export async function deleteCalendarSchedule(id: string, cookieHeader?: string) {
    const client = getPBSession(cookieHeader);

    try {
        const result = await client.collection("CalendarSchedules").delete(id);
        return createResult(result, null);
    } catch (error) {
        return createResult(null, "Failed to delete calendar schedule");        
    }
}