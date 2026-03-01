import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { 
  setSearchQuery, 
  nextPage, 
  previousPage
} from "../features/orders/ordersSlice";
import { useOrders } from "../hooks/useOrders";
import styles from "./TotalOrders.module.css";

const TotalOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, searchQuery, currentPage, filteredOrders, paginatedOrders, totalPages } = useOrders();

  const getStatusClass = (status) => {
    if (status === "pending") return styles.statusPending;
    if (status === "received") return styles.statusReceiving;
    if (status === "completed") return styles.statusCompleted;
    return "";
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Total Orders</h1>
        <button onClick={() => navigate("/dashboard/actions")}>Back</button>
      </div>
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Search:</label>
          <input
            type="text"
            placeholder="Order ID, Name, or Mobile"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className={styles.searchInput}
          />
        </div>
        <button
          onClick={() => dispatch(setSearchQuery(""))}
          className={styles.clearButton}
        >
          Clear Search
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Mobile</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id || order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.customerName}</td>
                <td>{order.customerAddress}</td>
                <td>{order.customerMobile}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(order.orderStatus)}`}>
                    {order.orderStatus === "received" ? "Pending for Receiving" : order.orderStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button 
            onClick={() => dispatch(previousPage())} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => dispatch(nextPage())} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        <div className={styles.totalCount}>
          <strong>Total Orders: {filteredOrders.length}</strong>
        </div>
      </div>
    </div>
  );
};

export default TotalOrders;
