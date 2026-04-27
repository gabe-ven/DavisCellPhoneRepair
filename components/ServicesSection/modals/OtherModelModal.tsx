// components/ServicesSection/modals/OtherModelModal.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { AndroidBrand } from '../types/wizard'

interface OtherModelModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (value: string) => void
  brand: AndroidBrand | null
}

export default function OtherModelModal({ isOpen, onClose, onConfirm, brand }: OtherModelModalProps) {
  const [model, setModel] = useState('')
  const [make, setMake] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Is this a known brand (not Other/null placeholder)?
  const isKnownBrand = brand !== null && brand.placeholder !== null

  // Reset and focus on open
  useEffect(() => {
    if (isOpen) {
      setModel('')
      setMake('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Escape key closes
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const canSubmit = isKnownBrand
    ? model.trim().length > 0
    : make.trim().length > 0 && model.trim().length > 0

  function handleConfirm() {
    if (!canSubmit) return
    const value = isKnownBrand
      ? model.trim()
      : `${make.trim()} ${model.trim()}`
    onConfirm(value)
    setModel('')
    setMake('')
  }

  const title = isKnownBrand
    ? `What's your ${brand!.label} model?`
    : "What's your device?"

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold text-slate-900 mb-5">
          {title}
        </h3>

        <div className="flex flex-col gap-3">
          {/* Make field — only for Other/unknown brand */}
          {!isKnownBrand && (
            <input
              ref={inputRef}
              type="text"
              value={make}
              onChange={e => setMake(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleConfirm() }}
              placeholder='e.g. Sony, Nokia, Asus'
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400
                         focus:outline-none focus:border-red-400 transition-colors duration-200 text-sm"
            />
          )}

          {/* Model field — always shown */}
          <input
            ref={isKnownBrand ? inputRef : undefined}
            type="text"
            value={model}
            onChange={e => setModel(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleConfirm() }}
            placeholder={isKnownBrand ? brand!.placeholder! : 'e.g. Xperia 1 VI, G50'}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400
                       focus:outline-none focus:border-red-400 transition-colors duration-200 text-sm"
          />
        </div>

        <button
          onClick={handleConfirm}
          disabled={!canSubmit}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400
                     text-white font-semibold rounded-xl py-3 text-sm
                     transition-all duration-200 active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  )
}