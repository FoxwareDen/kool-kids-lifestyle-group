import {
  addDays,
  isAfter,
  min,
  parseISO,
  startOfDay
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
  days_of_weeK: number[];
  frequency?: "weekly";
  buffer_minutes: number;
}

export interface Booking {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  unit_label: string;
  unit_id: string;
  status: "pending" | "completed" | "rescheduled" | "cancelled"
}

function generateAvailableSlots(schedule: Calendar, bookings: Booking[], config: { minAdvanceDays: number }) {
  const availableSlots: any[] = [];
  const today = startOfDay(new Date());

  const scheduleStart = parseISO(schedule.start_date);
  const scheduleEnd = parseISO(schedule.end_date);

  const minBookingDate = addDays(today, config.minAdvanceDays);

  // checks if the dates available is before or after minAdvanceDays
  const actualStart = isAfter(scheduleStart, minBookingDate) ? scheduleStart : minBookingDate;

  if (actualStart > scheduleEnd) {
    return availableSlots;
  }

  // TODO: split from actualStart to the scheduleEnd the days allowed ie days of the week selected
  // TODO: segment the start to end time out of each day
  // TODO: split that segments into slots ie (end_time - start_time / (curation + buffer_minutes))
  // TODO: iterate ove the segments check if the segment in crossing any of the bookings and map removing the tailing buffer_minutes to get true slots segments
  // TODO: remember booking amount is tied into the capacity alloed so ther can be a n number of bookings on each unit n being the capacity
  // TODO: return the segments thats not crossing bookings


}
