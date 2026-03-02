import { useNavigate } from "react-router-dom";
import styles from "./Nav.module.css";
import { logout } from "../../../utils/auth";

const Nav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.navContainer}>
      <h1 onClick={() => navigate("/dashboard")}>HSRP Dealer Dashboard</h1>
      <div className={styles.navLinks}>
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </div>
    </div>
  );
};

export default Nav;
