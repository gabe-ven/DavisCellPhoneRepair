'use client'

import { useState } from 'react'
import { Bell, CheckCircle, Clock } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { useTickets } from '../hooks/useTickets'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs  = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs < 24)  return `${hrs}h ago`
  return `${days}d ago`
}

const STATUS_DOT: Record<string, string> = {
  received:  'bg-[#8B1A1A]',
  reviewing: 'bg-yellow-400',
  in_repair: 'bg-orange-500',
  ready:     'bg-green-500',
  completed: 'bg-gray-400',
}

const STATUS_MSG: Record<string, string> = {
  received:  'New repair request submitted',
  reviewing: 'Ticket is being reviewed',
  in_repair: 'Repair has started',
  ready:     'Device is ready for pickup',
  completed: 'Repair completed',
}

export default function NotificationsView() {
  const { tickets, loading } = useTickets()
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const notifications = tickets
    .filter(t => !dismissed.has(t.ticketId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const newCount = notifications.filter(t => t.status === 'received').length

  function dismiss(ticketId: string) {
    setDismissed(prev => new Set([...prev, ticketId]))
  }

  function dismissAll() {
    setDismissed(new Set(notifications.map(t => t.ticketId)))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
            Notifications
          </h1>
          <p className="text-[15px] text-gray-400 dark:text-[#8888aa] mt-1">
            {newCount > 0
              ? `${newCount} new request${newCount > 1 ? 's' : ''} waiting for review.`
              : 'All requests are being handled.'}
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={dismissAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-[#2a2a3e] text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#16162a] transition-colors bg-white dark:bg-[#1c1c2e]"
          >
            <CheckCircle size={14} />
            Dismiss all
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#1c1c2e] border border-gray-200 dark:border-[#2a2a3e] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500">
            Loading…
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400 dark:text-gray-500">
            <Bell size={32} strokeWidth={1.5} />
            <p className="text-sm">All caught up — no notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-[#2a2a3e]/70">
            {notifications.map(t => {
              const isNew = t.status === 'received'
              return (
                <div
                  key={t.ticketId}
                  className={`flex items-start gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#16162a] transition-colors ${
                    isNew ? 'bg-red-50/40 dark:bg-[#1e1515]' : ''
                  }`}
                >
                  {/* Status dot */}
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${STATUS_DOT[t.status] ?? 'bg-gray-300'}`}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                        {t.customer.name}
                      </span>
                      <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500">
                        #{t.ticketId}
                      </span>
                      <StatusBadge status={t.status} />
                      {isNew && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#8B1A1A] text-white">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-gray-600 dark:text-gray-300 font-medium mb-0.5">
                      {STATUS_MSG[t.status]}
                    </p>
                    <p className="text-[12px] text-gray-400 dark:text-gray-500 leading-snug capitalize">
                      {t.device.type}
                      {t.device.brand ? ` · ${t.device.brand}` : ''}
                      {(t.device.modelCustom ?? t.device.modelTrim ?? t.device.modelNumber)
                        ? ` ${t.device.modelCustom ?? t.device.modelTrim ?? t.device.modelNumber}` : ''}
                      {t.issues.length > 0 ? ` · ${t.issues.join(', ')}` : ''}
                      {t.appointment.date
                        ? ` · Appt ${new Date(t.appointment.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${t.appointment.timeSlot}`
                        : ''}
                    </p>
                  </div>

                  {/* Time + dismiss */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="flex items-center gap-1 text-[12px] text-gray-400 dark:text-gray-500">
                      <Clock size={11} />
                      {timeAgo(t.createdAt)}
                    </span>
                    <button
                      onClick={() => dismiss(t.ticketId)}
                      className="text-[12px] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
