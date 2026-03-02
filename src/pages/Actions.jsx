import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Actions.module.css";
import { api } from "../services/api";

const Actions = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);

  const handleGetDetails = async () => {
    if (!orderId.trim()) {
      setMessage("Please enter a Vehicle Number");
      return;
    }

    setMessage("");
    const result = await api.getOrderById(orderId);
    if (result.success) {
      setOrderDetails(result.data);
    } else {
      setMessage("Order not found for this vehicle number");
      setOrderDetails(null);
    }
  };

  const handleCompleteOrder = async () => {
    if (!orderId.trim()) {
      setMessage("Please enter a Vehicle Number");
      return;
    }

    // First get order details
    const orderResult = await api.getOrderById(orderId);
    if (!orderResult.success) {
      setMessage("Order not found for this vehicle number");
      return;
    }

    // Check if order is in pending status
    if (orderResult.data.orderStatus !== "pending") {
      setMessage(`Cannot complete order. Current status: ${orderResult.data.orderStatus}. Order must be marked as received first.`);
      return;
    }

    if (window.confirm(`Complete order for vehicle ${orderId}?`)) {
      const result = await api.updateOrderStatus(orderId, "completed");
      if (result.success) {
        setMessage(`Order for vehicle ${orderId} completed successfully!`);
        setOrderId("");
        setOrderDetails(null);
      } else {
        setMessage(result.error || "Failed to complete order");
      }
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!orderId.trim()) {
      setMessage("Please enter a Vehicle Number");
      return;
    }

    const result = await api.updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setMessage(`Order for vehicle ${orderId} marked as received!`);
      setOrderDetails(result.data);
    } else {
      setMessage(result.error || "Failed to update order");
    }
  };

  return (
    <div className={styles.actionsContainer}>
      <div className={styles.header}>
        <div className={styles.headerTitles}>
          <h1>Actions</h1>
          <span className={styles.separator}>|</span>
          <h1>Reports</h1>
        </div>
        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.actionsSection}>
          <h2>Actions</h2>
          <div className={styles.actionsList}>
            <div className={styles.actionItem}>
              <h3>Complete Order</h3>
              <input
                type="text"
                placeholder="Enter Vehicle Number"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                className={styles.input}
              />
              <button
                onClick={handleCompleteOrder}
                className={styles.completeButton}
              >
                Complete Order
              </button>
              {message && <p className={styles.message}>{message}</p>}
            </div>
          </div>
        </div>
        <div className={styles.reportsSection}>
          <h2>Reports</h2>
          <div className={styles.reportButtons}>
            <button
              className={styles.reportButton}
              onClick={() => navigate("/dashboard/order-details")}
            >
              More Details About Order
            </button>
            <button
              className={styles.reportButton}
              onClick={() => navigate("/dashboard/orders/total")}
            >
              Total Orders
            </button>
            <button
              className={styles.reportButton}
              onClick={() => navigate("/dashboard/orders/receiving")}
            >
              Pending for Receiving
            </button>
            <button
              className={styles.reportButton}
              onClick={() => navigate("/dashboard/orders/pending")}
            >
              Pending Orders
            </button>
            <button
              className={styles.reportButton}
              onClick={() => navigate("/dashboard/orders/completed")}
            >
              Completed Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actions;
