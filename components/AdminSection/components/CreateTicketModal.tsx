'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import type { DeviceType } from '../../ServicesSection/types/wizard'
import type { AdminCreateTicketPayload } from '../../../app/api/admin/tickets/route'

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

interface CreateTicketModalProps {
  onClose: () => void
  onCreated: (ticketId: string) => void
}

const INPUT_CLS = `
  w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#2a2a3e]
  bg-white dark:bg-[#13131f] text-[14px] text-gray-900 dark:text-gray-100
  placeholder-gray-400 dark:placeholder-gray-500
  focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A]
  transition-colors
`

const LABEL_CLS = 'block text-[12px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1'

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
    notes:           '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleIssue(id: string) {
    setForm(prev => ({
      ...prev,
      issues: prev.issues.includes(id)
        ? prev.issues.filter(i => i !== id)
        : [...prev.issues, id],
    }))
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
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1c1c2e] rounded-2xl border border-gray-200 dark:border-[#2a2a3e] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-[#2a2a3e] sticky top-0 bg-white dark:bg-[#1c1c2e] z-10">
          <div>
            <h2 className="text-[18px] font-bold text-gray-900 dark:text-white">New Walk-In Ticket</h2>
            <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">
              Create a ticket for a customer at the counter.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-[#2a2a3e] text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#16162a] transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">

          {/* Customer Info */}
          <section>
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-3">
              Customer
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className={LABEL_CLS}>Name <span className="text-[#8B1A1A]">*</span></label>
                <input
                  value={form.customerName}
                  onChange={e => set('customerName', e.target.value)}
                  placeholder="Full name"
                  required
                  className={INPUT_CLS}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={LABEL_CLS}>Phone <span className="text-[#8B1A1A]">*</span></label>
                <input
                  value={form.customerPhone}
                  onChange={e => set('customerPhone', e.target.value)}
                  placeholder="(530) 000-0000"
                  required
                  className={INPUT_CLS}
                />
              </div>
              <div className="col-span-2">
                <label className={LABEL_CLS}>Email <span className="text-gray-400 font-normal normal-case tracking-normal">(optional — sends confirmation if provided)</span></label>
                <input
                  value={form.customerEmail}
                  onChange={e => set('customerEmail', e.target.value)}
                  placeholder="customer@email.com"
                  type="email"
                  className={INPUT_CLS}
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-gray-100 dark:bg-[#2a2a3e]" />

          {/* Device Info */}
          <section>
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-3">
              Device
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL_CLS}>Type</label>
                <select
                  value={form.deviceType}
                  onChange={e => set('deviceType', e.target.value as DeviceType | 'other')}
                  className={INPUT_CLS}
                >
                  {DEVICE_OPTIONS.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL_CLS}>Brand</label>
                <input
                  value={form.brand}
                  onChange={e => set('brand', e.target.value)}
                  placeholder="e.g. Apple, Samsung"
                  className={INPUT_CLS}
                />
              </div>
              <div className="col-span-2">
                <label className={LABEL_CLS}>Model / Description</label>
                <input
                  value={form.model}
                  onChange={e => set('model', e.target.value)}
                  placeholder="e.g. iPhone 16 Pro Max, Galaxy S24"
                  className={INPUT_CLS}
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-gray-100 dark:bg-[#2a2a3e]" />

          {/* Issues */}
          <section>
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-3">
              Issues <span className="text-[#8B1A1A]">*</span>
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {ISSUE_OPTIONS.map(issue => {
                const selected = form.issues.includes(issue.id)
                return (
                  <button
                    key={issue.id}
                    type="button"
                    onClick={() => toggleIssue(issue.id)}
                    className={`px-3 py-2 rounded-lg border text-[13px] font-medium text-left transition-colors ${
                      selected
                        ? 'border-[#8B1A1A] bg-[#8B1A1A]/10 text-[#8B1A1A] dark:text-red-300'
                        : 'border-gray-200 dark:border-[#2a2a3e] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#16162a]'
                    }`}
                  >
                    {issue.label}
                  </button>
                )
              })}
            </div>
          </section>

          <div className="h-px bg-gray-100 dark:bg-[#2a2a3e]" />

          {/* Appointment + Status */}
          <section>
            <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-3">
              Appointment &amp; Status
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={LABEL_CLS}>Date</label>
                <input
                  type="date"
                  value={form.appointmentDate}
                  onChange={e => set('appointmentDate', e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Time</label>
                <input
                  value={form.appointmentTime}
                  onChange={e => set('appointmentTime', e.target.value)}
                  placeholder="e.g. 2:30 PM"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Initial Status</label>
                <select
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                  className={INPUT_CLS}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="h-px bg-gray-100 dark:bg-[#2a2a3e]" />

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
            <p
              className="text-[13px] rounded-lg px-4 py-3 text-center"
              style={{ background: 'rgba(139,26,26,0.06)', border: '1px solid rgba(139,26,26,0.18)', color: '#8B1A1A' }}
            >
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-[#2a2a3e] text-[14px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#16162a] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[14px] font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: '#8B1A1A' }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {loading ? 'Creating…' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
