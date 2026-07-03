import { createFileRoute } from '@tanstack/react-router' 
import { useEffect, useState } from "react";
import type { SlotPreset, UnitType } from "booking-api-extended";
import type { FeatureCard } from "@/lib/experiences";
import { fetchFeaturedExperienceCard, fetchExperienceById, resolveTranslatable } from "@/lib/experiences";
import type { Calendar } from "@/lib/booking";
import { createServerFn } from '@tanstack/react-start';

const fetchCards = createServerFn()
  .inputValidator((input: { lang: 'en' | 'af' }) => input)
  .handler(async ({ data: { lang } }) => {
    const result = await fetchFeaturedExperienceCard(lang);

    // 1. If you have an early exit/error condition, convert it here too:
    if (!result) {
      return { success: false, error: "No result found", data: null };
    }

    // 2. Map the main branches safely
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

export const Route = createFileRoute('/_authed/dashboard/calendar')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: (search.lang as 'en' | 'af') ?? undefined,
  }),
  loader: async ({location}) => {
    const slug = location.pathname.replace(/^\/|\/$/g, '')
    
    // Parse ?lang= from the URL
    const params = new URLSearchParams(location.search)
    const lang = params.get('lang') as 'en' | 'af' | null

    const result = await fetchCards({data: { lang: lang || 'en' }});

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch experience cards");
    }

    return {cards:result.data||[], lang};
  },
  component: RouteComponent,
})

// TODO: wire this up once you have a save/create endpoint for calendars
// import { createCalendar } from "@/lib/booking";
 
// ---- Step type ----
type Step = "preset" | "experience" | "calendar";
 
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
  const { cards, lang} = Route.useLoaderData();
  const [step, setStep] = useState<Step>("preset");
 
  // ----- preset state -----
  const [presets, setPresets] = useState<SlotPreset[]>(DEFAULT_PRESETS);
  const [selectedPreset, setSelectedPreset] = useState<SlotPreset | null>(null);
  const [customPreset, setCustomPreset] = useState({ id: "", label: "", durationMinutes: 60 });
 
  // ----- experience card state -----
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsError, setCardsError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<FeatureCard | null>(null);
 
  // ----- hydrated experience state -----
  const [hydratedExperience, setHydratedExperience] = useState<any>(null);
  const [experienceLoading, setExperienceLoading] = useState(false);
  const [experienceError, setExperienceError] = useState<string | null>(null);
 
  // ----- calendar form state -----
  const [calendarForm, setCalendarForm] = useState<Omit<Calendar, "experiences">>({
    start_date: "",
    end_date: "",
    start_time: "09:00",
    end_time: "17:00",
    days_of_week: [1, 2, 3, 4, 5],
    buffer_minutes: 15,
    units: [],
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // ---- handlers ----
 
  function handleSelectPreset(preset: SlotPreset) {
    setSelectedPreset(preset);
  }
 
  function handleAddCustomPreset() {
    if (!customPreset.id || !customPreset.label || !customPreset.durationMinutes) return;
    const newPreset: SlotPreset = { ...customPreset };
    setPresets((prev) => [...prev, newPreset]);
    setSelectedPreset(newPreset);
    setCustomPreset({ id: "", label: "", durationMinutes: 60 });
  }
 
  function handleConfirmPreset() {
    if (!selectedPreset) return;
    setStep("experience");
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
 
  async function handleSubmitCalendar() {
    if (!selectedCard) return;
 
    const calendar: Calendar = {
      ...calendarForm,
      experiences: selectedCard.id,
    };
 
    setSaving(true);
    setSaveError(null);
 
    try {
      // TODO: replace with your real save call, e.g.:
      // const result = await createCalendar(calendar);
      // if (result.error) throw new Error(result.error);
      console.log("Calendar to save:", calendar);
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

      {/* ---------------- STEP 1: PRESET ---------------- */}
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

      {/* ---------------- STEP 2: EXPERIENCE CARDS ---------------- */}
      {(step === "experience" || step === "calendar") && (
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            2. Choose an experience to link
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
                  {resolveTranslatable(card.title, lang||"en") ?? card.id}
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
            3. Set up the calendar for "
            {resolveTranslatable(hydratedExperience.title, lang||"en") ??
              selectedCard?.id}
            "
          </h2>

          <div className="space-y-6">
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

            <label className="block text-sm font-medium text-gray-700">
              Buffer minutes
              <input
                type="number"
                value={calendarForm.buffer_minutes ?? 0}
                onChange={(e) => updateField("buffer_minutes", Number(e.target.value))}
                className="mt-1 w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </label>

            {/* Units editor - minimal, expand as needed */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Unit types</p>
              {(calendarForm.units ?? []).map((unit, i) => (
                <div key={i} className="flex flex-wrap gap-3 mb-3 items-end">
                  <input
                    placeholder="id"
                    value={unit.id}
                    onChange={(e) => {
                      const units = [...(calendarForm.units ?? [])];
                      units[i] = { ...unit, id: e.target.value };
                      updateField("units", units);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
                  />
                  <input
                    placeholder="label"
                    value={unit.label}
                    onChange={(e) => {
                      const units = [...(calendarForm.units ?? [])];
                      units[i] = { ...unit, label: e.target.value };
                      updateField("units", units);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
                  />
                  <input
                    type="number"
                    placeholder="capacity"
                    value={unit.capacity}
                    onChange={(e) => {
                      const units = [...(calendarForm.units ?? [])];
                      units[i] = { ...unit, capacity: Number(e.target.value) };
                      updateField("units", units);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-28"
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  updateField("units", [
                    ...(calendarForm.units ?? []),
                    { id: "", label: "", capacity: 1 } as UnitType,
                  ])
                }
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                + Add unit type
              </button>
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
                {saving ? "Saving..." : "Create calendar"}
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
