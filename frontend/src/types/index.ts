export interface Address {
  street: string
  city: string
  postal_code: string
}

export interface Driver {
  id: number
  name: string
  city: string
  available: boolean
  current_order: number
}

export interface Order {
  id: number
  pickup_address: Address
  delivery_address: Address
  package_description: string
  pickup_time: string
  priority: Priority
  status: Status
  assigned_driver: Driver | null
  created_at: string
  updated_at: string
}

export type Status = 'Pending' | 'Dispatched' | 'Delivered'
export type Priority = 'Standard' | 'Express' | 'Same-day'
