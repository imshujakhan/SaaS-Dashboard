import { saveToCache, getFromCache, clearCache } from '../utils/cache';
import { logInfo, logWarning, logError } from '../utils/logger';

const API_BASE = "https://69a22f42be843d692bd0f181.mockapi.io/api/v1";

export const api = {
  login: async (email, password) => {
    try {
      logInfo('Login attempt', { email });
      const cacheKey = 'dealers';
      let dealers = getFromCache(cacheKey);
      
      if (!dealers) {
        const res = await fetch(`${API_BASE}/dealers`);
        dealers = await res.json();
        saveToCache(cacheKey, dealers);
      }
      
      const dealer = dealers.find(d => d.email === email && d.password === password);
      if (dealer) {
        const { password: _, ...dealerData } = dealer;
        logInfo('Login successful', { dealerId: dealer.dealerId });
        return { success: true, data: dealerData };
      }
      logWarning('Login failed - invalid credentials', { email });
      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      logError('Login error', error);
      return { success: false, error: error.message };
    }
  },

  getDealerProfile: async (dealerId) => {
    const res = await fetch(`${API_BASE}/dealers`);
    const dealers = await res.json();
    const dealer = dealers.find(d => d.dealerId === dealerId);
    if (dealer) {
      const { password: _, ...dealerData } = dealer;
      return { success: true, data: dealerData };
    }
    return { success: false, error: "Dealer not found" };
  },

  getDashboardSummary: async (dealerId) => {
    const res = await fetch(`${API_BASE}/orders`);
    const allOrders = await res.json();
    const dealerOrders = allOrders.filter(o => o.dealerId === dealerId);
    const today = new Date().toISOString().split('T')[0];
    
    const totalOrders = dealerOrders.length;
    const ordersReceivedByDealer = dealerOrders.filter(o => o.orderStatus === 'received' || o.orderStatus === 'completed').length;
    const pendingOrders = dealerOrders.filter(o => o.orderStatus === 'pending').length;
    const completedOrders = dealerOrders.filter(o => o.orderStatus === 'completed').length;
    const todayCompletedOrders = dealerOrders.filter(o => 
      o.orderStatus === 'completed' && 
      o.completedDate?.startsWith(today)
    ).length;
    const todayScheduledAppointments = dealerOrders.filter(o => 
      o.appointmentDate === today
    ).length;
    
    return { 
      success: true, 
      data: {
        totalOrders,
        ordersReceivedByDealer,
        pendingOrders,
        completedOrders,
        todayCompletedOrders,
        todayScheduledAppointments
      }
    };
  },

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
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
      return { 
        success: true, 
        data: { 
          ...order, 
          customer: { 
            name: order.customerName, 
            mobile: order.customerMobile, 
            address: order.customerAddress, 
            vehicleNumber: order.vehicleNumber 
          }, 
          timeline: { 
            orderPlaced: order.orderPlaced, 
            orderDispatched: order.orderDispatched, 
            receivedByDealer: order.receivedByDealer, 
            completedDate: order.completedDate 
          } 
        } 
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

  updateOrderStatus: async (orderId, status) => {
    const res = await fetch(`${API_BASE}/orders`);
    const orders = await res.json();
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
      const now = new Date().toISOString();
      const updates = { orderStatus: status };
      if (status === 'received') updates.receivedByDealer = now;
      if (status === 'completed') updates.completedDate = now;
      
      await fetch(`${API_BASE}/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...order, ...updates })
      });
      return { success: true, data: { ...order, ...updates } };
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
        orderStatus: "pending",
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

  getAllDashboardData: async (dealerId = "D001") => {
    const [dealersRes, ordersRes] = await Promise.all([
      fetch(`${API_BASE}/dealers`),
      fetch(`${API_BASE}/orders`)
    ]);
    const dealers = await dealersRes.json();
    const allOrders = await ordersRes.json();
    
    const dealer = dealers.find(d => d.dealerId === dealerId);
    if (!dealer) {
      return { success: false, error: "Dealer not found" };
    }
    const { password: _, ...dealerData } = dealer;
    
    const dealerOrders = allOrders.filter(o => o.dealerId === dealerId);
    const today = new Date().toISOString().split('T')[0];
    
    const totalOrders = dealerOrders.length;
    const ordersReceivedByDealer = dealerOrders.filter(o => o.orderStatus === 'received' || o.orderStatus === 'completed').length;
    const pendingOrders = dealerOrders.filter(o => o.orderStatus === 'pending').length;
    const completedOrders = dealerOrders.filter(o => o.orderStatus === 'completed').length;
    const todayCompletedOrders = dealerOrders.filter(o => 
      o.orderStatus === 'completed' && 
      o.completedDate?.startsWith(today)
    ).length;
    
    const appointmentsByDate = {};
    dealerOrders.forEach(order => {
      if (order.appointmentDate) {
        const date = new Date(order.appointmentDate).toLocaleDateString('en-GB');
        appointmentsByDate[date] = (appointmentsByDate[date] || 0) + 1;
      }
    });
    
    const scheduledAppointments = Object.entries(appointmentsByDate)
      .map(([date, orders]) => ({ date, orders }))
      .sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')))
      .slice(0, 5);
    
    const receivedByDate = {};
    dealerOrders.filter(o => o.receivedByDealer).forEach(order => {
      const date = new Date(order.receivedByDealer).toLocaleDateString('en-GB');
      receivedByDate[date] = (receivedByDate[date] || 0) + 1;
    });
    
    const hsrpReceived = Object.entries(receivedByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')))
      .slice(0, 5);
    
    return {
      success: true,
      data: {
        dealerProfile: dealerData,
        orderSummary: [
          { label: "Total Orders", count: totalOrders },
          { label: "Order Received To Dealer", count: ordersReceivedByDealer },
          { label: "Pending for complete", count: pendingOrders },
          { label: "Completed Till Date", count: completedOrders },
        ],
        scheduledAppointments: scheduledAppointments.length > 0 ? scheduledAppointments : [{ date: "-", orders: 0 }],
        hsrpReceived: hsrpReceived.length > 0 ? hsrpReceived : [{ date: "-", count: 0 }],
        quickStats: [
          { title: "Pending for complete", count: pendingOrders },
          { title: "Today orders completed", count: todayCompletedOrders },
        ],
      },
    };
  },
};
