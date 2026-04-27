// components/ServicesSection/ui/FloatingPill.tsx

interface FloatingPillProps {
    count: number
    onClick: () => void
  }
  
  export default function FloatingPill({ count, onClick }: FloatingPillProps) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          fixed bottom-6 left-1/2 -translate-x-1/2
          bg-red-600 hover:bg-red-700 text-white
          rounded-full px-6 py-3 font-semibold
          shadow-lg hover:shadow-xl
          transition-all duration-200 opacity-100
          z-50
        "
      >
        Continue ({count}) →
      </button>
    )
  }