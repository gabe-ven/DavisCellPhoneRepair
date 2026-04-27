// StatCard color tokens:
// surface: bg-white dark:bg-[#1c1c2e]
// border: border-gray-200 dark:border-[#2a2a3e]
// label: text-gray-500 dark:text-gray-400
// value: text-gray-900 dark:text-gray-100

import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  subtext?: ReactNode
  icon: ReactNode
  iconBg: string
}

export default function StatCard({ label, value, subtext, icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1c1c2e] border border-gray-200 dark:border-[#2a2a3e] rounded-xl p-4 flex flex-col gap-2 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="text-[26px] font-medium text-gray-900 dark:text-gray-100 leading-none">
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-gray-500 dark:text-gray-400">{subtext}</div>
      )}
    </div>
  )
}