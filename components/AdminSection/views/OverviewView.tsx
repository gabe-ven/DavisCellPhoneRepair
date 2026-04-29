'use client'

import { Ticket, Wrench, CheckCircle, Calendar, Phone } from 'lucide-react'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { deviceLabel } from '../utils/deviceLabel'
import { useTickets } from '../hooks/useTickets'

const STATUS_BAR: Record<string, string> = {
  received:  'bg-blue-500',
  reviewing: 'bg-yellow-400',
  in_repair: 'bg-orange-500',
  ready:     'bg-green-500',
  completed: 'bg-[#d4d4d4] dark:bg-[#383838]',
}

const STATUS_LABELS: Record<string, string> = {
  received: 'Received', reviewing: 'Reviewing', in_repair: 'In Repair', ready: 'Ready', completed: 'Completed',
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

  const todayQueue = [...tickets]
    .filter(t => t.appointment.date === todayStr)
    .sort((a, b) => parseTimeSlot(a.appointment.timeSlot) - parseTimeSlot(b.appointment.timeSlot))

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
      <div className="flex items-center justify-center h-48 text-[#bbb] dark:text-[#444] text-sm">
        Loading…
      </div>
    )
  }

  if (error) return <p className="text-red-500 text-sm mt-4">{error}</p>

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <p className="text-[13px] text-[#aaa] dark:text-[#555] font-normal mb-1">
          {getGreeting()} — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-[30px] font-bold text-[#111] dark:text-[#f0f0f0] leading-tight" style={{ letterSpacing: '-0.025em' }}>
          Dashboard
        </h1>
        <p className="text-[14px] text-[#aaa] dark:text-[#555] mt-0.5">
          {stats.received > 0
            ? `${stats.received} new request${stats.received !== 1 ? 's' : ''} waiting for review.`
            : 'All requests are being handled.'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard
          label="Total Tickets"
          value={stats.total}
          subtext={<span><b className="text-[#6366f1] dark:text-[#818cf8] font-semibold">+{stats.thisWeek}</b> this week</span>}
          icon={<Ticket size={17} strokeWidth={2} className="text-[#6366f1] dark:text-[#818cf8]" />}
          iconBg="bg-indigo-50 dark:bg-indigo-950/40"
        />
        <StatCard
          label="In Repair"
          value={stats.in_repair}
          subtext="Active right now"
          icon={<Wrench size={17} strokeWidth={2} className="text-orange-500" />}
          iconBg="bg-orange-50 dark:bg-orange-950/40"
        />
        <StatCard
          label="Ready for Pickup"
          value={stats.ready}
          subtext="Awaiting customer"
          icon={<CheckCircle size={17} strokeWidth={2} className="text-green-500" />}
          iconBg="bg-green-50 dark:bg-green-950/40"
        />
        <StatCard
          label="Today's Appointments"
          value={stats.todayAppts}
          subtext="Scheduled today"
          icon={<Calendar size={17} strokeWidth={2} className="text-blue-500" />}
          iconBg="bg-blue-50 dark:bg-blue-950/40"
        />
      </div>

      {/* Today's Queue */}
      <div className="bg-white dark:bg-[#141414] border border-[#ebebeb] dark:border-[#1e1e1e] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f0f0] dark:border-[#1e1e1e]">
          <h2 className="text-[14px] font-semibold text-[#111] dark:text-[#f0f0f0]">Today&apos;s Queue</h2>
          <span className="text-[12px] font-semibold text-[#6366f1] dark:text-[#818cf8]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
            {todayQueue.length} appt{todayQueue.length !== 1 ? 's' : ''}
          </span>
        </div>

        {todayQueue.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-[#ccc] dark:text-[#333]">
            <Calendar size={28} strokeWidth={1.4} />
            <p className="text-[13px]">No appointments scheduled for today.</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#fafafa] dark:bg-[#111]">
                {['Time', 'Customer', 'Device', 'Issues', 'Assigned To', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-2.5 text-[10.5px] font-bold text-[#aaa] dark:text-[#444] uppercase tracking-widest border-b border-[#f0f0f0] dark:border-[#1e1e1e]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {todayQueue.map((ticket, i) => (
                <tr
                  key={ticket.ticketId}
                  className={`hover:bg-[#fafafa] dark:hover:bg-[#111] transition-colors ${
                    i !== todayQueue.length - 1 ? 'border-b border-[#f5f5f5] dark:border-[#1a1a1a]' : ''
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-bold text-[#111] dark:text-[#e0e0e0]" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                      {ticket.appointment.timeSlot ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-semibold text-[#111] dark:text-[#e0e0e0]">{ticket.customer.name}</p>
                    <a
                      href={`tel:${ticket.customer.phone.replace(/\D/g, '')}`}
                      className="flex items-center gap-1 text-[11px] text-[#6366f1] dark:text-[#818cf8] hover:underline mt-0.5"
                    >
                      <Phone size={10} />
                      {ticket.customer.phone}
                    </a>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] text-[#555] dark:text-[#aaa]">{deviceLabel(ticket.device.type)}</p>
                    <p className="text-[11px] text-[#bbb] dark:text-[#555]">
                      {[ticket.device.brand, ticket.device.modelCustom ?? ticket.device.modelTrim].filter(Boolean).join(' ')}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 max-w-[160px]">
                    <p className="text-[13px] text-[#555] dark:text-[#aaa] truncate">{ticket.issues.join(', ')}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] text-[#555] dark:text-[#aaa]">
                      {ticket.assignedTo ?? <span className="italic text-[#ccc] dark:text-[#333]">Unassigned</span>}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={ticket.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-3">

        {/* Status Breakdown */}
        <div className="bg-white dark:bg-[#141414] border border-[#ebebeb] dark:border-[#1e1e1e] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0f0f0] dark:border-[#1e1e1e]">
            <h2 className="text-[14px] font-semibold text-[#111] dark:text-[#f0f0f0]">Status Breakdown</h2>
          </div>
          <div className="flex flex-col gap-3 px-5 py-4">
            {(['received', 'reviewing', 'in_repair', 'ready', 'completed'] as const).map(s => {
              const count = stats[s as keyof typeof stats] as number
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className="w-[82px] flex-shrink-0 text-[12px] font-medium text-[#777] dark:text-[#777]">
                    {STATUS_LABELS[s]}
                  </span>
                  <div className="flex-1 h-[5px] rounded-full bg-[#f0f0f0] dark:bg-[#1e1e1e] overflow-hidden">
                    <div className={`h-full rounded-full ${STATUS_BAR[s]} transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[12px] font-semibold text-[#aaa] dark:text-[#555] min-w-[20px] text-right" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Technician Workload */}
        <div className="bg-white dark:bg-[#141414] border border-[#ebebeb] dark:border-[#1e1e1e] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0f0f0] dark:border-[#1e1e1e]">
            <h2 className="text-[14px] font-semibold text-[#111] dark:text-[#f0f0f0]">
              Technician Workload
              <span className="ml-2 text-[11px] font-normal text-[#bbb] dark:text-[#444]">open tickets</span>
            </h2>
          </div>

          {techEntries.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-[#ccc] dark:text-[#333] text-[13px]">
              No technicians assigned yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3 px-5 py-4">
              {techEntries.map(([tech, count]) => (
                <div key={tech} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#6366f1]/[0.08] dark:bg-[#6366f1]/[0.15] text-[#6366f1] dark:text-[#818cf8] flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                    {tech.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-medium text-[#333] dark:text-[#d4d4d4] flex-1 truncate">{tech}</span>
                  <div className="flex-1 h-[5px] rounded-full bg-[#f0f0f0] dark:bg-[#1e1e1e] overflow-hidden max-w-[80px]">
                    <div className="h-full rounded-full bg-[#6366f1] transition-all duration-500" style={{ width: `${(count / maxLoad) * 100}%` }} />
                  </div>
                  <span className="text-[13px] font-bold text-[#6366f1] dark:text-[#818cf8] min-w-[20px] text-right" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
