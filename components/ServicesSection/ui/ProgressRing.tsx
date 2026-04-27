// components/ServicesSection/ui/ProgressRing.tsx
// Core nav element: SVG ring that fills as steps complete. Mobile only (md:hidden in RepairWizard).
// Math: circumference = 2π × r. At step N: dashoffset = circumference × (1 - N/5)
// Step 5 = post-submit fully filled ring. Clamp handles this correctly.
//
// DESIGN TOKENS (change here, change everywhere):
//   Progress color (filled arc): text-red-600
//   Track color (unfilled arc):  text-gray-200
//   Transition:                  duration-700 ease-in-out

interface ProgressRingProps {
  step: number // 0–5 (5 = post-submit, fully filled)
}

const RADIUS = 60
const STROKE_WIDTH = 5
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Total viewBox size accounts for stroke overflow on all sides
const VIEW_SIZE = (RADIUS + STROKE_WIDTH) * 2

export default function ProgressRing({ step }: ProgressRingProps) {
  const clampedStep = Math.min(Math.max(step, 0), 5) // 5 = fully complete (post-submit)
  const progress = clampedStep / 5
  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const center = VIEW_SIZE / 2

  return (
    <svg
      width={VIEW_SIZE}
      height={VIEW_SIZE}
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      className="rotate-[-90deg]" // Start fill from top (12 o'clock)
      aria-hidden="true"
    >
      {/* Track ring — always full */}
      <circle
        cx={center}
        cy={center}
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE_WIDTH}
        className="text-gray-200"
      />

      {/* Progress ring — animates dashoffset */}
      <circle
        cx={center}
        cy={center}
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        className="text-red-600 transition-[stroke-dashoffset] duration-700 ease-in-out"
      />
    </svg>
  )
}