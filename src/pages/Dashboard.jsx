import { useState, useEffect } from "react";
import DealerProfile from "../components/dashboard/DealerProfile/DealerProfile";
import OrdersSummary from "../components/dashboard/OrdersSummary/OrdersSummary";
import OrdersData from "../components/dashboard/OrdersData/OrdersData";
import { api } from "../services/api";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dealerId = localStorage.getItem("dealerId") || "D001";
        const response = await api.getAllDashboardData(dealerId);
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <>
      <DealerProfile data={data?.dealerProfile} />
      <OrdersSummary data={data?.orderSummary} />
      <OrdersData 
        scheduledAppointments={data?.scheduledAppointments}
        hsrpReceived={data?.hsrpReceived}
        quickStats={data?.quickStats}
      />
    </>
  );
};

export default Dashboard;
