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
      setError('Please select a valid model and trim')
      return
    }
    setModel(selectedNumber, trim)
    setTimeout(() => nextStep(), 800)
  }

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* iPad Model dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-600">iPad Model</label>
        <div className="relative">
          <select
            value={selectedNumber}
            onChange={e => handleNumberChange(e.target.value)}
            className="w-full appearance-none border-2 border-gray-200 rounded-xl px-4 py-3 pr-10
                       text-slate-900 bg-white cursor-pointer
                       focus:outline-none focus:border-red-400 transition-colors duration-200 text-sm"
          >
            <option value="" disabled>Select iPad model…</option>
            {iPadModels.map(m => (
              <option key={m.number} value={m.number}>{m.number}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Generation/Trim dropdown — always shown once a model is picked */}
      {selectedNumber && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">Generation</label>
          <div className="relative">
            <select
              value={selectedTrim}
              onChange={e => handleTrimChange(e.target.value)}
              className="w-full appearance-none border-2 border-gray-200 rounded-xl px-4 py-3 pr-10
                         text-slate-900 bg-white cursor-pointer
                         focus:outline-none focus:border-red-400 transition-colors duration-200 text-sm"
            >
              <option value="" disabled>Select generation…</option>
              {trims.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  )
}