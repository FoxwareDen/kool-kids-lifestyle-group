import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from "react";
import type { SlotPreset } from "booking-api-extended";
import type { FeatureCard } from "@/lib/experiences";
import { fetchFeaturedExperienceCard, fetchExperienceById, resolveTranslatable } from "@/lib/experiences";
import type { Calendar, UnitType } from "@/lib/booking";
import { fetchUnitTypes, createUnit, createCalendarSchedule, updateCalendarSchedule } from "@/lib/booking";
import { createServerFn } from '@tanstack/react-start';
import { formatDateForInput } from '#/lib/utils';
import { Check } from 'lucide-react';
import { Button, SectionCard, TextField, controlClass } from '#/components/dashboard/form-controls';

const fetchCards = createServerFn()
  .inputValidator((input: { lang: 'en' | 'af' }) => input)
  .handler(async ({ data: { lang } }) => {
    const result = await fetchFeaturedExperienceCard(lang);

    if (!result) {
      return { success: false, error: "No result found", data: null };
    }

    if (result.isSuccess()) {
      return {
        success: true,
        data: result.value,
        error: null
      };
    } else {
      return {
        success: false,
        data: null,
        error: result.error
      };
    }
  })

const fetchUnits = createServerFn()
  .handler(async () => {
    const result = await fetchUnitTypes();

    if (!result) {
      return { success: false, error: "No result found", data: null };
    }

    if (result.isSuccess()) {
      return {
        success: true,
        data: result.value,
        error: null
      };
    } else {
      return {
        success: false,
        data: null,
        error: result.error
      };
    }
  })

export const Route = createFileRoute('/_authed/dashboard/create-calendar')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
    calId: (search.calId as string | undefined) ?? undefined,
  }),
  loaderDeps: ({ search: {lang, calId} }) => ({lang, calId}),
  loader: async ({ deps: {calId, lang} }) => {

    const [cardsResult, unitsResult] = await Promise.all([
      fetchCards({ data: { lang: lang || 'en' } }),
      fetchUnits(),
    ]);

    if (!cardsResult.success) {
      throw new Error(cardsResult.error || "Failed to fetch experience cards");
    }
    if (!unitsResult.success) {
      throw new Error(unitsResult.error || "Failed to fetch unit types");
    }

    return {
      cards: cardsResult.data || [],
      units: unitsResult.data || [],
      lang,
      calId,
    };
  },
  component: RouteComponent,
})

// ---- Step type ----
type Step = "experience" | "calendar"

// ---- Default presets (swap for a fetch if these live server-side) ----
const DEFAULT_PRESETS: SlotPreset[] = [
  { id: "40min", label: "40-minute session", durationMinutes: 40 },
  { id: "half-day", label: "Half day", durationMinutes: 240 },
  { id: "day", label: "Full day", durationMinutes: 480 },
];

const DAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

/**
 * Small numbered badge used to label the wizard steps.
 *
 * @param n - Step number to display.
 * @param active - Highlights the badge when its step is current.
 */
function StepBadge({ n, active }: { n: number; active: boolean }) {
  return (
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-sm text-xs font-bold ${
        active
          ? 'bg-[var(--brand-orange)] text-white'
          : 'bg-[var(--dash-panel-muted)] text-[var(--sea-ink-soft)]'
      }`}
    >
      {n}
    </span>
  )
}

function RouteComponent() {
  const location = useLocation({});
  const navigate = useNavigate({ from: "/dashboard/create-calendar" });

  const { cards, units, lang, calId} = Route.useLoaderData();
  const [step, setStep] = useState<Step>("experience");

  // ----- experience card state -----
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsError, setCardsError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<FeatureCard | null>(null);

  // ----- hydrated experience state -----
  const [hydratedExperience, setHydratedExperience] = useState<any>(null);
  const [experienceLoading, setExperienceLoading] = useState(false);
  const [experienceError, setExperienceError] = useState<string | null>(null);

  // ----- unit type state -----
  const [availableUnits, setAvailableUnits] = useState<UnitType[]>(units);
  const [newUnit, setNewUnit] = useState({ label: "", capacity: 1, value: 0.0 });
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [createUnitError, setCreateUnitError] = useState<string | null>(null);

  // ----- calendar form state -----
  const [calendarForm, setCalendarForm] = useState<Omit<Calendar, "experiences">>({
    title:"",
    start_date: "",
    end_date: "",
    start_time: "09:00",
    end_time: "17:00",
    days_of_week: [1, 2, 3, 4, 5],
    buffer_minutes: 15,
    units: [], // array of unit type ids
  });
  const [saving, setSaving] = useState(false);
  const [isLoaderReady, setIsLoaderReady] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // all-day slots: for bookings like a full event, inn stay, or campground
  // slot where a specific start/end time doesn't apply
  const [isAllDay, setIsAllDay] = useState(false);

  // buffer time entered by the user, with a unit selector so an inn can say
  // "1 day cleanup" instead of typing minutes. Converted to minutes on save.
  const [bufferUnit, setBufferUnit] = useState<"minutes" | "hours" | "days">("minutes");
  const [bufferAmount, setBufferAmount] = useState(15);

  useEffect(() => {
    if (cards.length > 0 && units.length > 0) {
      setIsLoaderReady(true);
    }
  }, [cards, units]);


  // loaded data if state has been passed useLocation
  useEffect(() => {
    if (calId && isLoaderReady) {

      (async () =>{
        const data = (location.state as unknown as { calendar: Calendar })?.calendar

        const card = cards.find((c) => c.id === data?.experiences[0]);

        if (card) {
          setSelectedCard(card);
          setExperienceLoading(true);
          setExperienceError(null);
          setHydratedExperience(null);

          const result = await fetchExperienceById(card.id);

          if (result.error) {
            setExperienceError(result.error);
          } else {
            setHydratedExperience(result.value);
          }
          setExperienceLoading(false);

          setStep("calendar");
        }

        const bufferMinutes = data?.buffer_minutes ?? 15;
        setBufferAmount(bufferMinutes);
        setBufferUnit("minutes");

        setCalendarForm((prev) => ({
          ...prev,
          title: data?.title ?? prev.title,
          start_date: formatDateForInput(data.start_date??""),
          end_date: formatDateForInput(data.end_date??""),
          start_time: data?.start_time ?? prev.start_time,
          end_time: data?.end_time ?? prev.end_time,
          days_of_week: data?.days_of_week ?? prev.days_of_week,
          buffer_minutes: data?.buffer_minutes ?? prev.buffer_minutes,
          units: data?.units ?? prev.units,
          experiences: [card?.id ?? ""],
        }))
      })()


    }
  }, [calId,isLoaderReady])

  const BUFFER_UNIT_TO_MINUTES: Record<typeof bufferUnit, number> = {
    minutes: 1,
    hours: 60,
    days: 60 * 24,
  };

  function updateBuffer(amount: number, unit: typeof bufferUnit) {
    setBufferAmount(amount);
    setBufferUnit(unit);
    updateField("buffer_minutes", amount * BUFFER_UNIT_TO_MINUTES[unit]);
  }

  async function handleSelectCard(card: FeatureCard) {
    setSelectedCard(card);
    setExperienceLoading(true);
    setExperienceError(null);
    setHydratedExperience(null);

    const result = await fetchExperienceById(card.id);
    if (result.error) {
      setExperienceError(result.error);
    } else {
      setHydratedExperience(result.value);
      setStep("calendar");
    }
    setExperienceLoading(false);
  }

  function toggleDay(day: number) {
    setCalendarForm((prev) => {
      const has = prev.days_of_week.includes(day);
      return {
        ...prev,
        days_of_week: has
          ? prev.days_of_week.filter((d) => d !== day)
          : [...prev.days_of_week, day].sort(),
      };
    });
  }

  function updateField<K extends keyof typeof calendarForm>(key: K, value: (typeof calendarForm)[K]) {
    setCalendarForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleUnit(unitId: string) {
    setCalendarForm((prev) => {
      const has = prev.units.includes(unitId);
      return {
        ...prev,
        units: has
          ? prev.units.filter((id) => id !== unitId)
          : [...prev.units, unitId],
      };
    });
  }

  async function handleCreateUnit() {
    if (!newUnit.label || !newUnit.capacity) return;
    setCreatingUnit(true);
    setCreateUnitError(null);

    const result = await createUnit(newUnit.label, newUnit.capacity, newUnit.value);
    if (result.error) {
      setCreateUnitError(String(result.error));
    } else {
      const created: UnitType = {
        id: result.value!,
        label: newUnit.label,
        capacity: newUnit.capacity,
        value: newUnit.value,
      } as UnitType;
      setAvailableUnits((prev) => [...prev, created]);
      setCalendarForm((prev) => ({ ...prev, units: [...prev.units, created.id] }));
      setNewUnit({ label: "", capacity: 1, value: 0 });
    }
    setCreatingUnit(false);
  }

  async function handleSubmitCalendar() {
    if (!selectedCard) return;

    const calendar: Calendar = {
      ...calendarForm,
      // all-day slots still need valid start/end times in the schema,
      // so we store the full-day span rather than adding a new field
      start_time: isAllDay ? "00:00" : calendarForm.start_time,
      end_time: isAllDay ? "23:59" : calendarForm.end_time,
      experiences: [selectedCard.id],
    };

    setSaving(true);
    setSaveError(null);

    try {
      if (calId === undefined) {
        const result = await createCalendarSchedule(calendar);

        if (!result.success) throw new Error(result.error || "Failed to save calendar");
      }else {
        const result = await updateCalendarSchedule(calId, calendar);

        if (!result.success) throw new Error(result.error || "Failed to update calendar");
      }

      navigate({ to: '/dashboard/calendars', search: { lang: lang || 'en' } });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save calendar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--sea-ink)]">
          {calId !== undefined ? 'Edit schedule' : 'Create schedule'}
        </h1>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          Link an experience, then define when it can be booked.
        </p>
      </div>

      <div className="space-y-6">
        {/* ---------------- STEP 1: EXPERIENCE CARDS ---------------- */}
        <SectionCard
          title="Choose an experience to link"
          description="Pick the experience this schedule opens bookings for."
          actions={<StepBadge n={1} active={step === 'experience'} />}
        >
          {cardsLoading && (
            <p className="italic text-[var(--sea-ink-soft)]">Loading experiences…</p>
          )}
          {cardsError && (
            <p className="rounded-sm bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] p-3 text-sm text-[var(--destructive)]">
              Error: {cardsError}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {cards.map((card) => {
              const selected = selectedCard?.id === card.id
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelectCard(card)}
                  className={`overflow-hidden rounded-sm border text-left transition-colors ${
                    selected
                      ? 'border-[var(--brand-orange)] ring-2 ring-[var(--brand-orange)]/30'
                      : 'border-[var(--line)] hover:border-[var(--brand-orange)]/50'
                  }`}
                >
                  <img
                    src={card.coverImage}
                    alt=""
                    className="h-32 w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-2 p-3">
                    <p className="truncate text-sm font-semibold text-[var(--sea-ink)]">
                      {resolveTranslatable(card.title, lang || "en") ?? card.id}
                    </p>
                    {selected && (
                      <Check className="size-4 shrink-0 text-[var(--brand-orange)]" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {experienceLoading && (
            <p className="mt-4 italic text-[var(--sea-ink-soft)]">Loading experience details…</p>
          )}
          {experienceError && (
            <p className="mt-4 rounded-sm bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] p-3 text-sm text-[var(--destructive)]">
              Error: {experienceError}
            </p>
          )}
        </SectionCard>

        {/* ---------------- STEP 2: CALENDAR FORM ---------------- */}
        {step === "calendar" && hydratedExperience && (
          <SectionCard
            title={`Set up the schedule for "${resolveTranslatable(hydratedExperience.title, lang || "en") ?? selectedCard?.id}"`}
            actions={<StepBadge n={2} active={step === 'calendar'} />}
          >
            <div className="space-y-6">
              <TextField
                label="Title"
                type="text"
                value={calendarForm.title}
                onChange={(e) => updateField("title", e.target.value)}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  label="Start date"
                  type="date"
                  value={calendarForm.start_date}
                  onChange={(e) => updateField("start_date", e.target.value)}
                />
                <TextField
                  label="End date"
                  type="date"
                  value={calendarForm.end_date ?? ""}
                  onChange={(e) => updateField("end_date", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-3 inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                    className="size-4 rounded-sm border-[var(--line)] accent-[var(--brand-orange)]"
                  />
                  <span className="text-sm font-semibold text-[var(--sea-ink)]">
                    All-day slot (event, inn stay, campsite — no specific hours)
                  </span>
                </label>

                {!isAllDay && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField
                      label="Start time"
                      type="time"
                      value={calendarForm.start_time}
                      onChange={(e) => updateField("start_time", e.target.value)}
                    />
                    <TextField
                      label="End time"
                      type="time"
                      value={calendarForm.end_time}
                      onChange={(e) => updateField("end_time", e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-[var(--sea-ink)]">Days of week</p>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => {
                    const active = calendarForm.days_of_week.includes(d.value)
                    return (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => toggleDay(d.value)}
                        className={`rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors ${
                          active
                            ? 'bg-[var(--brand-orange)] text-white'
                            : 'border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]'
                        }`}
                      >
                        {d.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--sea-ink)]">
                  Buffer between bookings
                </p>
                <p className="mb-2 text-xs text-[var(--sea-ink-soft)]">
                  Time blocked off before the next booking can start — e.g. cleanup for a room, or a gap between events.
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    value={bufferAmount}
                    onChange={(e) => updateBuffer(Number(e.target.value), bufferUnit)}
                    className={`${controlClass} w-28`}
                  />
                  <select
                    value={bufferUnit}
                    onChange={(e) => updateBuffer(bufferAmount, e.target.value as typeof bufferUnit)}
                    className={`${controlClass} w-32`}
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
                <p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
                  = {calendarForm.buffer_minutes ?? 0} minutes total
                </p>
              </div>

              {/* Unit types - a relation, selected from the UnitType collection */}
              <div>
                <p className="mb-2 text-sm font-semibold text-[var(--sea-ink)]">Unit types</p>

                {availableUnits.length === 0 && (
                  <p className="mb-3 text-sm italic text-[var(--sea-ink-soft)]">
                    No unit types yet — create one below.
                  </p>
                )}

                <div className="mb-4 flex flex-wrap gap-2">
                  {availableUnits.map((unit) => {
                    const selected = calendarForm.units.includes(unit.id);
                    return (
                      <button
                        key={unit.id}
                        type="button"
                        onClick={() => toggleUnit(unit.id)}
                        className={`inline-flex items-center gap-1.5 rounded-sm px-4 py-2 text-sm font-semibold transition-colors ${
                          selected
                            ? "bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-deep)]"
                            : "border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink)] hover:bg-[var(--link-bg-hover)]"
                        }`}
                      >
                        {unit.label} (cap {unit.capacity})
                        {selected && <Check className="size-3.5" />}
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-sm border border-[var(--line)] bg-[var(--dash-panel-muted)] p-4">
                  <h3 className="mb-3 text-sm font-semibold text-[var(--sea-ink)]">
                    Create a new unit type
                  </h3>
                  <div className="flex flex-col items-start gap-3">
                    <div className="flex w-full items-end gap-2">
                      <div className="grow">
                        <TextField
                          label="Label"
                          placeholder="e.g. Standard Room"
                          value={newUnit.label}
                          onChange={(e) => setNewUnit((p) => ({ ...p, label: e.target.value }))}
                        />
                      </div>
                      <Button variant="primary" onClick={handleCreateUnit} disabled={creatingUnit}>
                        {creatingUnit ? "Creating…" : "+ Add unit type"}
                      </Button>
                    </div>
                    <div className="flex w-full gap-2">
                      <div className="grow">
                        <TextField
                          label="Capacity"
                          type="number"
                          placeholder="e.g. 2"
                          value={newUnit.capacity}
                          onChange={(e) =>
                            setNewUnit((p) => ({ ...p, capacity: Number(e.target.value) }))
                          }
                        />
                      </div>
                      <div className="grow">
                        <TextField
                          label="Price"
                          type="text"
                          inputMode="decimal"
                          placeholder="e.g. 99.99"
                          value={newUnit.value}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const parsed = parseFloat(raw);
                            setNewUnit((p) => ({ ...p, value: isNaN(parsed) ? 0.0 : parsed }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {createUnitError && (
                    <p className="mt-3 rounded-sm bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] p-3 text-sm text-[var(--destructive)]">
                      {createUnitError}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-[var(--line)] pt-4">
                <Button variant="primary" onClick={handleSubmitCalendar} disabled={saving}>
                  {saving ? "Saving…" : calId !== undefined ? "Update schedule" : "Create schedule"}
                </Button>
                {saveError && (
                  <p className="mt-4 rounded-sm bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] p-3 text-sm text-[var(--destructive)]">
                    Error: {saveError}
                  </p>
                )}
              </div>
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
