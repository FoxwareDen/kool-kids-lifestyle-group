import { useState, useMemo } from "react";
import { format, parseISO, differenceInDays, differenceInMinutes, addMinutes, isWithinInterval } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AvailableRange, Booking } from "#/lib/system";

interface RangeBookingSelectProps {
  range: AvailableRange;
  existingBookings?: Booking[];
  onBookingCreate: (booking: Booking) => void;
}

export default function RangeBookingSelect({
  range,
  existingBookings = [],
  onBookingCreate,
}: RangeBookingSelectProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(undefined);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [selectedStartTime, setSelectedStartTime] = useState<string>("");

  // Parse range
  const rangeStart = parseISO(range.start_date);
  const rangeEnd = parseISO(range.end_date || range.start_date);
  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const units = range.units;

  // ---------- Helper: is date within range ----------
  const isDateInRange = (date: Date) =>
    date >= rangeStart && date <= rangeEnd;

  // ---------- For day bookings ----------
  // (unchanged – uses date range picker)

  // ---------- For slot bookings ----------
  // Get the selected unit object
  const selectedUnit = useMemo(
    () => units.find((u) => u.id === selectedUnitId),
    [units, selectedUnitId]
  );

  // Compute available start times for the selected unit on the selected date
  const availableStartTimes = useMemo(() => {
    if (range.type !== "slot" || !selectedDate || !selectedUnit) return [];

    const unitDuration = selectedUnit.duration;
    if (unitDuration <= 0) return []; // invalid

    const dayStart = parseISO(`${dateStr}T${range.start_time}`);
    const dayEnd = parseISO(`${dateStr}T${range.end_time}`);

    // Generate all possible start times (every 15 minutes) that allow a full slot
    const startTimes: string[] = [];
    let current = dayStart;
    while (current <= dayEnd) {
      const slotEnd = addMinutes(current, unitDuration);
      if (slotEnd <= dayEnd) {
        // Check if this slot overlaps any existing booking for this unit
        const conflicts = existingBookings.filter(
          (b) =>
            b.unit_id === selectedUnit.id &&
            b.date === dateStr &&
            b.status !== "cancelled"
        );
        const isBlocked = conflicts.some((b) => {
          const bStart = parseISO(`${dateStr}T${b.start_time}`);
          const bEnd = parseISO(`${dateStr}T${b.end_time}`);
          return current < bEnd && slotEnd > bStart;
        });
        if (!isBlocked) {
          startTimes.push(format(current, "HH:mm"));
        }
      }
      current = addMinutes(current, 15); // 15‑minute granularity
    }
    return startTimes;
  }, [range.type, selectedDate, selectedUnit, dateStr, existingBookings, range.start_time, range.end_time]);

  // ---------- Validation ----------
  const canBook =
    selectedDate &&
    selectedUnitId &&
    (range.type === "day"
      ? true // end date is optional; if not set, it's a single day
      : selectedStartTime && selectedUnit && selectedUnit.duration > 0);

  const handleBook = () => {
    if (!canBook) return;
    const unit = units.find((u) => u.id === selectedUnitId);
    if (!unit) return;

    let st: string, et: string, dur: number;
    if (range.type === "day") {
      st = range.start_time;
      et = range.end_time;
      const endDate = selectedEndDate || selectedDate!;
      dur = differenceInDays(endDate, selectedDate!) + 1;
    } else {
      st = selectedStartTime;
      dur = unit.duration;
      const start = parseISO(`${dateStr}T${st}`);
      const end = addMinutes(start, dur);
      et = format(end, "HH:mm");
    }

    const booking: Booking = {
      id: crypto.randomUUID?.() ?? Math.random().toString(36),
      date: dateStr,
      start_time: st,
      end_time: et,
      duration: dur,
      unit_label: unit.label,
      unit_id: unit.id,
      status: "pending",
    };

    onBookingCreate(booking);
    // Reset
    setSelectedDate(undefined);
    setSelectedEndDate(undefined);
    setSelectedUnitId("");
    setSelectedStartTime("");
  };

  // ---------- Render ----------
  return (
    <div className="space-y-4">
      {/* Date picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[280px] justify-start">
            {range.type === "day"
              ? selectedDate
                ? selectedEndDate
                  ? `${format(selectedDate, "PPP")} – ${format(selectedEndDate, "PPP")}`
                  : format(selectedDate, "PPP")
                : "Pick a date range"
              : selectedDate
              ? format(selectedDate, "PPP")
              : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode={range.type === "day" ? "range" : "single"}
            selected={
              range.type === "day"
                ? { from: selectedDate, to: selectedEndDate }
                : selectedDate
            }
            onSelect={(rangeOrDate) => {
              if (range.type === "day") {
                const r = rangeOrDate as { from?: Date; to?: Date };
                setSelectedDate(r?.from);
                setSelectedEndDate(r?.to);
              } else {
                setSelectedDate(rangeOrDate as Date);
              }
              setSelectedUnitId("");
              setSelectedStartTime("");
            }}
            disabled={(date) => !isDateInRange(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Unit selection */}
      {units.length > 0 && (
        <Select value={selectedUnitId} onValueChange={(id) => {
          setSelectedUnitId(id);
          setSelectedStartTime("");
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            {units.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.label} ({u.duration > 0 ? `${u.duration} min` : "flexible"})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Start time selection (slot only) */}
      {range.type === "slot" && selectedDate && selectedUnit && availableStartTimes.length > 0 && (
        <Select value={selectedStartTime} onValueChange={setSelectedStartTime}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Start time" />
          </SelectTrigger>
          <SelectContent>
            {availableStartTimes.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {range.type === "slot" && selectedDate && selectedUnit && availableStartTimes.length === 0 && (
        <p className="text-sm text-muted-foreground">No available slots for this unit on this date.</p>
      )}

      <Button onClick={handleBook} disabled={!canBook}>
        Book
      </Button>
    </div>
  );
}