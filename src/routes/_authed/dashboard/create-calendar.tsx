import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from "react";
import type { SlotPreset } from "booking-api-extended";
import type { FeatureCard } from "@/lib/experiences";
import { fetchFeaturedExperienceCard, fetchExperienceById, resolveTranslatable } from "@/lib/experiences";
import type { Calendar, UnitType } from "@/lib/booking";
import { fetchUnitTypes, createUnit, createCalendarSchedule, updateCalendarSchedule } from "@/lib/booking";
import { createServerFn } from '@tanstack/react-start';
import { formatDateForInput } from '#/lib/utils';

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

// TODO: wire this up once you have a save/create endpoint for calendars
// import { createCalendar } from "@/lib/booking";

// ---- Step type ----
type Step = "experience" | "calendar" // "preset" | 

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


function RouteComponent() {
  const location = useLocation({});
  const navigate = useNavigate({ from: "/dashboard/create-calendar" });

  const { cards, units, lang, calId} = Route.useLoaderData();
  const [step, setStep] = useState<Step>("experience");

  // // ----- preset state -----
  // const [presets, setPresets] = useState<SlotPreset[]>(DEFAULT_PRESETS);
  // const [selectedPreset, setSelectedPreset] = useState<SlotPreset | null>(null);
  // const [customPreset, setCustomPreset] = useState({ id: "", label: "", durationMinutes: 60 });

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
        // TODO: add the data to
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
        setBufferAmount(bufferMinutes); // Set this to 300
        setBufferUnit("minutes"); // Keep it as minutes

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
          experiences: [card?.id ?? ""], // just the first experience for now
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
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
        Booking Dashboard
      </h1>

      {/* ---------------- STEP 1: PRESET ---------------- 
      <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          1. Choose or create a slot preset
        </h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              disabled={step !== "preset"}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                step !== "preset"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : selectedPreset?.id === preset.id
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {preset.label} ({preset.durationMinutes}min)
              {selectedPreset?.id === preset.id ? " ✓" : ""}
            </button>
          ))}
        </div>

        {step === "preset" && (
          <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Or create a custom preset
            </h3>
            <div className="flex flex-wrap gap-3">
              <input
                placeholder="id (e.g. 90min)"
                value={customPreset.id}
                onChange={(e) => setCustomPreset((p) => ({ ...p, id: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                placeholder="label (e.g. 90-minute session)"
                value={customPreset.label}
                onChange={(e) => setCustomPreset((p) => ({ ...p, label: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 min-w-[200px]"
              />
              <input
                type="number"
                placeholder="duration (minutes)"
                value={customPreset.durationMinutes}
                onChange={(e) =>
                  setCustomPreset((p) => ({ ...p, durationMinutes: Number(e.target.value) }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
              />
              <button
                onClick={handleAddCustomPreset}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Add preset
              </button>
            </div>
          </div>
        )}

        {step === "preset" && (
          <button
            onClick={handleConfirmPreset}
            disabled={!selectedPreset}
            className={`mt-4 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              !selectedPreset
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Continue with "{selectedPreset?.label ?? "..."}"
          </button>
        )}
      </section>
      */}

      {/* ---------------- STEP 2: EXPERIENCE CARDS ---------------- */}
      {(step === "experience" || step === "calendar") && (
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1. Choose an experience to link
          </h2>

          {cardsLoading && (
            <p className="text-gray-600 italic">Loading experiences...</p>
          )}
          {cardsError && (
            <p className="text-red-600 bg-red-50 p-3 rounded-md">Error: {cardsError}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleSelectCard(card)}
                className={`cursor-pointer p-3 rounded-lg border transition-all ${
                  selectedCard?.id === card.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <img
                  src={card.coverImage}
                  alt=""
                  width={120}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <p className="text-sm font-medium text-gray-800 truncate">
                  {resolveTranslatable(card.title, lang || "en") ?? card.id}
                </p>
                {selectedCard?.id === card.id && (
                  <span className="text-xs text-blue-600 font-medium">(selected)</span>
                )}
              </div>
            ))}
          </div>

          {experienceLoading && (
            <p className="text-gray-600 italic mt-4">Loading experience details...</p>
          )}
          {experienceError && (
            <p className="text-red-600 bg-red-50 p-3 rounded-md mt-4">
              Error: {experienceError}
            </p>
          )}
        </section>
      )}

      {/* ---------------- STEP 3: CALENDAR FORM ---------------- */}
      {step === "calendar" && hydratedExperience && (
        <section className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            2. Set up the calendar for "
            {resolveTranslatable(hydratedExperience.title, lang || "en") ??
              selectedCard?.id}
            "
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Title
                <input
                  type="text"
                  value={calendarForm.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                Start date
                <input
                  type="date"
                  value={calendarForm.start_date}
                  onChange={(e) => updateField("start_date", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                End date
                <input
                  type="date"
                  value={calendarForm.end_date ?? ""}
                  onChange={(e) => updateField("end_date", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
            </div>

            <div>
              <label className="inline-flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  All-day slot (event, inn stay, campsite — no specific hours)
                </span>
              </label>

              {!isAllDay && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Start time
                    <input
                      type="time"
                      value={calendarForm.start_time}
                      onChange={(e) => updateField("start_time", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    End time
                    <input
                      type="time"
                      value={calendarForm.end_time}
                      onChange={(e) => updateField("end_time", e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </label>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Days of week</p>
              <div className="flex flex-wrap gap-3">
                {DAYS.map((d) => (
                  <label key={d.value} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={calendarForm.days_of_week.includes(d.value)}
                      onChange={() => toggleDay(d.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{d.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Buffer between bookings
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Time blocked off before the next booking can start — e.g. cleanup for a room, or a gap between events.
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={bufferAmount}
                  onChange={(e) => updateBuffer(Number(e.target.value), bufferUnit)}
                  className="w-28 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={bufferUnit}
                  onChange={(e) => updateBuffer(bufferAmount, e.target.value as typeof bufferUnit)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                = {calendarForm.buffer_minutes ?? 0} minutes total
              </p>
            </div>

            {/* Unit types - now a relation, selected from the UnitType collection */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Unit types</p>

              {availableUnits.length === 0 && (
                <p className="text-sm text-gray-500 italic mb-3">
                  No unit types yet — create one below.
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {availableUnits.map((unit) => {
                  const selected = calendarForm.units.includes(unit.id);
                  return (
                    <button
                      key={unit.id}
                      type="button"
                      onClick={() => toggleUnit(unit.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selected
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {unit.label} (cap {unit.capacity}){selected ? " ✓" : ""}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 bg-white rounded-md border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Create a new unit type
                </h3>
                <div className="flex flex-col items-start gap-2">
                  <div className='flex w-full gap-2 items-end'>
                    <label className="grow text-sm font-medium text-gray-700">
                      Label
                      <input
                        placeholder="e.g. Standard Room"
                        value={newUnit.label}
                        onChange={(e) => setNewUnit((p) => ({ ...p, label: e.target.value }))}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
                      />
                    </label>
                    <button
                      onClick={handleCreateUnit}
                      disabled={creatingUnit}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        creatingUnit
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {creatingUnit ? "Creating..." : "+ Add unit type"}
                    </button>
                  </div>
                  <div className='flex w-full gap-2'>
                    <label className="grow text-sm font-medium text-gray-700">
                      Capacity
                      <input
                        type="number"
                        placeholder="e.g. 2"
                        value={newUnit.capacity}
                        onChange={(e) =>
                          setNewUnit((p) => ({ ...p, capacity: Number(e.target.value) }))
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </label>
                    <label className="grow text-sm font-medium text-gray-700">
                      Price
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="e.g. 99.99"
                        value={newUnit.value}
                        onChange={(e) => {
                          const raw = e.target.value;
                          // allow free typing (including partial input like "12." or "")
                          // but only commit a valid float to state
                          const parsed = parseFloat(raw);
                          setNewUnit((p) => ({ ...p, value: isNaN(parsed) ? 0.0 : parsed }));
                        }}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </label>
                  </div>
                </div>
                {createUnitError && (
                  <p className="text-red-600 bg-red-50 p-3 rounded-md mt-3 text-sm">
                    {createUnitError}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleSubmitCalendar}
                disabled={saving}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  saving
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {saving ? "Saving..." : calId !== undefined ? "Update" : "Create calendar"}
              </button>
              {saveError && (
                <p className="text-red-600 bg-red-50 p-3 rounded-md mt-4">
                  Error: {saveError}
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}