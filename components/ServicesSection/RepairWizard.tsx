// components/ServicesSection/RepairWizard.tsx
// Root wizard component. Owns all state via useWizardState.
// Renders the ring housing, navigation, and current step.
// At step 5 (submitted), the entire wizard is replaced by a confirmation screen.
'use client'

import { useWizardState } from './hooks/useWizardState'
import ProgressRing from './ui/ProgressRing'
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

      {/* Large check icon */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50">
        <CheckCircle size={40} className="text-red-600" />
      </div>

      {/* Heading + copy */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900">
          We'll do whatever we can to get you up and running. 💪
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Your ticket has been submitted and our team is already on it. You'll hear
          from us soon with a diagnosis and next steps.
        </p>
      </div>

      {/* Ticket number pill */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-wide">
          <Ticket size={13} />
          Your ticket number
        </div>
        <div className="bg-red-600 text-white rounded-full px-8 py-3 font-mono font-bold text-xl tracking-widest select-all">
          {ticketId}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-left space-y-3 w-full">
        <p className="text-slate-700 font-semibold text-sm">What happens next?</p>
        <ul className="space-y-2 text-slate-500 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold mt-0.5">1.</span>
            Our technician reviews your ticket and device description.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold mt-0.5">2.</span>
            We'll contact you with a quote and estimated repair time.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold mt-0.5">3.</span>
            Visit <strong>My Repair</strong> and enter ticket number{' '}
            <span className="font-mono text-slate-700 font-semibold">{ticketId}</span>{' '}
            to track your repair status at any time.
          </li>
        </ul>
      </div>

      {/* Store address */}
      <a
        href="https://maps.google.com/?q=140+B+St+%234,+Davis,+CA+95616"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm"
      >
        <MapPin size={14} className="text-red-400 shrink-0" />
        140 B St #4, Davis, CA 95616
      </a>
    </div>
  )
}

// ─── RepairWizard ─────────────────────────────────────────────────────────────
export default function RepairWizard() {
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

  // Step 5: wizard submitted — replace entire UI with confirmation screen
  if (step === 5 && state.submittedTicketId) {
    return (
      <div className="relative flex flex-col items-center w-full max-w-2xl mx-auto">
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
    <div className="relative flex flex-col items-center w-full max-w-2xl mx-auto gap-10">
      {/* Back button — hidden on step 0 */}
      <BackButton step={step} onBack={prevStep} />

      {/* Step header */}
      <h2 className="text-2xl font-semibold text-slate-900 text-center pt-4">
        {STEP_HEADERS[step]}
      </h2>

      {/* Ring housing */}
      <div className="relative flex items-center justify-center">
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