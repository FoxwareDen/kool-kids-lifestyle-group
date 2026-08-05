import React, { useState, useEffect } from "react";
import { create } from "zustand";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { addDays, differenceInCalendarDays, eachDayOfInterval, endOfDay, format, parseISO, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { ClientOnly } from "../client-only";
import type { AvailableRange, Booking, Unit } from "#/lib/system";
import { Check, Clock, Users } from "lucide-react";
import { isWithinInterval } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export type SlotType = "day" | "slot";
export type StepName = "calendar" | "unit_select" | "time_picker" | "view_booking";

export const steps: Record<SlotType, { setCount: number; steps: StepName[] }> = {
  day: {
    setCount: 3,
    steps: ["unit_select", "calendar", "view_booking"],
  },
  slot: {
    setCount: 4,
    steps: ["unit_select", "calendar", "time_picker", "view_booking"],
  },
};

interface BookerState {
  booking: Booking;
  schedule: AvailableRange[];
  filteredSchedules: AvailableRange[];
  selectedSchedule: null;
  selectedUnit?: Unit;
  type: SlotType;
  sepCounter: number;
  date: Date | undefined;
  duration: number;
  onSubmit?: (booking: Booking) => void;

  setSlot: (type: SlotType) => void;
  setDate: (date: Date | undefined) => void;
  setDuration: (days: number) => void;
  step: (direction: "forward" | "back") => void;
  setUnit: (unit: Unit) => void;
  populateSchedule: (schedule: AvailableRange[]) => void;
  filterByUnit: (unit: Unit) => void;
  setSelectedSchedule: (slot: AvailableRange) => void;
  setBooking: (booking: Booking) => void;
  setOnSubmit: (fn: (booking: Booking) => void) => void;
}

export const useBookerStore = create<BookerState>((set) => ({
  booking: {
    calendar_ref: "",
    date: "",
    duration: 0,
    start_time: "",
    end_time: "",
    unit_id: "",
    unit_label: "",
    status: "pending",
    id: ""
  },
  schedule: [],
  filteredSchedules: [],
  selectedSchedule: null,
  type: "slot",
  sepCounter: 0,
  date: new Date(),
  duration: 1,

  setDate: (date) => set({ date }),
  setSlot: (type) => set({ type, sepCounter: 0 }),
  setDuration: (duration) => set({ duration }),

  step: (direction) =>
    set((state) => {
      const maxSteps = steps[state.type].setCount;
      const delta = direction === "forward" ? 1 : -1;
      const nextCounter = state.sepCounter + delta;
      if (nextCounter < 0 || nextCounter >= maxSteps) return state;
      return { sepCounter: nextCounter };
    }),

  setUnit: (unit) => set({ selectedUnit: unit }),
  populateSchedule: (schedule) => set((prev) => ({ ...prev, schedule })),
  filterByUnit: (unit: Unit) => set(prev => ({
    ...prev,
    filteredSchedules: prev.schedule.filter(sc => sc.units.flatMap(u => u.id).includes(unit.id))
  })),
  setSelectedSchedule: () => {},
  setBooking: (booking: Booking) => set(prev => ({ ...prev, booking })),
  setOnSubmit: (fn) => set({ onSubmit: fn }),
}));

export function Booker({
  schedule,
  type = "slot",
  className,
  children,
  onSubmit,
}: {
  schedule: AvailableRange[];
  type?: SlotType;
  className?: string;
  children: React.ReactNode;
  onSubmit?: (booking: Booking) => void;
}) {
  const { setSlot, populateSchedule, setOnSubmit } = useBookerStore();

  useEffect(() => {
    setSlot(type);
    populateSchedule(schedule);
    if (onSubmit) setOnSubmit(onSubmit);
  }, [type, setSlot]);

  return (
    <div className={cn("w-fit rounded-xl border bg-card p-4 text-card-foreground shadow-sm flex flex-col gap-4", className)}>
      {children}
    </div>
  );
}

export function BookerStep({
  name,
  children,
  className,
}: {
  name: StepName;
  children: React.ReactNode;
  className?: string;
}) {
  const sepCounter = useBookerStore((s) => s.sepCounter);
  const type = useBookerStore((s) => s.type);
  const currentStepName = steps[type].steps[sepCounter];

  if (currentStepName !== name) return null;

  return (
    <div className={cn("w-full flex justify-center items-center min-h-96 min-w-96", className)}>
      {name === "calendar" ? <ClientOnly>{children}</ClientOnly> : children}
    </div>
  );
}

export function BookingUnitSelect() {
  const { booking, schedule, type, selectedUnit, filterByUnit, setBooking, setUnit } = useBookerStore();

  const units = schedule.flatMap((sc) => sc.units)
    .reduce((prev: Unit[], cur: Unit) => {
      if (prev.flatMap(p => p.id).includes(cur.id)) return prev;
      return [...prev, cur];
    }, []);

  const filterUnits = (unit: Unit) => {
    filterByUnit(unit);
    setUnit(unit);
    setBooking({ ...booking, unit_id: unit.id, unit_label: unit.label });
  };

  return (
    <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
      {units.map((unit) => {
        const isSelected = selectedUnit?.id === unit.id;
        return (
          <button
            key={unit.id}
            type="button"
            onClick={() => filterUnits(unit)}
            className={cn(
              "relative flex flex-col items-start justify-between rounded-lg border p-3.5 text-left transition-all hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected ? "border-primary bg-primary/5 text-foreground shadow-xs" : "border-border bg-card text-card-foreground"
            )}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span className="font-medium text-sm">{unit.label}</span>
              {isSelected && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>Cap: {unit.capacity}</span>
              </div>
              {unit.duration > 0 && type !== "day" && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{unit.duration} mins</span>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function BookingCalendar({ className }: { className?: string }) {
  const { type, date, booking, filteredSchedules, setDate, setDuration, setBooking } = useBookerStore();

  const [currentRange, setCurrentRange] = useState<DateRange | undefined>({ from: undefined, to: undefined });

  useEffect(() => {
    setCurrentRange({ from: undefined, to: undefined });
  }, [type]);

  const availableDates: { from: Date; to: Date }[] = filteredSchedules.flatMap(r => ({
    from: startOfDay(parseISO(r.start_date)),
    to: endOfDay(parseISO(r.end_date)),
  }));

  const handleChange = (date: Date) => {
    setDate(date);
    const formatted = format(date, 'yyyy-MM-dd');
    const range = filteredSchedules.find((fs) => formatted >= fs.start_date && formatted <= fs.end_date);
    if (!range) return;
    setBooking({
      ...booking,
      calendar_ref: range.calendar_ref,
      date: formatted,
      duration: 1,
      start_time: range.start_time,
      end_time: range.end_time,
    });
  };

  const handleRangeChange = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) {
      setCurrentRange(range);
      return;
    }

    const days = eachDayOfInterval({ start: range.from, end: range.to });
    const spansDisabled = days.some((day) =>
      !availableDates.some(t => isWithinInterval(day, { start: t.from, end: t.to }))
    );

    if (spansDisabled) {
      setCurrentRange({ from: range.to, to: undefined });
      return;
    }

    setCurrentRange(range);

    const amount = differenceInCalendarDays(range.to, range.from) + 1;
    if (amount <= 0) return;

    const fromFormatted = format(range.from, 'yyyy-MM-dd');
    const matchingRange = filteredSchedules.find((fs) => fromFormatted >= fs.start_date && fromFormatted <= fs.end_date);
    if (!matchingRange) return;

    setDate(range.from);
    setDuration(amount);
    setBooking({
      ...booking,
      calendar_ref: matchingRange.calendar_ref,
      date: fromFormatted,
      duration: amount,
      start_time: matchingRange.start_time,
      end_time: matchingRange.end_time,
    });
  };

  if (type === "slot") {
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleChange}
        className={cn("rounded-md border w-full", className)}
        required
        disabled={(date: Date) => !availableDates.some(t => isWithinInterval(date, { start: t.from, end: t.to }))}
      />
    );
  }

  return (
    <Calendar
      mode="range"
      className={cn("rounded-md border w-full", className)}
      selected={currentRange}
      onSelect={handleRangeChange}
      disabled={(date: Date) => !availableDates.some(t => isWithinInterval(date, { start: t.from, end: t.to }))}
    />
  );
}

export function BookingTimeSelect() {
  const filteredSchedules = useBookerStore((s) => s.filteredSchedules);
  const selectedUnit = useBookerStore((s) => s.selectedUnit);
  const date = useBookerStore((s) => s.date);

  return (
    <div className="w-full space-y-3">
      
    </div>
  );
}

export function BookingView() {
  const { booking, type } = useBookerStore();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Unit</span>
          <Badge variant="secondary">{booking.unit_label}</Badge>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{type === "day" ? "Check-in" : "Date"}</span>
          <span className="text-sm font-medium">{format(parseISO(booking.date), "EEE, MMM d yyyy")}</span>
        </div>

        {type === "day" ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Check-out</span>
              <span className="text-sm font-medium">
                {format(addDays(parseISO(booking.date), booking.duration), "EEE, MMM d yyyy")}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Duration</span>
              <Badge>{booking.duration} {booking.duration === 1 ? "night" : "nights"}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Check-in time</span>
              <span className="text-sm font-medium">{booking.start_time}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Check-out time</span>
              <span className="text-sm font-medium">{booking.end_time}</span>
            </div>
          </>
        ) : (
          <>
            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Start time</span>
              <span className="text-sm font-medium">{booking.start_time}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">End time</span>
              <span className="text-sm font-medium">{booking.end_time}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function BookingPagingButtonGroup({ className, buttonClassName }: { className?: string; buttonClassName?: string }) {
  const sepCounter = useBookerStore((s) => s.sepCounter);
  const type = useBookerStore((s) => s.type);
  const step = useBookerStore((s) => s.step);
  const selectedUnit = useBookerStore((s) => s.selectedUnit);
  const date = useBookerStore((s) => s.date);
  const duration = useBookerStore((s) => s.duration);
  const booking = useBookerStore((s) => s.booking);
  const onSubmit = useBookerStore((s) => s.onSubmit);

  const isLastStep = sepCounter >= steps[type].setCount - 1;
  const currentStep = steps[type].steps[sepCounter];

  const canProceed = (() => {
    switch (currentStep) {
      case "unit_select": return !!selectedUnit;
      case "calendar": return !!date && duration > 0;
      case "time_picker": return false;
      case "view_booking": return true;
      default: return false;
    }
  })();

  return (
    <div className={cn("flex items-center justify-between gap-3 pt-3 border-t w-full", className)}>
      <Button
        disabled={sepCounter === 0}
        onClick={() => step("back")}
        className={cn("px-4", buttonClassName)}
        variant="outline"
        size="sm"
      >
        Back
      </Button>

      {isLastStep ? (
        <Button
          onClick={() => onSubmit?.(booking)}
          className={cn("px-4", buttonClassName)}
          size="sm"
        >
          Confirm Booking
        </Button>
      ) : (
        <Button
          disabled={!canProceed}
          onClick={() => step("forward")}
          className={cn("px-4", buttonClassName)}
          size="sm"
        >
          Next
        </Button>
      )}
    </div>
  );
}