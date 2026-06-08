import type { Order, Driver } from '@/types'

const API_BASE = '/api'

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/orders`)
  if (!res.ok) throw new Error('Failed to fetch orders')
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function fetchDrivers(): Promise<Driver[]> {
  const res = await fetch(`${API_BASE}/drivers`)
  if (!res.ok) throw new Error('Failed to fetch drivers')
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function createOrder(order: Omit<Order, 'id' | 'status' | 'assigned_driver' | 'created_at' | 'updated_at'>): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create order')
  return data
}

export async function assignDriver(orderId: number, driverId: number): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/assign`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId, driver_id: driverId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to assign driver')
  return data
}

export async function markDelivered(orderId: number): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/status?id=${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Delivered' }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update status')
  return data
}
