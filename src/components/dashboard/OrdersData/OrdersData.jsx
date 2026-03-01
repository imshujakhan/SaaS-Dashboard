import { useNavigate } from "react-router-dom";
import styles from "./OrdersData.module.css";

const OrdersData = ({ scheduledAppointments, hsrpReceived, quickStats }) => {
  const navigate = useNavigate();
  if (!scheduledAppointments || !hsrpReceived || !quickStats) return null;

  return (
    <>
      <div className={styles.dataTables}>
        <div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>
                  <h4>Scheduled Appointment</h4>
                </th>
                <th>
                  <h4>Orders</h4>
                </th>
              </tr>
              {scheduledAppointments.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>
                    <a href="#">{item.orders}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>
                  <h4>Appointment Date</h4>
                </th>
                <th>
                  <h4>
                    HSRP Received
                    <br />
                    By Dealer
                  </h4>
                </th>
              </tr>
              {hsrpReceived.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>
                    <a href="#">{item.count}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <table className="table table-bordered">
            <tbody>
              {quickStats.map((stat, index) => (
                <>
                  <tr key={`title-${index}`}>
                    <th>
                      <h4>{stat.title}</h4>
                    </th>
                  </tr>
                  <tr key={`count-${index}`}>
                    <td>
                      <a href="#">{stat.count}</a>
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => navigate("/dashboard/actions")}
        >
          Actions/Reports
        </button>
      </div>
    </>
  );
};

export default OrdersData;
