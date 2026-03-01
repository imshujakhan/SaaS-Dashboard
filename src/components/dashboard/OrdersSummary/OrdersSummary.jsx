import styles from "./OrdersSummary.module.css";

const OrdersSummary = ({ data }) => {
  if (!data) return null;

  const summaryItems = [
    { ...data[0], className: styles.totalOrder },
    { ...data[1], className: styles.orderReceivedToDealer },
    { ...data[2], className: styles.pendingOrders },
    { ...data[3], className: styles.completedTillDate },
  ];

  return (
    <div className={styles.orderSummary}>
      <div className={styles.orderHeading}>
        {summaryItems.map((item, index) => (
          <div key={index} className={item.className}>
            <h1>{item.count}</h1>
            <a href="#">{item.label}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersSummary;
