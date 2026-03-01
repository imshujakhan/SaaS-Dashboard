import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await api.login(email, password);
    
    if (result.success) {
      localStorage.setItem("dealerId", result.data.dealerId);
      localStorage.setItem("dealerData", JSON.stringify(result.data));
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftSection}>
        <div className={styles.content}>
          <h1 className={styles.mainTitle}>Welcome to</h1>
          <h2 className={styles.brandTitle}>HSRP BOOKING PORTAL</h2>
          <p className={styles.description}>Manage HSRP number plate bookings efficiently with our comprehensive dealer management system</p>
          <div className={styles.features}>
            <div className={styles.feature}>✓ Real-time Booking Tracking</div>
            <div className={styles.feature}>✓ Complete Order Management</div>
            <div className={styles.feature}>✓ Detailed Reports & Analytics</div>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.loginBox}>
          <div className={styles.logoSection}>
            <h1 className={styles.logo}>Dealer Login</h1>
            <p className={styles.subtitle}>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.loginButton} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className={styles.footer}>
            <p>Demo: shuja@hsrp.com or khan@hsrp.com / admin1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
