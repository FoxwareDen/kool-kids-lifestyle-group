import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { AvailableRange, Booking, Calendar, Unit } from "./system"
import { generateAvailableSlots} from "./system"


// ─── Shared fixtures ──────────────────────────────────────────────────────────

const UNIT_A: Unit = { id: "unit_a", label: "Unit A", capacity: 1, duration: 60 };
const UNIT_B: Unit = { id: "unit_b", label: "Unit B", capacity: 1, duration: 60 };

/** A Mon–Fri slot-based calendar for a single week */
const slotCalendar = (overrides: Partial<Calendar> = {}): Calendar => ({
  start_date: "2026-08-03", // Monday
  end_date: "2026-08-07",   // Friday
  start_time: "09:00",
  end_time: "17:00",
  booking_type: "slot",
  days_of_weeK: [1, 2, 3, 4, 5], // Mon–Fri
  buffer_minutes: 0,
  units: [UNIT_A],
  ...overrides,
});

/** A Mon–Fri day-based calendar across two weeks, overnight end_time (checkin 14:00, checkout 11:00 next day) */
const dayCalendar = (overrides: Partial<Calendar> = {}): Calendar => ({
  start_date: "2026-08-03",
  end_date: "2026-08-14",
  start_time: "14:00",
  end_time: "11:00",
  booking_type: "day",
  days_of_weeK: [0, 1, 2, 3, 4, 5, 6],
  buffer_minutes: 0,
  units: [UNIT_A],
  ...overrides,
});

const noBookings: Booking[] = [];

// ─── Fake Timers ──────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 7, 3)); // Aug 3 2026
});

afterEach(() => {
  vi.useRealTimers();
});

// ─── Helper ───────────────────────────────────────────────────────────────────

function booking(overrides: Partial<Booking> & Pick<Booking, "date" | "start_time" | "end_time">): Booking {
  return {
    id: "bk_" + Math.random().toString(36).slice(2),
    duration: 60,
    unit_label: UNIT_A.label,
    unit_id: UNIT_A.id,
    status: "pending",
    ...overrides,
  };
}

function dayBooking(overrides: Partial<Booking> & Pick<Booking, "date" | "duration">): Booking {
  return {
    id: "bk_" + Math.random().toString(36).slice(2),
    start_time: "14:00",
    end_time: "11:00",
    unit_label: UNIT_A.label,
    unit_id: UNIT_A.id,
    status: "pending",
    ...overrides,
  };
}

// ─── Slot mode ────────────────────────────────────────────────────────────────

describe("slot mode – no bookings", () => {
  it("returns one full-day range per operating day", () => {
    const result = generateAvailableSlots(slotCalendar(), noBookings, { minAdvanceDays: 0 });

    // 5 operating days → 5 ranges
    expect(result).toHaveLength(5);
    result.forEach((r) => {
      expect(r.type).toBe("slot");
      expect(r.start_time).toBe("09:00");
      expect(r.end_time).toBe("17:00");
      expect(r.start_date).toBe(r.end_date);
    });
  });

  it("each range contains the correct unit", () => {
    const result = generateAvailableSlots(slotCalendar(), noBookings, { minAdvanceDays: 0 });
    result.forEach((r) => {
      expect(r.units).toEqual([UNIT_A]);
    });
  });

  it("ranges are sorted chronologically", () => {
    const result = generateAvailableSlots(slotCalendar(), noBookings, { minAdvanceDays: 0 });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].start_date >= result[i - 1].start_date).toBe(true);
    }
  });
});

describe("slot mode – single booking", () => {
  it("splits the day into two windows around a mid-day booking", () => {
    const bk = booking({ date: "2026-08-03", start_time: "11:00", end_time: "12:00" });
    const result = generateAvailableSlots(slotCalendar(), [bk], { minAdvanceDays: 0 });

    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday).toHaveLength(2);

    const [before, after] = monday.sort((a, b) => a.start_time.localeCompare(b.start_time));
    expect(before.start_time).toBe("09:00");
    expect(before.end_time).toBe("11:00");
    expect(after.start_time).toBe("12:00");
    expect(after.end_time).toBe("17:00");
  });

  it("produces no range before a booking that starts at open", () => {
    const bk = booking({ date: "2026-08-03", start_time: "09:00", end_time: "10:00" });
    const result = generateAvailableSlots(slotCalendar(), [bk], { minAdvanceDays: 0 });

    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday).toHaveLength(1);
    expect(monday[0].start_time).toBe("10:00");
    expect(monday[0].end_time).toBe("17:00");
  });

  it("produces no range after a booking that ends at close", () => {
    const bk = booking({ date: "2026-08-03", start_time: "16:00", end_time: "17:00" });
    const result = generateAvailableSlots(slotCalendar(), [bk], { minAdvanceDays: 0 });

    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday).toHaveLength(1);
    expect(monday[0].start_time).toBe("09:00");
    expect(monday[0].end_time).toBe("16:00");
  });

  it("produces no ranges when a booking spans the entire operating day", () => {
    const bk = booking({ date: "2026-08-03", start_time: "09:00", end_time: "17:00" });
    const result = generateAvailableSlots(slotCalendar(), [bk], { minAdvanceDays: 0 });

    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday).toHaveLength(0);
  });

  it("ignores cancelled bookings", () => {
    const bk = booking({ date: "2026-08-03", start_time: "11:00", end_time: "12:00", status: "cancelled" });
    const result = generateAvailableSlots(slotCalendar(), [bk], { minAdvanceDays: 0 });

    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday).toHaveLength(1);
    expect(monday[0].start_time).toBe("09:00");
    expect(monday[0].end_time).toBe("17:00");
  });

  it("does not affect other days when booking is on monday only", () => {
    const bk = booking({ date: "2026-08-03", start_time: "09:00", end_time: "17:00" });
    const result = generateAvailableSlots(slotCalendar(), [bk], { minAdvanceDays: 0 });

    const otherDays = result.filter((r) => r.start_date !== "2026-08-03");
    expect(otherDays).toHaveLength(4);
    otherDays.forEach((r) => {
      expect(r.start_time).toBe("09:00");
      expect(r.end_time).toBe("17:00");
    });
  });
});

describe("slot mode – buffer padding", () => {
  it("pads before and after a booking with the configured buffer", () => {
    const bk = booking({ date: "2026-08-03", start_time: "11:00", end_time: "12:00" });
    const cal = slotCalendar({ buffer_minutes: 30 });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });

    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday).toHaveLength(2);

    const [before, after] = monday.sort((a, b) => a.start_time.localeCompare(b.start_time));
    expect(before.end_time).toBe("10:30");
    expect(after.start_time).toBe("12:30");
  });

  it("eliminates a range that buffer consumes entirely", () => {
    const bk = booking({ date: "2026-08-03", start_time: "09:15", end_time: "09:45" });
    const cal = slotCalendar({ buffer_minutes: 30 });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });

    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday.every((r) => r.start_time >= "09:00")).toBe(true);
    expect(monday.some((r) => r.start_time < "09:00")).toBe(false);
  });

  it("buffer does not bleed past operating close", () => {
    const bk = booking({ date: "2026-08-03", start_time: "16:45", end_time: "17:00" });
    const cal = slotCalendar({ buffer_minutes: 30 });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });

    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday.every((r) => r.end_time <= "17:00")).toBe(true);
  });

  it("buffer does not bleed before operating open", () => {
    const bk = booking({ date: "2026-08-03", start_time: "09:00", end_time: "09:30" });
    const cal = slotCalendar({ buffer_minutes: 30 });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });

    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday.every((r) => r.start_time >= "09:00")).toBe(true);
  });
});

describe("slot mode – multiple bookings on the same day", () => {
  it("carves multiple windows from multiple bookings", () => {
    const bk1 = booking({ date: "2026-08-03", start_time: "09:30", end_time: "10:30" });
    const bk2 = booking({ date: "2026-08-03", start_time: "13:00", end_time: "14:00" });
    const result = generateAvailableSlots(slotCalendar(), [bk1, bk2], { minAdvanceDays: 0 });

    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday).toHaveLength(3);

    const sorted = monday.sort((a, b) => a.start_time.localeCompare(b.start_time));
    expect(sorted[0]).toMatchObject({ start_time: "09:00", end_time: "09:30" });
    expect(sorted[1]).toMatchObject({ start_time: "10:30", end_time: "13:00" });
    expect(sorted[2]).toMatchObject({ start_time: "14:00", end_time: "17:00" });
  });

  it("handles back-to-back bookings with no gap", () => {
    const bk1 = booking({ date: "2026-08-03", start_time: "10:00", end_time: "11:00" });
    const bk2 = booking({ date: "2026-08-03", start_time: "11:00", end_time: "12:00" });
    const result = generateAvailableSlots(slotCalendar(), [bk1, bk2], { minAdvanceDays: 0 });

    const monday = result.filter((r) => r.start_date === "2026-08-03");
    const sorted = monday.sort((a, b) => a.start_time.localeCompare(b.start_time));
    expect(sorted[0]).toMatchObject({ start_time: "09:00", end_time: "10:00" });
    expect(sorted[sorted.length - 1]).toMatchObject({ start_time: "12:00", end_time: "17:00" });
    expect(monday.some((r) => r.start_time === r.end_time)).toBe(false);
  });

  it("handles three bookings leaving two gaps", () => {
    const bk1 = booking({ date: "2026-08-03", start_time: "09:00", end_time: "10:00" });
    const bk2 = booking({ date: "2026-08-03", start_time: "11:00", end_time: "13:00" });
    const bk3 = booking({ date: "2026-08-03", start_time: "15:00", end_time: "17:00" });
    const result = generateAvailableSlots(slotCalendar(), [bk1, bk2, bk3], { minAdvanceDays: 0 });

    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday).toHaveLength(2);
    const sorted = monday.sort((a, b) => a.start_time.localeCompare(b.start_time));
    expect(sorted[0]).toMatchObject({ start_time: "10:00", end_time: "11:00" });
    expect(sorted[1]).toMatchObject({ start_time: "13:00", end_time: "15:00" });
  });
});

describe("slot mode – multiple units", () => {
  it("tracks availability independently per unit", () => {
    const cal = slotCalendar({ units: [UNIT_A, UNIT_B] });
    const bk = booking({ date: "2026-08-03", start_time: "09:00", end_time: "17:00", unit_id: UNIT_A.id, unit_label: UNIT_A.label });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });

    const mondayWithB = result.filter(
      (r) => r.start_date === "2026-08-03" && r.units.some((u) => u.id === UNIT_B.id)
    );
    expect(mondayWithB.length).toBeGreaterThan(0);
  });

  it("booking on unit A does not affect unit B availability", () => {
    const cal = slotCalendar({ units: [UNIT_A, UNIT_B] });
    const bk = booking({ date: "2026-08-03", start_time: "11:00", end_time: "12:00", unit_id: UNIT_A.id, unit_label: UNIT_A.label });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });

    const mondayFullB = result.find(
      (r) => r.start_date === "2026-08-03" && r.start_time === "09:00" && r.end_time === "17:00" && r.units.some((u) => u.id === UNIT_B.id)
    );
    expect(mondayFullB).toBeDefined();
  });
});

describe("slot mode – days of week filtering", () => {
  it("excludes dates that fall on non-operating days", () => {
    const cal = slotCalendar({ end_date: "2026-08-09" });
    const result = generateAvailableSlots(cal, noBookings, { minAdvanceDays: 0 });

    const dates = result.map((r) => r.start_date);
    expect(dates).not.toContain("2026-08-08"); // Saturday
    expect(dates).not.toContain("2026-08-09"); // Sunday
  });

  it("only includes the specified days of week", () => {
    const cal = slotCalendar({ days_of_weeK: [1, 3], end_date: "2026-08-09" }); // Mon + Wed only
    const result = generateAvailableSlots(cal, noBookings, { minAdvanceDays: 0 });

    const dates = result.map((r) => r.start_date);
    expect(dates).toContain("2026-08-03"); // Monday
    expect(dates).toContain("2026-08-05"); // Wednesday
    expect(dates).not.toContain("2026-08-04"); // Tuesday
    expect(dates).not.toContain("2026-08-06"); // Thursday
    expect(dates).not.toContain("2026-08-07"); // Friday
  });
});

describe("slot mode – minAdvanceDays", () => {
  it("excludes dates before the advance lead time", () => {
    const result = generateAvailableSlots(slotCalendar(), noBookings, { minAdvanceDays: 3 });
    const dates = result.map((r) => r.start_date);
    expect(dates).not.toContain("2026-08-03");
    expect(dates).not.toContain("2026-08-04");
    expect(dates).not.toContain("2026-08-05");
    expect(dates).toContain("2026-08-06");
    expect(dates).toContain("2026-08-07");
  });

  it("minAdvanceDays of 0 includes today", () => {
    const result = generateAvailableSlots(slotCalendar(), noBookings, { minAdvanceDays: 0 });
    const dates = result.map((r) => r.start_date);
    expect(dates).toContain("2026-08-03");
  });
});

// ─── Day mode ─────────────────────────────────────────────────────────────────

describe("day mode – no bookings", () => {
  it("returns a single contiguous block spanning the full horizon", () => {
    const result = generateAvailableSlots(dayCalendar(), noBookings, { minAdvanceDays: 0 });
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("day");
    expect(result[0].start_date).toBe("2026-08-03");
    expect(result[0].end_date).toBe("2026-08-14");
    expect(result[0].start_time).toBe("14:00");
    expect(result[0].end_time).toBe("11:00");
  });
});

describe("day mode – single booking", () => {
  it("splits the horizon into two blocks around a booked stay", () => {
    const bk = dayBooking({ date: "2026-08-05", duration: 2 });
    const result = generateAvailableSlots(dayCalendar(), [bk], { minAdvanceDays: 0 });

    expect(result).toHaveLength(2);
    const sorted = result.sort((a, b) => a.start_date.localeCompare(b.start_date));
    // Aug 4 is blocked because it's the day before the Aug 5 booking (overnight checkout crosses into Aug 5)
    expect(sorted[0].end_date).toBe("2026-08-03");
    expect(sorted[1].start_date).toBe("2026-08-07");
    expect(sorted[1].start_time).toBe("14:00");
  });

  it("blocks the booked day itself (Aug 5 with duration 1)", () => {
    const bk = dayBooking({ date: "2026-08-05", duration: 1 });
    const result = generateAvailableSlots(dayCalendar(), [bk], { minAdvanceDays: 0 });

    const rangesContainingAug5 = result.filter(
      (r) => r.start_date <= "2026-08-05" && (r.end_date ?? r.start_date) >= "2026-08-05"
    );
    expect(rangesContainingAug5).toHaveLength(0);
  });

  it("blocks the day before a booking due to overnight checkout (end_time crosses midnight)", () => {
    // Booking on Aug 6: checkin 14:00, checkout 11:00 next day (Aug 7)
    // So Aug 5 should NOT be available — a guest checking in Aug 5 would checkout Aug 6,
    // overlapping with the Aug 6 booking checkin
    const bk = dayBooking({ date: "2026-08-06", duration: 1 });
    const result = generateAvailableSlots(dayCalendar(), [bk], { minAdvanceDays: 0 });

    const rangesContainingAug5 = result.filter(
      (r) => r.start_date <= "2026-08-05" && (r.end_date ?? r.start_date) >= "2026-08-05"
    );
    expect(rangesContainingAug5).toHaveLength(0);
  });

  it("does not block two days before a booking", () => {
    const bk = dayBooking({ date: "2026-08-07", duration: 1 });
    const result = generateAvailableSlots(dayCalendar(), [bk], { minAdvanceDays: 0 });

    const rangesContainingAug5 = result.filter(
      (r) => r.start_date <= "2026-08-05" && (r.end_date ?? r.start_date) >= "2026-08-05"
    );
    expect(rangesContainingAug5.length).toBeGreaterThan(0);
  });

  it("allows same-day booking when start time is after previous end_time + buffer", () => {
    const bk = dayBooking({ date: "2026-08-05", duration: 1 });
    const cal = dayCalendar({ buffer_minutes: 60 });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });

    const sameDay = result.find((r) => r.start_date === "2026-08-06");
    expect(sameDay).toBeDefined();
    expect(sameDay!.start_time >= "12:00").toBe(true);
  });

  it("does not allow same-day booking when start time is within buffer of previous end_time", () => {
    const bk = dayBooking({ date: "2026-08-05", duration: 1 });
    const cal = dayCalendar({ buffer_minutes: 60 });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });

    const sameDay = result.find((r) => r.start_date === "2026-08-06");
    if (sameDay) {
      expect(sameDay.start_time < "12:00").toBe(false);
    }
  });

  it("ignores cancelled day bookings", () => {
    const bk = dayBooking({ date: "2026-08-05", duration: 2, status: "cancelled" });
    const result = generateAvailableSlots(dayCalendar(), [bk], { minAdvanceDays: 0 });
    expect(result).toHaveLength(1);
    expect(result[0].start_date).toBe("2026-08-03");
    expect(result[0].end_date).toBe("2026-08-14");
  });

  it("produces no range before a stay starting on the first day of the horizon", () => {
    const bk = dayBooking({ date: "2026-08-03", duration: 2 });
    const result = generateAvailableSlots(dayCalendar(), [bk], { minAdvanceDays: 0 });
    const before = result.filter((r) => r.start_date < "2026-08-03");
    expect(before).toHaveLength(0);
  });

  it("produces no range after a stay ending on the last day of the horizon", () => {
    const bk = dayBooking({ date: "2026-08-13", duration: 1 });
    const result = generateAvailableSlots(dayCalendar(), [bk], { minAdvanceDays: 0 });
    const after = result.filter((r) => r.start_date > "2026-08-14");
    expect(after).toHaveLength(0);
  });

  it("booking at capacity blocks the day, booking below capacity does not", () => {
    const cal = dayCalendar({ units: [{ ...UNIT_A, capacity: 2 }] });
    const bk = dayBooking({ date: "2026-08-05", duration: 1 });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });

    // With capacity 2 and only 1 booking, Aug 5 should still be available
    const rangesContainingAug5 = result.filter(
      (r) => r.start_date <= "2026-08-05" && (r.end_date ?? r.start_date) >= "2026-08-05"
    );
    expect(rangesContainingAug5.length).toBeGreaterThan(0);
  });
});

describe("day mode – multiple bookings", () => {
  it("produces three ranges around two non-adjacent bookings", () => {
    const bk1 = dayBooking({ date: "2026-08-05", duration: 1 });
    const bk2 = dayBooking({ date: "2026-08-10", duration: 1 });
    const result = generateAvailableSlots(dayCalendar(), [bk1, bk2], { minAdvanceDays: 0 });

    expect(result).toHaveLength(3);
    const sorted = result.sort((a, b) => a.start_date.localeCompare(b.start_date));
    expect(sorted[0].end_date).toBe("2026-08-03"); // only Aug 3 is free before bk1 (Aug 4 blocked as day-before bk1's Aug5)
    expect(sorted[1].start_date).toBe("2026-08-06");
    expect(sorted[1].end_date).toBe("2026-08-08"); // Aug 9 blocked as day-before bk2's Aug10
    expect(sorted[2].start_date).toBe("2026-08-11");
  });

  it("adjacent bookings leave no gap between them", () => {
    const bk1 = dayBooking({ date: "2026-08-05", duration: 1 });
    const bk2 = dayBooking({ date: "2026-08-06", duration: 1 }); // immediately after
    const result = generateAvailableSlots(dayCalendar(), [bk1, bk2], { minAdvanceDays: 0 });

    // Aug 6 is the day before bk2 AND the checkout day of bk1 — no gap
    const rangesContainingAug6 = result.filter(
      (r) => r.start_date <= "2026-08-06" && (r.end_date ?? r.start_date) >= "2026-08-06"
    );
    expect(rangesContainingAug6).toHaveLength(0);
  });
});

describe("day mode – buffer", () => {
  it("enforces buffer_minutes between consecutive bookings on the same unit", () => {
    const bk1 = dayBooking({ date: "2026-08-05", duration: 1 });
    const bk2 = dayBooking({ date: "2026-08-06", duration: 1 });
    const cal = dayCalendar({ buffer_minutes: 120 });
    const result = generateAvailableSlots(cal, [bk1, bk2], { minAdvanceDays: 0 });

    const aug6 = result.filter((r) => r.start_date === "2026-08-06");
    aug6.forEach((r) => {
      expect(r.start_time >= "13:00").toBe(true);
    });
  });
});

describe("day mode – multiple units", () => {
  it("tracks availability independently per unit", () => {
    const cal = dayCalendar({ units: [UNIT_A, UNIT_B] });
    const bkA = dayBooking({ date: "2026-08-05", duration: 2, unit_id: UNIT_A.id, unit_label: UNIT_A.label });
    const bkB = dayBooking({ date: "2026-08-09", duration: 2, unit_id: UNIT_B.id, unit_label: UNIT_B.label });
    const result = generateAvailableSlots(cal, [bkA, bkB], { minAdvanceDays: 0 });

    const aRanges = result.filter((r) => r.units.some((u) => u.id === UNIT_A.id));
    const bRanges = result.filter((r) => r.units.some((u) => u.id === UNIT_B.id));

    const aGap = aRanges.find((r) => r.end_date && r.end_date < "2026-08-05");
    expect(aGap).toBeDefined();

    const bGap = bRanges.find((r) => r.start_date >= "2026-08-10");
    expect(bGap).toBeDefined();
  });

  it("booking on unit A does not block unit B on the same day", () => {
    const cal = dayCalendar({ units: [UNIT_A, UNIT_B] });
    const bkA = dayBooking({ date: "2026-08-05", duration: 1, unit_id: UNIT_A.id, unit_label: UNIT_A.label });
    const result = generateAvailableSlots(cal, [bkA], { minAdvanceDays: 0 });

    const bRanges = result.filter((r) => r.units.some((u) => u.id === UNIT_B.id));
    const bContainsAug5 = bRanges.some(
      (r) => r.start_date <= "2026-08-05" && (r.end_date ?? r.start_date) >= "2026-08-05"
    );
    expect(bContainsAug5).toBe(true);
  });
});

describe("day mode – minAdvanceDays", () => {
  it("trims the start of the available block to respect lead time", () => {
    const result = generateAvailableSlots(dayCalendar(), noBookings, { minAdvanceDays: 7 });
    expect(result.length).toBeGreaterThan(0);
    result.forEach((r) => {
      expect(r.start_date >= "2026-08-10").toBe(true);
    });
  });

  it("minAdvanceDays of 0 includes today in day mode", () => {
    const result = generateAvailableSlots(dayCalendar(), noBookings, { minAdvanceDays: 0 });
    expect(result[0].start_date).toBe("2026-08-03");
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("returns an empty array when the calendar horizon is empty", () => {
    const cal = slotCalendar({ start_date: "2026-08-10", end_date: "2026-08-09" });
    const result = generateAvailableSlots(cal, noBookings, { minAdvanceDays: 0 });
    expect(result).toHaveLength(0);
  });

  it("returns an empty array when no days match the days_of_week filter", () => {
    const cal = slotCalendar({ days_of_weeK: [0] }); // Sunday only, but calendar is Mon–Fri
    const result = generateAvailableSlots(cal, noBookings, { minAdvanceDays: 0 });
    expect(result).toHaveLength(0);
  });

  it("returns an empty array when minAdvanceDays pushes past the end of the horizon", () => {
    const result = generateAvailableSlots(slotCalendar(), noBookings, { minAdvanceDays: 100 });
    expect(result).toHaveLength(0);
  });

  it("no range has a start_time equal to or later than its end_time (slot mode)", () => {
    const bk = booking({ date: "2026-08-03", start_time: "10:00", end_time: "16:00" });
    const cal = slotCalendar({ buffer_minutes: 15 });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });
    result.forEach((r) => {
      expect(r.start_time < r.end_time).toBe(true);
    });
  });

  it("no range has a start_date later than its end_date (day mode)", () => {
    const bk = dayBooking({ date: "2026-08-06", duration: 1 });
    const result = generateAvailableSlots(dayCalendar(), [bk], { minAdvanceDays: 0 });
    result.forEach((r) => {
      if (r.end_date) expect(r.start_date <= r.end_date).toBe(true);
    });
  });

  it("rescheduled bookings are treated as active (not available)", () => {
    const bk = booking({ date: "2026-08-03", start_time: "11:00", end_time: "12:00", status: "rescheduled" });
    const result = generateAvailableSlots(slotCalendar(), [bk], { minAdvanceDays: 0 });
    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday.some((r) => r.start_time === "09:00" && r.end_time === "17:00")).toBe(false);
  });

  it("booking matched by unit_label (not unit_id) is still counted", () => {
    const bk = booking({
      date: "2026-08-03",
      start_time: "09:00",
      end_time: "17:00",
      unit_id: "wrong_id",       // id won't match
      unit_label: UNIT_A.label,  // but label will
    });
    const result = generateAvailableSlots(slotCalendar(), [bk], { minAdvanceDays: 0 });
    const monday = result.filter((r) => r.start_date === "2026-08-03");
    expect(monday).toHaveLength(0);
  });

  it("booking on a non-operating day does not affect operating days", () => {
    // Sunday booking — calendar is Mon–Fri so this should be irrelevant
    const bk = booking({ date: "2026-08-09", start_time: "09:00", end_time: "17:00" });
    const cal = slotCalendar({ end_date: "2026-08-14" });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });
    const operatingDays = result.filter((r) => r.start_date >= "2026-08-10" && r.start_date <= "2026-08-14");
    expect(operatingDays).toHaveLength(5);
  });

  it("single day horizon with no bookings returns one slot", () => {
    const cal = slotCalendar({ start_date: "2026-08-03", end_date: "2026-08-03" });
    const result = generateAvailableSlots(cal, noBookings, { minAdvanceDays: 0 });
    expect(result).toHaveLength(1);
    expect(result[0].start_date).toBe("2026-08-03");
  });

  it("single day horizon fully booked returns empty", () => {
    const bk = booking({ date: "2026-08-03", start_time: "09:00", end_time: "17:00" });
    const cal = slotCalendar({ start_date: "2026-08-03", end_date: "2026-08-03" });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });
    expect(result).toHaveLength(0);
  });

  it("day mode: single day horizon with booking blocks entire range", () => {
    const cal = dayCalendar({ start_date: "2026-08-05", end_date: "2026-08-05" });
    const bk = dayBooking({ date: "2026-08-05", duration: 1 });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });
    expect(result).toHaveLength(0);
  });
});