'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { useTickets } from '../hooks/useTickets'
import type { Ticket } from '../types/admin'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function CalendarView() {
  const { tickets, loading } = useTickets()
  const today = new Date()
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const { year, month } = viewDate
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  // Group tickets by appointment date
  const ticketsByDate = tickets.reduce<Record<string, Ticket[]>>((acc, t) => {
    if (t.appointment.date) {
      acc[t.appointment.date] = [...(acc[t.appointment.date] ?? []), t]
    }
    return acc
  }, {})

  function prevMonth() {
    setViewDate(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 })
    setSelectedDate(null)
  }
  function nextMonth() {
    setViewDate(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 })
    setSelectedDate(null)
  }

  const monthLabel = new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const selectedTickets = selectedDate ? (ticketsByDate[selectedDate] ?? []) : []

  // Build calendar cells
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[32px] font-bold text-[#111111] dark:text-[#f5f5f5] leading-tight tracking-tight">
          Calendar
        </h1>
        <p className="text-[15px] text-[#9ca3af] dark:text-[#6b7280] mt-1">
          View and manage appointments by date.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-5 items-start">

        {/* Calendar grid */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-2xl overflow-hidden">

          {/* Month nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[#2a2a2a]">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a3e] transition-colors text-[#6b7280] dark:text-[#6b7280]"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-[15px] font-semibold text-[#111111] dark:text-[#f0f0f0]">{monthLabel}</span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a3e] transition-colors text-[#6b7280] dark:text-[#6b7280]"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-[#e5e7eb] dark:border-[#2a2a2a]">
            {DAYS.map(d => (
              <div
                key={d}
                className="text-center py-2.5 text-[11px] font-semibold text-[#9ca3af] dark:text-[#6b7280] uppercase tracking-wide"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (!day) {
                return (
                  <div
                    key={`empty-${i}`}
                    className="h-[88px] border-b border-r border-[#e5e7eb]/60 dark:border-[#2a2a2a]/40 bg-[#f9f9f9]/50 dark:bg-[#222]/30"
                  />
                )
              }

              const dateStr = toDateStr(year, month, day)
              const dayTickets = ticketsByDate[dateStr] ?? []
              const isToday = dateStr === todayStr
              const isSelected = selectedDate === dateStr

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`h-[88px] p-2 text-left border-b border-r border-[#e5e7eb]/60 dark:border-[#2a2a2a]/40 transition-colors hover:bg-[#f9f9f9] dark:hover:bg-[#222] ${
                    isSelected ? 'bg-red-50 dark:bg-[#1f1010]' : ''
                  }`}
                >
                  <span
                    className={`text-[13px] font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                      isToday
                        ? 'bg-[#8B1A1A] text-white'
                        : 'text-[#374151] dark:text-[#a3a3a3]'
                    }`}
                  >
                    {day}
                  </span>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {dayTickets.slice(0, 2).map(t => (
                      <span
                        key={t.ticketId}
                        className="text-[10px] truncate rounded px-1 py-0.5 bg-[#8B1A1A]/10 text-[#8B1A1A] dark:text-red-300 font-medium leading-tight"
                      >
                        {t.customer.name.split(' ')[0]} · {t.appointment.timeSlot}
                      </span>
                    ))}
                    {dayTickets.length > 2 && (
                      <span className="text-[10px] text-[#9ca3af] dark:text-[#6b7280]">
                        +{dayTickets.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Day detail panel */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e5e7eb] dark:border-[#2a2a2a]">
            <p className="text-[15px] font-semibold text-[#111111] dark:text-[#f0f0f0]">
              {selectedDate
                ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric',
                  })
                : 'Select a date'}
            </p>
            {selectedDate && (
              <p className="text-[12px] text-[#9ca3af] dark:text-[#6b7280] mt-0.5">
                {selectedTickets.length} appointment{selectedTickets.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40 text-[#9ca3af] dark:text-[#6b7280] text-sm">
              Loading…
            </div>
          ) : !selectedDate ? (
            <div className="flex items-center justify-center h-40 text-[#9ca3af] dark:text-[#6b7280] text-sm">
              Click a day to see appointments
            </div>
          ) : selectedTickets.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-[#9ca3af] dark:text-[#6b7280] text-sm">
              No appointments this day
            </div>
          ) : (
            <div className="divide-y divide-[#e5e7eb] dark:divide-[#2a2a2a]/70">
              {selectedTickets
                .sort((a, b) => (a.appointment.timeSlot ?? '').localeCompare(b.appointment.timeSlot ?? ''))
                .map(t => (
                  <div key={t.ticketId} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] font-semibold text-[#111111] dark:text-[#f0f0f0]">
                        {t.customer.name}
                      </span>
                      <span className="text-[12px] font-medium text-[#8B1A1A] dark:text-red-300">
                        {t.appointment.timeSlot}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#6b7280] dark:text-[#6b7280] mb-2 capitalize">
                      {t.device.type} · {t.issues.join(', ')}
                    </p>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={t.status} />
                      <span className="font-mono text-[11px] text-[#9ca3af] dark:text-[#6b7280]">
                        #{t.ticketId}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
