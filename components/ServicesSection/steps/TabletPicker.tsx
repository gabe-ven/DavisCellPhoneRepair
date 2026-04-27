// components/ServicesSection/steps/TabletPicker.tsx

'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { iPadModels, getIPadTrims, isValidIPadCombo } from '../data/iPadModels'

interface TabletPickerProps {
  modelNumber: string | null
  modelTrim: string | null
  setModel: (number: string, trim: string | null) => void
  nextStep: () => void
}

export default function TabletPicker({ modelNumber, modelTrim, setModel, nextStep }: TabletPickerProps) {
  const [selectedNumber, setSelectedNumber] = useState<string>(modelNumber ?? '')
  const [selectedTrim, setSelectedTrim] = useState<string>(modelTrim ?? '')
  const [error, setError] = useState<string | null>(null)

  const trims = selectedNumber ? getIPadTrims(selectedNumber) : []
  const canContinue = selectedNumber !== '' && selectedTrim !== '' && isValidIPadCombo(selectedNumber, selectedTrim)

  function handleNumberChange(number: string) {
    setSelectedNumber(number)
    setSelectedTrim('')
    setError(null)
  }

  function handleTrimChange(trim: string) {
    setSelectedTrim(trim)
    setError(null)

    if (!selectedNumber) return
    if (!isValidIPadCombo(selectedNumber, trim)) {
      setError('Please select a valid model and generation')
      return
    }
    setModel(selectedNumber, trim)
  }

  function handleContinue() {
    if (!canContinue) return
    nextStep()
  }

  const selectClass =
    'w-full appearance-none border-2 border-[#e5e7eb] rounded-xl px-4 py-3 pr-10 text-[#111111] bg-white cursor-pointer focus:outline-none focus:border-brand transition-colors duration-200 text-sm'

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* iPad Model dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: '#374151' }}>iPad Model</label>
        <div className="relative">
          <select
            value={selectedNumber}
            onChange={e => handleNumberChange(e.target.value)}
            className={selectClass}
          >
            <option value="" disabled>Select iPad model…</option>
            {iPadModels.map(m => (
              <option key={m.number} value={m.number}>{m.number}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
        </div>
      </div>

      {/* Generation dropdown — shown once a model is picked */}
      {selectedNumber && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" style={{ color: '#374151' }}>Generation</label>
          <div className="relative">
            <select
              value={selectedTrim}
              onChange={e => handleTrimChange(e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>Select generation…</option>
              {trims.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-brand font-medium">{error}</p>
      )}

      {/* Continue — only appears once both dropdowns are filled */}
      {canContinue && (
        <button
          onClick={handleContinue}
          className="w-full bg-brand hover:bg-brand-hover text-white font-bold tracking-[0.02em] rounded-lg py-3 text-sm transition-all duration-200 active:scale-95"
          style={{ boxShadow: '0 4px 20px rgba(139,26,26,0.25)' }}
        >
          Continue
        </button>
      )}
    </div>
  )
}
