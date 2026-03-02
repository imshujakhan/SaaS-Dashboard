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
            <h1>HSRP Portal</h1>
          </div>
          <button onClick={() => navigate("/login")} className={styles.dealerLoginBtn}>
            Dealer Login
          </button>
        </div>
      </header>

      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>High Security Registration Plate</h1>
          <p className={styles.heroSubtitle}>Government Approved • Tamper-Proof • Easy Installation</p>
          <div className={styles.heroButtons}>
            <button onClick={() => navigate("/booking-form")} className={styles.primaryBtn}>
              Book HSRP Now
            </button>
            <button onClick={() => document.getElementById('trackSection').scrollIntoView({ behavior: 'smooth' })} className={styles.secondaryBtn}>
              Track Order
            </button>
          </div>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Choose HSRP?</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Tamper-Proof Security</h3>
            <p>Non-removable plates with chromium hologram and laser-etched details</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✓</div>
            <h3>Government Approved</h3>
            <p>Fully compliant with Ministry of Road Transport & Highways regulations</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Quick Installation</h3>
            <p>Snap lock mechanism ensures fast and secure fitment at your location</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📱</div>
            <h3>Online Booking</h3>
            <p>Book from home, choose appointment slot, and get doorstep installation</p>
          </div>
        </div>
      </div>

      <div className={styles.trackSectionWrapper} id="trackSection">
        <div className={styles.trackContainer}>
          <h2 className={styles.trackTitle}>Track Your Order</h2>
          <p className={styles.trackSubtitle}>Enter your Order ID to check status</p>
          <form onSubmit={handleTrackOrder} className={styles.trackForm}>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., ORD001)"
              className={styles.trackInput}
              required
            />
            <button type="submit" className={styles.trackButton}>
              Track Now
            </button>
          </form>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>© 2024 HSRP Booking Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default OrderBooking;
