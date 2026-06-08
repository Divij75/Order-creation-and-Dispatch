import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/StatusBadge'
import { PriorityBadge } from '@/components/PriorityBadge'
import { Truck, CheckCircle, Eye, ArrowRight } from 'lucide-react'
import type { Order } from '@/types'

interface OrderCardProps {
  order: Order
  onAssign: (order: Order) => void
  onDeliver: (orderId: number) => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export function OrderCard({ order, onAssign, onDeliver }: OrderCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Top row: ID + Status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-slate-800">#{order.id}</span>
        <StatusBadge status={order.status} />
      </div>

      {/* Route */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className="font-medium text-slate-700">{order.pickup_address.city}</span>
        <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-medium text-slate-700">{order.delivery_address.city}</span>
      </div>

      {/* Package + Priority */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500 truncate max-w-[60%]">{order.package_description}</p>
        <PriorityBadge priority={order.priority} />
      </div>

      {/* Driver */}
      {order.assigned_driver && (
        <div className="flex items-center gap-2 mb-3 py-2 px-3 bg-slate-50 rounded-lg">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[9px]">
              {getInitials(order.assigned_driver.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-slate-600">{order.assigned_driver.name}</span>
        </div>
      )}

      {/* Action */}
      <div className="pt-2 border-t border-slate-100">
        {order.status === 'Pending' && (
          <Button size="sm" className="w-full" onClick={() => onAssign(order)}>
            <Truck className="h-3.5 w-3.5" />
            Assign Driver
          </Button>
        )}
        {order.status === 'Dispatched' && (
          <Button size="sm" variant="success" className="w-full" onClick={() => onDeliver(order.id)}>
            <CheckCircle className="h-3.5 w-3.5" />
            Mark Delivered
          </Button>
        )}
        {order.status === 'Delivered' && (
          <Button size="sm" variant="outline" className="w-full">
            <Eye className="h-3.5 w-3.5" />
            View Details
          </Button>
        )}
      </div>
    </div>
  )
}
