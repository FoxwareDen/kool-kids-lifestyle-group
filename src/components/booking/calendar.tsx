import React, { useState, useEffect } from "react";
import { create } from "zustand";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { differenceInCalendarDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { ClientOnly } from "../client-only";
import type { AvailableRange, Unit } from "#/lib/system";
import { Check, Clock, Users } from "lucide-react";

export type SlotType = "day" | "slot";
export type StepName = "calendar" | "unit_select" | "time_picker";

export const steps: Record<SlotType, { setCount: number; steps: StepName[] }> = {
  day: {
    setCount: 2,
    steps: ["unit_select", "calendar"],
  },
  slot: {
    setCount: 3,
    steps: ["unit_select", "calendar", "time_picker"],
  },
};

interface BookerState {
  schedule: AvailableRange[];
  filteredSchedules: AvailableRange[];
  selectedUnit?: Unit;
  type: SlotType;
  sepCounter: number;
  date: Date | undefined;
  duration: number;

  setSlot: (type: SlotType) => void;
  setDate: (date: Date | undefined) => void;
  setDuration: (days: number) => void;

  step: (direction: "forward" | "back") => void;

  setUnit: (unit: Unit) => void;
  populateSchedule: (schedule: AvailableRange[]) => void;
}

export const useBookerStore = create<BookerState>((set) => ({
  schedule: [],
  filteredSchedules: [],
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
  populateSchedule: (schedule) => set((prev)=>({...prev, schedule}))

}));

export function Booker({
  schedule,
  type = "slot",
  className,
  children,
}: {
  schedule: AvailableRange[]
  type?: SlotType;
  className?: string;
  children: React.ReactNode;
}) {
  const {setSlot, } = useBookerStore();

  useEffect(() => {
    setSlot(type);
  }, [type, setSlot]);

  return (
    <div
      className={cn(
        "w-fit rounded-xl border bg-card p-4 text-card-foreground shadow-sm flex flex-col gap-4",
        className
      )}
    >
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
    <div
      className={cn(
        "w-full flex justify-center items-center min-h-96 min-w-96",
        className
      )}
    >
      {name === "calendar" ? <ClientOnly>{children}</ClientOnly> : children}
    </div>
  );
}

export function BookingUnitSelect() {
  const schedule = useBookerStore((s) => s.schedule);
  const type = useBookerStore((s) => s.type);
  const selectedUnit = useBookerStore((s) => s.selectedUnit);
  const setUnit = useBookerStore((s) => s.setUnit);

  const units = schedule.flatMap((sc) => sc.units);

  return (
    <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
      {units.map((unit) => {
        const isSelected = selectedUnit?.id === unit.id;

        return (
          <button
            key={unit.id}
            type="button"
            onClick={() => setUnit(unit)}
            className={cn(
              "relative flex flex-col items-start justify-between rounded-lg border p-3.5 text-left transition-all hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected
                ? "border-primary bg-primary/5 text-foreground shadow-xs"
                : "border-border bg-card text-card-foreground"
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
  const type = useBookerStore((s) => s.type);
  const date = useBookerStore((s) => s.date);
  const setDate = useBookerStore((s) => s.setDate);
  const setDuration = useBookerStore((s) => s.setDuration);

  const [currentRange, setCurrentRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    setCurrentRange({ from: undefined, to: undefined });
  }, [type]);

  const handleRangeChange = (range: DateRange | undefined) => {
    setCurrentRange(range);
    if (!range?.from || !range.to) return;

    const amount = differenceInCalendarDays(range.to, range.from) + 1;
    if (amount <= 0) return;

    setDate(range.from);
    setDuration(amount);
  };

  if (type === "slot") {
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className={cn("rounded-md border p-3 w-full", className)}
        required
      />
    );
  }

  return (
    <Calendar
      mode="range"
      className={cn("rounded-md border p-3 w-full", className)}
      selected={currentRange}
      onSelect={handleRangeChange}
    />
  );
}

export function BookingPagingButtonGroup({
  className,
  buttonClassName,
}: {
  className?: string;
  buttonClassName?: string;
}) {
  const sepCounter = useBookerStore((s) => s.sepCounter);
  const type = useBookerStore((s) => s.type);
  const step = useBookerStore((s) => s.step);

  const isLastStep = sepCounter >= steps[type].setCount - 1;

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
      <Button
        disabled={isLastStep}
        onClick={() => step("forward")}
        className={cn("px-4", buttonClassName)}
        size="sm"
      >
        Next
      </Button>
    </div>
  );
}
