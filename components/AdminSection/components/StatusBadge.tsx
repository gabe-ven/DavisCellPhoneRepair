// Status color tokens:
// received:   bg-blue-100 text-blue-700   dark:bg-blue-950 dark:text-blue-300
// reviewing:  bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300
// in_repair:  bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300
// ready:      bg-green-100 text-green-700  dark:bg-green-950 dark:text-green-300
// completed:  bg-gray-100 text-gray-500   dark:bg-gray-800 dark:text-gray-400

import type { TicketStatus } from '../../ServicesSection/types/wizard'

const STATUS_STYLES: Record<TicketStatus, string> = {
  received:  'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  reviewing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  in_repair: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  ready:     'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  completed: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
}

const STATUS_LABELS: Record<TicketStatus, string> = {
  received:  'Received',
  reviewing: 'Reviewing',
  in_repair: 'In Repair',
  ready:     'Ready',
  completed: 'Completed',
}

interface StatusBadgeProps {
  status: TicketStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}