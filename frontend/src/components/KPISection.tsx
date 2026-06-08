import { Package, Clock, Navigation, CheckCircle } from 'lucide-react'
import type { Order } from '@/types'

interface KPISectionProps {
  orders: Order[]
}

export function KPISection({ orders }: KPISectionProps) {
  const total = orders.length
  const pending = orders.filter(o => o.status === 'Pending').length
  const dispatched = orders.filter(o => o.status === 'Dispatched').length
  const delivered = orders.filter(o => o.status === 'Delivered').length

  const cards = [
    {
      label: 'Total Orders',
      value: total,
      icon: Package,
      color: 'text-slate-800',
      bg: 'bg-slate-100',
      border: 'border-slate-200',
      trend: total > 0 ? `${total} total` : 'No orders yet',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      trend: pending > 0 ? 'Awaiting dispatch' : 'All clear',
    },
    {
      label: 'Dispatched',
      value: dispatched,
      icon: Navigation,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      trend: dispatched > 0 ? 'In transit' : 'None in transit',
    },
    {
      label: 'Delivered',
      value: delivered,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      trend: total > 0 ? `${Math.round((delivered / total) * 100)}% completion` : 'No deliveries',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg, border, trend }) => (
        <div
          key={label}
          className={`group relative bg-white rounded-xl border ${border} p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-default`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {label}
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
              <p className="text-xs text-slate-400 mt-1.5">{trend}</p>
            </div>
            <div className={`${bg} ${color} p-2.5 rounded-lg transition-transform duration-200 group-hover:scale-110`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
