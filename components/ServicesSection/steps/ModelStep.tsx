// components/ServicesSection/steps/ModelStep.tsx

'use client'

import { useState } from 'react'
import type { DeviceType, AndroidBrand } from '../types/wizard'
import AndroidModelPicker from './AndroidModelPicker'
import IPhonePicker from './IPhonePicker'
import TabletPicker from './TabletPicker'
import OtherModelModal from '../modals/OtherModelModal'

interface ModelStepProps {
  device: DeviceType
  modelNumber: string | null
  modelTrim: string | null
  setBrand: (brand: string) => void
  setModel: (number: string, trim: string | null) => void
  setModelCustom: (custom: string) => void
  nextStep: () => void
}

export default function ModelStep({
  device,
  modelNumber,
  modelTrim,
  setBrand,
  setModel,
  setModelCustom,
  nextStep,
}: ModelStepProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<AndroidBrand | null>(null)

  // Tablet inline form state
  const [tabletMake, setTabletMake] = useState('')
  const [tabletModel, setTabletModel] = useState('')

  function handleOpenModal(brand: AndroidBrand) {
    setSelectedBrand(brand)
    setModalOpen(true)
  }

  function handleModalConfirm(value: string) {
    setModalOpen(false)
    setModelCustom(value)
    nextStep()
  }

  function handleTabletContinue() {
    const combined = `${tabletMake.trim()} ${tabletModel.trim()}`
    setModelCustom(combined)
    nextStep()
  }

  const tabletReady = tabletMake.trim().length > 0 && tabletModel.trim().length > 0

  const inputClass = `
    w-full border-2 border-[#e5e7eb] rounded-xl px-4 py-3
    text-[#111111] placeholder:text-[#9ca3af]
    focus:outline-none focus:border-brand
    transition-colors duration-200 text-sm
  `

  return (
    <>
      {device === 'android' && (
        <AndroidModelPicker
          setBrand={setBrand}
          nextStep={nextStep}
          openModal={handleOpenModal}
        />
      )}

      {device === 'iphone' && (
        <IPhonePicker
          modelNumber={modelNumber}
          modelTrim={modelTrim}
          setModel={setModel}
          nextStep={nextStep}
        />
      )}

      {device === 'tablet' && (
        <div className="flex flex-col gap-4 w-full">
          <p className="text-base font-semibold" style={{ color: '#374151' }}>
            What&apos;s your tablet?
          </p>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide px-1" style={{ color: '#9ca3af' }}>Make</label>
            <input
              type="text"
              value={tabletMake}
              onChange={e => setTabletMake(e.target.value)}
              placeholder="e.g. Samsung, Microsoft, Lenovo"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide px-1" style={{ color: '#9ca3af' }}>Model</label>
            <input
              type="text"
              value={tabletModel}
              onChange={e => setTabletModel(e.target.value)}
              placeholder="e.g. Galaxy Tab S9, Surface Pro 11, Tab P12"
              className={inputClass}
            />
          </div>
          <button
            onClick={handleTabletContinue}
            disabled={!tabletReady}
            className="w-full bg-brand hover:bg-brand-hover disabled:bg-[#e5e7eb] disabled:text-[#9ca3af]
                       text-white font-bold tracking-[0.02em] rounded-lg py-3 text-sm
                       transition-all duration-200 active:scale-95"
            style={!tabletReady ? undefined : { boxShadow: '0 4px 20px rgba(139,26,26,0.25)' }}
          >
            Continue
          </button>
        </div>
      )}

      {device === 'ipad' && (
        <TabletPicker
          modelNumber={modelNumber}
          modelTrim={modelTrim}
          setModel={setModel}
          nextStep={nextStep}
        />
      )}

      <OtherModelModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        brand={selectedBrand}
      />
    </>
  )
}