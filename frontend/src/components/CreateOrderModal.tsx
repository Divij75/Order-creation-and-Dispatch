import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, MapPin, Package, Calendar } from 'lucide-react'

const orderSchema = z.object({
  pickup_street: z.string().min(1, 'Required'),
  pickup_city: z.string().min(1, 'Required'),
  pickup_postal_code: z.string().min(1, 'Required'),
  delivery_street: z.string().min(1, 'Required'),
  delivery_city: z.string().min(1, 'Required'),
  delivery_postal_code: z.string().min(1, 'Required'),
  package_description: z.string().min(1, 'Required'),
  pickup_time: z.string().min(1, 'Required').refine((val) => {
    const d = new Date(val)
    return d > new Date()
  }, 'Must be a future date'),
  priority: z.enum(['Standard', 'Express', 'Same-day']),
})

type OrderFormData = z.infer<typeof orderSchema>

interface CreateOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    pickup_address: { street: string; city: string; postal_code: string }
    delivery_address: { street: string; city: string; postal_code: string }
    package_description: string
    pickup_time: string
    priority: string
  }) => Promise<void>
}

export function CreateOrderModal({ open, onOpenChange, onSubmit }: CreateOrderModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: { priority: 'Standard' },
  })

  const submit = async (data: OrderFormData) => {
    await onSubmit({
      pickup_address: {
        street: data.pickup_street,
        city: data.pickup_city,
        postal_code: data.pickup_postal_code,
      },
      delivery_address: {
        street: data.delivery_street,
        city: data.delivery_city,
        postal_code: data.delivery_postal_code,
      },
      package_description: data.package_description,
      pickup_time: data.pickup_time,
      priority: data.priority,
    })
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50">
              <Package className="h-5 w-5 text-indigo-600" />
            </div>
            Create Delivery Order
          </DialogTitle>
          <DialogDescription>
            Fill in pickup, delivery, and cargo details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="px-6 pb-2 space-y-6">
          {/* Section 1: Pickup */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-600 text-white text-xs font-bold">1</div>
              <h4 className="text-sm font-semibold text-slate-700">Pickup Address</h4>
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
              <div className="sm:col-span-6">
                <Label htmlFor="pickup_street">Street *</Label>
                <Input id="pickup_street" placeholder="e.g. 100 Transport Ave" {...register('pickup_street')} className={errors.pickup_street ? 'border-red-400 focus-visible:ring-red-400' : ''} />
                {errors.pickup_street && <p className="text-xs text-red-500 mt-1">{errors.pickup_street.message}</p>}
              </div>
              <div className="sm:col-span-4">
                <Label htmlFor="pickup_city">City *</Label>
                <Input id="pickup_city" placeholder="San Francisco" {...register('pickup_city')} className={errors.pickup_city ? 'border-red-400 focus-visible:ring-red-400' : ''} />
                {errors.pickup_city && <p className="text-xs text-red-500 mt-1">{errors.pickup_city.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="pickup_postal_code">Postal Code *</Label>
                <Input id="pickup_postal_code" placeholder="94103" {...register('pickup_postal_code')} className={errors.pickup_postal_code ? 'border-red-400 focus-visible:ring-red-400' : ''} />
                {errors.pickup_postal_code && <p className="text-xs text-red-500 mt-1">{errors.pickup_postal_code.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Delivery */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-600 text-white text-xs font-bold">2</div>
              <h4 className="text-sm font-semibold text-slate-700">Delivery Destination</h4>
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
              <div className="sm:col-span-6">
                <Label htmlFor="delivery_street">Street *</Label>
                <Input id="delivery_street" placeholder="e.g. 200 Logistics Blvd" {...register('delivery_street')} className={errors.delivery_street ? 'border-red-400 focus-visible:ring-red-400' : ''} />
                {errors.delivery_street && <p className="text-xs text-red-500 mt-1">{errors.delivery_street.message}</p>}
              </div>
              <div className="sm:col-span-4">
                <Label htmlFor="delivery_city">City *</Label>
                <Input id="delivery_city" placeholder="Oakland" {...register('delivery_city')} className={errors.delivery_city ? 'border-red-400 focus-visible:ring-red-400' : ''} />
                {errors.delivery_city && <p className="text-xs text-red-500 mt-1">{errors.delivery_city.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="delivery_postal_code">Postal Code *</Label>
                <Input id="delivery_postal_code" placeholder="94607" {...register('delivery_postal_code')} className={errors.delivery_postal_code ? 'border-red-400 focus-visible:ring-red-400' : ''} />
                {errors.delivery_postal_code && <p className="text-xs text-red-500 mt-1">{errors.delivery_postal_code.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Cargo & Scheduling */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-600 text-white text-xs font-bold">3</div>
              <h4 className="text-sm font-semibold text-slate-700">Cargo &amp; Scheduling</h4>
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
              <div className="sm:col-span-6">
                <Label htmlFor="package_description">Package Description *</Label>
                <Textarea id="package_description" rows={3} placeholder="Describe contents, handling requirements, weight…" {...register('package_description')} className={errors.package_description ? 'border-red-400 focus-visible:ring-red-400' : ''} />
                {errors.package_description && <p className="text-xs text-red-500 mt-1">{errors.package_description.message}</p>}
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="pickup_time">Pickup Date &amp; Time *</Label>
                <Input id="pickup_time" type="datetime-local" {...register('pickup_time')} className={errors.pickup_time ? 'border-red-400 focus-visible:ring-red-400' : ''} />
                {errors.pickup_time && <p className="text-xs text-red-500 mt-1">{errors.pickup_time.message}</p>}
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="priority">Priority *</Label>
                <Select id="priority" {...register('priority')}>
                  <SelectTrigger aria-invalid={!!errors.priority}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Express">Express</SelectItem>
                    <SelectItem value="Same-day">Same-day</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && <p className="text-xs text-red-500 mt-1">{errors.priority.message}</p>}
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => { reset(); onOpenChange(false); }}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} onClick={handleSubmit(submit)}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating…
              </>
            ) : (
              'Create Order'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
