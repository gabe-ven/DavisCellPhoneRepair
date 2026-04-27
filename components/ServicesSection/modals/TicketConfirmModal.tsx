'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

// ─── Color tokens ──────────────────────────────────────────────────────────────
// Checkmark circle stroke: #8B1A1A (brand crimson) — change here to retheme
// Modal overlay: bg-black/50 — change here to adjust backdrop darkness

interface TicketConfirmModalProps {
  ticketId: string
  email: string
  // 'ticket' → warm "we're on it" copy
  // 'quote'  → lighter "we'll be in touch" copy
  variant: 'ticket' | 'quote'
  onClose: () => void
}

// ─── Copy variants ─────────────────────────────────────────────────────────────
const COPY = {
  ticket: {
    heading: "You're in good hands 🙌",
    sub: "Your ticket is in — we're on it. Our team will reach out with an update as soon as we've reviewed your device.",
    confirmationLine: (email: string) => <>A confirmation has been sent to <span className="font-medium break-all" style={{ color: '#111111' }}>{email}</span></>,
  },
  quote: {
    heading: 'Quote request received',
    sub: "We'll take a look and get back to you with a fair, transparent estimate.",
    confirmationLine: (email: string) => <>We&apos;ll be in touch at <span className="font-medium break-all" style={{ color: '#111111' }}>{email}</span></>,
  },
}

// ─── AnimatedCheck ─────────────────────────────────────────────────────────────
// Pure SVG + CSS, zero external dependencies.
// ViewBox 64×64. Circle cx=32 cy=32 r=28 (circumference ≈ 175.93 → 176).
// Checkmark path M16,34 L28,46 L48,22 (total path length ≈ 48.21 → 49).
//
// Sequence:
//   t=0ms      : 'animate' class added after 50ms mount delay
//   t=0–300ms  : circle stroke draws in  (dashoffset 176→0, ease-out)
//   t=200ms    : checkmark begins         (200ms CSS delay)
//   t=200–700ms: checkmark draws in       (dashoffset 49→0, ease-out)
function AnimatedCheck() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // 50ms delay: guarantees the browser paints the initial dashoffset state
    // before the transition class fires. Without it Safari skips the animation.
    const t = setTimeout(() => setAnimate(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <style>{`
        .check-circle {
          stroke-dasharray: 176;
          stroke-dashoffset: 176;
          transition: stroke-dashoffset 300ms ease-out;
        }
        .check-circle.animate { stroke-dashoffset: 0; }

        .check-mark {
          stroke-dasharray: 49;
          stroke-dashoffset: 49;
          transition: stroke-dashoffset 500ms ease-out 200ms;
        }
        .check-mark.animate { stroke-dashoffset: 0; }
      `}</style>

      <svg viewBox="0 0 64 64" width="72" height="72" aria-hidden="true">
        {/* Static gray track */}
        <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" />
        {/* Animated brand circle — rotated so stroke starts from top */}
        <circle
          cx="32" cy="32" r="28"
          fill="none"
          stroke="#8B1A1A"
          strokeWidth="4"
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
          className={`check-circle${animate ? ' animate' : ''}`}
        />
        {/* Animated checkmark — draws after circle completes */}
        <path
          d="M16 34 L28 46 L48 22"
          fill="none"
          stroke="#8B1A1A"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`check-mark${animate ? ' animate' : ''}`}
        />
      </svg>
    </>
  )
}

// ─── TicketConfirmModal ────────────────────────────────────────────────────────
export default function TicketConfirmModal({
  ticketId,
  email,
  variant,
  onClose,
}: TicketConfirmModalProps) {
  const copy = COPY[variant]

  // Write session on mount — survives tab close without needing Done click
  useEffect(() => {
    try {
      sessionStorage.setItem('mfc_session', JSON.stringify({ ticketId, email }))
    } catch {
      // Private mode / storage full — fail silently
    }
  }, [ticketId, email])

  // Escape key dismiss
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    // Modal overlay — bg-black/50 (change here to adjust backdrop)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-5 text-center"
        style={{ border: '1.5px solid #e5e7eb' }}
      >

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9ca3af] hover:text-brand transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Animated SVG checkmark */}
        <AnimatedCheck />

        {/* Heading + sub copy — varies by variant */}
        <div className="space-y-2">
          <h2 className="text-xl tracking-tight" style={{ fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}>
            {copy.heading}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{copy.sub}</p>
        </div>

        {/* Ticket ID pill — large, monospaced, selectable */}
        <div
          className="bg-brand text-white rounded-full px-6 py-3 font-mono font-bold text-lg tracking-widest select-all"
          style={{ boxShadow: '0 4px 20px rgba(139,26,26,0.25)' }}
        >
          {ticketId}
        </div>

        {/* Confirmation email line — varies by variant */}
        <p className="text-sm" style={{ color: '#6b7280' }}>
          {copy.confirmationLine(email)}
        </p>

        {/* Done button */}
        <button
          onClick={onClose}
          className="w-full bg-brand hover:bg-brand-hover text-white font-bold tracking-[0.02em] py-3 rounded-lg transition-colors text-sm"
          style={{ boxShadow: '0 4px 20px rgba(139,26,26,0.25)' }}
        >
          Done
        </button>
      </div>
    </div>
  )
}