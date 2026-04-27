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

  // Ready to continue: model chosen + trim filled if required
  const trimValue = selectedTrim === '__null__' ? null : selectedTrim || null
  const canContinue =
    selectedNumber !== '' &&
    (!needsTrim || (selectedTrim !== '' && isValidIPhoneCombo(selectedNumber, trimValue)))

  function handleNumberChange(number: string) {
    setSelectedNumber(number)
    setSelectedTrim('')
    setError(null)
    // Always set the model in state so it persists; user confirms with Continue
    if (!iPhoneNeedsTrim(number)) {
      setModel(number, null)
    }
  }

  function handleTrimChange(trim: string) {
    const resolved = trim === '__null__' ? null : trim
    setSelectedTrim(trim)
    setError(null)

    if (!selectedNumber) return
    if (!isValidIPhoneCombo(selectedNumber, resolved)) {
      setError('Please select a valid model and trim')
      return
    }
    setModel(selectedNumber, resolved)
  }

  function handleContinue() {
    if (!canContinue) return
    nextStep()
  }

  // Derive image once both are valid
  const showImage =
    selectedNumber !== '' &&
    (!needsTrim || (selectedTrim !== '' && isValidIPhoneCombo(selectedNumber, trimValue)))

  const imageUrl = showImage
    ? getDeviceImage(selectedNumber, trimValue)
    : null

  const selectClass =
    'w-full appearance-none border-2 border-[#e5e7eb] rounded-xl px-4 py-3 pr-10 text-[#111111] bg-white cursor-pointer focus:outline-none focus:border-brand transition-colors duration-200 text-sm'

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* iPhone Number dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" style={{ color: '#374151' }}>iPhone Model</label>
        <div className="relative">
          <select
            value={selectedNumber}
            onChange={e => handleNumberChange(e.target.value)}
            className={selectClass}
          >
            <option value="" disabled>Select iPhone model…</option>
            {iPhoneModels.map(m => (
              <option key={m.number} value={m.number}>{m.number}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
        </div>
      </div>

      {/* Trim dropdown — only shown when needed */}
      {needsTrim && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium" style={{ color: '#374151' }}>Trim</label>
          <div className="relative">
            <select
              value={selectedTrim}
              onChange={e => handleTrimChange(e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>Select trim…</option>
              {trims.map((t, i) => (
                <option key={i} value={t === null ? '__null__' : t}>
                  {t === null ? `${selectedNumber} (Base)` : t}
                </option>
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

      {/* Device image preview */}
      {imageUrl && (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`${selectedNumber}${selectedTrim ? ' ' + selectedTrim : ''}`}
            className="h-32 object-contain opacity-80"
          />
        </div>
      )}

      {/* Continue — only appears once a valid selection is made */}
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
