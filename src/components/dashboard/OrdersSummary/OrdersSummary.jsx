import styles from "./OrdersSummary.module.css";
import SummaryCard from "./SummaryCard";

const OrdersSummary = ({ data }) => {
  if (!data) return null;

  const summaryItems = [
    { ...data[0], className: styles.totalOrder, link: "/dashboard/orders/total" },
    { ...data[1], className: styles.orderReceivedToDealer, link: "/dashboard/orders/receiving" },
    { ...data[2], className: styles.pendingOrders, link: "/dashboard/orders/pending" },
    { ...data[3], className: styles.completedTillDate, link: "/dashboard/orders/completed" },
  ];

  return (
    <div className={styles.orderSummary}>
      <div className={styles.orderHeading}>
        {summaryItems.map((item, index) => (
          <SummaryCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default OrdersSummary;
