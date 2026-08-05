import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { AvailableRange, Booking, SlotType, Unit } from "#/lib/system";
import { Booker, BookerStep, BookingCalendar, BookingPagingButtonGroup, BookingUnitSelect } from "#/components/booking/calendar";

// ----- MOCK UNITS -----
const units: Unit[] = [
  { id: "u1", label: "Room A", capacity: 1, duration: 60 },  // 1 hour slots
  { id: "u2", label: "Room B", capacity: 2, duration: 90 },  // 1.5 hour slots
];

// ----- DAY RANGE -----
const dayRange: AvailableRange = {
  start_date: "2026-08-01",
  end_date: "2026-08-10",
  start_time: "14:00",
  end_time: "10:00",
  type: "day",
  units,
};

// ----- SLOT RANGE -----
const slotRange: AvailableRange = {
  start_date: "2026-08-01",
  end_date: "2026-08-10",
  start_time: "09:00",
  end_time: "17:00",
  type: "slot",
  units,
};

// ----- EXISTING BOOKINGS (block some slots) -----
const existingBookings: Booking[] = [
  {
    id: "b1",
    date: "2026-08-02",
    start_time: "10:00",
    end_time: "11:30",
    duration: 90,
    unit_label: "Room A",
    unit_id: "u1",
    status: "pending",
  },
  {
    id: "b2",
    date: "2026-08-02",
    start_time: "14:00",
    end_time: "15:30",
    duration: 90,
    unit_label: "Room B",
    unit_id: "u2",
    status: "pending",
  },
];

export const Route = createFileRoute("/_authed/dashboard/test-page")({
  component: RouteComponent,
});

function RouteComponent() {
  const [mode, setMode] = useState<SlotType>("day");
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);

  const handleBooking = (booking: Booking) => {
    console.log("Booking created:", booking);
    setLastBooking(booking);
  };

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
      >
        <BookerStep name="unit_select">
          <BookingUnitSelect />
        </BookerStep>

        <BookerStep name="calendar">
          <BookingCalendar />
        </BookerStep>

        <BookerStep name="time_picker">
          <div className="py-12 px-6 text-center text-sm text-muted-foreground">
            Time slots grid goes here
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
