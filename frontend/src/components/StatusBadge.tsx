import { Badge } from '@/components/ui/badge'
import type { Status } from '@/types'
import { Clock, Navigation, CheckCircle } from 'lucide-react'

const statusConfig: Record<Status, { variant: 'pending' | 'dispatched' | 'delivered'; icon: React.ReactNode }> = {
  Pending: { variant: 'pending', icon: <Clock className="h-3 w-3" /> },
  Dispatched: { variant: 'dispatched', icon: <Navigation className="h-3 w-3" /> },
  Delivered: { variant: 'delivered', icon: <CheckCircle className="h-3 w-3" /> },
}

interface StatusBadgeProps {
  status: Status
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant}>
      {config.icon}
      {status}
    </Badge>
  )
}
