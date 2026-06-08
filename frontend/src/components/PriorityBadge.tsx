import { Badge } from '@/components/ui/badge'
import type { Priority } from '@/types'

const priorityConfig: Record<Priority, { variant: 'standard' | 'express' | 'sameday'; label: string }> = {
  Standard: { variant: 'standard', label: 'Standard' },
  Express: { variant: 'express', label: 'Express' },
  'Same-day': { variant: 'sameday', label: 'Same Day' },
}

interface PriorityBadgeProps {
  priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
