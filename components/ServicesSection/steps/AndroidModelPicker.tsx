// components/ServicesSection/steps/AndroidModelPicker.tsx

import { androidBrands } from '../data/androidBrands'
import type { AndroidBrand } from '../types/wizard'
import DeviceCard from '../ui/DeviceCard'

interface AndroidModelPickerProps {
  setBrand: (brand: string) => void
  nextStep: () => void
  openModal: (brand: AndroidBrand) => void
}

export default function AndroidModelPicker({ setBrand, nextStep, openModal }: AndroidModelPickerProps) {
  function handleSelect(brand: AndroidBrand) {
    setBrand(brand.id)
    openModal(brand)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {androidBrands.map(brand => (
        <DeviceCard
          key={brand.id}
          label={brand.label}
          imagePath={brand.imagePath}
          size="large"
          onClick={() => handleSelect(brand)}
        />
      ))}
    </div>
  )
}