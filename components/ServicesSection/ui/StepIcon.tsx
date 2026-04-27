// components/ServicesSection/ui/StepIcon.tsx
// Renders the Lucide icon for the current wizard step.
// All icon decisions live here — step components never import icons directly.

import {
    Smartphone,
    Cpu,
    Wrench,
    CalendarDays,
    ClipboardList,
    CheckCircle,
    LucideIcon,
  } from 'lucide-react'
  
  // Map: step number → Lucide icon component
  // Step 5 = post-submit confirmation state (checkmark)
  const STEP_ICON_MAP: Record<number, LucideIcon> = {
    0: Smartphone,    // Device selection
    1: Cpu,           // Model selection
    2: Wrench,        // Issue selection
    3: CalendarDays,  // Appointment
    4: ClipboardList, // Quote + submission
    5: CheckCircle,   // Post-submit confirmation
  }
  
  interface StepIconProps {
    step: number  // 0–5
    size?: number
  }
  
  export default function StepIcon({ step, size = 28 }: StepIconProps) {
    const Icon = STEP_ICON_MAP[step] ?? Smartphone
    const isComplete = step === 5
  
    return (
      <Icon
        size={size}
        strokeWidth={1.75}
        className={
          isComplete
            ? 'text-red-600 transition-colors duration-300'
            : 'text-slate-700 transition-colors duration-300'
        }
      />
    )
  }