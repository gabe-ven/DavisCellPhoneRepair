// components/ServicesSection/ui/BackButton.tsx
//
// Mobile:  block-level, in normal document flow (between header and ring/bar).
//          Prevents overlap with step header text on narrow viewports.
// Desktop: absolute top-4 left-4 (md: and above), floats over the wizard wrapper.

import { ChevronLeft } from 'lucide-react'

interface BackButtonProps {
  step: number
  onBack: () => void
}

export default function BackButton({ step, onBack }: BackButtonProps) {
  if (step === 0) return null

  return (
    <button
      onClick={onBack}
      aria-label="Go back"
      className="
        flex items-center gap-1
        text-[#9ca3af] hover:text-brand
        transition-colors duration-200
        self-start
        md:absolute md:top-4 md:left-4
      "
    >
      <ChevronLeft size={22} strokeWidth={2} />
      <span className="text-sm font-medium">Back</span>
    </button>
  )
}