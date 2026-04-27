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
            ? 'border-red-500 bg-red-50 ring-2 ring-red-500 ring-offset-1'
            : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50/30'
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
            <div className="w-full h-full bg-gray-100 rounded-xl" />
          )}
        </div>
  
        {/* Label */}
        <span className={`font-semibold text-center leading-tight ${isLarge ? 'text-base' : 'text-sm'} ${selected ? 'text-red-600' : 'text-slate-700'}`}>
          {label}
        </span>
      </button>
    )
  }