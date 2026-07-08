// app/routes/_authed/dashboard/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_authed/dashboard/')({
  component: RouteComponent,
})

// ------------------------------------------------------------------
// Data: Guides
// ------------------------------------------------------------------
type Guide = {
  id: string
  title: string
  description: string
  icon: string
  steps: string[]
}

const GUIDES: Guide[] = [
  {
    id: 'create-experience',
    title: 'Creating Experiences',
    description: 'Build new experiences with blocks, images, and multilingual content.',
    icon: '✍️',
    steps: [
      'Navigate to "Create Experience" in the sidebar.',
      'Select the language (English / Afrikaans) for the content.',
      'Upload a cover image.',
      'Add categories (type and press Enter).',
      'Fill in the title and short description.',
      'Add content blocks: header, paragraph, image, video, or selectable.',
      'Click "Create Experience" to save.',
      'You can later edit the experience and add translations by switching languages and saving again.'
    ]
  },
  {
    id: 'manage-schedules',
    title: 'Managing Schedules',
    description: 'View, edit, or delete existing schedules for experiences.',
    icon: '📅',
    steps: [
      'Go to "Schedules" in the sidebar (dashboard/calendars).',
      'You\'ll see a list of all created schedules.',
      'Each schedule shows its linked experience, date range, days of week, buffer time, and unit types.',
      'Click "Edit" (pencil icon) to modify the schedule – this takes you to the creation form with pre-filled data.',
      'Click "Delete" (trash icon) to remove the schedule permanently.',
      'Unit types can also be managed here: add, edit, or remove them.'
    ]
  },
  {
    id: 'create-schedule',
    title: 'Creating Schedules',
    description: 'Link an experience, set dates, times, and define unit types with prices.',
    icon: '⏰',
    steps: [
      'Go to "Create Schedule" in the sidebar.',
      'First, select an existing experience to link the schedule to.',
      'Fill in the title (auto-filled from experience).',
      'Set start and end dates.',
      'Toggle "All-day slot" if the booking is for a full day (e.g., event, campsite).',
      'Otherwise, set start and end times.',
      'Select the days of the week the schedule applies to.',
      'Set a buffer time between bookings (e.g., cleaning time).',
      'Add unit types: label, capacity, price per unit. You can add multiple.',
      'Click "Create Calendar" to save.',
      'If you later click "Update" from the manage page, the form will be pre-filled with existing data – just save to update.'
    ]
  }
]

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
function RouteComponent() {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null)

  const openModal = (guide: Guide) => setSelectedGuide(guide)
  const closeModal = () => setSelectedGuide(null)

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className="display-title text-4xl font-bold text-[var(--sea-ink)]">
          Dashboard Wiki
        </h1>
        <p className="text-[var(--sea-ink-soft)] mt-1">
          Quick guides to get the most out of your dashboard.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {GUIDES.map(guide => (
          <div
            key={guide.id}
            className="feature-card rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border border-[var(--line)]"
            onClick={() => openModal(guide)}
          >
            <div className="text-4xl mb-3">{guide.icon}</div>
            <h3 className="text-xl font-semibold text-[var(--sea-ink)]">
              {guide.title}
            </h3>
            <p className="text-[var(--sea-ink-soft)] text-sm mt-1">
              {guide.description}
            </p>
            <div className="mt-4 text-[var(--lagoon)] text-sm font-medium flex items-center gap-1">
              Learn more →
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="island-shell rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] text-2xl"
            >
              ✕
            </button>

            {/* Content */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedGuide.icon}</span>
                <h2 className="text-2xl font-bold text-[var(--sea-ink)] display-title">
                  {selectedGuide.title}
                </h2>
              </div>
              <div className="border-t border-[var(--line)] pt-4">
                <h3 className="text-sm uppercase tracking-wider text-[var(--kicker)] font-semibold mb-3">
                  How-to Guide
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-[var(--sea-ink)]">
                  {selectedGuide.steps.map((step, idx) => (
                    <li key={idx} className="text-sm leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}