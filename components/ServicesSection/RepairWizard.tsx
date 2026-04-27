// components/ServicesSection/RepairWizard.tsx
// Root wizard component. Owns all state via useWizardState.
// Renders the ring housing, navigation, and current step.
// At step 5 (submitted), the entire wizard is replaced by a confirmation screen.
'use client'

import { useEffect, useRef } from 'react'
import { useWizardState } from './hooks/useWizardState'
import ProgressRing from './ui/ProgressRing'
import ProgressBar from './ui/ProgressBar'
import StepIcon from './ui/StepIcon'
import BackButton from './ui/BackButton'
import DeviceStep from './steps/DeviceStep'
import ModelStep from './steps/ModelStep'
import IssueStep from './steps/IssueStep'
import AppointmentStep from './steps/AppointmentStep'
import QuoteStep from './steps/QuoteStep'
import { CheckCircle, Ticket, MapPin } from 'lucide-react'

const STEP_HEADERS: Record<number, string> = {
  0: 'What device needs repair?',
  1: 'Select your model',
  // Step 2 header rendered inside IssueStep (device name interpolation)
  3: 'Want to bring it in?',
  4: 'Your repair quote',
}

// ─── Step 5: Post-submission confirmation ─────────────────────────────────────
// Replaces the entire wizard UI. No reset button — user must refresh to restart.
// Reads ticketId from state.submittedTicketId (in-memory only; refreshing clears
// React state and naturally shows the form again — no extra logic needed).
function SubmittedConfirmation({ ticketId }: { ticketId: string }) {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto gap-8 py-8 text-center">

      <div
        className="flex items-center justify-center w-20 h-20 rounded-full"
        style={{ background: 'rgba(139,26,26,0.07)' }}
      >
        <CheckCircle size={40} className="text-brand" />
      </div>

      <div className="space-y-3">
        <h2
          className="text-2xl tracking-tight"
          style={{ fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}
        >
          We&apos;ll do whatever we can to get you up and running.
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
          Your ticket has been submitted and our team is already on it. You&apos;ll hear
          from us soon with a diagnosis and next steps.
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div
          className="flex items-center gap-2 text-xs uppercase tracking-wide"
          style={{ color: '#9ca3af' }}
        >
          <Ticket size={13} />
          Your ticket number
        </div>
        <div
          className="bg-brand text-white rounded-full px-8 py-3 font-mono font-bold text-xl tracking-widest select-all"
          style={{ boxShadow: '0 4px 20px rgba(139,26,26,0.25)' }}
        >
          {ticketId}
        </div>
      </div>

      <div
        className="rounded-xl px-6 py-5 text-left space-y-3 w-full"
        style={{ background: '#f9f9f9', border: '1.5px solid #e5e7eb' }}
      >
        <p className="font-semibold text-sm" style={{ color: '#111111' }}>
          What happens next?
        </p>
        <ul className="space-y-2 text-sm" style={{ color: '#6b7280' }}>
          <li className="flex items-start gap-2">
            <span className="text-brand font-bold mt-0.5">1.</span>
            Our technician reviews your ticket and device description.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand font-bold mt-0.5">2.</span>
            We&apos;ll contact you with a quote and estimated repair time.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand font-bold mt-0.5 shrink-0">3.</span>
            <span>
              Visit <strong style={{ color: '#374151' }}>My Repair</strong> and enter ticket number{' '}
              <span className="font-mono font-semibold" style={{ color: '#374151' }}>{ticketId}</span>{' '}
              to track your repair status at any time.
            </span>
          </li>
        </ul>
      </div>

      <a
        href="https://maps.google.com/?q=140+B+St+%234,+Davis,+CA+95616"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:text-brand transition-colors text-sm"
        style={{ color: '#6b7280' }}
      >
        <MapPin size={14} className="text-brand shrink-0" />
        140 B St #4, Davis, CA 95616
      </a>
    </div>
  )
}

// ─── RepairWizard ─────────────────────────────────────────────────────────────
export default function RepairWizard() {
  const wizardRef = useRef<HTMLDivElement>(null)

  const {
    state,
    prevStep,
    nextStep,
    setDevice,
    setBrand,
    setModel,
    setModelCustom,
    toggleIssue,
    addImage,
    removeImage,
    setAppointment,
    skipAppointment,
    setTicketId,
  } = useWizardState()

  const { step } = state

  // Scroll the wizard back into view on every step change so the user
  // never drifts down the page while navigating.
  useEffect(() => {
    wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  // Step 5: wizard submitted — replace entire UI with confirmation screen
  if (step === 5 && state.submittedTicketId) {
    return (
      <div ref={wizardRef} className="relative flex flex-col items-center w-full max-w-2xl mx-auto">
        <SubmittedConfirmation ticketId={state.submittedTicketId} />
      </div>
    )
  }

  function renderStep() {
    switch (step) {
      case 0:
        return <DeviceStep setDevice={setDevice} nextStep={nextStep} />
      case 1:
        return (
          <ModelStep
            device={state.device!}
            modelNumber={state.modelNumber}
            modelTrim={state.modelTrim}
            setBrand={setBrand}
            setModel={setModel}
            setModelCustom={setModelCustom}
            nextStep={nextStep}
          />
        )
      case 2:
        return (
          <IssueStep
            device={state.device}
            issues={state.issues}
            toggleIssue={toggleIssue}
            nextStep={nextStep}
          />
        )
      case 3:
        return (
          <AppointmentStep
            setAppointment={setAppointment}
            skipAppointment={skipAppointment}
            nextStep={nextStep}
          />
        )
      case 4:
        return (
          <QuoteStep
            state={state}
            setTicketId={setTicketId}
            addImage={addImage}
            removeImage={removeImage}
            nextStep={nextStep}
          />
        )
      default:
        return null
    }
  }

  return (
    <div ref={wizardRef} className="relative flex flex-col items-center w-full max-w-2xl mx-auto gap-10">
      {/* Back button — hidden on step 0 */}
      <BackButton step={step} onBack={prevStep} />

      {/* Step header — matches site headline tokens */}
      <h2
        className="text-2xl md:text-3xl text-center pt-4 tracking-tight"
        style={{ fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}
      >
        {STEP_HEADERS[step]}
      </h2>

      {/* Desktop: horizontal step bar */}
      <ProgressBar step={step} />

      {/* Mobile: circular ring with icon (hidden on md+) */}
      <div className="relative flex items-center justify-center md:hidden">
        <ProgressRing step={step} />
        <div className="absolute inset-0 flex items-center justify-center">
          <StepIcon step={step} size={28} />
        </div>
      </div>

      {/* Current step content */}
      <div className="w-full">
        {renderStep()}
      </div>
    </div>
  )
}