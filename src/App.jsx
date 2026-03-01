import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/layout/Nav/Nav";
import ErrorBoundary from "./components/ErrorBoundary";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./pages/Dashboard";
import Actions from "./pages/Actions";
import TotalOrders from "./pages/TotalOrders";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import OrderBooking from "./pages/OrderBooking";
import TrackOrder from "./pages/TrackOrder";
import BookingForm from "./pages/BookingForm";

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("dealerId");
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderBooking />} />
        <Route path="/login" element={<Login />} />
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
                  <Route path="/orders/total" element={<TotalOrders />} />
                  <Route path="/orders/receiving" element={<Orders />} />
                  <Route path="/orders/pending" element={<Orders />} />
                  <Route path="/orders/completed" element={<Orders />} />
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
