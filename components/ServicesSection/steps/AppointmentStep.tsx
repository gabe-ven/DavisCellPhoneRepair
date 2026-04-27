'use client'

import { useState } from 'react'
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { getSlotsForDate } from '../data/timeSlots'

interface AppointmentStepProps {
  setAppointment: (date: string, timeSlot: string) => void
  skipAppointment: () => void
  nextStep: () => void
}

const STORE_MAPS_URL = 'https://maps.google.com/?q=140+B+St+%234+Davis+CA+95616'

// ─── Calendar helpers ────────────────────────────────────────────────────────

function toISODate(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

function getTodayISO(): string {
  const t = new Date()
  return toISODate(t.getFullYear(), t.getMonth(), t.getDate())
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay() // 0 = Sunday
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// ─── Component ───────────────────────────────────────────────────────────────

export default function AppointmentStep({
  setAppointment,
  skipAppointment,
  nextStep,
}: AppointmentStepProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const todayISO = getTodayISO()
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
    // Clear selection if it no longer falls in the new view
    setSelectedDate(null)
    setSelectedSlot(null)
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
    setSelectedDate(null)
    setSelectedSlot(null)
  }

  function handleDayClick(day: number) {
    const iso = toISODate(viewYear, viewMonth, day)
    if (iso < todayISO) return // past date — disabled
    if (selectedDate === iso) {
      // deselect
      setSelectedDate(null)
      setSelectedSlot(null)
    } else {
      setSelectedDate(iso)
      setSelectedSlot(null) // reset slot when date changes
    }
  }

  function handleSlotClick(label: string) {
    setSelectedSlot(prev => (prev === label ? null : label))
  }

  function handleContinue() {
    if (!selectedDate || !selectedSlot) return
    setAppointment(selectedDate, selectedSlot)
    nextStep()
  }

  function handleSkip() {
    skipAppointment()
    nextStep()
  }

  const canContinue = !!selectedDate && !!selectedSlot
  const slots = selectedDate ? getSlotsForDate(selectedDate) : []

  // Build the calendar grid cells
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete the last week row
  while (cells.length % 7 !== 0) cells.push(null)

  // Determine if we can go back (don't go before current month)
  const isCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth()

  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      {/* Store info */}
      <a
        href={STORE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors mb-6 group"
      >
        <MapPin className="w-4 h-4 text-red-500 group-hover:text-red-600 flex-shrink-0" />
        <span>140 B St #4, Davis, CA 95616</span>
      </a>

      {/* Main layout: calendar + slots */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* ── Calendar ── */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              disabled={isCurrentMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-slate-800">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-gray-50 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map(d => (
              <div key={d} className="text-center text-[11px] font-medium text-slate-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => {
              if (!day) {
                return <div key={`empty-${i}`} />
              }
              const iso = toISODate(viewYear, viewMonth, day)
              const isPast = iso < todayISO
              const isToday = iso === todayISO
              const isSelected = iso === selectedDate

              return (
                <button
                  key={iso}
                  onClick={() => handleDayClick(day)}
                  disabled={isPast}
                  className={[
                    'mx-auto w-8 h-8 rounded-full text-sm flex items-center justify-center transition-all',
                    isPast
                      ? 'text-slate-200 cursor-not-allowed'
                      : isSelected
                      ? 'bg-red-600 text-white font-semibold shadow-sm'
                      : isToday
                      ? 'bg-red-50 text-red-600 font-semibold ring-1 ring-red-200 hover:bg-red-100'
                      : 'text-slate-700 hover:bg-gray-100',
                  ].join(' ')}
                  aria-label={iso}
                  aria-pressed={isSelected}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Time slots ── */}
        <div className="sm:w-44 flex flex-col">
          {selectedDate ? (
            <>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                Available Times
              </p>
              <div className="flex flex-col gap-2">
                {slots.map(slot => {
                  const isChosen = slot.label === selectedSlot
                  return (
                    <button
                      key={slot.label}
                      onClick={() => handleSlotClick(slot.label)}
                      className={[
                        'w-full text-sm font-medium py-2 px-3 rounded-xl border transition-all',
                        isChosen
                          ? 'bg-red-600 border-red-600 text-white shadow-sm'
                          : 'bg-white border-gray-200 text-slate-700 hover:border-red-300 hover:bg-red-50',
                      ].join(' ')}
                    >
                      {slot.label}
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-slate-400 text-center">
                Select a date to see available times
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={handleSkip}
          className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-slate-600 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          Skip
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={[
            'flex-1 py-3 rounded-xl font-semibold text-sm transition-all',
            canContinue
              ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed',
          ].join(' ')}
        >
          Continue
        </button>
      </div>
    </div>
  )
}