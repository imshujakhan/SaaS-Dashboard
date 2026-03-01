import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import styles from "./TrackOrder.module.css";

function TrackOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const result = await api.getOrderById(orderId);
      if (result.success) {
        setOrder(result.data);
      } else {
        setError("Order not found");
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Order Not Found</h2>
          <p>The order ID you entered does not exist.</p>
          <button onClick={() => navigate("/")} className={styles.backButton}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Order Tracking</h1>
        <button onClick={() => navigate("/")} className={styles.backButton}>
          Back to Home
        </button>
      </div>

      <div className={styles.orderCard}>
        <div className={styles.orderHeader}>
          <h2>Order ID: {order.orderId}</h2>
          <span className={`${styles.status} ${styles[order.orderStatus]}`}>
            {order.orderStatus.toUpperCase()}
          </span>
        </div>

        <div className={styles.section}>
          <h3>Customer Details</h3>
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Name:</span>
              <span className={styles.value}>{order.customer.name}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Mobile:</span>
              <span className={styles.value}>{order.customer.mobile}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Address:</span>
              <span className={styles.value}>{order.customer.address}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Vehicle Number:</span>
              <span className={styles.value}>{order.customer.vehicleNumber}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Appointment Details</h3>
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Date:</span>
              <span className={styles.value}>{order.appointmentDate}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Time:</span>
              <span className={styles.value}>{order.appointmentTime}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Order Timeline</h3>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDot}></div>
              <div className={styles.timelineContent}>
                <h4>Order Placed</h4>
                <p>{new Date(order.timeline.orderPlaced).toLocaleString()}</p>
              </div>
            </div>
            {order.timeline.orderDispatched && (
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <h4>Order Dispatched</h4>
                  <p>{new Date(order.timeline.orderDispatched).toLocaleString()}</p>
                </div>
              </div>
            )}
            {order.timeline.receivedByDealer && (
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <h4>Received by Dealer</h4>
                  <p>{new Date(order.timeline.receivedByDealer).toLocaleString()}</p>
                </div>
              </div>
            )}
            {order.timeline.completedDate && (
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <h4>Completed</h4>
                  <p>{new Date(order.timeline.completedDate).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;
