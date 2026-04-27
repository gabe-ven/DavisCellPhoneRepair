// components/ServicesSection/steps/DeviceStep.tsx

'use client'

import { useState } from 'react'
import type { DeviceType } from '../types/wizard'
import DeviceCard from '../ui/DeviceCard'

interface DeviceStepProps {
  setDevice: (device: DeviceType) => void
  nextStep: () => void
}

const devices: { type: DeviceType; label: string }[] = [
  { type: 'android', label: 'Android Phone' },
  { type: 'iphone',  label: 'iPhone' },
  { type: 'tablet',  label: 'Tablet' },
  { type: 'ipad',    label: 'iPad' },
]

export default function DeviceStep({ setDevice, nextStep }: DeviceStepProps) {
  const [advancing, setAdvancing] = useState(false)

  function handleSelect(device: DeviceType) {
    if (advancing) return  // ignore any extra clicks while the step is transitioning
    setAdvancing(true)
    setDevice(device)
    setTimeout(() => nextStep(), 600)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {devices.map(({ type, label }) => (
        <DeviceCard
          key={type}
          label={label}
          size="large"
          onClick={() => handleSelect(type)}
        />
      ))}
    </div>
  )
}
