import {
  addDays,
  eachDayOfInterval,
  format,
  getDay,
  isAfter,
  parseISO,
  startOfDay,
} from "date-fns";

/**
 * Represents a discrete, bookable resource or physical unit within a schedule.
 *
 * @example
 * ```ts
 * const room: Unit = {
 *   id: "unit_101",
 *   label: "Deluxe Suite 101",
 *   capacity: 1,
 *   duration: 1440 // 1 day in minutes
 * };
 * ```
 */
export interface Unit {
  /** Unique identifier for the bookable unit. */
  id: string;
  /** Human-readable display label (e.g., "Table 4", "Room A"). */
  label: string;
  /** Maximum concurrent bookings allowed for this unit before it is marked full. */
  capacity: number;
  /** Expected default duration for a single booking (minutes for slots, days for daily bookings). */
  duration: number;
}

/**
 * Defines the operational granularity of a calendar schedule.
 * - `"day"`: Multi-day or single-day stay-based reservations (e.g., hotels, equipment rentals).
 * - `"slot"`: Intra-day time-window reservations (e.g., restaurant tables, appointments, tours).
 */
export type SlotType = "slot" | "day";

/**
 * Defines the global operating rules, time bounds, active days, and associated units for a business schedule.
 */
export interface Calendar {
  id: string;
  /** ISO-8601 string marking the start of the schedule horizon (e.g., `"2026-01-01"`). */
  start_date: string;
  /** ISO-8601 string marking the end of the schedule horizon (e.g., `"2026-12-31"`). */
  end_date: string;
  /** Opening time boundary in 24-hour format (e.g., `"09:00"`). */
  start_time: string;
  /** Closing time boundary in 24-hour format (e.g., `"17:00"`). */
  end_time: string;
  /** Strategy used to process availability: contiguous multi-day blocks vs. intra-day time windows. */
  booking_type: SlotType;
  /**
   * Array of permitted days of the week using standard JavaScript indexing:
   * `0` = Sunday, `1` = Monday, ..., `6` = Saturday.
   */
  days_of_week: number[];
  /** Recurrence pattern for the schedule rules. Defaults to weekly when omitted. */
  frequency?: "weekly";
  /** Mandatory operational turnaround or cleanup time (in minutes) required before and after bookings. */
  buffer_minutes: number;
  /** Array of individual bookable units governed by this calendar setup. */
  units: Unit[];
}

/**
 * Represents an existing reservation against a specific unit.
 */
export interface Booking {
  /** Unique identifier for the booking record. */
  id: string;
  /** Calendar date of the reservation in `"YYYY-MM-DD"` format. */
  date: string;
  /** Start time of the reservation in 24-hour `"HH:mm"` format. */
  start_time: string;
  /** End time of the reservation in 24-hour `"HH:mm"` format. */
  end_time: string;
  /** Total reservation length (minutes for slot bookings, days for day bookings). */
  duration: number;
  /** Human-readable label matching the reserved unit. */
  unit_label: string;
  /** Unique identifier matching the reserved unit. */
  unit_id: string;
  /** Current state of the booking reservation. Cancelled bookings are ignored during slot calculation. */
  status: "pending" | "completed" | "rescheduled" | "cancelled";
}

/**
 * Represents an unreserved, bookable range of operating time or contiguous calendar days.
 *
 * ### Field Semantics by `type`:
 * - **`type === "day"` (Multi-day stays / rentals)**:
 *   - `start_date` & `end_date`: Define the contiguous block of available dates (e.g., `"2026-08-01"` to `"2026-08-05"`).
 *   - `start_time` & `end_time`: Represent daily operational bounds like Check-in time (`start_time`) and Check-out time (`end_time`).
 *
 * - **`type === "slot"` (Intra-day time windows)**:
 *   - `start_date` & `end_date`: Anchor to the exact same single date (e.g., `"2026-08-01"`).
 *   - `start_time` & `end_time`: Define the start and end of the free, unreserved time window carved out on that day (e.g., `"09:00"` to `"11:30"`).
 */
export interface AvailableRange {
  calendar_ref: string;
  /**
   * Starting date in `"YYYY-MM-DD"` format.
   * - **`"day"`**: First date of a contiguous multi-day stay block.
   * - **`"slot"`**: The single date on which this time window occurs.
   */
  start_date: string;

  /**
   * Ending date in `"YYYY-MM-DD"` format.
   * - **`"day"`**: Final date of the contiguous multi-day stay block.
   * - **`"slot"`**: Identical to `start_date`.
   */
  end_date: string;

  /**
   * Opening boundary time in 24-hour `"HH:mm"` format.
   * - **`"day"`**: Daily schedule opening or Check-in time (e.g., `"14:00"`).
   * - **`"slot"`**: The exact start of an open time window on `start_date` (e.g., `"09:00"`).
   */
  start_time: string;

  /**
   * Closing boundary time in 24-hour `"HH:mm"` format.
   * - **`"day"`**: Daily schedule closing or Check-out time (e.g., `"10:00"`).
   * - **`"slot"`**: The exact end of an open time window on `start_date` (e.g., `"11:30"`).
   */
  end_time: string;

  /** List of bookable units available throughout this range. */
  units: Unit[];

  /** Mode of availability represented by this range object. */
  type: SlotType;
}

/**
 * Converts a 24-hour time string (`"HH:mm"`) into total elapsed minutes from midnight.
 *
 * @param t - The time string to convert (e.g., `"14:30"`).
 * @returns Total minutes from midnight (e.g., `870`).
 *
 * @internal
 */
const timeToMinutes = (t: string): number => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Converts an integer count of minutes from midnight into a zero-padded 24-hour time string (`"HH:mm"`).
 *
 * @param m - Minutes elapsed from midnight (e.g., `870`).
 * @returns Formatted time string (e.g., `"14:30"`).
 *
 * @internal
 */
const minutesToTime = (m: number): string => {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

/**
 * Evaluates a schedule definition against active bookings to derive unreserved, bookable operating ranges.
 *
 * ### Operating Modes:
 * 1. **Day Mode (`"day"`)**:
 *    Iterates unit-by-unit across the calendar horizon, coalescing unbroken sequences of available
 *    days into single contiguous `AvailableRange` blocks (`start_date` $\rightarrow$ `end_date`).
 *
 * 2. **Slot Mode (`"slot"`)**:
 *    Iterates day-by-day and unit-by-unit, using chronological interval carving to slice open time
 *    windows between existing bookings while strictly enforcing pre- and post-booking buffer padding.
 *
 * @param schedule - Configuration object containing calendar limits, operating hours, buffer, and units.
 * @param bookings - Array of existing reservation objects to check against for capacity and overlaps.
 * @param config - Execution constraints, including minimum lead time (`minAdvanceDays`).
 * @returns Array of calculated {@link AvailableRange} objects ready for consumer UI rendering or selection.
 *
 * @example
 * ```ts
 * const available = generateAvailableSlots(mySchedule, existingBookings, { minAdvanceDays: 1 });
 * console.log(available);
 * ```
 */
export function generateAvailableSlots(
  schedule: Calendar,
  bookings: Booking[],
  config: { minAdvanceDays: number }
): AvailableRange[] {
  // Store all calculated available range objects to return
  const availableSlots: AvailableRange[] = [];

  // Normalize today's date to midnight so advance-day calculations remain standard
  const today = startOfDay(new Date());

  // Parse ISO date strings from the schedule into standard Date objects
  const scheduleStart = startOfDay(parseISO(schedule.start_date));
  const scheduleEnd = parseISO(schedule.end_date);

  // Calculate the earliest permissible date for reservations based on lead-time configuration
  const minBookingDate = addDays(today, config.minAdvanceDays);

  // Establish the actual operational start boundary (whichever is later)
  const actualStart = isAfter(scheduleStart, minBookingDate) ? scheduleStart : minBookingDate;

  // Short-circuit immediately if the schedule end date precedes the lead-time threshold
  if (isAfter(actualStart, scheduleEnd)) {
    return availableSlots;
  }

  // Safely generate every discrete calendar day within the active horizon (DST-resilient)
  const daysInRange = eachDayOfInterval({ start: actualStart, end: scheduleEnd });

  // =========================================================================
  // BRANCH 1: DAY-BASED BOOKINGS (Contiguous Range Coalescing)
  // =========================================================================
  if (schedule.booking_type === "day") {

    // Evaluate unit-by-unit to track individual contiguous active ranges independently
    for (const unit of schedule.units) {

      let activeRange: AvailableRange | null = null;

      // Iterate through each day in the schedule horizon to determine availability
      for (const date of daysInRange) {

        const day_of_the_week = getDay(date);

        const formattedDate = format(date, 'yyyy-MM-dd');

        // Rule Check 1: Is this day of the week enabled in the calendar schedule?
        const isWorkingDay = schedule.days_of_week.includes(day_of_the_week);

        // Rule Check 2: Count non-cancelled bookings occupying this unit on this date
        const bookedCount = bookings.filter((b) => {
          if (b.status === "cancelled") return false;
          if (b.unit_id !== unit.id && b.unit_label !== unit.label) return false;
          const bStartDate = startOfDay(parseISO(b.date));
          const bEndDate = addDays(bStartDate, b.duration);
          return date.getTime() >= bStartDate.getTime() && date.getTime() < bEndDate.getTime();
        }).length;

        // // Rule Check 3: Also check next day isn't booked (since stay runs into next morning)
        // const nextDate = addDays(date, 1);
        // const nextDayBookedCount = bookings.filter((b) => {
        //   if (b.status === "cancelled") return false;
        //   if (b.unit_id !== unit.id && b.unit_label !== unit.label) return false;
        //   const bStartDate = parseISO(b.date);
        //   const bEndDate = addDays(bStartDate, b.duration);
        //   return nextDate.getTime() >= bStartDate.getTime() && nextDate.getTime() < bEndDate.getTime();
        // }).length;

        // const isAvailable = isWorkingDay && bookedCount < unit.capacity && nextDayBookedCount < unit.capacity;

        const isAvailable = isWorkingDay && bookedCount < unit.capacity;

        if (isAvailable) {
          if (!activeRange) {
            // INITIALIZE A NEW RANGE TRACKER
            activeRange = {
              calendar_ref: schedule.id,
              start_date: formattedDate,
              end_date: formattedDate,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              units: [unit],
              type: "day"
            };
          } else {
            // EXTEND THE ACTIVE CONTIGUOUS RANGE
            activeRange.end_date = formattedDate;
          }
        } else {
          // CAPACITY/SCHEDULE BLOCK ENCOUNTERED: Close and flush the open active range
          if (activeRange) {
            availableSlots.push(activeRange);
            activeRange = null;
          }
        }
      }

      // Flush any range that remained open when the date loop completed
      if (activeRange) {
        availableSlots.push(activeRange);
      }
    }
  }
  // else if (schedule.booking_type === "static") {
  //   return availableSlots;
  // }
  // =========================================================================
  // BRANCH 2: INTRA-DAY SLOT BOOKINGS (Dynamic Interval Carving)
  // =========================================================================
  else {
    for (const date of daysInRange) {
      const day_of_the_week = getDay(date);
      const formattedDate = format(date, "yyyy-MM-dd");

      const isworkingDay = schedule.days_of_week.includes(day_of_the_week);
      if (!isworkingDay) continue;

      // Filter non-cancelled reservations for this calendar date
      const matchedBookings = bookings.filter(
        (b) => b.date === formattedDate && b.status !== "cancelled"
      );

      const opStart = timeToMinutes(schedule.start_time);
      const opEnd = timeToMinutes(schedule.end_time);

      for (const unit of schedule.units) {
        // Isolate bookings relevant to this specific unit
        const unitBookings = matchedBookings.filter(
          (b) => b.unit_id === unit.id || b.unit_label === unit.label
        );

        // BUGFIX (capacity > 1): the old code walked bookings one-by-one and
        // advanced `windowStart` past every booking unconditionally, which
        // treats every unit as if unit.capacity === 1. Instead, build a
        // buffered occupancy interval per booking so we can count how many
        // bookings actually overlap a given moment, and only mark that
        // moment unavailable once the count reaches unit.capacity.
        const occupiedIntervals = unitBookings
          .map((b): [number, number] => {
            const bStart = timeToMinutes(b.start_time);
            const bEnd = timeToMinutes(b.end_time);

            // Deduct mandatory buffer time from the available window prior to the booking
            // (and, symmetrically, after it) — same buffer semantics as before,
            // just applied per-interval instead of via a running `windowStart`.
            const bufferedStart = Math.max(opStart, bStart);
            const bufferedEnd = Math.min(opEnd, bEnd + schedule.buffer_minutes);
            return [bufferedStart, bufferedEnd];
          })
          .filter(([s, e]) => e > s);

        // Every point in time where the overlap count could change
        const boundaryPoints = Array.from(
          new Set([opStart, opEnd, ...occupiedIntervals.flat()])
        ).sort((a, b) => a - b);

        let windowStart: number | null = null;

        // Sort bookings chronologically to process time gaps in order
        for (let i = 0; i < boundaryPoints.length - 1; i++) {
          const segStart = boundaryPoints[i];
          const segEnd = boundaryPoints[i + 1];
          if (segEnd <= segStart) continue;

          // Count how many buffered bookings overlap this micro-segment
          const midpoint = (segStart + segEnd) / 2;
          const occupied = occupiedIntervals.filter(
            ([s, e]) => midpoint >= s && midpoint < e
          ).length;

          // Save free window prior to this booking if sufficient gap exists
          if (occupied < unit.capacity) {
            if (windowStart === null) windowStart = segStart;
          } else if (windowStart !== null) {
            availableSlots.push({
              calendar_ref: schedule.id,
              start_date: formattedDate,
              end_date: formattedDate,
              start_time: minutesToTime(windowStart),
              end_time: minutesToTime(segStart),
              units: [unit],
              type: schedule.booking_type,
            });
            windowStart = null;
          }
        }

        // Capture remaining unreserved operating window up to end-of-day
        if (windowStart !== null) {
          availableSlots.push({
            calendar_ref: schedule.id,
            start_date: formattedDate,
            end_date: formattedDate,
            start_time: minutesToTime(windowStart),
            end_time: minutesToTime(opEnd),
            units: [unit],
            type: schedule.booking_type,
          });
        }
      }
    }
  }

  return availableSlots;
}


const units2: Unit[] = [
  { id: "u2id", label: "2 Bedroom", capacity: 1, duration: 0 }
];

const calendar: Calendar = {
  id: "this-is-a-test",
  booking_type: "day",
  buffer_minutes: 1,
  days_of_week: [0, 1, 2, 3, 4, 5, 6],
  start_date: "2026-08-20",
  end_date: "2026-08-23",
  start_time: "09:00",
  end_time: "04:00",
  frequency: "weekly",
  units: units2,
}

const bookings: Booking[] = [
  {
    date: "2026-08-21",
    duration: 1,
    start_time: "09:00",
    end_time: "04:00",
    status: "pending",
    unit_id: "u2id",
    unit_label: "2 Bedroom",
    id: "b1id",
  }
];

// (()=>{
//   const slots = generateAvailableSlots(calendar, bookings, { minAdvanceDays: 0 });
//   console.log(`slots generated`);
//   console.log(slots);

// })()
