import { issueTypes } from '../data/issueTypes'
import IssueCard from '../ui/IssueCard'
import FloatingPill from '../ui/FloatingPill'
import type { DeviceType } from '../types/wizard'

interface IssueStepProps {
  device: DeviceType | null
  issues: string[]
  toggleIssue: (id: string) => void
  nextStep: () => void
}

const DEVICE_LABEL: Record<string, string> = {
  iphone:  'iPhone',
  android: 'Android Phone',
  tablet:  'Tablet',
}

export default function IssueStep({ device, issues, toggleIssue, nextStep }: IssueStepProps) {
  const deviceLabel = device ? (DEVICE_LABEL[device] ?? 'device') : 'device'

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Sub-header */}
      <p className="text-slate-500 text-sm text-center">
        What's wrong with your {deviceLabel}?
      </p>

      {/* Break out of the wizard's horizontal padding on desktop */}
      <div className="lg:-mx-[20vw]">
        <div className="grid grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4 pb-28">
          {issueTypes.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              selected={issues.includes(issue.id)}
              onClick={() => toggleIssue(issue.id)}
            />
          ))}
        </div>
      </div>

      {issues.length > 0 && (
        <FloatingPill count={issues.length} onClick={nextStep} />
      )}

    </div>
  )
}