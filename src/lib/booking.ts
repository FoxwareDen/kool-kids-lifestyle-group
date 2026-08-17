import { addDays, format } from "date-fns";
import { createBookingPage } from "./experiences";
import { createPayment } from "./payment";
import { buildImageUrl, create, createResult, deleteItemInCollection, fetchCollection, getPBSession, Result, type MetaData } from "./pocketbase";
import { type Unit as U, type Calendar as C, type Booking as B, type AvailableRange, generateAvailableSlots } from "@/lib/system";

export type UnitType = U & {
  value: number;
};

export type UnitTypeResponse = UnitType & MetaData;

export type Calendar = Omit<C, "user_id" | "units"> & {
  units: string[];
  experiences: string[];
  title: string;
  min_advance_days?: number;
  max_advance_days?: number;
};

export type CalendarResponse = Calendar & MetaData;

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

export type TransformedCalendarSchedule = Omit<CalendarResponse, "units" | "experiences"> & {
  units: UnitTypeResponse[];
  experiences: TransformedExperience[];
};

export interface CalendarScheduleRecord extends Omit<CalendarResponse, "units" | "experiences" | "days_of_week"> {
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

function convertTo24Hour(time: string): string {
  if (!time.includes("AM") && !time.includes("PM")) return time;
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);
  if (modifier === "AM" && hours === 12) hours = 0;
  if (modifier === "PM" && hours !== 12) hours += 12;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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
      booking_type: data.booking_type,
    });
    return createResult(result, null);
  } catch (error) {
    console.error(error);
    return createResult(null, "Failed to create calendar schedule");
  }
}

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
      const daysOfWeekNumbers = record.days_of_week
        ? record.days_of_week.map(day => typeof day === "string" ? parseInt(day, 10) : day)
        : [];

      return {
        buffer_minutes: record.buffer_minutes,
        booking_type: record.booking_type,
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
            booking_type: record.booking_type,
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
        booking_type: record.booking_type,
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
      booking_type: data.booking_type,
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

// ==================================== Booking & packages ====================================

export interface Booking extends B {}

export interface BookingResponse extends Omit<Booking, "id">, MetaData {
  expanded: {
    calendar_ref?: CalendarResponse
  }
}

export async function checkBookingTaken(booking: Omit<Booking, "id" | "created" | "updated" | "collectionId" | "collectionName">, cookieHeader?: string): Promise<Result<boolean, string>> {
  const client = getPBSession(cookieHeader);
  
  try {
    const dateStr = booking.date
    const startTime = booking.start_time
    const unitId = booking.unit_id
    const nextDay = format(addDays(new Date(dateStr), 1), "yyyy-MM-dd");

    const filter = `date >= "${dateStr} 00:00:00" && date < "${nextDay} 00:00:00" && start_time = "${startTime}" && unit_id = "${unitId}" && status != "cancelled"`;
    const records = await client.collection("Bookings").getFirstListItem(filter)

    const isTaken = records.items.length > 0;

    return createResult(isTaken, null);
  } catch (error) {
    console.error(error);
    return createResult(null, "Failed to check if booking is taken")
  }
}

export async function deleteBookingByMatches(booking: Omit<Booking, "id" | "created" | "updated" | "collectionId" | "collectionName">, cookieHeader?: string): Promise<Result<boolean, string>> {
  const client = getPBSession(cookieHeader);

  try {
    const dateStr = booking.date
    const startTime = booking.start_time
    const unitId = booking.unit_id
    const nextDay = format(addDays(new Date(dateStr), 1), "yyyy-MM-dd");

    const filter = `date >= "${dateStr} 00:00:00" && date < "${nextDay} 00:00:00" && start_time = "${startTime}" && unit_id = "${unitId}" && status != "cancelled"`;
    const record = await client.collection("Bookings").getFirstListItem(filter)

    const res = await client.collection("Bookings").delete(record.id)

    return createResult(res, null);
  } catch (error) {
    
    return createResult(null, "Failed to create");
  }
}

export async function createBooking(
  data: Omit<Booking, "id" | "created" | "updated" | "collectionId" | "collectionName">,
  cookieHeader?: string
): Promise<Result<BookingResponse, string>> {
  const client = getPBSession(cookieHeader);
  try {
    const isTaken = await checkBookingTaken(data)

    if (!isTaken.value || !isTaken.success) {
      return createResult(null, "Failed to something idont know")
    }

    if (isTaken.value) {
      return createResult(null, "blop")
    }

    const record = await client.collection("Bookings").create<BookingResponse>(data);
    return createResult(record, null);
  } catch (error) {
    console.error(error);
    return createResult(null, "Failed to create client booking");
  }
}

export interface Package extends MetaData {
  booking_ids: string[],
  status: "canceled" | "pending" | "complete",
  payment_ref: string
}

export async function fetchBookingsByScheduleId(
  scheduleId: string,
  cookieHeader?: string
): Promise<Result<BookingResponse[], string>> {
  const client = getPBSession(cookieHeader);
  try {
    const records = await client.collection("Bookings").getFullList<BookingResponse>({
      sort: "date, start_time",
    });
    const cleaned = records.map((r) => ({
      ...r,
      date: r.date.split(" ")[0],
      start_time: convertTo24Hour(r.start_time),
      end_time: convertTo24Hour(r.end_time),
    }));
    return createResult(cleaned, null);
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

// ============================== booking helpers ==============================
export function toUnitType(unit: UnitType): U {
  return {
    id: unit.id,
    label: unit.label,
    capacity: unit.capacity,
    value: unit.value,
    duration: unit.duration
  } as U;
}

export function toCalendar(schedule: TransformedCalendarSchedule): C {
  const units: U[] = schedule.units.map(toUnitType);
  return {
    id: schedule.id,
    start_date: schedule.start_date.split(" ")[0],
    end_date: schedule.end_date.split(" ")[0],
    start_time: schedule.start_time,
    end_time: schedule.end_time,
    days_of_week: schedule.days_of_week,
    buffer_minutes: schedule.buffer_minutes,
    frequency: "weekly",
    booking_type: schedule.booking_type,
    units,
  };
}

export function toBooking(response: BookingResponse): B {
  return {
    calendar_ref: response.calendar_ref,
    id: response.id,
    date: response.date.split(" ")[0],
    start_time: convertTo24Hour(response.start_time),
    end_time: convertTo24Hour(response.end_time),
    duration: response.duration,
    unit_label: response.unit_label,
    unit_id: response.unit_id,
    status: response.status,
  };
}

export function generateSlots(
  schedules: TransformedCalendarSchedule[],
  bookings: BookingResponse[]
): AvailableRange[] {
  const calendars = schedules.map(toCalendar);
  const mappedBookings = bookings.map(toBooking);

  return generateAvailableSlots(calendars[0], mappedBookings, { minAdvanceDays: 0 }).sort((a, b) => {
    const dateA = new Date(`${a.start_date}T${a.start_time}`);
    const dateB = new Date(`${b.start_date}T${b.start_time}`);
    return dateA.getTime() - dateB.getTime();
  });
}

export interface PackageResponse extends Package {
  expanded: {
    booking_ids: Booking[],
  }
}

export type PaymentContinueFunc = (data: {name?: string, phone: string, email: string}) => Promise<Result<PackageResponse, string>>

export async function createPackage(booking: Booking, code: string, reference: string, cookieHeader?: string): Promise<Result<PaymentContinueFunc, string>> {
  const bookingResult = await createBooking(booking, cookieHeader);

  if (!bookingResult.success || bookingResult.value == null) {
    return createResult(null, bookingResult.error ?? "Failed to create booking for package");
  }

  const bookingTemp = bookingResult.value;
  return createResult(async function ({name, email, phone}: {name?: string, phone: string, email: string}): Promise<Result<PackageResponse, string>> {
    const result = await createPayment({phone, email, name, bookingId: bookingTemp.id, code, reference}, cookieHeader);

    if (!result.success || !result.value) {
      return createResult(null, "Failed to create payment for package");
    }

    const paymentTemp = result.value;

    try {
      const record = await create("Packages", {
        booking_ids: [bookingTemp.id],
        status: "pending",
        payment_ref: paymentTemp.id
      }, cookieHeader);

      // @ts-ignore
      return createResult(record.value, null);
    } catch (error) {
      console.error(error);
      return createResult(null, "Failed to create package");
    }
  }, null);
}

export async function fetchPackages(cookieHeader?: string) {
  const client = getPBSession(cookieHeader);
  try {
    const records = await client.collection("Packages").getFullList<PackageResponse>({ batch: 50 });
    return createResult(records, null);
  } catch (err) {
    console.error(err);
    return createResult(null, "Failed to fetch batch of packages");
  }
}

type RefKey = "email" | "reference" | "phone" | "name";

export async function fetchPackageByRef(ref_key: RefKey, value: string, cookieHeader?: string) {
  const client = getPBSession(cookieHeader);

  const filter: string = {
    "email": `payment_ref.email = ${value}`,
    "name": `payment_ref.name ~ ${value}`,
    "phone": `payment_ref.phone = ${value}`,
    "reference": `payment_ref.reference = ${value}`
  }[ref_key];

  try {
    const records = await client.collection("Packages").getFullList<PackageResponse>({
      filter,
      expand: "payment_ref, booking_ids"
    });
    return createResult(records, null);
  } catch (err) {
    console.error(err);
    return createResult(null, "Failed to fetch packages");
  }
}

export async function updatePackageById(id: string, data: Partial<Package>, cookieHeader?: string) {
  const client = getPBSession(cookieHeader);
  try {
    const record = await client.collection("Packages").update(id, data);
    return createResult(record, null);
  } catch (err) {
    console.error(err);
    return createResult(null, "Failed to update package");
  }
}

export async function deletePackageById(id: string, cookieHeader?: string) {
  const client = getPBSession(cookieHeader);
  try {
    const success = await client.collection("Packages").delete(id);
    return createResult(success, null);
  } catch (err) {
    console.error(err);
    return createResult(null, "Failed to delete package");
  }
}