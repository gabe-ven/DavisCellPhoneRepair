'use client'

import { useState } from 'react'
import { Bell, CheckCircle, Clock } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import TicketDetailPanel from '../components/TicketDetailPanel'
import { useTickets } from '../hooks/useTickets'
import { deviceLabel } from '../utils/deviceLabel'
import type { TicketStatus } from '../types/admin'

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
  received:  'bg-[#6366f1]',
  reviewing: 'bg-yellow-400',
  in_repair: 'bg-orange-500',
  ready:     'bg-green-500',
  completed: 'bg-[#d4d4d4] dark:bg-[#404040]',
}

const STATUS_MSG: Record<string, string> = {
  received:  'New repair request submitted',
  reviewing: 'Ticket is being reviewed',
  in_repair: 'Repair has started',
  ready:     'Device is ready for pickup',
  completed: 'Repair completed',
}

interface NotificationsViewProps {
  dismissed: string[]
  onDismiss: (id: string) => void
  onDismissAll: (ids: string[]) => void
}

export default function NotificationsView({ dismissed, onDismiss, onDismissAll }: NotificationsViewProps) {
  const { tickets, loading, updateStatus } = useTickets()
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const selectedTicket = tickets.find(t => t.ticketId === selectedTicketId) ?? null

  async function handleStatusChange(ticketId: string, status: TicketStatus) {
    await updateStatus(ticketId, status)
  }

  const notifications = tickets
    .filter(t => !dismissed.includes(t.ticketId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const newCount = notifications.filter(t => t.status === 'received').length

  return (
    <>
    {selectedTicket && (
      <TicketDetailPanel
        ticket={selectedTicket}
        onClose={() => setSelectedTicketId(null)}
        onStatusChange={handleStatusChange}
      />
    )}
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#111111] dark:text-[#f5f5f5] leading-tight tracking-tight">
            Notifications
          </h1>
          <p className="text-[15px] text-[#9ca3af] dark:text-[#737373] mt-1">
            {newCount > 0
              ? `${newCount} new request${newCount > 1 ? 's' : ''} waiting for review.`
              : 'All requests are being handled.'}
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={() => onDismissAll(notifications.map(t => t.ticketId))}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#e5e7eb] dark:border-[#262626] text-[13px] font-medium text-[#374151] dark:text-[#d4d4d4] hover:bg-[#f9f9f9] dark:hover:bg-[#1f1f1f] transition-colors bg-white dark:bg-[#1a1a1a] cursor-pointer"
          >
            <CheckCircle size={14} />
            Dismiss all
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#262626] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-[#9ca3af] dark:text-[#737373]">
            Loading…
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-[#9ca3af] dark:text-[#737373]">
            <Bell size={32} strokeWidth={1.5} />
            <p className="text-sm">All caught up — no notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#e5e7eb] dark:divide-[#262626]/70">
            {notifications.map(t => {
              const isNew = t.status === 'received'
              return (
                <div
                  key={t.ticketId}
                  onClick={() => setSelectedTicketId(t.ticketId)}
                  className={`flex items-start gap-4 px-6 py-4 hover:bg-[#f9f9f9] dark:hover:bg-[#1f1f1f] transition-colors cursor-pointer ${
                    isNew ? 'bg-indigo-50/30 dark:bg-[#13131f]' : ''
                  }`}
                >
                  {/* Status dot */}
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${STATUS_DOT[t.status] ?? 'bg-gray-300'}`}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[14px] font-semibold text-[#111111] dark:text-[#f0f0f0]">
                        {t.customer.name}
                      </span>
                      <span className="font-mono text-[11px] text-[#9ca3af] dark:text-[#737373]">
                        #{t.ticketId}
                      </span>
                      <StatusBadge status={t.status} />
                      {isNew && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#6366f1] text-white">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-[#374151] dark:text-[#a3a3a3] font-medium mb-0.5">
                      {STATUS_MSG[t.status]}
                    </p>
                    <p className="text-[12px] text-[#9ca3af] dark:text-[#737373] leading-snug">
                      {deviceLabel(t.device.type)}
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
                    <span className="flex items-center gap-1 text-[12px] text-[#9ca3af] dark:text-[#737373]">
                      <Clock size={11} />
                      {timeAgo(t.createdAt)}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); onDismiss(t.ticketId) }}
                      className="text-[12px] text-[#9ca3af] hover:text-[#374151] dark:hover:text-[#d4d4d4] transition-colors cursor-pointer"
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
    </>
  )
}
