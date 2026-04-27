'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Phone, Ticket, FileText, CheckCircle, Loader2,
  ImagePlus, X, Upload,
} from 'lucide-react'
import { WizardState } from '../types/wizard'
import { WizardImage } from '../hooks/useWizardState'
import { submitTicket } from '../api/tickets'
import TicketConfirmModal from '../modals/TicketConfirmModal'

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_IMAGES = 5
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Props ────────────────────────────────────────────────────────────────────
interface QuoteStepProps {
  state: WizardState
  setTicketId: (id: string) => void
  addImage: (image: WizardImage) => void
  removeImage: (id: string) => void
  nextStep: () => void
}

type ActiveAction = 'ticket' | 'quote' | null

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildModelLabel(state: WizardState): string {
  if (state.modelCustom) return state.modelCustom
  const parts = [state.brand, state.modelNumber, state.modelTrim].filter(Boolean)
  return parts.join(' ') || '—'
}

function buildAppointmentLabel(state: WizardState): string {
  const { date, timeSlot } = state.appointment
  if (!date && !timeSlot) return 'Walk-in / No appointment'
  return [date, timeSlot].filter(Boolean).join(' at ')
}

// Convert File → WizardImage (base64).
// To swap in a real upload endpoint later: replace this function only.
// The state shape and submit payload stay identical.
async function fileToWizardImage(file: File): Promise<WizardImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      type: file.type,
      base64: reader.result as string,
      sizeKb: Math.round(file.size / 1024),
    })
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ─── QuoteStep ────────────────────────────────────────────────────────────────
export default function QuoteStep({
  state,
  setTicketId,
  addImage,
  removeImage,
  nextStep,
}: QuoteStepProps) {
  const [activeAction, setActiveAction] = useState<ActiveAction>(null)
  const [name, setName] = useState(state.customer.name)
  const [email, setEmail] = useState(state.customer.email)
  const [phone, setPhone] = useState(state.customer.phone)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [resolvedTicketId, setResolvedTicketId] = useState<string>('')

  // Per-image fake upload progress: id → 0–100
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEmailValid = EMAIL_REGEX.test(email)
  const isFormValid = name.trim() !== '' && isEmailValid && phone.trim() !== ''
  const atImageLimit = state.images.length >= MAX_IMAGES

  // Cancel modal timer if component unmounts during the 800ms ring→modal gap
  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    return () => { if (modalTimerRef.current) clearTimeout(modalTimerRef.current) }
  }, [])

  // ── Image handling ───────────────────────────────────────────────────────────

  const simulateProgress = useCallback((id: string) => {
    // Fake progress: ticks 0→100 in random increments over ~800ms
    let pct = 0
    const interval = setInterval(() => {
      pct += Math.floor(Math.random() * 25) + 10
      if (pct >= 100) {
        pct = 100
        clearInterval(interval)
        setTimeout(() => {
          setUploadProgress(prev => {
            const next = { ...prev }
            delete next[id]
            return next
          })
        }, 400)
      }
      setUploadProgress(prev => ({ ...prev, [id]: pct }))
    }, 150)
  }, [])

  const processFiles = useCallback(async (files: FileList | File[]) => {
    setUploadError(null)
    const arr = Array.from(files)
    const remaining = MAX_IMAGES - state.images.length

    if (remaining === 0) {
      setUploadError(`Maximum ${MAX_IMAGES} images allowed.`)
      return
    }

    const invalid = arr.find(f => !ACCEPTED_TYPES.includes(f.type))
    if (invalid) {
      setUploadError(`"${invalid.name}" is not a supported image type.`)
      return
    }

    const toProcess = arr.slice(0, remaining)
    if (arr.length > remaining) {
      setUploadError(`Only ${remaining} more image${remaining === 1 ? '' : 's'} can be added. First ${remaining} selected.`)
    }

    for (const file of toProcess) {
      try {
        const wizImg = await fileToWizardImage(file)
        addImage(wizImg)
        simulateProgress(wizImg.id)
      } catch {
        setUploadError(`Failed to read "${file.name}". Please try another image.`)
      }
    }
  }, [state.images.length, addImage, simulateProgress])

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) processFiles(e.target.files)
    e.target.value = '' // reset so same file can be re-selected after removal
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files)
  }

  // ── Submission ───────────────────────────────────────────────────────────────

  function handleActionClick(action: ActiveAction) {
    setActiveAction(prev => (prev === action ? null : action))
  }

  async function handleSubmit() {
    if (!isFormValid || loading) return
    setLoading(true)
    try {
      const mergedState: WizardState = {
        ...state,
        customer: { name, email, phone },
      }
      const { ticketId } = await submitTicket(mergedState)
      setResolvedTicketId(ticketId)
      setTicketId(ticketId)

      // Advance ring to step 5 first so the progress animation plays,
      // then open the modal 800ms later once the ring has settled.
      // Sequence: API resolves → nextStep() → 800ms → modal opens.
      nextStep()
      modalTimerRef.current = setTimeout(() => setShowModal(true), 800)
    } finally {
      setLoading(false)
    }
  }

  function handleModalClose() {
    // nextStep() already fired before modal opened — only dismiss overlay here.
    setShowModal(false)
  }

  const submitLabel = activeAction === 'ticket' ? 'Submit Ticket' : 'Request Quote'

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">

      {/* ── Incentive Banner ──────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
        <Ticket size={20} className="text-red-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-slate-800 font-semibold text-sm">
            Get a ticket — it's fast and free
          </p>
          <p className="text-slate-500 text-sm mt-0.5">
            We'll review your device, give you an honest quote, and keep you
            updated every step of the way.
          </p>
        </div>
      </div>

      {/* ── Summary Card ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-3">
        <h2 className="text-slate-900 font-semibold text-lg mb-4">Repair Summary</h2>
        <SummaryRow label="Device" value={
          state.device
            ? state.device.charAt(0).toUpperCase() + state.device.slice(1)
            : '—'
        } />
        <SummaryRow label="Model"       value={buildModelLabel(state)} />
        <SummaryRow
          label="Issues"
          value={state.issues.length > 0 ? state.issues.join(', ') : '—'}
        />
        <SummaryRow label="Timeframe"   value="24 Hours" />
        <SummaryRow label="Warranty"    value="Up to 6 Months" />
        <SummaryRow label="Appointment" value={buildAppointmentLabel(state)} />
      </div>

      {/* ── Action Buttons ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <ActionButton
          icon={<Ticket size={16} />}
          label="Create a Ticket"
          active={activeAction === 'ticket'}
          onClick={() => handleActionClick('ticket')}
        />
        <ActionButton
          icon={<FileText size={16} />}
          label="Get Quote"
          active={activeAction === 'quote'}
          onClick={() => handleActionClick('quote')}
        />
        <a
          href="tel:+15303413384"
          className="flex flex-col items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-2xl px-3 py-4 transition-colors text-center leading-tight"
        >
          <Phone size={16} />
          Call Now
        </a>
      </div>

      {/* ── Inline Form ───────────────────────────────────────────────────────── */}
      {activeAction !== null && (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-5">
          <h3 className="text-slate-800 font-semibold text-sm uppercase tracking-wide">
            {activeAction === 'ticket' ? 'Create a Ticket' : 'Request a Quote'}
          </h3>

          {/* Contact fields */}
          <div className="space-y-3">
            <FormField
              label="Name"  type="text"  value={name}
              onChange={setName} placeholder="Your full name"
            />
            <FormField
              label="Email" type="email" value={email}
              onChange={setEmail} placeholder="you@example.com"
              invalid={email.length > 0 && !isEmailValid}
            />
            <FormField
              label="Phone" type="tel"   value={phone}
              onChange={setPhone} placeholder="(530) 000-0000"
            />
          </div>

          {/* ── Image Upload ───────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Photos{' '}
                <span className="normal-case font-normal text-slate-400">
                  (optional, up to {MAX_IMAGES})
                </span>
              </label>
              <span className="text-xs text-slate-400">
                {state.images.length}/{MAX_IMAGES}
              </span>
            </div>

            {/* Drop zone — hidden once limit is reached */}
            {!atImageLimit && (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  flex flex-col items-center justify-center gap-2 w-full
                  border-2 border-dashed rounded-xl py-6 cursor-pointer transition-colors
                  ${dragOver
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-red-300 hover:bg-gray-50'
                  }
                `}
              >
                <Upload size={20} className="text-slate-400" />
                <p className="text-sm text-slate-500">
                  <span className="font-medium text-red-600">Click to upload</span>
                  {' '}or drag &amp; drop
                </p>
                <p className="text-xs text-slate-400">JPG, PNG, WEBP, GIF, HEIC</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_TYPES.join(',')}
                  multiple
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
            )}

            {/* Upload error */}
            {uploadError && (
              <p className="text-xs text-red-500">{uploadError}</p>
            )}

            {/* Thumbnail grid */}
            {state.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {state.images.map(img => (
                  <div key={img.id} className="relative group">
                    {/* Thumbnail */}
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={img.base64}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Fake progress bar */}
                    {uploadProgress[img.id] !== undefined && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                        <div
                          className="h-full bg-red-500 transition-all duration-150"
                          style={{ width: `${uploadProgress[img.id]}%` }}
                        />
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => { removeImage(img.id); setUploadError(null) }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-700 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      aria-label={`Remove ${img.name}`}
                    >
                      <X size={10} />
                    </button>

                    {/* Filename on hover */}
                    <p className="text-xs text-slate-400 truncate mt-1 hidden group-hover:block">
                      {img.name}
                    </p>
                  </div>
                ))}

                {/* Add-more slot */}
                {!atImageLimit && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-red-300 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                    aria-label="Add another image"
                  >
                    <ImagePlus size={18} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            className={`
              w-full flex items-center justify-center gap-2 py-3 rounded-xl
              font-semibold text-sm transition-all
              ${isFormValid && !loading
                ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Submitting…</>
            ) : (
              <><CheckCircle size={16} /> {submitLabel}</>
            )}
          </button>
        </div>
      )}

      {/* Ticket Confirm Modal */}
      {showModal && (
        <TicketConfirmModal
          ticketId={resolvedTicketId}
          email={email}
          variant={activeAction === 'quote' ? 'quote' : 'ticket'}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-slate-400 w-28 shrink-0">{label}</span>
      <span className="text-slate-900 font-medium">{value}</span>
    </div>
  )
}

function ActionButton({
  icon, label, active, onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-1.5 text-sm font-semibold
        rounded-2xl px-3 py-4 transition-all leading-tight text-center border-2
        ${active
          ? 'bg-red-600 text-white border-red-600'
          : 'bg-white text-red-600 border-red-200 hover:border-red-600 hover:bg-red-50'
        }
      `}
    >
      {icon}
      {label}
    </button>
  )
}

function FormField({
  label, type, value, onChange, placeholder, invalid,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  invalid?: boolean
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white
          outline-none transition-colors
          ${invalid
            ? 'border-red-400 focus:border-red-500 ring-1 ring-red-300'
            : 'border-gray-200 focus:border-red-400 focus:ring-1 focus:ring-red-200'
          }
        `}
      />
      {invalid && (
        <p className="text-xs text-red-500">Please enter a valid email address.</p>
      )}
    </div>
  )
}