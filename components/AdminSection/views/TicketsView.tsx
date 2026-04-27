'use client'

import { useState, useRef } from 'react'
import { Search, ChevronDown, Plus, CheckCircle, UserRound } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import CreateTicketModal from '../components/CreateTicketModal'
import { useTickets } from '../hooks/useTickets'
import { updateAssignedTo } from '../api/adminApi'
import type { TicketStatus } from '../types/admin'

// Inline assignee cell — click to edit, blur/Enter to save
function AssigneeCell({ ticketId, value }: { ticketId: string; value: string | null | undefined }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setDraft(value ?? '')
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  async function save() {
    setEditing(false)
    setSaving(true)
    try {
      await updateAssignedTo(ticketId, draft.trim() || null)
    } catch {
      // silently revert on error — real-time subscription will resync
    } finally {
      setSaving(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={onKeyDown}
        placeholder="Enter name…"
        className="w-full px-2 py-1 text-[13px] rounded-md border border-[#8B1A1A]/50 bg-white dark:bg-[#111] text-[#111111] dark:text-[#f0f0f0] focus:outline-none focus:ring-1 focus:ring-[#8B1A1A]"
      />
    )
  }

  return (
    <button
      onClick={startEdit}
      title="Click to assign"
      className={`flex items-center gap-1.5 text-[13px] rounded-md px-2 py-1 transition-colors w-full text-left group ${
        saving ? 'opacity-50' : ''
      } ${
        value
          ? 'text-[#111111] dark:text-[#d4d4d4] hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a3e]'
          : 'text-[#9ca3af] dark:text-[#6b7280] hover:bg-[#f9f9f9] dark:hover:bg-[#2a2a3e]'
      }`}
    >
      <UserRound size={13} className={value ? 'text-[#8B1A1A]' : 'text-[#9ca3af] dark:text-[#6b7280]'} />
      <span>{saving ? '…' : (value || 'Unassigned')}</span>
    </button>
  )
}

const STATUS_FILTERS = ['all', 'received', 'reviewing', 'in_repair', 'ready', 'completed'] as const
type Filter = typeof STATUS_FILTERS[number]

const STATUS_OPTIONS: TicketStatus[] = ['received', 'reviewing', 'in_repair', 'ready', 'completed']

export default function TicketsView() {
  const { tickets, loading, error, updateStatus, refetch } = useTickets()
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null)

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

  function handleCreated(ticketId: string) {
    setShowCreateModal(false)
    setCreatedTicketId(ticketId)
    refetch()
    setTimeout(() => setCreatedTicketId(null), 5000)
  }

  return (
    <>
      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}

    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[#111111] dark:text-[#f5f5f5] leading-tight tracking-tight">
            Tickets
          </h1>
          <p className="text-[15px] text-[#9ca3af] dark:text-[#6b7280] mt-1">
            Manage and update all repair requests.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold text-white transition-all hover:opacity-90 active:scale-95 mt-1"
          style={{ background: '#8B1A1A' }}
        >
          <Plus size={16} />
          New Ticket
        </button>
      </div>

      {/* Success toast */}
      {createdTicketId && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border"
          style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.25)' }}>
          <CheckCircle size={17} className="text-green-500 flex-shrink-0" />
          <p className="text-[14px] font-medium text-green-700 dark:text-green-400">
            Ticket <span className="font-mono">#{createdTicketId}</span> created successfully.
          </p>
        </div>
      )}

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
                  : 'bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] text-[#374151] dark:text-[#6b7280] hover:bg-[#f9f9f9] dark:hover:bg-[#222]'
              }`}
            >
              {s === 'all' ? 'All' : s === 'in_repair' ? 'In Repair' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 h-9 px-3 rounded-xl border border-[#e5e7eb] dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] max-w-[280px] flex-1">
          <Search size={14} className="text-[#9ca3af] flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, ticket ID…"
            className="bg-transparent text-[13px] text-[#111111] dark:text-[#d4d4d4] placeholder-gray-400 dark:placeholder-gray-500 flex-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-[#9ca3af] dark:text-[#6b7280]">
            Loading tickets…
          </div>
        ) : error ? (
          <div className="p-6 text-red-500 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-[#9ca3af] dark:text-[#6b7280] text-sm">
            No tickets found.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Ticket ID', 'Customer', 'Device', 'Issues', 'Appointment', 'Assigned To', 'Status', 'Update'].map(h => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-[11px] font-semibold text-[#9ca3af] dark:text-[#6b7280] uppercase tracking-wider border-b border-[#e5e7eb] dark:border-[#2a2a2a]"
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
                  className="hover:bg-[#f9f9f9] dark:hover:bg-[#222] transition-colors"
                >
                  <td className="px-5 py-4 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                    <span className="font-mono text-[12px] text-[#9ca3af] dark:text-[#6b7280]">
                      #{ticket.ticketId}
                    </span>
                  </td>
                  <td className="px-5 py-4 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                    <p className="text-[14px] font-semibold text-[#111111] dark:text-[#f0f0f0]">
                      {ticket.customer.name}
                    </p>
                    <p className="text-[12px] text-[#9ca3af] dark:text-[#6b7280]">
                      {ticket.customer.phone}
                    </p>
                  </td>
                  <td className="px-5 py-4 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                    <p className="text-[14px] text-[#374151] dark:text-[#a3a3a3] capitalize">
                      {ticket.device.type}
                    </p>
                    <p className="text-[12px] text-[#9ca3af] dark:text-[#6b7280]">
                      {[ticket.device.brand, ticket.device.modelCustom ?? ticket.device.modelTrim ?? ticket.device.modelNumber]
                        .filter(Boolean).join(' ')}
                    </p>
                  </td>
                  <td className="px-5 py-4 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50 max-w-[160px]">
                    <p className="text-[13px] text-[#374151] dark:text-[#a3a3a3] truncate">
                      {ticket.issues.join(', ')}
                    </p>
                  </td>
                  <td className="px-5 py-4 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                    {ticket.appointment.date ? (
                      <>
                        <p className="text-[13px] text-[#374151] dark:text-[#a3a3a3]">
                          {new Date(ticket.appointment.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-[12px] text-[#9ca3af] dark:text-[#6b7280]">
                          {ticket.appointment.timeSlot}
                        </p>
                      </>
                    ) : (
                      <span className="text-[12px] text-[#9ca3af] dark:text-[#6b7280]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50 min-w-[130px]">
                    <AssigneeCell ticketId={ticket.ticketId} value={ticket.assignedTo} />
                  </td>
                  <td className="px-5 py-4 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-5 py-4 border-b border-[#e5e7eb]/60 dark:border-[#2a2a2a]/50">
                    <div className="relative inline-block">
                      <select
                        value={ticket.status}
                        disabled={updatingId === ticket.ticketId}
                        onChange={e => handleStatusChange(ticket.ticketId, e.target.value as TicketStatus)}
                        className="appearance-none text-[12px] font-medium pl-3 pr-7 py-1.5 rounded-lg border border-[#e5e7eb] dark:border-[#2a2a2a] bg-white dark:bg-[#111] text-[#374151] dark:text-[#a3a3a3] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#8B1A1A] disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>
                            {s === 'in_repair' ? 'In Repair' : s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </>
  )
}
