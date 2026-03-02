import styles from "./OrdersData.module.css";
import DataTable from "./DataTable";
import QuickStatsTable from "./QuickStatsTable";
import ActionButton from "./ActionButton";

const OrdersData = ({ scheduledAppointments, hsrpReceived, quickStats }) => {
  if (!scheduledAppointments || !hsrpReceived || !quickStats) return null;

  const scheduledRows = scheduledAppointments.map(item => [
    { value: item.date },
    { value: item.orders, link: true }
  ]);

  const hsrpRows = hsrpReceived.map(item => [
    { value: item.date },
    { value: item.count, link: true }
  ]);

  return (
    <>
      <div className={styles.dataTables}>
        <DataTable 
          headers={["Scheduled Appointment", "Orders"]} 
          rows={scheduledRows} 
        />
        <DataTable 
          headers={["Appointment Date", "HSRP Received\nBy Dealer"]} 
          rows={hsrpRows} 
        />
        <QuickStatsTable stats={quickStats} />
      </div>
      <ActionButton />
    </>
  );
};

export default OrdersData;
