import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import styles from "./PrintReceipt.module.css";

const PrintReceipt = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const result = await api.getOrderById(orderId);
        setOrder(result.data);
      } catch (error) {
        alert("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!order) return <div className={styles.error}>Order not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.noPrint}>
        <button onClick={handlePrint} className={styles.printBtn}>
          🖨️ Print Receipt
        </button>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          Back
        </button>
      </div>

      <div className={styles.receipt}>
        <div className={styles.header}>
          <h1>HSRP Order Receipt</h1>
          <p className={styles.orderId}>Order ID: {order.orderId}</p>
        </div>

        <div className={styles.section}>
          <h2>Customer Details</h2>
          <div className={styles.row}>
            <span className={styles.label}>Name:</span>
            <span className={styles.value}>{order.customerName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Mobile:</span>
            <span className={styles.value}>{order.customerMobile}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Address:</span>
            <span className={styles.value}>{order.customerAddress}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Vehicle Details</h2>
          <div className={styles.row}>
            <span className={styles.label}>Vehicle Number:</span>
            <span className={styles.value}>{order.vehicleNumber}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Vehicle Class:</span>
            <span className={styles.value}>{order.vehicleClass?.toUpperCase()}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Appointment Details</h2>
          <div className={styles.row}>
            <span className={styles.label}>Date:</span>
            <span className={styles.value}>
              {order.appointmentDate ? new Date(order.appointmentDate).toLocaleDateString('en-IN') : 'N/A'}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Time:</span>
            <span className={styles.value}>{order.appointmentTime || 'N/A'}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Status:</span>
            <span className={`${styles.value} ${styles.status}`}>
              {order.orderStatus?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className={styles.footer}>
          <p>Thank you for choosing HSRP services</p>
          <p className={styles.date}>
            Printed on: {new Date().toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintReceipt;
