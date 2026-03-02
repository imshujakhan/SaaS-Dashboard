import { API_BASE } from './config';
import { saveToCache, getFromCache, clearCache } from '../utils/cache';
import { logInfo, logError } from '../utils/logger';

export const orderService = {
  getAllOrders: async (dealerId, filters = {}) => {
    try {
      logInfo('Fetching orders', { dealerId, filters });
      const cacheKey = `orders_${dealerId}_${JSON.stringify(filters)}`;
      let orders = getFromCache(cacheKey);
      
      if (!orders) {
        const res = await fetch(`${API_BASE}/orders`);
        const allOrders = await res.json();
        orders = allOrders.filter(o => o.dealerId === dealerId);
        
        if (filters.status) {
          orders = orders.filter(o => o.orderStatus === filters.status);
        }
        
        if (filters.date === 'today') {
          const today = new Date().toISOString().split('T')[0];
          orders = orders.filter(o => o.appointmentDate === today);
        }
        
        saveToCache(cacheKey, orders);
      }
      
      logInfo('Orders fetched', { count: orders.length });
      return { success: true, data: orders };
    } catch (error) {
      logError('Error fetching orders', error);
      return { success: false, error: error.message };
    }
  },

  getOrderById: async (orderId) => {
    const res = await fetch(`${API_BASE}/orders`);
    const orders = await res.json();
    const order = orders.find(o => o.orderId === orderId || o.vehicleNumber === orderId);
    if (order) {
      return { 
        success: true, 
        data: order
      };
    }
    return { success: false, error: "Order not found" };
  },

  getOrdersByStatus: async (dealerId, status) => {
    const res = await fetch(`${API_BASE}/orders`);
    const allOrders = await res.json();
    const orders = allOrders.filter(o => o.dealerId === dealerId && o.orderStatus === status);
    return { success: true, data: orders };
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await fetch(`${API_BASE}/orders`);
    const orders = await res.json();
    const order = orders.find(o => o.orderId === orderId || o.vehicleNumber === orderId);
    if (order) {
      const now = new Date().toISOString();
      const updates = { orderStatus: status };
      if (status === 'pending') updates.receivedByDealer = now;
      if (status === 'completed') updates.completedDate = now;
      
      const updated = { ...order, ...updates };
      await fetch(`${API_BASE}/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      clearCache();
      return { success: true, data: updated };
    }
    return { success: false, error: "Order not found" };
  },

  createOrder: async (orderData) => {
    try {
      logInfo('Creating order', { dealerId: orderData.dealerId });
      const orderId = `HSRP${Date.now().toString().slice(-8)}`;
      const now = new Date().toISOString();
      const newOrder = {
        orderId,
        dealerId: orderData.dealerId,
        orderPlacedDate: now,
        appointmentDate: orderData.appointmentDate,
        appointmentTime: orderData.appointmentTime,
        customerName: orderData.customerName,
        customerMobile: orderData.customerMobile,
        customerAddress: orderData.customerAddress,
        vehicleNumber: orderData.vehicleNumber,
        chassisNumber: orderData.chassisNumber,
        engineNumber: orderData.engineNumber,
        vehicleClass: orderData.vehicleClass,
        orderStatus: "receiving",
        orderPlaced: now,
        orderDispatched: "",
        receivedByDealer: "",
        completedDate: ""
      };
      
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      
      if (!res.ok) {
        throw new Error('Failed to create order');
      }
      
      const created = await res.json();
      clearCache();
      logInfo('Order created', { orderId });
      return { success: true, data: { orderId, order: created } };
    } catch (error) {
      logError('Create order error', error);
      return { success: false, error: error.message };
    }
  },

  getScheduledAppointments: async (dealerId) => {
    const res = await fetch(`${API_BASE}/orders`);
    const allOrders = await res.json();
    const appointments = allOrders
      .filter(o => o.dealerId === dealerId)
      .map(o => ({
        date: o.appointmentDate,
        time: o.appointmentTime,
        orderId: o.orderId,
        customerName: o.customerName
      }));
    return { success: true, data: appointments };
  },

  getTodayCompletedOrders: async (dealerId) => {
    const res = await fetch(`${API_BASE}/orders`);
    const allOrders = await res.json();
    const today = new Date().toISOString().split('T')[0];
    const orders = allOrders.filter(
      o => o.dealerId === dealerId && 
      o.orderStatus === 'completed' &&
      o.completedDate?.startsWith(today)
    );
    return { success: true, data: orders };
  },
};
