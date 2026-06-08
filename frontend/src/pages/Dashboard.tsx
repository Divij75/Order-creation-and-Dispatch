import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { KPISection } from '@/components/KPISection'
import { OrderTable } from '@/components/OrderTable'
import { OrderCard } from '@/components/OrderCard'
import { CreateOrderModal } from '@/components/CreateOrderModal'
import { AssignDriverDrawer } from '@/components/AssignDriverDrawer'
import { useToast } from '@/components/ui/use-toast'
import { fetchOrders, fetchDrivers, createOrder, assignDriver, markDelivered } from '@/services/api'
import type { Order, Driver, Status } from '@/types'
import {
  Truck,
  Plus,
  Search,
  Bell,
  Package,
  Loader2,
} from 'lucide-react'

const statusFilters: Array<{ label: string; value: Status | 'All' }> = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Dispatched', value: 'Dispatched' },
  { label: 'Delivered', value: 'Delivered' },
]

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [driverDrawerOpen, setDriverDrawerOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const { toast } = useToast()

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [ordersData, driversData] = await Promise.all([fetchOrders(), fetchDrivers()])
      setOrders(ordersData.slice().reverse())
      setDrivers(driversData)
    } catch {
      toast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Filtered orders
  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter
    const q = searchQuery.toLowerCase()
    const matchSearch =
      !q ||
      [
        String(o.id),
        o.package_description,
        o.pickup_address.city,
        o.delivery_address.city,
        o.assigned_driver?.name,
      ].some((v) => (v ?? '').toLowerCase().includes(q))
    return matchStatus && matchSearch
  })

  // Handlers
  const handleCreateOrder = async (data: {
    pickup_address: { street: string; city: string; postal_code: string }
    delivery_address: { street: string; city: string; postal_code: string }
    package_description: string
    pickup_time: string
    priority: string
  }) => {
    try {
      const newOrder = await createOrder(data as any)
      setOrders((prev) => [newOrder, ...prev])
      setCreateModalOpen(false)
      toast(`Order #${newOrder.id} created successfully!`, 'success')
    } catch (e: any) {
      toast(e.message || 'Failed to create order', 'error')
      throw e
    }
  }

  const handleOpenAssignDrawer = (order: Order) => {
    setSelectedOrder(order)
    setDriverDrawerOpen(true)
  }

  const handleAssignDriver = async (driver: Driver) => {
    if (!selectedOrder) return
    try {
      const updated = await assignDriver(selectedOrder.id, driver.id)
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      setDriverDrawerOpen(false)
      setSelectedOrder(null)
      const driversData = await fetchDrivers()
      setDrivers(driversData)
      toast(`${driver.name} assigned to Order #${updated.id}`, 'success')
    } catch (e: any) {
      toast(e.message || 'Failed to assign driver', 'error')
    }
  }

  const handleDeliver = async (orderId: number) => {
    try {
      const updated = await markDelivered(orderId)
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      const driversData = await fetchDrivers()
      setDrivers(driversData)
      toast(`Order #${orderId} marked as delivered ✓`, 'success')
    } catch (e: any) {
      toast(e.message || 'Failed to update status', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 shadow-sm">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              DispatchFlow
            </span>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex relative max-w-sm flex-1 mx-8">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search orders…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-slate-100 text-slate-800 text-xs font-bold">
                DF
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Monitor and manage all delivery operations</p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>

        {/* KPIs */}
        <KPISection orders={orders} />

        {/* Orders Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Orders</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Status filters */}
                <div className="flex gap-1 p-1 rounded-lg bg-slate-100">
                  {statusFilters.map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => setStatusFilter(value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        statusFilter === value
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-slate-500 animate-spin mb-3" />
              <p className="text-sm text-slate-400">Loading orders…</p>
            </div>
          ) : filtered.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="p-4 rounded-full bg-slate-100 mb-4">
                <Package className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-base font-semibold text-slate-600">No Orders Yet</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-sm">
                Create your first delivery order to begin managing dispatches.
              </p>
              <Button className="mt-5" onClick={() => setCreateModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Create Order
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <OrderTable orders={filtered} onAssign={handleOpenAssignDrawer} onDeliver={handleDeliver} />
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4 grid gap-3">
                {filtered.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onAssign={handleOpenAssignDrawer}
                    onDeliver={handleDeliver}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* ─── Modals & Drawers ─── */}
      <CreateOrderModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateOrder}
      />

      <AssignDriverDrawer
        open={driverDrawerOpen}
        onOpenChange={setDriverDrawerOpen}
        order={selectedOrder}
        drivers={drivers}
        onAssign={handleAssignDriver}
      />
    </div>
  )
}
