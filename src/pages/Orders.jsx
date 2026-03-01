import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TotalOrders.module.css";
import { api } from "../lib/api";

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

  useEffect(() => {
    const fetchOrders = async () => {
      const dealerId = localStorage.getItem("dealerId") || "D001";
      let result;
      const path = location.pathname;

      if (path.includes("receiving")) {
        setTitle("Pending for Receiving");
        result = await api.getOrdersByStatus(dealerId, "received");
      } else if (path.includes("pending")) {
        setTitle("Pending Orders");
        result = await api.getOrdersByStatus(dealerId, "pending");
      } else if (path.includes("completed")) {
        setTitle("Completed Orders");
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
        const orderDate = new Date(order.timeline.orderPlaced);
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
      filtered = filtered.filter((order) =>
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.mobile.includes(searchQuery)
      );
    }

    setFilteredOrders(filtered);
  }, [startDate, endDate, searchQuery, orders]);

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
      case "pending":
        return styles.statusPending;
      case "received":
        return styles.statusReceiving;
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
        <button onClick={() => navigate("/dashboard/actions")}>Back</button>
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
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Mobile</th>
              <th>Order Date</th>
              <th>Received Date</th>
              <th>Due Date</th>
              <th>Remaining Days</th>
              <th>Completed Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.customer.name}</td>
                  <td>{order.customer.address}</td>
                  <td>{order.customer.mobile}</td>
                  <td>{formatDate(order.timeline.orderPlaced)}</td>
                  <td>{formatDate(order.timeline.receivedByDealer)}</td>
                  <td>{formatDate(order.appointmentDate)}</td>
                  <td>{calculateRemainingDays(order.appointmentDate, order.timeline.completedDate)}</td>
                  <td>{formatDate(order.timeline.completedDate)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus === "received" ? "Pending for Receiving" : order.orderStatus}
                    </span>
                  </td>
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
