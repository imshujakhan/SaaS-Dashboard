import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { vehicleDatabase, dealerDatabase, timeSlots } from "../constants/vehicleData";
import { getMinDate, getMaxDate } from "../utils/helpers";
import { api } from "../lib/api";
import styles from "./BookingForm.module.css";

function BookingForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    state: "",
    vehicleNumber: "",
    chassisNumber: "",
    engineNumber: "",
    registrationDate: "",
    vehicleClass: "",
  });
  const [contactData, setContactData] = useState({
    name: "",
    address: "",
    mobile: "",
  });
  const [appointmentData, setAppointmentData] = useState({
    dealer: "",
    date: "",
    slot: "",
  });
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerificationChange = (e) => {
    setVerificationData({ ...verificationData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleContactChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleAppointmentChange = (e) => {
    setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log('Searching for:', verificationData);
      console.log('Database:', vehicleDatabase);
      
      const vehicle = vehicleDatabase.find(
        (v) => {
          const match = v.state === verificationData.state &&
            v.vehicleNumber.toUpperCase().replace(/-/g, '') === verificationData.vehicleNumber.toUpperCase().replace(/-/g, '') &&
            v.chassisNumber === verificationData.chassisNumber &&
            v.engineNumber === verificationData.engineNumber &&
            v.registrationDate === verificationData.registrationDate &&
            v.vehicleClass === verificationData.vehicleClass;
          
          console.log('Checking vehicle:', v, 'Match:', match);
          return match;
        }
      );

      console.log('Found vehicle:', vehicle);

      if (vehicle) {
        setStep(2);
        setError("");
      } else {
        setError("Vehicle details do not match our records. Please check and try again.");
      }
      setLoading(false);
    }, 1000);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      const selectedDealer = dealerDatabase.find(d => d.id === appointmentData.dealer);
      
      // Create order in database
      const orderData = {
        dealerId: appointmentData.dealer,
        vehicleNumber: verificationData.vehicleNumber,
        customerName: contactData.name,
        customerMobile: contactData.mobile,
        customerAddress: contactData.address,
        appointmentDate: appointmentData.date,
        appointmentTime: appointmentData.slot
      };

      const result = await api.createOrder(orderData);
      
      if (result.success) {
        setBookingConfirmation({
          orderId: result.data.orderId,
          dealer: selectedDealer,
          date: appointmentData.date,
          slot: appointmentData.slot,
        });
        setLoading(false);
        setStep(4);
      }
    }, 1000);
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>HSRP Booking Portal</h1>
          </div>
          <button onClick={() => navigate("/")} className={styles.backBtn}>
            Back to Home
          </button>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.formCard}>
          {step !== 4 && (
            <>
              <h2>HSRP Booking Form</h2>
              <p className={styles.subtitle}>
                {step === 1 && "Step 1: Verify Vehicle Details"}
                {step === 2 && "Step 2: Contact Information"}
                {step === 3 && "Step 3: Select Dealer & Appointment"}
              </p>
            </>
          )}

          {error && <div className={styles.error}>{error}</div>}

          {step === 1 && (
            <form onSubmit={handleVerify} className={styles.form}>
              <div className={styles.formGroup}>
                <label>State *</label>
                <select
                  name="state"
                  value={verificationData.state}
                  onChange={handleVerificationChange}
                  required
                >
                  <option value="">Select State</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="delhi">Delhi</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="gujarat">Gujarat</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Vehicle Number *</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={verificationData.vehicleNumber}
                  onChange={handleVerificationChange}
                  placeholder="e.g., MH12AB1234"
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Chassis Number (Last 5 digits) *</label>
                  <input
                    type="text"
                    name="chassisNumber"
                    value={verificationData.chassisNumber}
                    onChange={handleVerificationChange}
                    placeholder="12345"
                    maxLength="5"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Engine Number (Last 5 digits) *</label>
                  <input
                    type="text"
                    name="engineNumber"
                    value={verificationData.engineNumber}
                    onChange={handleVerificationChange}
                    placeholder="67890"
                    maxLength="5"
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Date of Registration *</label>
                <input
                  type="date"
                  name="registrationDate"
                  value={verificationData.registrationDate}
                  onChange={handleVerificationChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Vehicle Class *</label>
                <select
                  name="vehicleClass"
                  value={verificationData.vehicleClass}
                  onChange={handleVerificationChange}
                  required
                >
                  <option value="">Select Vehicle Class</option>
                  <option value="2w">Two Wheeler (2W)</option>
                  <option value="4w">Four Wheeler (4W)</option>
                  <option value="hgv">Heavy Goods Vehicle (HGV)</option>
                </select>
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? "Verifying..." : "Verify Vehicle"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleContactSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={contactData.name}
                  onChange={handleContactChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Address *</label>
                <textarea
                  name="address"
                  value={contactData.address}
                  onChange={handleContactChange}
                  placeholder="Enter complete address"
                  rows="3"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={contactData.mobile}
                  onChange={handleContactChange}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Continue to Appointment
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Select Dealer *</label>
                <select
                  name="dealer"
                  value={appointmentData.dealer}
                  onChange={handleAppointmentChange}
                  required
                >
                  <option value="">Select Dealer</option>
                  {dealerDatabase.map((dealer) => (
                    <option key={dealer.id} value={dealer.id}>
                      {dealer.name} - {dealer.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Appointment Date *</label>
                <input
                  type="date"
                  name="date"
                  value={appointmentData.date}
                  onChange={handleAppointmentChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  required
                />
                <small className={styles.hint}>Appointments available 5-14 days from today</small>
              </div>

              <div className={styles.formGroup}>
                <label>Time Slot *</label>
                <select
                  name="slot"
                  value={appointmentData.slot}
                  onChange={handleAppointmentChange}
                  required
                >
                  <option value="">Select Time Slot</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? "Confirming..." : "Confirm Booking"}
              </button>
            </form>
          )}

          {step === 4 && bookingConfirmation && (
            <div className={styles.confirmation}>
              <div className={styles.successIcon}>✓</div>
              <h2>Booking Confirmed!</h2>
              <p className={styles.confirmSubtitle}>Your HSRP booking has been successfully completed</p>

              <div className={styles.confirmDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Order ID:</span>
                  <span className={styles.detailValue}>{bookingConfirmation.orderId}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Dealer Name:</span>
                  <span className={styles.detailValue}>{bookingConfirmation.dealer.name}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Dealer Address:</span>
                  <span className={styles.detailValue}>{bookingConfirmation.dealer.address}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Dealer Contact:</span>
                  <span className={styles.detailValue}>{bookingConfirmation.dealer.contact}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Appointment Date:</span>
                  <span className={styles.detailValue}>{new Date(bookingConfirmation.date).toLocaleDateString('en-IN')}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Time Slot:</span>
                  <span className={styles.detailValue}>{bookingConfirmation.slot}</span>
                </div>
              </div>

              <button onClick={() => navigate("/")} className={styles.submitButton}>
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
