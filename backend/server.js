import express from 'express';
import cors from 'cors';

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// In-memory data store
let orders = [];
let nextOrderId = 1;

let drivers = [
  { id: 1, name: 'John Smith', city: 'San Francisco', available: true, current_order: 0 },
  { id: 2, name: 'Maria Garcia', city: 'Oakland', available: true, current_order: 0 },
  { id: 3, name: 'Ahmed Hassan', city: 'San Jose', available: true, current_order: 0 },
  { id: 4, name: 'Lisa Chen', city: 'San Francisco', available: false, current_order: 0 },
  { id: 5, name: 'Carlos Rodriguez', city: 'Oakland', available: true, current_order: 0 },
];

// Validation Helper
function validateOrder(order) {
  if (!order.pickup_address || !order.pickup_address.street || !order.pickup_address.city || !order.pickup_address.postal_code) {
    return 'Pickup address is incomplete';
  }
  if (!order.delivery_address || !order.delivery_address.street || !order.delivery_address.city || !order.delivery_address.postal_code) {
    return 'Delivery address is incomplete';
  }
  if (!order.package_description || order.package_description.trim() === '') {
    return 'Package description is required';
  }
  if (!order.pickup_time || order.pickup_time.trim() === '') {
    return 'Pickup time is required';
  }
  if (!order.priority) {
    return 'Priority is required';
  }
  if (order.priority !== 'Standard' && order.priority !== 'Express' && order.priority !== 'Same-day') {
    return 'Invalid priority';
  }
  return null;
}

// 1. Create Order
app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  const validationError = validateOrder(orderData);
  
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const newOrder = {
    id: nextOrderId++,
    pickup_address: orderData.pickup_address,
    delivery_address: orderData.delivery_address,
    package_description: orderData.package_description,
    pickup_time: orderData.pickup_time,
    priority: orderData.priority,
    status: 'Pending',
    assigned_driver: null,
    created_at: new Date(),
    updated_at: new Date()
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// 2. Get All Orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// 3. Get Drivers
app.get('/api/drivers', (req, res) => {
  res.json(drivers);
});

// 4. Assign Driver to Order
app.put('/api/orders/assign', (req, res) => {
  const { order_id, driver_id } = req.body;

  if (!order_id || !driver_id) {
    return res.status(400).json({ error: 'order_id and driver_id are required' });
  }

  const orderIdx = orders.findIndex(o => o.id === order_id);
  if (orderIdx === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = orders[orderIdx];
  if (order.status !== 'Pending') {
    return res.status(400).json({ error: 'Only pending orders can be dispatched' });
  }

  const driver = drivers.find(d => d.id === driver_id);
  if (!driver) {
    return res.status(404).json({ error: 'Driver not found' });
  }

  if (!driver.available) {
    return res.status(400).json({ error: 'Driver is not available' });
  }

  // Update Driver status
  driver.available = false;
  driver.current_order = order_id;

  // Update Order status and assign driver
  order.status = 'Dispatched';
  order.assigned_driver = driver;
  order.updated_at = new Date();

  res.json(order);
});

// 5. Update Order Status (Mark as Delivered)
app.put('/api/orders/status', (req, res) => {
  const orderIdStr = req.query.id;
  if (!orderIdStr) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const orderId = parseInt(orderIdStr, 10);
  if (isNaN(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  const { status } = req.body;
  if (status !== 'Pending' && status !== 'Dispatched' && status !== 'Delivered') {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const orderIdx = orders.findIndex(o => o.id === orderId);
  if (orderIdx === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = orders[orderIdx];

  if (status === 'Delivered' && order.status !== 'Dispatched') {
    return res.status(400).json({ error: 'Only dispatched orders can be marked as delivered' });
  }

  // If status is Delivered, release the assigned driver
  if (status === 'Delivered' && order.assigned_driver) {
    const driver = drivers.find(d => d.id === order.assigned_driver.id);
    if (driver) {
      driver.available = true;
      driver.current_order = 0;
    }
  }

  order.status = status;
  order.updated_at = new Date();

  res.json(order);
});

// 6. Delete Order
app.delete('/api/orders', (req, res) => {
  const orderIdStr = req.query.id;
  if (!orderIdStr) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const orderId = parseInt(orderIdStr, 10);
  if (isNaN(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  const orderIdx = orders.findIndex(o => o.id === orderId);
  if (orderIdx === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = orders[orderIdx];

  // If order was dispatched and has an assigned driver, release the driver
  if (order.status === 'Dispatched' && order.assigned_driver) {
    const driver = drivers.find(d => d.id === order.assigned_driver.id);
    if (driver) {
      driver.available = true;
      driver.current_order = 0;
    }
  }

  orders.splice(orderIdx, 1);
  res.json({ message: `Order #${orderId} deleted successfully`, order });
});

// 7. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`🚀 Node/Express Order Dispatch API starting on http://localhost:${port}`);
});
