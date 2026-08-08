// ============================================================
// BOOKING SLOTS
// ------------------------------------------------------------
// Client-side slot generation. These shapes mirror the contract the backend
// will eventually return, so the UI can be wired to live data later with no
// component changes. For now slots are generated deterministically from the
// experience id + date so a given experience always shows a stable schedule.
// ============================================================

/** Availability for a single bookable unit type within a slot. */
export type UnitAvailability = {
  unit_type_id: string
  unit_label: string
  capacity: number
  booked: number
  remaining: number
}

/** A single bookable time slot on a given day. */
export type Slot = {
  date: string // YYYY-MM-DD
  start_time: string // HH:mm
  end_time: string // HH:mm
  duration: number // minutes
  slot_preset_id: string
  unit_availability: UnitAvailability[]
}

/** A day grouping of slots, used to drive the date strip in the UI. */
export type SlotDay = {
  date: string // YYYY-MM-DD
  slots: Slot[]
}

const UNIT_TYPES: { unit_type_id: string; unit_label: string; capacity: number }[] = [
  { unit_type_id: '4-bed', unit_label: '4-bedroom villa', capacity: 4 },
  { unit_type_id: '2-bed', unit_label: '2-bedroom apartment', capacity: 2 },
  { unit_type_id: 'standard', unit_label: 'Standard unit', capacity: 6 },
]

const SLOT_PRESET = { id: '40min', duration: 40 }

/**
 * Small, stable string hash used to derive deterministic pseudo-random values
 * from an experience id + slot identity. Keeps generated availability constant
 * between renders for the same inputs.
 */
function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

/** Format a Date into a local YYYY-MM-DD string. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Add minutes to an HH:mm string, returning a new HH:mm string. */
function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  const hh = String(Math.floor(total / 60) % 24).padStart(2, '0')
  const mm = String(total % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

const START_TIMES = ['09:00', '10:00', '11:30', '13:00', '14:30', '16:00']

/**
 * Generate booking slots for an experience across the next `days` days.
 * Sundays are treated as closed (no slots) to feel realistic.
 *
 * @param experienceId - Used as a deterministic seed for availability.
 * @param days - Number of days from today to generate (default 14).
 */
export function generateSlots(experienceId: string, days = 14): SlotDay[] {
  const result: SlotDay[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateKey = toDateKey(date)

    // Closed on Sundays.
    if (date.getDay() === 0) {
      result.push({ date: dateKey, slots: [] })
      continue
    }

    const slots: Slot[] = START_TIMES.map((start) => {
      const unit_availability: UnitAvailability[] = UNIT_TYPES.map((unit) => {
        const seed = hash(`${experienceId}-${dateKey}-${start}-${unit.unit_type_id}`)
        const booked = seed % (unit.capacity + 1)
        const remaining = Math.max(0, unit.capacity - booked)
        return {
          unit_type_id: unit.unit_type_id,
          unit_label: unit.unit_label,
          capacity: unit.capacity,
          booked,
          remaining,
        }
      })

      return {
        date: dateKey,
        start_time: start,
        end_time: addMinutes(start, SLOT_PRESET.duration),
        duration: SLOT_PRESET.duration,
        slot_preset_id: SLOT_PRESET.id,
        unit_availability,
      }
    })

    result.push({ date: dateKey, slots })
  }

  return result
}

/** Total remaining capacity across all units in a slot. */
export function slotRemaining(slot: Slot): number {
  return slot.unit_availability.reduce((sum, u) => sum + u.remaining, 0)
}

/** Human-friendly day label, e.g. "Mon 5 Mar". */
export function formatDayLabel(dateKey: string): { weekday: string; day: string; month: string } {
  const date = new Date(`${dateKey}T00:00:00`)
  return {
    weekday: date.toLocaleDateString('en-ZA', { weekday: 'short' }),
    day: date.toLocaleDateString('en-ZA', { day: 'numeric' }),
    month: date.toLocaleDateString('en-ZA', { month: 'short' }),
  }
}
