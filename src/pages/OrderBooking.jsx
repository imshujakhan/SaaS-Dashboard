import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OrderBooking.module.css";

function OrderBooking() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/track-order/${orderId}`);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>HSRP Booking Portal</h1>
          </div>
          <button onClick={() => navigate("/login")} className={styles.dealerLoginBtn}>
            Dealer Login
          </button>
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.contentSection}>
          <h2>High Security Registration Plate</h2>
          <p>Book your HSRP number plate online - Fast, Secure & Government Approved</p>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>Tamper-Proof</h3>
              <p>Non-removable and non-reusable plates with chromium hologram</p>
            </div>
            <div className={styles.feature}>
              <h3>Government Approved</h3>
              <p>Fully compliant with Ministry of Road Transport regulations</p>
            </div>
            <div className={styles.feature}>
              <h3>Easy Installation</h3>
              <p>Snap lock mechanism for quick and secure fitment</p>
            </div>
          </div>

          <button onClick={() => navigate("/booking-form")} className={styles.bookButton}>
            Book HSRP
          </button>

          <div className={styles.trackSection}>
            <h3>Track Your Order</h3>
            <form onSubmit={handleTrackOrder} className={styles.trackForm}>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID"
                className={styles.trackInput}
                required
              />
              <button type="submit" className={styles.trackButton}>
                Track Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderBooking;
