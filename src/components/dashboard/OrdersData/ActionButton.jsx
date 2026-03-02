import { useNavigate } from "react-router-dom";
import styles from "./OrdersData.module.css";

const ActionButton = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.buttonContainer}>
      <button 
        type="button" 
        className="btn btn-primary"
        onClick={() => navigate("/dashboard/actions")}
      >
        Actions/Reports
      </button>
    </div>
  );
};

export default ActionButton;
