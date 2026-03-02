# HSRP Dealer Dashboard - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [User Workflows](#user-workflows)
5. [File Descriptions](#file-descriptions)
6. [Order Status Flow](#order-status-flow)
7. [API Integration](#api-integration)
8. [Setup Instructions](#setup-instructions)

---

## 🎯 Project Overview

**HSRP Dealer Dashboard** is a web application for managing High Security Registration Plate (HSRP) orders. It has two main user interfaces:

1. **Public Interface** - For customers to book HSRP installations
2. **Dealer Dashboard** - For dealers to manage orders and track installations

### Key Features
- ✅ Vehicle verification and booking
- ✅ Order tracking for customers
- ✅ Dealer authentication and dashboard
- ✅ Order status management (Receiving → Pending → Completed)
- ✅ Bulk order processing
- ✅ Print receipts
- ✅ Mobile responsive design

---

## 🛠 Technology Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Navigation and routing
- **Redux Toolkit** - State management
- **CSS Modules** - Component styling
- **Vite** - Build tool and dev server

### Backend/API
- **MockAPI** - REST API for data storage
- Base URL: `https://69a22f42be843d692bd0f181.mockapi.io/api/v1`

### Resources Used
- `dealers` - Dealer information
- `orders` - Order data with embedded customer details

---

## 📁 Project Structure

```
SaaS-Dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── DealerProfile/      # Dealer info display
│   │   │   ├── OrdersSummary/      # Order count cards
│   │   │   └── OrdersData/         # Scheduled appointments & stats
│   │   ├── layout/          # Layout components
│   │   │   └── Nav/                # Navigation bar
│   │   ├── orders/          # Order-related components
│   │   │   └── PrintReceipt.jsx    # Printable receipt
│   │   └── ErrorBoundary.jsx       # Error handling
│   │
│   ├── pages/               # Page components (routes)
│   │   ├── OrderBooking.jsx        # Public landing page
│   │   ├── BookingForm.jsx         # 4-step booking form
│   │   ├── TrackOrder.jsx          # Order tracking page
│   │   ├── Login.jsx               # Dealer login
│   │   ├── Dashboard.jsx           # Dealer dashboard home
│   │   ├── Actions.jsx             # Complete orders
│   │   ├── OrderDetails.jsx        # View order details
│   │   ├── TotalOrders.jsx         # All orders list
│   │   └── Orders.jsx              # Status-specific orders
│   │
│   ├── services/            # API service layer
│   │   ├── api.js                  # Main API export
│   │   ├── config.js               # API base URL
│   │   ├── dealerService.js        # Dealer API calls
│   │   ├── orderService.js         # Order API calls
│   │   └── dashboardService.js     # Dashboard data
│   │
│   ├── features/            # Redux slices
│   │   ├── orders/ordersSlice.js   # Orders state
│   │   ├── dealer/dealerSlice.js   # Dealer state
│   │   └── dashboard/dashboardSlice.js
│   │
│   ├── store/               # Redux store
│   │   └── store.js                # Store configuration
│   │
│   ├── utils/               # Utility functions
│   │   ├── auth.js                 # Authentication helpers
│   │   ├── cache.js                # Local caching
│   │   ├── helpers.js              # Date helpers
│   │   └── logger.js               # Console logging
│   │
│   ├── config/              # Configuration files
│   │   ├── constants.js            # App constants
│   │   └── vehicleData.js          # Vehicle database & time slots
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── useOrders.js            # Orders data hook
│   │
│   ├── App.jsx              # Main app component with routes
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
│
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

---

## 🔄 User Workflows

### 1️⃣ Customer Booking Flow

```
Landing Page (OrderBooking.jsx)
    ↓
Click "Book HSRP Now"
    ↓
BookingForm.jsx - Step 1: Vehicle Verification
    ↓ (Verify vehicle details + Check for duplicates)
BookingForm.jsx - Step 2: Contact Information
    ↓ (Enter name, mobile, address)
BookingForm.jsx - Step 3: Select Dealer & Appointment
    ↓ (Choose dealer, date, time slot)
BookingForm.jsx - Step 4: Confirmation
    ↓ (Show order ID, print receipt option)
Done ✅
```

**Key Validations:**
- Vehicle details must match database
- Vehicle number converted to UPPERCASE
- Duplicate vehicle check (no multiple bookings)
- Mobile number: exactly 10 digits
- Appointment: 5-14 days from today

---

### 2️⃣ Customer Order Tracking Flow

```
Landing Page (OrderBooking.jsx)
    ↓
Enter Order ID → Click "Track Now"
    ↓
TrackOrder.jsx
    ↓
Shows: Customer details, Appointment, Timeline
```

---

### 3️⃣ Dealer Login & Dashboard Flow

```
Click "Dealer Login" → Login.jsx
    ↓ (Enter dealerId + password)
Dashboard.jsx
    ↓
Shows:
- Dealer Profile
- Order Summary Cards (4 cards)
- Scheduled Appointments
- Quick Stats
```

**Dashboard Cards:**
1. Total Orders
2. Pending to Receive (receiving status)
3. Pending Orders (pending status)
4. Completed Till Date

---

### 4️⃣ Dealer Order Management Flow

#### A. Mark Orders as Received
```
Dashboard → Navigate to "Pending for Receiving"
    ↓
Orders.jsx (receiving status)
    ↓
Select orders (checkboxes) → Click "Mark as Received"
    ↓
Status changes: receiving → pending
```

#### B. Complete Orders
```
Dashboard → Actions → Complete Order
    ↓
Actions.jsx
    ↓
Enter Vehicle Number → Click "Complete Order"
    ↓
Validates: Order must be in "pending" status
    ↓
Status changes: pending → completed
```

#### C. View Order Details
```
Dashboard → Actions → More Details About Order
    ↓
OrderDetails.jsx
    ↓
Enter Vehicle Number → Click "Get Details"
    ↓
Shows: All order info + vehicle details + timestamps
```

---

## 📄 File Descriptions

### 🎨 Pages (src/pages/)

| File | Purpose | Key Features |
|------|---------|--------------|
| **OrderBooking.jsx** | Public landing page | Hero section, features, track order form |
| **BookingForm.jsx** | 4-step booking wizard | Vehicle verification, contact info, appointment selection |
| **TrackOrder.jsx** | Order tracking page | Shows order status, timeline, customer details |
| **Login.jsx** | Dealer authentication | Login form with dealerId + password |
| **Dashboard.jsx** | Dealer home page | Profile, order summary, appointments, stats |
| **Actions.jsx** | Order actions page | Complete orders, view reports |
| **OrderDetails.jsx** | Detailed order view | Full order information by vehicle number |
| **TotalOrders.jsx** | All orders list | Searchable table with pagination |
| **Orders.jsx** | Status-specific orders | Filtered by status (receiving/pending/completed) |

---

### 🧩 Components (src/components/)

#### Dashboard Components
| Component | Purpose |
|-----------|---------|
| **DealerProfile/** | Displays dealer information in a table |
| **OrdersSummary/** | Shows 4 order count cards with links |
| **OrdersData/** | Displays scheduled appointments and stats tables |

#### Layout Components
| Component | Purpose |
|-----------|---------|
| **Nav/** | Navigation bar with logout button |

#### Order Components
| Component | Purpose |
|-----------|---------|
| **PrintReceipt.jsx** | Printable order receipt with print-specific CSS |

#### Utility Components
| Component | Purpose |
|-----------|---------|
| **ErrorBoundary.jsx** | Catches and displays React errors |

---

### 🔌 Services (src/services/)

| File | Purpose | Key Methods |
|------|---------|-------------|
| **api.js** | Main API export | Combines all services |
| **config.js** | API configuration | Base URL constant |
| **dealerService.js** | Dealer operations | `loginDealer()`, `getDealerById()` |
| **orderService.js** | Order operations | `createOrder()`, `getOrderById()`, `updateOrderStatus()`, `getOrdersByStatus()` |
| **dashboardService.js** | Dashboard data | `getAllDashboardData()`, `getDashboardSummary()` |

---

### 🗂 Redux Features (src/features/)

| Slice | State Managed | Key Actions |
|-------|---------------|-------------|
| **ordersSlice.js** | Orders list, search, pagination | `fetchAllOrders`, `fetchOrdersByStatus`, `updateOrderStatus` |
| **dealerSlice.js** | Dealer info, auth status | `loginDealer`, `logoutDealer` |
| **dashboardSlice.js** | Dashboard data | `fetchDashboardData` |

---

### 🛠 Utils (src/utils/)

| File | Purpose | Key Functions |
|------|---------|---------------|
| **auth.js** | Authentication helpers | `isAuthenticated()`, `logout()`, `getDealerId()` |
| **cache.js** | Local storage caching | `saveToCache()`, `getFromCache()`, `clearCache()` |
| **helpers.js** | Date utilities | `getMinDate()`, `getMaxDate()` (5-14 days range) |
| **logger.js** | Console logging | `logInfo()`, `logError()` |

---

### ⚙️ Config (src/config/)

| File | Purpose | Contents |
|------|---------|----------|
| **constants.js** | App constants | `API_CONFIG`, `PAGINATION`, `ORDER_STATUS` |
| **vehicleData.js** | Static data | Vehicle database, dealer database, time slots |

---

## 🔄 Order Status Flow

```
┌─────────────────────────────────────────────────────────┐
│                    ORDER LIFECYCLE                       │
└─────────────────────────────────────────────────────────┘

1. RECEIVING (Pending for Receiving)
   ↓
   Customer books → Order created with status "receiving"
   ↓
   Dealer receives HSRP plates from manufacturer
   ↓
   Dealer marks as received (in Pending for Receiving page)
   ↓

2. PENDING (Pending to Fit)
   ↓
   Order status: "pending"
   ↓
   Dealer installs HSRP at customer location
   ↓
   Dealer completes order (in Actions page)
   ↓

3. COMPLETED
   ↓
   Order status: "completed"
   ↓
   Installation done ✅
```

### Status Definitions

| Status | Meaning | Visible In |
|--------|---------|------------|
| **receiving** | Order placed, waiting for dealer to receive plates | Pending for Receiving |
| **pending** | Plates received, waiting for installation | Pending Orders |
| **completed** | Installation completed | Completed Orders |

---

## 🌐 API Integration

### MockAPI Resources

#### 1. Dealers Resource
```json
{
  "dealerId": "D001",
  "dealershipName": "Shuja HSRP Center",
  "address": "Mumbai, Maharashtra",
  "email": "dealer@example.com",
  "contactPerson": "John Doe",
  "mobile": "9876543210",
  "password": "admin1234"
}
```

#### 2. Orders Resource
```json
{
  "id": "1",
  "orderId": "HSRP12345678",
  "dealerId": "D001",
  "vehicleNumber": "MH12AB1234",
  "chassisNumber": "12345",
  "engineNumber": "67890",
  "vehicleClass": "4w",
  "customerName": "Customer Name",
  "customerMobile": "9876543210",
  "customerAddress": "Customer Address",
  "appointmentDate": "2024-03-15",
  "appointmentTime": "12:00 PM - 2:00 PM",
  "orderStatus": "receiving",
  "orderPlaced": "2024-03-01T10:00:00.000Z",
  "receivedByDealer": "",
  "completedDate": ""
}
```

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/dealers` | Get all dealers |
| GET | `/dealers/:id` | Get dealer by ID |
| GET | `/orders` | Get all orders |
| GET | `/orders/:id` | Get order by ID |
| POST | `/orders` | Create new order |
| PUT | `/orders/:id` | Update order |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
```bash
cd c:\Users\bashi\Desktop\React\SaaS-Dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 🎨 Color Scheme

| Color | Hex Code | Usage |
|-------|----------|-------|
| Green | `#10b981` | Primary buttons, headers, success states |
| Yellow | `#fbbf24` | Secondary buttons, highlights |
| Black | `#1a1a1a` | Text, borders, complete buttons |
| White | `#ffffff` | Backgrounds, text on dark |
| Light Green | `#f0fdf4` | Page backgrounds |

---

## 📱 Responsive Design

- **Desktop**: Full layout with side-by-side sections
- **Tablet**: Stacked sections, adjusted spacing
- **Mobile**: Single column, full-width buttons, optimized tables

Breakpoints:
- Mobile: `max-width: 768px`
- Tablet: `max-width: 968px`

---

## 🔐 Authentication

### Dealer Login
- **Storage**: `localStorage.setItem("dealerId", "D001")`
- **Check**: `localStorage.getItem("dealerId")`
- **Logout**: `localStorage.removeItem("dealerId")`

### Protected Routes
- Dashboard and all sub-routes require authentication
- Redirects to `/login` if not authenticated
- Login page redirects to `/dashboard` if already authenticated

---

## 📊 Key Business Rules

1. **No Duplicate Bookings**: Same vehicle number cannot book twice
2. **Vehicle Verification**: Must match database before booking
3. **Appointment Window**: 5-14 days from today
4. **Time Slots**: 3 slots per day (12-2 PM, 2-4 PM, 4-6 PM)
5. **Order Completion**: Can only complete orders in "pending" status
6. **Vehicle Number Format**: Always stored in UPPERCASE
7. **Mobile Validation**: Exactly 10 digits required

---

## 🐛 Error Handling

- **API Errors**: Caught and displayed with user-friendly messages
- **React Errors**: ErrorBoundary component catches render errors
- **Form Validation**: Real-time validation with error messages
- **Network Issues**: Timeout handling and retry logic

---

## 📝 Notes for Developers

### Adding New Order Status
1. Update `ORDER_STATUS` in `constants.js`
2. Add status case in `getStatusClass()` functions
3. Update CSS for new status badge color
4. Modify `updateOrderStatus()` logic if needed

### Adding New Report
1. Create route in `App.jsx`
2. Add button in `Actions.jsx` Reports section
3. Create page component in `src/pages/`
4. Add API call in appropriate service file

### Modifying Order Flow
1. Update `orderService.js` → `updateOrderStatus()`
2. Update status transitions in `Actions.jsx`
3. Update `Orders.jsx` for new status handling
4. Update dashboard summary in `dashboardService.js`

---

## 📞 Support

For issues or questions:
1. Check this README first
2. Review code comments in files
3. Check browser console for errors
4. Verify MockAPI is accessible

---

## ✅ Project Status

**Current Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: 2024

### Completed Features
✅ Customer booking system  
✅ Order tracking  
✅ Dealer dashboard  
✅ Order management  
✅ Bulk operations  
✅ Print receipts  
✅ Mobile responsive  
✅ Authentication  

---

**End of Documentation**
