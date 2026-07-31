import {
  addDays,
  eachDayOfInterval,
  format,
  getDay,
  isAfter,
  parseISO,
  startOfDay,
} from "date-fns";

export interface Unit {
  id: string;
  label: string;
  capacity: number;
  duration: number;
}

export interface Calendar {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  booking_type: "slot" | "day";
  days_of_weeK: number[];
  frequency?: "weekly";
  buffer_minutes: number;
  units: Unit[]
}

export interface Booking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;// of calendar type is slot its minutes else its days
  unit_label: string;
  unit_id: string;
  status: "pending" | "completed" | "rescheduled" | "cancelled"
}

export interface AvailableRange  {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  units: Unit[];
}


export function generateAvailableSlots(
  schedule: Calendar, 
  bookings: Booking[], 
  config: { minAdvanceDays: number }
) {
  // Store all available slot objects to return
  const availableSlots: AvailableRange[] = [];
  
  // Normalize today's date to midnight so advance-day calculations are consistent
  const today = startOfDay(new Date());

  // Parse ISO strings from the schedule into Date objects
  const scheduleStart = parseISO(schedule.start_date);
  const scheduleEnd = parseISO(schedule.end_date);

  // Calculate the earliest possible date the user is allowed to book
  const minBookingDate = addDays(today, config.minAdvanceDays);

  // Start from whichever is later: the schedule start or the minimum allowed booking date
  const actualStart = isAfter(scheduleStart, minBookingDate) ? scheduleStart : minBookingDate;

  // Return empty immediately if the start threshold falls beyond the end of the schedule
  if (isAfter(actualStart, scheduleEnd)) {
    return availableSlots;
  }

  // Safely generate an array of Date objects for each day in range (handles DST safely)
  const daysInRange = eachDayOfInterval({ start: actualStart, end: scheduleEnd });

  // ONLY FOR DAY BOOKINGS
  if (schedule.booking_type === "day") {
    
    // Loop unit-by-unit so each unit tracks its own contiguous range independently
    for (const unit of schedule.units) {

      let activeRange: AvailableRange | null = null;

      for (const date of daysInRange) {
        const dotw = getDay(date);
        const formattedDate = format(date, 'yyyy-MM-dd');

        // Check 1: Is this day enabled in schedule?
        const isWorkingDay = schedule.days_of_weeK.includes(dotw);

        // Check 2: Has this unit reached capacity on this date?
        const bookedCount = bookings.filter(
          (b) => b.date === formattedDate && 
                 b.status !== 'cancelled' && 
                 (b.unit_id === unit.id || b.unit_label === unit.label)
        ).length;

        const isAvailable = isWorkingDay && bookedCount < unit.capacity;

        if (isAvailable) {

          if (!activeRange) {
            // START A NEW RANGE
            activeRange = {
              start_date: formattedDate,
              end_date: formattedDate,
              start_time: schedule.start_time,
              end_time: schedule.end_time,
              units: [unit],
            };
          } else {
            // STRETCH THE EXISTING RANGE
            activeRange.end_date = formattedDate;
          }

        } else {
          
          // DAY IS BLOCKED: Close and save active range if one exists
          if (activeRange) {
            availableSlots.push(activeRange);
            activeRange = null;
          }
          
        }
      }

      // Flush any range that was still open when the loop ended
      if (activeRange) {
        availableSlots.push(activeRange);
      }
    }
  } else {
    
  }

  return availableSlots;
}