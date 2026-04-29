'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Clock } from 'lucide-react'
import type { DeviceType } from '../../ServicesSection/types/wizard'
import type { AdminCreateTicketPayload } from '../../../app/api/admin/tickets/route'
import { getAllTickets } from '../api/adminApi'
import type { Ticket } from '../../ServicesSection/types/wizard'

const ISSUE_OPTIONS = [
  { id: 'screen',         label: 'Screen' },
  { id: 'back-glass',     label: 'Back Glass' },
  { id: 'battery',        label: 'Battery' },
  { id: 'camera-front',   label: 'Front Camera' },
  { id: 'camera-back',    label: 'Back Camera' },
  { id: 'charging-port',  label: 'Charging Port' },
  { id: 'earpiece',       label: 'Earpiece' },
  { id: 'speaker',        label: 'Speaker' },
  { id: 'microphone',     label: 'Microphone' },
  { id: 'water-damage',   label: 'Water Damage' },
  { id: 'face-id',        label: 'Face ID' },
  { id: 'touch-id',       label: 'Touch ID' },
  { id: 'wifi',           label: 'WiFi' },
  { id: 'bluetooth',      label: 'Bluetooth' },
  { id: 'signal',         label: 'No Signal' },
  { id: 'wont-turn-on',   label: "Won't Turn On" },
  { id: 'overheats',      label: 'Overheating' },
  { id: 'data-recovery',  label: 'Data Recovery' },
  { id: 'other',          label: 'Other' },
]

const DEVICE_OPTIONS: { value: DeviceType | 'other'; label: string }[] = [
  { value: 'iphone',  label: 'iPhone' },
  { value: 'android', label: 'Android' },
  { value: 'ipad',    label: 'iPad' },
  { value: 'tablet',  label: 'Tablet (Non-iPad)' },
  { value: 'other',   label: 'Other' },
]

const STATUS_OPTIONS = [
  { value: 'received',  label: 'Received' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'in_repair', label: 'In Repair' },
  { value: 'ready',     label: 'Ready' },
]

const TODAY = new Date().toISOString().split('T')[0]

function getTimeSlots(dateStr: string): string[] {
  const dow = new Date(dateStr + 'T12:00:00').getDay()
  if (dow === 0) return ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM']
  return ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
}

interface CreateTicketModalProps {
  onClose: () => void
  onCreated: (ticketId: string) => void
}

const INPUT_CLS = `
  w-full px-3 py-2 rounded-[8px] border border-[#e8e8e8] dark:border-[#222]
  bg-white dark:bg-[#111] text-[14px] text-[#111] dark:text-[#f0f0f0]
  placeholder-[#c0c0c0] dark:placeholder-[#444]
  focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]
  transition-colors
`

const LABEL_CLS = 'block text-[10.5px] font-bold text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-1.5'

export default function CreateTicketModal({ onClose, onCreated }: CreateTicketModalProps) {
  const [form, setForm] = useState({
    customerName:    '',
    customerPhone:   '',
    customerEmail:   '',
    deviceType:      'iphone' as DeviceType | 'other',
    brand:           '',
    model:           '',
    issues:          [] as string[],
    appointmentDate: TODAY,
    appointmentTime: '',
    status:          'received',
    assignedTo:      '',
    notes:           '',
  })
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState<string | null>(null)
  const [existingTickets, setExistingTickets] = useState<Ticket[]>([])

  useEffect(() => {
    getAllTickets().then(setExistingTickets).catch(() => {})
  }, [])

  const bookedSlots = form.appointmentDate
    ? existingTickets
        .filter(t => t.appointment.date === form.appointmentDate && t.appointment.timeSlot)
        .map(t => t.appointment.timeSlot!)
    : []

  const timeSlots = form.appointmentDate ? getTimeSlots(form.appointmentDate) : []
  const availableCount = timeSlots.filter(s => !bookedSlots.includes(s)).length

  function set(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleDateChange(date: string) {
    setForm(prev => ({ ...prev, appointmentDate: date, appointmentTime: '' }))
  }

  function toggleIssue(id: string) {
    setForm(prev => ({
      ...prev,
      issues: prev.issues.includes(id)
        ? prev.issues.filter(i => i !== id)
        : [...prev.issues, id],
    }))
  }

  function toggleSlot(slot: string) {
    setForm(prev => ({ ...prev, appointmentTime: prev.appointmentTime === slot ? '' : slot }))
  }

  const isValid = form.customerName.trim() && form.customerPhone.trim() && form.issues.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || loading) return
    setLoading(true)
    setError(null)
    try {
      const payload: AdminCreateTicketPayload = {
        customerName:    form.customerName.trim(),
        customerPhone:   form.customerPhone.trim(),
        customerEmail:   form.customerEmail.trim(),
        deviceType:      form.deviceType,
        brand:           form.brand.trim(),
        model:           form.model.trim(),
        issues:          form.issues,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        status:          form.status,
        assignedTo:      form.assignedTo.trim(),
        notes:           form.notes.trim(),
      }
      const res = await fetch('/api/admin/tickets', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? 'Failed to create ticket')
      }
      const { ticketId } = await res.json() as { ticketId: string }
      onCreated(ticketId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#161616] rounded-2xl border border-[#e8e8e8] dark:border-[#222] shadow-2xl dark:shadow-black/60">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0] dark:border-[#1e1e1e] sticky top-0 bg-white dark:bg-[#161616] z-10">
          <div>
            <h2 className="text-[17px] font-bold text-[#111] dark:text-[#f0f0f0]" style={{ letterSpacing: '-0.015em' }}>New Walk-In Ticket</h2>
            <p className="text-[12px] text-[#aaa] dark:text-[#555] mt-0.5">Create a ticket for a customer at the counter.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] border border-[#e8e8e8] dark:border-[#222] text-[#aaa] dark:text-[#555] hover:text-[#374151] dark:hover:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#222] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">

          {/* Customer */}
          <section>
            <p className="text-[10.5px] font-bold text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-3">Customer</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLS}>Name <span className="text-[#6366f1]">*</span></label>
                <input value={form.customerName} onChange={e => set('customerName', e.target.value)} placeholder="Full name" required className={INPUT_CLS} />
              </div>
              <div>
                <label className={LABEL_CLS}>Phone <span className="text-[#6366f1]">*</span></label>
                <input value={form.customerPhone} onChange={e => set('customerPhone', e.target.value)} placeholder="(530) 000-0000" required className={INPUT_CLS} />
              </div>
              <div className="col-span-2">
                <label className={LABEL_CLS}>
                  Email <span className="text-[#c0c0c0] dark:text-[#444] font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <input value={form.customerEmail} onChange={e => set('customerEmail', e.target.value)} placeholder="customer@email.com" type="email" className={INPUT_CLS} />
              </div>
            </div>
          </section>

          <div className="h-px bg-[#f5f5f5] dark:bg-[#1e1e1e]" />

          {/* Device */}
          <section>
            <p className="text-[10.5px] font-bold text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-3">Device</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLS}>Type</label>
                <select value={form.deviceType} onChange={e => set('deviceType', e.target.value as DeviceType | 'other')} className={INPUT_CLS}>
                  {DEVICE_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>Brand</label>
                <input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Apple, Samsung" className={INPUT_CLS} />
              </div>
              <div className="col-span-2">
                <label className={LABEL_CLS}>Model / Description</label>
                <input value={form.model} onChange={e => set('model', e.target.value)} placeholder="e.g. iPhone 16 Pro Max, Galaxy S24" className={INPUT_CLS} />
              </div>
            </div>
          </section>

          <div className="h-px bg-[#f5f5f5] dark:bg-[#1e1e1e]" />

          {/* Issues */}
          <section>
            <p className="text-[10.5px] font-bold text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-3">
              Issues <span className="text-[#6366f1]">*</span>
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {ISSUE_OPTIONS.map(issue => {
                const selected = form.issues.includes(issue.id)
                return (
                  <button
                    key={issue.id}
                    type="button"
                    onClick={() => toggleIssue(issue.id)}
                    className={`px-2.5 py-1.5 rounded-[7px] border text-[12px] font-medium text-left transition-colors ${
                      selected
                        ? 'border-[#6366f1] bg-[#6366f1]/[0.08] dark:bg-[#6366f1]/[0.15] text-[#6366f1] dark:text-[#818cf8]'
                        : 'border-[#e8e8e8] dark:border-[#222] text-[#555] dark:text-[#777] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {issue.label}
                  </button>
                )
              })}
            </div>
          </section>

          <div className="h-px bg-[#f5f5f5] dark:bg-[#1e1e1e]" />

          {/* Appointment & Status */}
          <section>
            <p className="text-[10.5px] font-bold text-[#aaa] dark:text-[#555] uppercase tracking-widest mb-3">Appointment &amp; Status</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={LABEL_CLS}>Date</label>
                <input
                  type="date"
                  value={form.appointmentDate}
                  onChange={e => handleDateChange(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Initial Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} className={INPUT_CLS}>
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className={LABEL_CLS + ' mb-0'}>
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} />
                    Appointment Time
                  </span>
                </label>
                {form.appointmentDate && (
                  <span className="text-[11px] text-[#aaa] dark:text-[#555]">
                    {availableCount} of {timeSlots.length} slots available
                  </span>
                )}
              </div>

              {!form.appointmentDate ? (
                <p className="text-[12px] text-[#bbb] dark:text-[#444] italic py-2">Select a date to see available times.</p>
              ) : (
                <div className="grid grid-cols-4 gap-1.5">
                  {timeSlots.map(slot => {
                    const isBooked   = bookedSlots.includes(slot)
                    const isSelected = form.appointmentTime === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => toggleSlot(slot)}
                        className={`
                          flex flex-col items-center justify-center py-2 px-1 rounded-[8px] border
                          text-[12px] font-medium transition-colors
                          ${isBooked
                            ? 'border-[#f0f0f0] dark:border-[#1a1a1a] bg-[#fafafa] dark:bg-[#111] text-[#ccc] dark:text-[#333] cursor-not-allowed'
                            : isSelected
                              ? 'border-[#6366f1] bg-[#6366f1] text-white shadow-sm'
                              : 'border-[#e8e8e8] dark:border-[#222] text-[#444] dark:text-[#aaa] hover:border-[#6366f1]/50 hover:bg-[#6366f1]/[0.05] dark:hover:bg-[#6366f1]/[0.08]'
                          }
                        `}
                      >
                        <span className={isBooked ? 'line-through' : ''}>{slot}</span>
                        {isBooked && (
                          <span className="text-[9.5px] font-semibold text-[#ccc] dark:text-[#333] uppercase tracking-wide mt-0.5 no-underline">
                            Booked
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {form.appointmentTime && !bookedSlots.includes(form.appointmentTime) && (
                <p className="mt-2 text-[11px] text-[#6366f1] dark:text-[#818cf8] font-medium">
                  Selected: {form.appointmentTime}
                </p>
              )}
            </div>

            <div>
              <label className={LABEL_CLS}>
                Assign to Technician <span className="text-[#c0c0c0] dark:text-[#444] font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <input value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)} placeholder="Technician name" className={INPUT_CLS} />
            </div>
          </section>

          <div className="h-px bg-[#f5f5f5] dark:bg-[#1e1e1e]" />

          {/* Notes */}
          <section>
            <label className={LABEL_CLS}>Notes / Additional Details</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Customer described the issue as…"
              rows={3}
              className={`${INPUT_CLS} resize-none`}
            />
          </section>

          {/* Error */}
          {error && (
            <p className="text-[13px] rounded-[8px] px-4 py-3 text-center bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-[8px] border border-[#e8e8e8] dark:border-[#222] text-[13px] font-medium text-[#555] dark:text-[#aaa] hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[8px] text-[13px] font-semibold text-white bg-[#6366f1] hover:bg-[#4f46e5] transition-colors disabled:opacity-40"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus size={15} />
              )}
              {loading ? 'Creating…' : 'Create Ticket'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
