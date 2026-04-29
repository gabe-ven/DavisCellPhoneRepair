'use client'

import { Ticket, Wrench, CheckCircle, Calendar } from 'lucide-react'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { deviceLabel } from '../utils/deviceLabel'
import { useTickets } from '../hooks/useTickets'

const STATUS_BAR_COLORS: Record<string, string> = {
  received:  'bg-blue-500',
  reviewing: 'bg-yellow-400',
  in_repair: 'bg-orange-500',
  ready:     'bg-green-500',
  completed: 'bg-gray-400',
}

function parseTimeSlot(slot: string | null | undefined): number {
  if (!slot) return 9999
  const m = slot.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 9999
  let h = parseInt(m[1]); const min = parseInt(m[2]); const ap = m[3].toUpperCase()
  if (ap === 'PM' && h !== 12) h += 12
  if (ap === 'AM' && h === 12) h = 0
  return h * 60 + min
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}


export default function OverviewView() {
  const { tickets, loading, error } = useTickets()

  const todayStr = new Date().toISOString().split('T')[0]
  const weekAgo  = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const stats = {
    total:      tickets.length,
    in_repair:  tickets.filter(t => t.status === 'in_repair').length,
    ready:      tickets.filter(t => t.status === 'ready').length,
    todayAppts: tickets.filter(t => t.appointment.date === todayStr).length,
    thisWeek:   tickets.filter(t => new Date(t.createdAt) >= weekAgo).length,
    received:   tickets.filter(t => t.status === 'received').length,
    reviewing:  tickets.filter(t => t.status === 'reviewing').length,
    completed:  tickets.filter(t => t.status === 'completed').length,
  }

  // Today's queue — appointments today, sorted by time
  const todayQueue = [...tickets]
    .filter(t => t.appointment.date === todayStr)
    .sort((a, b) => parseTimeSlot(a.appointment.timeSlot) - parseTimeSlot(b.appointment.timeSlot))

  // Technician workload — open tickets per assignee
  const techWorkload = tickets
    .filter(t => t.assignedTo && t.status !== 'completed')
    .reduce<Record<string, number>>((acc, t) => {
      const tech = t.assignedTo!
      acc[tech] = (acc[tech] ?? 0) + 1
      return acc
    }, {})
  const techEntries = Object.entries(techWorkload).sort((a, b) => b[1] - a[1])
  const maxLoad = Math.max(1, ...Object.values(techWorkload))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-[#9ca3af] dark:text-[#6b7280] text-base">
        Loading…
      </div>
    )
  }

  if (error) return <p className="text-red-500 text-base mt-4">{error}</p>

  return (
    <div className="flex flex-col gap-6">

      {/* Welcome */}
      <div className="mb-2">
        <p className="text-[15px] text-[#9ca3af] dark:text-[#6b7280] font-normal mb-1">
          {getGreeting()}, welcome back 👋
        </p>
        <h1 className="text-[32px] font-bold text-[#111111] dark:text-[#f5f5f5] leading-tight tracking-tight">
          Davis Cell Phone Repair
        </h1>
        <p className="text-[15px] text-[#9ca3af] dark:text-[#6b7280] mt-1">
          Here's what's happening at Davis Cell Phone Repair today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Tickets"
          value={stats.total}
          subtext={<span><b className="text-[#8B1A1A]">+{stats.thisWeek}</b> this week</span>}
          icon={<Ticket size={18} strokeWidth={2} className="text-[#8B1A1A]" />}
          iconBg="bg-red-50 dark:bg-red-950/60"
        />
        <StatCard
          label="In Repair"
          value={stats.in_repair}
          subtext="Active repairs"
          icon={<Wrench size={18} strokeWidth={2} className="text-orange-500" />}
          iconBg="bg-orange-50 dark:bg-orange-950/60"
        />
        <StatCard
          label="Ready for Pickup"
          value={stats.ready}
          subtext="Awaiting pickup"
          icon={<CheckCircle size={18} strokeWidth={2} className="text-green-500" />}
          iconBg="bg-green-50 dark:bg-green-950/60"
        />
        <StatCard
          label="Appointments Today"
          value={stats.todayAppts}
          subtext="Today's bookings"
          icon={<Calendar size={18} strokeWidth={2} className="text-blue-500" />}
          iconBg="bg-blue-50 dark:bg-blue-950/60"
        />
      </div>

      {/* Today's Queue */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] dark:border-[#2a2a2a]">
          <div>
            <span className="text-[16px] font-semibold text-[#111111] dark:text-[#f0f0f0]">Today's Queue</span>
            <span className="ml-2 text-[12px] text-[#9ca3af]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <span className="text-[13px] font-semibold text-[#8B1A1A]">
            {todayQueue.length} appointment{todayQueue.length !== 1 ? 's' : ''}
          </span>
        </div>

        {todayQueue.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-[#9ca3af]">
            <Calendar size={28} strokeWidth={1.5} />
            <p className="text-[14px]">No appointments scheduled for today.</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Time', 'Customer', 'Device', 'Issues', 'Assigned To', 'Status'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider border-b border-[#e5e7eb] dark:border-[#2a2a2a]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {todayQueue.map(ticket => (
                <tr key={ticket.ticketId} className="hover:bg-[#f9f9f9] dark:hover:bg-[#222] transition-colors">
                  <td className="px-6 py-3.5 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                    <span className="text-[13px] font-bold text-[#111111] dark:text-[#f0f0f0]">
                      {ticket.appointment.timeSlot ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                    <p className="text-[14px] font-semibold text-[#111111] dark:text-[#f0f0f0]">{ticket.customer.name}</p>
                    <a
                      href={`tel:${ticket.customer.phone.replace(/\D/g, '')}`}
                      className="text-[12px] text-[#8B1A1A] hover:underline"
                    >
                      {ticket.customer.phone}
                    </a>
                  </td>
                  <td className="px-6 py-3.5 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                    <p className="text-[13px] text-[#374151] dark:text-[#a3a3a3]">{deviceLabel(ticket.device.type)}</p>
                    <p className="text-[12px] text-[#9ca3af]">
                      {[ticket.device.brand, ticket.device.modelCustom ?? ticket.device.modelTrim]
                        .filter(Boolean).join(' ')}
                    </p>
                  </td>
                  <td className="px-6 py-3.5 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50 max-w-[160px]">
                    <p className="text-[13px] text-[#374151] dark:text-[#a3a3a3] truncate">{ticket.issues.join(', ')}</p>
                  </td>
                  <td className="px-6 py-3.5 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                    <span className="text-[13px] text-[#374151] dark:text-[#9ca3af]">
                      {ticket.assignedTo ?? <span className="text-[#9ca3af] italic">Unassigned</span>}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                    <StatusBadge status={ticket.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-4">

        {/* Status Breakdown */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[#2a2a2a]">
            <span className="text-[16px] font-semibold text-[#111111] dark:text-[#f0f0f0]">Status Breakdown</span>
          </div>
          <div className="flex flex-col gap-3 px-6 py-4">
            {(['received', 'reviewing', 'in_repair', 'ready', 'completed'] as const).map(s => {
              const count = stats[s as keyof typeof stats] as number
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={s} className="flex items-center gap-3">
                  <div className="w-[90px] flex-shrink-0">
                    <StatusBadge status={s} />
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-[#f5f5f5] dark:bg-[#2a2a3e] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${STATUS_BAR_COLORS[s]} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[13px] text-[#9ca3af] min-w-[20px] text-right font-medium">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Technician Workload */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[#2a2a2a]">
            <span className="text-[16px] font-semibold text-[#111111] dark:text-[#f0f0f0]">Technician Workload</span>
            <span className="ml-2 text-[12px] text-[#9ca3af]">open tickets</span>
          </div>

          {techEntries.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-[#9ca3af] text-[13px] italic">
              No technicians assigned yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3 px-6 py-4">
              {techEntries.map(([tech, count]) => (
                <div key={tech} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A] flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                    {tech.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-medium text-[#374151] dark:text-[#d4d4d4] flex-1 truncate">{tech}</span>
                  <div className="flex-1 h-2 rounded-full bg-[#f5f5f5] dark:bg-[#2a2a3e] overflow-hidden max-w-[80px]">
                    <div
                      className="h-full rounded-full bg-[#8B1A1A] transition-all duration-500"
                      style={{ width: `${(count / maxLoad) * 100}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-semibold text-[#8B1A1A] min-w-[20px] text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
