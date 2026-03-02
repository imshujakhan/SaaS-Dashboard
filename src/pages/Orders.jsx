import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TotalOrders.module.css";
import { api } from "../services/api";

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isReceivingPage, setIsReceivingPage] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const dealerId = localStorage.getItem("dealerId") || "D001";
      let result;
      const path = location.pathname;

      if (path.includes("receiving")) {
        setTitle("Pending for Receiving");
        setIsReceivingPage(true);
        result = await api.getOrdersByStatus(dealerId, "receiving");
      } else if (path.includes("received")) {
        setTitle("Received Orders");
        setIsReceivingPage(false);
        result = await api.getOrdersByStatus(dealerId, "received");
      } else if (path.includes("pending")) {
        setTitle("Pending Orders");
        setIsReceivingPage(false);
        result = await api.getOrdersByStatus(dealerId, "pending");
      } else if (path.includes("completed")) {
        setTitle("Completed Orders");
        setIsReceivingPage(false);
        result = await api.getOrdersByStatus(dealerId, "completed");
      }

      if (result?.success) {
        setOrders(result.data);
        setFilteredOrders(result.data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [location]);

  useEffect(() => {
    let filtered = orders;

    // Date filter
    if (startDate || endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderPlaced);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
          return orderDate >= start && orderDate <= end;
        } else if (start) {
          return orderDate >= start;
        } else if (end) {
          return orderDate <= end;
        }
        return true;
      });
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.customerMobile.includes(searchQuery),
      );
    }

    setFilteredOrders(filtered);
  }, [startDate, endDate, searchQuery, orders]);

  const handleMarkAsReceived = async (orderId) => {
    const result = await api.updateOrderStatus(orderId, 'pending');
    if (result.success) {
      setOrders(orders.filter(o => o.orderId !== orderId));
      setFilteredOrders(filteredOrders.filter(o => o.orderId !== orderId));
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      alert('Failed to update order');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(filteredOrders.map(o => o.orderId));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleBulkMarkAsReceived = async () => {
    if (selectedOrders.length === 0) {
      alert('Please select orders to mark as received');
      return;
    }
    
    if (window.confirm(`Mark ${selectedOrders.length} order(s) as received?`)) {
      for (const orderId of selectedOrders) {
        await api.updateOrderStatus(orderId, 'pending');
      }
      setOrders(orders.filter(o => !selectedOrders.includes(o.orderId)));
      setFilteredOrders(filteredOrders.filter(o => !selectedOrders.includes(o.orderId)));
      setSelectedOrders([]);
      alert('Orders marked as received!');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateRemainingDays = (appointmentDate, completedDate) => {
    if (completedDate) return "Completed";
    if (!appointmentDate) return "-";

    const today = new Date();
    const dueDate = new Date(appointmentDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return "Due Today";
    return `${diffDays} days`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "receiving":
        return styles.statusReceiving;
      case "received":
        return styles.statusReceived;
      case "pending":
        return styles.statusPending;
      case "completed":
        return styles.statusCompleted;
      default:
        return "";
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{title}</h1>
        <div className={styles.headerButtons}>
          {isReceivingPage && selectedOrders.length > 0 && (
            <button onClick={handleBulkMarkAsReceived} className={styles.bulkActionBtn}>
              Mark as Received ({selectedOrders.length})
            </button>
          )}
          <button onClick={() => navigate("/dashboard/actions")}>Back</button>
        </div>
      </div>
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Search:</label>
          <input
            type="text"
            placeholder="Order ID, Name, or Mobile"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>From Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>To Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setSearchQuery("");
          }}
          className={styles.clearButton}
        >
          Clear Filter
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              {isReceivingPage && (
                <th>
                  <input
                    type="checkbox"
                    checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                  />
                </th>
              )}
              <th>Order ID</th>
              <th>Vehicle Number</th>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Order Date</th>
              <th>Received Date</th>
              <th>Due Date</th>
              <th>Remaining Days</th>
              <th>Completed Date</th>
              <th>Status</th>
              {isReceivingPage && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  {isReceivingPage && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.orderId)}
                        onChange={() => handleSelectOrder(order.orderId)}
                        className={styles.checkbox}
                      />
                    </td>
                  )}
                  <td>{order.orderId}</td>
                  <td>{order.vehicleNumber}</td>
                  <td>{order.customerName}</td>
                  <td>{order.customerMobile}</td>
                  <td>{formatDate(order.orderPlaced)}</td>
                  <td>{formatDate(order.receivedByDealer)}</td>
                  <td>{formatDate(order.appointmentDate)}</td>
                  <td>
                    {calculateRemainingDays(
                      order.appointmentDate,
                      order.completedDate,
                    )}
                  </td>
                  <td>{formatDate(order.completedDate)}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(order.orderStatus)}`}
                    >
                      {order.orderStatus === "receiving"
                        ? "Pending for Receiving"
                        : order.orderStatus}
                    </span>
                  </td>
                  {isReceivingPage && (
                    <td>
                      <button
                        onClick={() => handleMarkAsReceived(order.orderId)}
                        className={styles.actionBtn}
                      >
                        Mark as Received
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
