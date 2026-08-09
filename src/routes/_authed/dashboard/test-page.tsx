import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { generateAvailableSlots, type AvailableRange, type Booking, type Calendar, type SlotType, type Unit } from "#/lib/system";
import { Booker, BookerStep, BookingCalendar, BookingPagingButtonGroup, BookingTimeSelect, BookingUnitSelect, BookingView } from "#/components/booking/calendar";
import type { Language } from "#/lib/experiences";
import { fetchBookingsByScheduleId, fetchCalendarScheduleByExperiencesIds, fetchCalendarSchedules, toCalendar } from "#/lib/booking";

// ----- MOCK UNITS -----
const units: Unit[] = [
  { id: "u1", label: "Room A", capacity: 1, duration: 60 },  // 1 hour slots
  { id: "u2", label: "Room B", capacity: 2, duration: 90 },  // 1.5 hour slots
];

const units2: Unit[] = [
  { id: "u2id", label: "2 Bedroom", capacity: 1, duration:0 }
];

const dayRange: AvailableRange = {
  calendar_ref: "cal_1",
  start_date: "2026-08-01",
  end_date: "2026-08-10",
  start_time: "14:00",
  end_time: "10:00",
  type: "day",
  units,
};

const dayRange2: AvailableRange = {
  calendar_ref: "cal_1",
  start_date: "2026-08-13",
  end_date: "2026-08-15",
  start_time: "14:00",
  end_time: "10:00",
  type: "day",
  units: units2,
};

const dayRange3: AvailableRange = {
  calendar_ref: "cal_1",
  start_date: "2026-08-17",
  end_date: "2026-08-20",
  start_time: "14:00",
  end_time: "10:00",
  type: "day",
  units: units2,
};

// Range 1: Morning
const slotRange1: AvailableRange = {
  calendar_ref: "cal_2",
  start_date: "2026-08-01",
  end_date: "2026-08-10",
  start_time: "05:00",
  end_time: "09:00", // Available 05:00 - 09:00
  type: "slot",
  units,
};

// Range 2: Midday
const slotRange2: AvailableRange = {
  calendar_ref: "cal_2",
  start_date: "2026-08-01",
  end_date: "2026-08-10",
  start_time: "10:30", // BOOKED GAP 1: 09:00 - 10:30
  end_time: "13:00",   // Available 10:30 - 13:00
  type: "slot",
  units,
};

// Range 3: Afternoon
const slotRange3: AvailableRange = {
  calendar_ref: "cal_2",
  start_date: "2026-08-01",
  end_date: "2026-08-10",
  start_time: "14:30", // BOOKED GAP 2: 13:00 - 14:30
  end_time: "17:00",   // Available 14:30 - 17:00
  type: "slot",
  units,
};

const coll = [dayRange, dayRange2, dayRange3]

const coll2 = [slotRange1, slotRange2, slotRange3]

const calendar: Calendar = {
  id: "this-is-a-test",
  booking_type: "day",
  buffer_minutes: 1,
  days_of_week: [0,1,2,3,4,5,6],
  start_date: "2026-08-20",
  end_date: "2026-08-23",
  start_time: "09:00",
  end_time: "04:00",
  frequency: "weekly",
  units: units2,
}

const bookings: Booking[] = [
  {
    id: "bobby",
    date: "2026-08-21",
    duration: 1,
    start_time: "09:00",
    end_time: "04:00",
    status: "pending",
    unit_id: "u2id",
    unit_label: "2 Bedroom"
  }
]

export const Route = createFileRoute("/_authed/dashboard/test-page")({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as Language) ?? undefined,
  }),
  loaderDeps: ({ search: {lang} }) => ({lang}),
  loader: async ({ deps: { lang } }) => {
    return {
      lang
    }
  },
  component: RouteComponent,
});


function RouteComponent() {
  const [mode, setMode] = useState<SlotType>("day");
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [liveSlots, setLiveSlots] = useState<AvailableRange[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const id = "9i530p06zj381zs";
      const scheduleResult = await fetchCalendarScheduleByExperiencesIds(id);
      const matchingBookingsResult = await fetchBookingsByScheduleId(id);

      if (scheduleResult.value == null || matchingBookingsResult.value == null) {
        setError("Failed to load schedule or bookings");
        setLoading(false);
        return;
      }

      const schedule = scheduleResult.value;
      const matchingBookings = matchingBookingsResult.value;

      if (!schedule[0]) {
        setError("No calendar found for this experience ID");
        setLoading(false);
        return;
      }

      const slots = generateAvailableSlots(toCalendar(schedule[0]), matchingBookings, { minAdvanceDays: 0 });
      setLiveSlots(slots);
      setLoading(false);
    })();
  }, []);

  const activeSchedule = liveSlots ?? (mode === "day" ? coll : coll2);

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-2 items-center">
        <button
          className={`px-4 py-2 rounded ${mode === "day" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("day")}
        >
          Day Mode
        </button>
        <button
          className={`px-4 py-2 rounded ${mode === "slot" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setMode("slot")}
        >
          Slot Mode
        </button>
        {loading && <span className="text-sm text-gray-400">Loading live data...</span>}
        {error && <span className="text-sm text-red-500">{error}</span>}
        {liveSlots && <span className="text-sm text-green-500">Live data loaded ✓</span>}
      </div>

      <Booker
        type={mode}
        schedule={activeSchedule}
      >
        <BookerStep name="unit_select">
          <BookingUnitSelect />
        </BookerStep>

        <BookerStep name="calendar">
          <BookingCalendar />
        </BookerStep>

        <BookerStep name="view_booking">
          <BookingView />
        </BookerStep>

        <BookerStep name="time_picker">
          <BookingTimeSelect />
        </BookerStep>

        <BookingPagingButtonGroup />
      </Booker>

      {lastBooking && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold">Last Booking:</h3>
          <pre className="text-sm">{JSON.stringify(lastBooking, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}