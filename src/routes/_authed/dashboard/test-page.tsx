import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { AvailableRange, Booking, SlotType, Unit } from "#/lib/system";
import { Booker, BookerStep, BookingCalendar, BookingPagingButtonGroup, BookingTimeSelect, BookingUnitSelect } from "#/components/booking/calendar";

// ----- MOCK UNITS -----
const units: Unit[] = [
  { id: "u1", label: "Room A", capacity: 1, duration: 60 },  // 1 hour slots
  { id: "u2", label: "Room B", capacity: 2, duration: 90 },  // 1.5 hour slots
];

const units2: Unit[] = [
  { id: "u2id", label: "2 Bedroom", capacity: 2, duration:0 }
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

const slotRange: AvailableRange = {
  calendar_ref: "cal_2",
  start_date: "2026-08-01",
  end_date: "2026-08-10",
  start_time: "09:00",
  end_time: "10:00",
  type: "slot",
  units,
};

const slotRange2: AvailableRange = {
  calendar_ref: "cal_2",
  start_date: "2026-08-01",
  end_date: "2026-08-10",
  start_time: "11:30",
  end_time: "17:00",
  type: "slot",
  units,
};

const coll = [dayRange, dayRange2, dayRange3]

const coll2 = [slotRange, slotRange2]


export const Route = createFileRoute("/_authed/dashboard/test-page")({
  component: RouteComponent,
});

function RouteComponent() {
  const [mode, setMode] = useState<SlotType>("day");
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-2">
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
      </div>

      <Booker
        type={mode}
        schedule={mode == "day" ? coll: coll2}
      >
        <BookerStep name="unit_select">
          <BookingUnitSelect />
        </BookerStep>

        <BookerStep name="calendar">
          <BookingCalendar />
        </BookerStep>

        <BookerStep name="time_picker">
          <BookingTimeSelect />
        </BookerStep>
  
        <BookerStep name="view_booking">
          <div className="py-12 px-6 text-center text-sm text-muted-foreground">
            View goes goes here
          </div>
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
