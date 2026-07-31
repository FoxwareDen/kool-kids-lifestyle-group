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

function generateAvailableSlots(
  schedule: Calendar, 
  bookings: Booking[], 
  config: { minAdvanceDays: number }
) {
  // Store all available slot objects to return
  const availableSlots: any[] = [];
  
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

  for (const date of daysInRange) {
    // Note: getDay() returns 0 for Sunday through 6 for Saturday
    const dotw = getDay(date);

    // Skip days that aren't enabled in the schedule's active days list
    if (!schedule.days_of_weeK.includes(dotw)) {
      continue;
    }


    // filter all bookings with this date
    const formattedDate = format(date, 'yyyy-MM-dd');
    const matchedBookings = bookings.filter((b) => b.date === formattedDate && b.status !== 'cancelled');
    
    
    if (schedule.booking_type == "day") {
      // TODO: day segments

      

    }else {
      // TODO: sots during the day
    }
  }

  return availableSlots;
}


  // TODO: split from actualStart to the scheduleEnd the days allowed ie days of the week selected
  // TODO: segment the start to end time out of each day
  // TODO: split that segments into slots ie (end_time - start_time / (curation + buffer_minutes))
  // TODO: iterate ove the segments check if the segment in crossing any of the bookings and map removing the tailing buffer_minutes to get true slots segments
  // TODO: remember booking amount is tied into the capacity allowed so ther can be a n number of bookings on each unit n being the capacity
  // TODO: return the segments thats not crossing bookings