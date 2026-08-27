import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { generateAvailableSlots, type AvailableRange, type Booking, type Calendar, type SlotType, type Unit } from "#/lib/system";
import { Booker, BookerStep, BookingCalendar, BookingPagingButtonGroup, BookingTimeSelect, BookingUnitSelect, BookingView } from "#/components/booking/calendar";
import type { Language } from "#/lib/experiences";
import { fetchBookingsByScheduleId, fetchCalendarScheduleByExperiencesIds, fetchCalendarSchedules, toCalendar } from "#/lib/booking";
import MediaModel from "#/components/mediaModel";
import { getAssets, type Asset } from "#/lib/pocketbase";

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
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen(prev=> !prev);
  }

  return (
    <div className="p-6 space-y-6">
        <button
          className={`px-4 py-2 rounded ${isOpen ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={toggleOpen}
        >
          Day Mode
        </button>
        <MediaModel open={isOpen} toggleOpen={toggleOpen}   onClick={()=>{}} />
    </div>
  );
}