import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/layout/Nav/Nav";
import ErrorBoundary from "./components/ErrorBoundary";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./pages/Dashboard";
import Actions from "./pages/Actions";
import TotalOrders from "./pages/TotalOrders";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Login from "./pages/Login";
import OrderBooking from "./pages/OrderBooking";
import TrackOrder from "./pages/TrackOrder";
import BookingForm from "./pages/BookingForm";
import PrintReceipt from "./components/orders/PrintReceipt";

import { isAuthenticated } from "./utils/auth";

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderBooking />} />
        <Route path="/login" element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        } />
        <Route path="/track-order/:orderId" element={<TrackOrder />} />
        <Route path="/booking-form" element={<BookingForm />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <main>
                <Nav />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/actions" element={<Actions />} />
                  <Route path="/order-details" element={<OrderDetails />} />
                  <Route path="/orders/total" element={<TotalOrders />} />
                  <Route path="/orders/receiving" element={<Orders />} />
                  <Route path="/orders/pending" element={<Orders />} />
                  <Route path="/orders/completed" element={<Orders />} />
                  <Route path="/orders/print/:orderId" element={<PrintReceipt />} />
                </Routes>
              </main>
            </ProtectedRoute>
          }
        />
      </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
