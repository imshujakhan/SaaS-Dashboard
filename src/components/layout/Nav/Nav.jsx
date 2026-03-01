import { useNavigate } from "react-router-dom";
import styles from "./Nav.module.css";

const Nav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("dealerId");
    localStorage.removeItem("dealerData");
    navigate("/login");
  };

  return (
    <div className={styles.navContainer}>
      <h1>HSRP Dealer Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Nav;
