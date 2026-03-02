import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "../features/orders/ordersSlice";
import dealerReducer from "../features/dealer/dealerSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    dealer: dealerReducer,
    dashboard: dashboardReducer,
  },
});
