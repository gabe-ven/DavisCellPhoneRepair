// components/ServicesSection/ui/ProgressBar.tsx
// Desktop-only (md: and above) horizontal progress bar.
// Hidden on mobile — ProgressRing takes over below md breakpoint.
//
// DESIGN TOKENS (change here, change everywhere):
//   Completed node bg:   bg-red-600
//   Completed node icon: text-white (renders Check, not original icon)
//   Current node bg:     bg-red-600
//   Current node icon:   text-white (original step icon)
//   Future node bg:      bg-gray-200
//   Future node icon:    text-gray-400 (original step icon)
//   Completed label:     text-red-600
//   Current label:       text-red-600
//   Future label:        text-slate-500
//   Connector track:     bg-gray-200
//   Connector fill:      bg-red-600
//   Connector transition: duration-700 ease-in-out

import { Smartphone, Cpu, Wrench, CalendarDays, ClipboardList, Check, LucideIcon } from 'lucide-react'

// NOTE FOR PHASE 6 (QuoteStep / Chat 5):
// When submitTicket() resolves, call nextStep() to set step → 5 (all nodes red + check),
// then use setTimeout(openModal, 800) AFTER that so the user sees the bar fully complete
// before TicketConfirmModal appears. The 800ms delay lives in QuoteStep.tsx, not here.

interface StepConfig {
  label: string
  Icon: LucideIcon
}

const STEPS: StepConfig[] = [
  { label: 'Device',      Icon: Smartphone   },
  { label: 'Model',       Icon: Cpu          },
  { label: 'Issue',       Icon: Wrench       },
  { label: 'Appointment', Icon: CalendarDays },
  { label: 'Quote',       Icon: ClipboardList },
]

interface ProgressBarProps {
  step: number // 0–5 (5 = post-submit, all complete)
}

export default function ProgressBar({ step }: ProgressBarProps) {
  return (
    <div className="hidden md:flex items-start justify-center w-full max-w-2xl mx-auto px-4">
      {STEPS.map((s, index) => {
        const isCompleted = index < step
        const isCurrent   = index === step && step < 5
        const isAllDone   = step === 5 // post-submit: every node is completed

        const nodeCompleted = isCompleted || isAllDone
        const nodeCurrent   = isCurrent

        // Connector to the right — exists between every pair of steps
        const showConnector = index < STEPS.length - 1
        const connectorFilled = step > index || isAllDone

        return (
          <div key={s.label} className="flex items-start flex-1 last:flex-none">

            {/* Step node + label */}
            <div className="flex flex-col items-center gap-2">

              {/* Circle */}
              <div
                className={[
                  'w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-700',
                  nodeCompleted || nodeCurrent ? 'bg-red-600' : 'bg-gray-200',
                ].join(' ')}
              >
                {nodeCompleted ? (
                  // Completed: always show white Check
                  <Check size={20} strokeWidth={2.5} className="text-white" />
                ) : (
                  // Current or future: show original step icon
                  <s.Icon
                    size={20}
                    strokeWidth={1.75}
                    className={nodeCurrent ? 'text-white' : 'text-gray-400'}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={[
                  'text-xs font-medium text-center',
                  nodeCompleted || nodeCurrent ? 'text-red-600' : 'text-slate-500',
                ].join(' ')}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {showConnector && (
              <div className="relative flex-1 h-[2px] mt-6 mx-1 bg-gray-200 overflow-hidden rounded-full">
                <div
                  className={[
                    'absolute inset-y-0 left-0 bg-red-600 rounded-full transition-all duration-700 ease-in-out',
                    connectorFilled ? 'w-full' : 'w-0',
                  ].join(' ')}
                />
              </div>
            )}

          </div>
        )
      })}
    </div>
  )
}