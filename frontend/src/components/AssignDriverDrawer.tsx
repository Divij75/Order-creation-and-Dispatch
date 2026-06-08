import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MapPin, Truck } from 'lucide-react'
import type { Order, Driver } from '@/types'

interface AssignDriverDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  drivers: Driver[]
  onAssign: (driver: Driver) => void
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export function AssignDriverDrawer({ open, onOpenChange, order, drivers, onAssign }: AssignDriverDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50">
              <Truck className="h-5 w-5 text-indigo-600" />
            </div>
            Assign Driver
          </SheetTitle>
          <SheetDescription>
            {order ? `Select a driver for Order #${order.id}` : 'Select a driver'}
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 py-4 space-y-3 overflow-y-auto flex-1">
          {drivers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-full bg-slate-100 mb-4">
                <Truck className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-500">No drivers available</p>
              <p className="text-xs text-slate-400 mt-1">All drivers are currently on dispatch.</p>
            </div>
          ) : (
            drivers.map((driver) => (
              <div
                key={driver.id}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={driver.available ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}>
                      {getInitials(driver.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{driver.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1 text-slate-400">
                        <MapPin className="h-3 w-3" />
                        <span className="text-xs">{driver.city}</span>
                      </div>
                      <Badge variant={driver.available ? 'available' : 'busy'}>
                        {driver.available ? 'Available' : 'Busy'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={!driver.available}
                  onClick={() => onAssign(driver)}
                  variant={driver.available ? 'default' : 'secondary'}
                >
                  Assign
                </Button>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
