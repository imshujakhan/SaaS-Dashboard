import { API_BASE } from './config';

export const dashboardService = {
  getDashboardSummary: async (dealerId) => {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const allOrders = await res.json();
      if (!Array.isArray(allOrders)) throw new Error('Invalid data format');
      
      const dealerOrders = allOrders.filter(o => o.dealerId === dealerId);
      const today = new Date().toISOString().split('T')[0];
      
      const totalOrders = dealerOrders.length;
      const receivingOrders = dealerOrders.filter(o => o.orderStatus === 'receiving').length;
      const ordersReceivedByDealer = dealerOrders.filter(o => o.orderStatus === 'received').length;
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
          receivingOrders,
          ordersReceivedByDealer,
          pendingOrders,
          completedOrders,
          todayCompletedOrders,
          todayScheduledAppointments
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getAllDashboardData: async (dealerId = "D001") => {
    try {
      const [dealersRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE}/dealers`),
        fetch(`${API_BASE}/orders`)
      ]);
      
      if (!dealersRes.ok || !ordersRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const dealers = await dealersRes.json();
      const allOrders = await ordersRes.json();
      
      if (!Array.isArray(dealers) || !Array.isArray(allOrders)) {
        throw new Error('Invalid data format');
      }
      
      const dealer = dealers.find(d => d.dealerId === dealerId);
      if (!dealer) {
        return { success: false, error: "Dealer not found" };
      }
      const { password: _, ...dealerData } = dealer;
      
      const dealerOrders = allOrders.filter(o => o.dealerId === dealerId);
      const today = new Date().toISOString().split('T')[0];
      
      const totalOrders = dealerOrders.length;
      const receivingOrders = dealerOrders.filter(o => o.orderStatus === 'receiving').length;
      const ordersReceivedByDealer = dealerOrders.filter(o => o.orderStatus === 'received').length;
      const pendingOrders = dealerOrders.filter(o => o.orderStatus === 'pending').length;
      const completedOrders = dealerOrders.filter(o => o.orderStatus === 'completed').length;
      const todayCompletedOrders = dealerOrders.filter(o => 
        o.orderStatus === 'completed' && 
        o.completedDate?.startsWith(today)
      ).length;
      
      const appointmentsByDate = {};
      dealerOrders.forEach(order => {
        if (order.appointmentDate) {
          appointmentsByDate[order.appointmentDate] = (appointmentsByDate[order.appointmentDate] || 0) + 1;
        }
      });

      const scheduledAppointments = Object.entries(appointmentsByDate)
        .map(([date, orders]) => ({ date, orders }))
        .slice(0, 5);

      const hsrpReceived = dealerOrders
        .filter(o => o.orderStatus === 'received')
        .reduce((acc, order) => {
          const date = order.appointmentDate;
          if (date) {
            const existing = acc.find(item => item.date === date);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ date, count: 1 });
            }
          }
          return acc;
        }, [])
        .slice(0, 5);

      const quickStats = [
        { title: "Today's Completed Orders", count: todayCompletedOrders },
        { title: "Today's Scheduled Appointments", count: appointmentsByDate[today] || 0 }
      ];

      return {
        success: true,
        data: {
          dealerProfile: dealerData,
          orderSummary: [
            { label: "Total Orders", count: totalOrders },
            { label: "Pending to Receive", count: receivingOrders },
            { label: "Pending Orders", count: pendingOrders },
            { label: "Completed Till Date", count: completedOrders }
          ],
          scheduledAppointments,
          hsrpReceived,
          quickStats
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
