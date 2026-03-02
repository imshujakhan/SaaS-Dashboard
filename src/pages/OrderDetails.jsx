import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Actions.module.css";
import { api } from "../services/api";

const OrderDetails = () => {
  const navigate = useNavigate();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [message, setMessage] = useState("");

  const handleGetDetails = async () => {
    if (!vehicleNumber.trim()) {
      setMessage("Please enter a Vehicle Number");
      return;
    }

    setMessage("");
    const result = await api.getOrderById(vehicleNumber);
    if (result.success) {
      setOrderDetails(result.data);
    } else {
      setMessage("Order not found for this vehicle number");
      setOrderDetails(null);
    }
  };

  return (
    <div className={styles.actionsContainer}>
      <div className={styles.header}>
        <h1>Order Details</h1>
        <button onClick={() => navigate("/dashboard/actions")}>Back</button>
      </div>
      <div className={styles.content}>
        <div className={styles.actionsSection} style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <h2>Get Order Details</h2>
          <div className={styles.actionsList}>
            <div className={styles.actionItem}>
              <input
                type="text"
                placeholder="Enter Vehicle Number"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                className={styles.input}
              />
              <button
                onClick={handleGetDetails}
                className={styles.actionButton}
              >
                Get Details
              </button>
              {orderDetails && (
                <div className={styles.orderDetails}>
                  <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                  <p><strong>Vehicle Number:</strong> {orderDetails.vehicleNumber}</p>
                  <p><strong>Chassis Number:</strong> {orderDetails.chassisNumber || 'N/A'}</p>
                  <p><strong>Engine Number:</strong> {orderDetails.engineNumber || 'N/A'}</p>
                  <p><strong>Vehicle Class:</strong> {orderDetails.vehicleClass || 'N/A'}</p>
                  <p><strong>Customer Name:</strong> {orderDetails.customerName}</p>
                  <p><strong>Customer Mobile:</strong> {orderDetails.customerMobile}</p>
                  <p><strong>Customer Address:</strong> {orderDetails.customerAddress}</p>
                  <p><strong>Dealer ID:</strong> {orderDetails.dealerId}</p>
                  <p><strong>Appointment Date:</strong> {orderDetails.appointmentDate}</p>
                  <p><strong>Appointment Time:</strong> {orderDetails.appointmentTime}</p>
                  <p><strong>Order Placed:</strong> {new Date(orderDetails.orderPlaced).toLocaleString()}</p>
                  <p><strong>Received by Dealer:</strong> {orderDetails.receivedByDealer ? new Date(orderDetails.receivedByDealer).toLocaleString() : 'Not yet received'}</p>
                  <p><strong>Completed Date:</strong> {orderDetails.completedDate ? new Date(orderDetails.completedDate).toLocaleString() : 'Not completed'}</p>
                  <p><strong>Current Status:</strong> {orderDetails.orderStatus}</p>
                  
                  {orderDetails.orderStatus === "completed" && (
                    <p className={styles.completedText}>
                      Order Already Completed
                    </p>
                  )}
                </div>
              )}
              {message && <p className={styles.message}>{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
