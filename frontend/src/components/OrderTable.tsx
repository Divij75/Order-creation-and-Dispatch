import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/StatusBadge'
import { PriorityBadge } from '@/components/PriorityBadge'
import { Truck, CheckCircle, Eye, Calendar } from 'lucide-react'
import type { Order } from '@/types'

interface OrderTableProps {
  orders: Order[]
  onAssign: (order: Order) => void
  onDeliver: (orderId: number) => void
}

function formatTime(t: string) {
  try {
    return new Date(t).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return t
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export function OrderTable({ orders, onAssign, onDeliver }: OrderTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
          <TableHead>Order ID</TableHead>
          <TableHead>Pickup City</TableHead>
          <TableHead>Delivery City</TableHead>
          <TableHead>Package</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Driver</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <span className="font-bold text-slate-800">#{order.id}</span>
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium text-slate-900 text-sm">{order.pickup_address.city}</p>
                <p className="text-xs text-slate-400 truncate max-w-[140px]">{order.pickup_address.street}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium text-slate-900 text-sm">{order.delivery_address.city}</p>
                <p className="text-xs text-slate-400 truncate max-w-[140px]">{order.delivery_address.street}</p>
              </div>
            </TableCell>
            <TableCell>
              <p className="text-sm text-slate-600 truncate max-w-[120px]">{order.package_description}</p>
            </TableCell>
            <TableCell>
              <PriorityBadge priority={order.priority} />
            </TableCell>
            <TableCell>
              <StatusBadge status={order.status} />
            </TableCell>
            <TableCell>
              {order.assigned_driver ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px]">
                      {getInitials(order.assigned_driver.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-700">{order.assigned_driver.name}</span>
                </div>
              ) : (
                <span className="text-sm text-slate-300">—</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">{formatTime(order.created_at)}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              {order.status === 'Pending' && (
                <Button size="sm" variant="default" onClick={() => onAssign(order)}>
                  <Truck className="h-3.5 w-3.5" />
                  Assign Driver
                </Button>
              )}
              {order.status === 'Dispatched' && (
                <Button size="sm" variant="success" onClick={() => onDeliver(order.id)}>
                  <CheckCircle className="h-3.5 w-3.5" />
                  Mark Delivered
                </Button>
              )}
              {order.status === 'Delivered' && (
                <Button size="sm" variant="outline">
                  <Eye className="h-3.5 w-3.5" />
                  View Details
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
