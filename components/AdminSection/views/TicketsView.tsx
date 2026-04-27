'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { useTickets } from '../hooks/useTickets'
import type { TicketStatus } from '../types/admin'

const STATUS_FILTERS = ['all', 'received', 'reviewing', 'in_repair', 'ready', 'completed'] as const
type Filter = typeof STATUS_FILTERS[number]

const STATUS_OPTIONS: TicketStatus[] = ['received', 'reviewing', 'in_repair', 'ready', 'completed']

export default function TicketsView() {
  const { tickets, loading, error, updateStatus } = useTickets()
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = tickets
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => {
      const q = search.toLowerCase()
      return (
        t.ticketId.toLowerCase().includes(q) ||
        t.customer.name.toLowerCase().includes(q) ||
        t.customer.email.toLowerCase().includes(q) ||
        t.customer.phone.includes(q)
      )
    })

  async function handleStatusChange(ticketId: string, status: TicketStatus) {
    setUpdatingId(ticketId)
    await updateStatus(ticketId, status)
    setUpdatingId(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[32px] font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
          Tickets
        </h1>
        <p className="text-[15px] text-gray-400 dark:text-[#8888aa] mt-1">
          Manage and update all repair requests.
        </p>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                filter === s
                  ? 'bg-[#8B1A1A] text-white'
                  : 'bg-white dark:bg-[#1c1c2e] border border-gray-200 dark:border-[#2a2a3e] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#16162a]'
              }`}
            >
              {s === 'all' ? 'All' : s === 'in_repair' ? 'In Repair' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 h-9 px-3 rounded-xl border border-gray-200 dark:border-[#2a2a3e] bg-white dark:bg-[#1c1c2e] max-w-[280px] flex-1">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, ticket ID…"
            className="bg-transparent text-[13px] text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 flex-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1c1c2e] border border-gray-200 dark:border-[#2a2a3e] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500">
            Loading tickets…
          </div>
        ) : error ? (
          <div className="p-6 text-red-500 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
            No tickets found.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Ticket ID', 'Customer', 'Device', 'Issues', 'Appointment', 'Status', 'Update'].map(h => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-[#2a2a3e]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ticket => (
                <tr
                  key={ticket.ticketId}
                  className="hover:bg-gray-50 dark:hover:bg-[#16162a] transition-colors"
                >
                  <td className="px-5 py-4 border-b border-gray-100 dark:border-[#2a2a3e]/50">
                    <span className="font-mono text-[12px] text-gray-400 dark:text-gray-500">
                      #{ticket.ticketId}
                    </span>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 dark:border-[#2a2a3e]/50">
                    <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">
                      {ticket.customer.name}
                    </p>
                    <p className="text-[12px] text-gray-400 dark:text-gray-500">
                      {ticket.customer.phone}
                    </p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 dark:border-[#2a2a3e]/50">
                    <p className="text-[14px] text-gray-700 dark:text-gray-300 capitalize">
                      {ticket.device.type}
                    </p>
                    <p className="text-[12px] text-gray-400 dark:text-gray-500">
                      {[ticket.device.brand, ticket.device.modelCustom ?? ticket.device.modelTrim ?? ticket.device.modelNumber]
                        .filter(Boolean).join(' ')}
                    </p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 dark:border-[#2a2a3e]/50 max-w-[160px]">
                    <p className="text-[13px] text-gray-600 dark:text-gray-300 truncate">
                      {ticket.issues.join(', ')}
                    </p>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 dark:border-[#2a2a3e]/50">
                    {ticket.appointment.date ? (
                      <>
                        <p className="text-[13px] text-gray-700 dark:text-gray-300">
                          {new Date(ticket.appointment.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-[12px] text-gray-400 dark:text-gray-500">
                          {ticket.appointment.timeSlot}
                        </p>
                      </>
                    ) : (
                      <span className="text-[12px] text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 dark:border-[#2a2a3e]/50">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 dark:border-[#2a2a3e]/50">
                    <div className="relative inline-block">
                      <select
                        value={ticket.status}
                        disabled={updatingId === ticket.ticketId}
                        onChange={e => handleStatusChange(ticket.ticketId, e.target.value as TicketStatus)}
                        className="appearance-none text-[12px] font-medium pl-3 pr-7 py-1.5 rounded-lg border border-gray-200 dark:border-[#2a2a3e] bg-white dark:bg-[#13131f] text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>
                            {s === 'in_repair' ? 'In Repair' : s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
