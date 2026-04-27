// components/ServicesSection/ui/ProgressBar.tsx
// Desktop-only (md: and above) horizontal progress bar.
// Hidden on mobile — ProgressRing takes over below md breakpoint.
//
// Layout: `justify-between` nodes on a relative container; a single
// absolutely-positioned track line sits behind them, spanning center-to-center.
// This guarantees perfectly equal segment lengths regardless of label width.

import { Smartphone, Cpu, Wrench, CalendarDays, ClipboardList, Check, LucideIcon } from 'lucide-react'

interface StepConfig {
  label: string
  Icon: LucideIcon
}

const STEPS: StepConfig[] = [
  { label: 'Device',      Icon: Smartphone    },
  { label: 'Model',       Icon: Cpu           },
  { label: 'Issue',       Icon: Wrench        },
  { label: 'Appointment', Icon: CalendarDays  },
  { label: 'Quote',       Icon: ClipboardList },
]

interface ProgressBarProps {
  step: number // 0–5 (5 = post-submit, all complete)
}

export default function ProgressBar({ step }: ProgressBarProps) {
  const isAllDone = step === 5
  // Each of the 4 connectors fills in sequence; clamp at 4 segments max
  const fillPct = Math.min(step, STEPS.length - 1) / (STEPS.length - 1) * 100

  return (
    <div className="hidden md:block w-full max-w-2xl mx-auto px-4">
      {/* Outer wrapper — nodes justify-between, track line absolute behind them */}
      <div className="relative flex items-start justify-between">

        {/* ── Track line ── spans from center of first node to center of last
            top-6 = half of h-12 (48px circle), left/right-6 = half of w-12 */}
        <div className="absolute top-6 left-6 right-6 h-[2px] bg-[#e5e7eb] rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${fillPct}%` }}
          />
        </div>

        {/* ── Step nodes ── */}
        {STEPS.map((s, index) => {
          const nodeCompleted = index < step || isAllDone
          const nodeCurrent   = index === step && !isAllDone

          return (
            <div key={s.label} className="relative z-10 flex flex-col items-center gap-2">
              {/* Circle */}
              <div
                className={[
                  'w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-700',
                  nodeCompleted || nodeCurrent ? 'bg-brand' : 'bg-[#e5e7eb]',
                ].join(' ')}
              >
                {nodeCompleted ? (
                  <Check size={20} strokeWidth={2.5} className="text-white" />
                ) : (
                  <s.Icon
                    size={20}
                    strokeWidth={1.75}
                    className={nodeCurrent ? 'text-white' : 'text-[#9ca3af]'}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={[
                  'text-xs font-medium text-center whitespace-nowrap',
                  nodeCompleted || nodeCurrent ? 'text-brand' : 'text-[#6b7280]',
                ].join(' ')}
              >
                {s.label}
              </span>
            </div>
          )
        })}

      </div>
    </div>
  )
}
