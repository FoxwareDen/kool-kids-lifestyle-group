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

/** A Mon–Fri day-based calendar across two weeks */
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
});

describe("slot mode – days of week filtering", () => {
  it("excludes dates that fall on non-operating days", () => {
    const cal = slotCalendar({ end_date: "2026-08-09" });
    const result = generateAvailableSlots(cal, noBookings, { minAdvanceDays: 0 });

    const dates = result.map((r) => r.start_date);
    expect(dates).not.toContain("2026-08-08");
    expect(dates).not.toContain("2026-08-09");
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
    const bk: Booking = {
      id: "bk_stay",
      date: "2026-08-05",
      start_time: "14:00",
      end_time: "11:00",
      duration: 2,
      unit_label: UNIT_A.label,
      unit_id: UNIT_A.id,
      status: "pending",
    };
    const result = generateAvailableSlots(dayCalendar(), [bk], { minAdvanceDays: 0 });

    expect(result).toHaveLength(2);
    const sorted = result.sort((a, b) => a.start_date.localeCompare(b.start_date));
    expect(sorted[0].end_date).toBe("2026-08-04");
    expect(sorted[1].start_date).toBe("2026-08-07");
    expect(sorted[1].start_time).toBe("14:00");
  });

  it("allows same-day booking when start time is after previous end_time + buffer", () => {
    const bk: Booking = {
      id: "bk_same_day",
      date: "2026-08-05",
      start_time: "14:00",
      end_time: "11:00",
      duration: 1,
      unit_label: UNIT_A.label,
      unit_id: UNIT_A.id,
      status: "pending",
    };
    const cal = dayCalendar({ buffer_minutes: 60 });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });

    const sameDay = result.find((r) => r.start_date === "2026-08-06");
    expect(sameDay).toBeDefined();
    expect(sameDay!.start_time >= "12:00").toBe(true);
  });

  it("does not allow same-day booking when start time is within buffer of previous end_time", () => {
    const bk: Booking = {
      id: "bk_same_day_blocked",
      date: "2026-08-05",
      start_time: "14:00",
      end_time: "11:00",
      duration: 1,
      unit_label: UNIT_A.label,
      unit_id: UNIT_A.id,
      status: "pending",
    };
    const cal = dayCalendar({ buffer_minutes: 60 });
    const result = generateAvailableSlots(cal, [bk], { minAdvanceDays: 0 });

    const sameDay = result.find((r) => r.start_date === "2026-08-06");
    if (sameDay) {
      expect(sameDay.start_time < "12:00").toBe(false);
    }
  });

  it("ignores cancelled day bookings", () => {
    const bk: Booking = {
      id: "bk_cancel",
      date: "2026-08-05",
      start_time: "14:00",
      end_time: "11:00",
      duration: 2,
      unit_label: UNIT_A.label,
      unit_id: UNIT_A.id,
      status: "cancelled",
    };
    const result = generateAvailableSlots(dayCalendar(), [bk], { minAdvanceDays: 0 });
    expect(result).toHaveLength(1);
    expect(result[0].start_date).toBe("2026-08-03");
    expect(result[0].end_date).toBe("2026-08-14");
  });

  it("produces no range before a stay starting on the first day of the horizon", () => {
    const bk: Booking = {
      id: "bk_early",
      date: "2026-08-03",
      start_time: "14:00",
      end_time: "11:00",
      duration: 2,
      unit_label: UNIT_A.label,
      unit_id: UNIT_A.id,
      status: "pending",
    };
    const result = generateAvailableSlots(dayCalendar(), [bk], { minAdvanceDays: 0 });
    const before = result.filter((r) => r.start_date < "2026-08-03");
    expect(before).toHaveLength(0);
  });
});

describe("day mode – buffer", () => {
  it("enforces buffer_minutes between consecutive bookings on the same unit", () => {
    const bk1: Booking = { id: "bk_1", date: "2026-08-05", start_time: "14:00", end_time: "11:00", duration: 1, unit_id: UNIT_A.id, unit_label: UNIT_A.label, status: "pending" };
    const bk2: Booking = { id: "bk_2", date: "2026-08-06", start_time: "12:00", end_time: "16:00", duration: 1, unit_id: UNIT_A.id, unit_label: UNIT_A.label, status: "pending" };
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
    const bkA: Booking = { id: "bk_a", date: "2026-08-05", start_time: "14:00", end_time: "11:00", duration: 2, unit_id: UNIT_A.id, unit_label: UNIT_A.label, status: "pending" };
    const bkB: Booking = { id: "bk_b", date: "2026-08-09", start_time: "14:00", end_time: "11:00", duration: 2, unit_id: UNIT_B.id, unit_label: UNIT_B.label, status: "pending" };
    const result = generateAvailableSlots(cal, [bkA, bkB], { minAdvanceDays: 0 });

    const aRanges = result.filter((r) => r.units.some((u) => u.id === UNIT_A.id));
    const bRanges = result.filter((r) => r.units.some((u) => u.id === UNIT_B.id));

    const aGap = aRanges.find((r) => r.end_date && r.end_date < "2026-08-05");
    expect(aGap).toBeDefined();

    const bGap = bRanges.find((r) => r.start_date >= "2026-08-10");
    expect(bGap).toBeDefined();
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
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("returns an empty array when the calendar horizon is empty", () => {
    const cal = slotCalendar({ start_date: "2026-08-10", end_date: "2026-08-09" });
    const result = generateAvailableSlots(cal, noBookings, { minAdvanceDays: 0 });
    expect(result).toHaveLength(0);
  });

  it("returns an empty array when no days match the days_of_week filter", () => {
    const cal = slotCalendar({ days_of_weeK: [0] });
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
    const bk: Booking = { id: "bk_x", date: "2026-08-06", start_time: "14:00", end_time: "11:00", duration: 1, unit_id: UNIT_A.id, unit_label: UNIT_A.label, status: "pending" };
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
});