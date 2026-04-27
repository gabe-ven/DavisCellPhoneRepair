// components/ServicesSection/steps/IPhonePicker.tsx

'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  iPhoneModels,
  getIPhoneTrims,
  iPhoneNeedsTrim,
  isValidIPhoneCombo,
} from '../data/iPhoneModels'
import { getDeviceImage } from '../data/deviceImageMap'

interface IPhonePickerProps {
  modelNumber: string | null
  modelTrim: string | null
  setModel: (number: string, trim: string | null) => void
  nextStep: () => void
}

export default function IPhonePicker({ modelNumber, modelTrim, setModel, nextStep }: IPhonePickerProps) {
  const [selectedNumber, setSelectedNumber] = useState<string>(modelNumber ?? '')
  const [selectedTrim, setSelectedTrim] = useState<string>(modelTrim ?? '')
  const [error, setError] = useState<string | null>(null)

  const needsTrim = selectedNumber ? iPhoneNeedsTrim(selectedNumber) : false
  const trims = selectedNumber ? getIPhoneTrims(selectedNumber) : []

  function handleNumberChange(number: string) {
    setSelectedNumber(number)
    setSelectedTrim('')
    setError(null)

    if (!iPhoneNeedsTrim(number)) {
      // No trim needed — auto-advance
      setModel(number, null)
      setTimeout(() => nextStep(), 800)
    }
  }

  function handleTrimChange(trim: string) {
    // trim from the dropdown can be '' (placeholder) or a real value or '__null__'
    const resolved = trim === '__null__' ? null : trim
    setSelectedTrim(trim)
    setError(null)

    if (!selectedNumber) return
    if (!isValidIPhoneCombo(selectedNumber, resolved)) {
      setError('Please select a valid model and trim')
      return
    }
    setModel(selectedNumber, resolved)
    setTimeout(() => nextStep(), 800)
  }

  // Derive image once both are valid
  const showImage =
    selectedNumber && (!needsTrim || selectedTrim) &&
    isValidIPhoneCombo(selectedNumber, selectedTrim === '__null__' ? null : selectedTrim || null)

  const imageUrl = showImage
    ? getDeviceImage(selectedNumber, selectedTrim === '__null__' ? null : selectedTrim || null)
    : null

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* iPhone Number dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-600">iPhone Model</label>
        <div className="relative">
          <select
            value={selectedNumber}
            onChange={e => handleNumberChange(e.target.value)}
            className="w-full appearance-none border-2 border-gray-200 rounded-xl px-4 py-3 pr-10
                       text-slate-900 bg-white cursor-pointer
                       focus:outline-none focus:border-red-400 transition-colors duration-200 text-sm"
          >
            <option value="" disabled>Select iPhone model…</option>
            {iPhoneModels.map(m => (
              <option key={m.number} value={m.number}>{m.number}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Trim dropdown — only shown when needed */}
      {needsTrim && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">Trim</label>
          <div className="relative">
            <select
              value={selectedTrim}
              onChange={e => handleTrimChange(e.target.value)}
              className="w-full appearance-none border-2 border-gray-200 rounded-xl px-4 py-3 pr-10
                         text-slate-900 bg-white cursor-pointer
                         focus:outline-none focus:border-red-400 transition-colors duration-200 text-sm"
            >
              <option value="" disabled>Select trim…</option>
              {trims.map((t, i) => (
                <option key={i} value={t === null ? '__null__' : t}>
                  {t === null ? `${selectedNumber} (Base)` : t}
                </option>
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

      {/* Device image preview */}
      {imageUrl && (
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt={`${selectedNumber}${selectedTrim ? ' ' + selectedTrim : ''}`}
            className="h-32 object-contain opacity-80"
          />
        </div>
      )}
    </div>
  )
}