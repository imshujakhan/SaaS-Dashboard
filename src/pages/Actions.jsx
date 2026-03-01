import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Actions.module.css";
import { api } from "../lib/api";

const Actions = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);

  const handleGetDetails = async () => {
    if (!orderId.trim()) {
      setMessage("Please enter an Order ID");
      return;
    }

    setMessage("");
    const result = await api.getOrderById(orderId);
    if (result.success) {
      setOrderDetails(result.data);
    } else {
      setMessage("Order not found");
      setOrderDetails(null);
    }
  };

  const handleCompleteOrder = async () => {
    if (!orderId.trim()) {
      setMessage("Please enter an Order ID");
      return;
    }

    const result = await api.updateOrderStatus(orderId, "completed");
    if (result.success) {
      setMessage(`Order ${orderId} completed successfully!`);
      setOrderId("");
      setOrderDetails(null);
    } else {
      setMessage(result.error || "Failed to complete order");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!orderId.trim()) {
      setMessage("Please enter an Order ID");
      return;
    }

    const result = await api.updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setMessage(`Order ${orderId} status updated to ${newStatus}!`);
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
        <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
      <div className={styles.content}>
        <div className={styles.actionsSection}>
          <h2>Actions</h2>
          <div className={styles.actionsList}>
            <div className={styles.actionItem}>
              <h3>Complete Order</h3>
              <input
                type="text"
                placeholder="Enter Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className={styles.input}
              />
              <button onClick={handleGetDetails} className={styles.actionButton}>
                Get Details
              </button>
              {orderDetails && (
                <div className={styles.orderDetails}>
                  <p><strong>Name:</strong> {orderDetails.customer.name}</p>
                  <p><strong>Address:</strong> {orderDetails.customer.address}</p>
                  <p><strong>Mobile:</strong> {orderDetails.customer.mobile}</p>
                  <p><strong>Current Status:</strong> {orderDetails.orderStatus}</p>
                  
                  <div className={styles.statusButtons}>
                    {orderDetails.orderStatus === "pending" && (
                      <button onClick={() => handleUpdateStatus("received")} className={styles.statusButton}>
                        Mark as Received
                      </button>
                    )}
                    {orderDetails.orderStatus === "received" && (
                      <button onClick={handleCompleteOrder} className={styles.completeButton}>
                        Complete Order
                      </button>
                    )}
                    {orderDetails.orderStatus === "completed" && (
                      <p className={styles.completedText}>Order Already Completed</p>
                    )}
                  </div>
                </div>
              )}
              {message && <p className={styles.message}>{message}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.reportsSection}>
        <h2>Reports</h2>
        <div className={styles.reportButtons}>
          <button className={styles.reportButton} onClick={() => navigate("/dashboard/orders/total")}>Total Orders</button>
          <button className={styles.reportButton} onClick={() => navigate("/dashboard/orders/receiving")}>Pending for Receiving</button>
          <button className={styles.reportButton} onClick={() => navigate("/dashboard/orders/pending")}>Pending Orders</button>
          <button className={styles.reportButton} onClick={() => navigate("/dashboard/orders/completed")}>Completed Orders</button>
        </div>
      </div>
    </div>
  );
};

export default Actions;
