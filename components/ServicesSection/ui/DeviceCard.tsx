// components/ServicesSection/ui/DeviceCard.tsx

interface DeviceCardProps {
    label: string
    imagePath?: string
    selected?: boolean
    onClick: () => void
    size?: 'default' | 'large'
  }

  export default function DeviceCard({
    label,
    imagePath,
    selected = false,
    onClick,
    size = 'default',
  }: DeviceCardProps) {
    const isLarge = size === 'large'

    return (
      <button
        onClick={onClick}
        className={`
          flex flex-col items-center w-full rounded-2xl border-2 cursor-pointer
          transition-all duration-200 ease-in-out
          shadow-sm hover:shadow-md active:scale-95
          ${isLarge ? 'gap-4 p-6 min-h-[200px]' : 'gap-3 p-4'}
          ${selected
            ? 'border-brand bg-brand/8 ring-2 ring-brand ring-offset-1'
            : 'border-[#e5e7eb] bg-white hover:border-brand/40 hover:bg-brand/5'
          }
        `}
      >
        {/* Image area */}
        <div className={`w-full flex items-center justify-center ${isLarge ? 'h-24' : 'h-16'}`}>
          {imagePath ? (
            <img
              src={imagePath}
              alt={label}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-[#f9f9f9] rounded-xl" />
          )}
        </div>

        {/* Label */}
        <span className={`font-semibold text-center leading-tight ${isLarge ? 'text-base' : 'text-sm'} ${selected ? 'text-brand' : 'text-[#374151]'}`}>
          {label}
        </span>
      </button>
    )
  }
