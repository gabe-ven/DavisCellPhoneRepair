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
        bg-brand hover:bg-brand-hover text-white
        rounded-lg px-6 py-3 font-bold tracking-[0.02em]
        shadow-lg hover:shadow-xl
        transition-all duration-200
        z-50
      "
      style={{ boxShadow: '0 4px 20px rgba(139,26,26,0.3)' }}
    >
      Continue ({count}) →
    </button>
  )
}
