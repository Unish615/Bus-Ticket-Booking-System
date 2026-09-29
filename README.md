# YatraBus — Modern Bus Ticket Booking System

A full-stack web application for reserving, tracking, and managing bus travel across Nepal, built with **React JS**, **Java Spring Boot**, **MySQL**, and **JWT Authentication**.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture & Folder Structure](#system-architecture--folder-structure)
- [Database Design & Relationships](#database-design--relationships)
- [Seed Demo Accounts](#seed-demo-accounts)
- [Environment Configuration](#environment-configuration)
- [Local Installation & Setup Guide](#local-installation--setup-guide)
  - [Prerequisites](#prerequisites)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Complete REST API Documentation](#complete-rest-api-documentation)
- [Concurrency & Booking Logic](#concurrency--booking-logic)
- [Future Enhancements](#future-enhancements)

---

## 🌟 Project Overview

**YatraBus** provides a bus reservation workflow for travelers in Nepal. Designed with a clean, minimal UI and responsive layouts, it handles:
- Interactive 2+2 visual seat maps with driver cabin layout and live seat status.
- Concurrency-safe backend transaction locking to prevent duplicate seat bookings.
- Realistic simulated payment flows (eSewa, Khalti, Debit/Credit Card, and Station Cash Counter).
- Instant electronic tickets featuring dynamic QR Codes (scannable for validation).
- Live 5-stage ticket tracking (`Booking Confirmed` → `Bus Assigned` → `Boarding` → `On The Way` → `Arrived`).
- Cancellations with automatic fee and refund calculation that releases seats back to the inventory.
- Passenger reviews submitted only after trip completion.
- Multi-role administration for Admins, Bus Operators, and Passengers.

---

## 🚀 Key Features

### Passenger Experience
* **Search & Filter:** Find schedules by Origin, Destination, and Travel Date. Filter by price slider, departure time slots (Morning, Afternoon, Evening, Night), bus type, minimum rating, and seat availability.
* **Interactive Seat Map:** Visual 2+2 grid representing window, aisle, and driver seats with live availability pulled directly from MySQL.
* **Dynamic Passenger Manifest:** Automatic form generation matching the number of selected seats with validation.
* **Realistic Checkout Simulation:** Integrated mock flows for eSewa, Khalti, Card, and Cash.
* **QR Ticket & Print:** Printable and downloadable ticket format with High-ECC QR codes.
* **Live Trip Tracking:** Real-time progress updates through booking code search without requiring login.
* **Trip Cancellation & Refunds:** Self-service ticket cancellation with breakdown of refund and immediate seat release.
* **Verified Reviews:** Rating and review submission unlocked strictly for completed trips.

### Bus Operator Portal
* Isolated access to their agency's vehicles, assigned routes, and departure schedules.
* Live passenger manifests with seat numbers, names, ages, and contact info.
* Trip status update controls (`Boarding`, `On The Way`, `Arrived`).
* Revenue and earnings analytics.

### Super Admin Dashboard
* KPI metrics: Total Users, Total Buses, Total Bookings, Today's Bookings, Total Gross Revenue, Cancelled Bookings.
* Visual analytics powered by **Recharts**:
  * Monthly Booking Volumes (Bar Chart)
  * Monthly Revenue Trends (Line Chart)
  * Top Popular Route Corridors (Horizontal Bar Chart)
  * Booking Status Distribution (Pie Chart)
* Full CRUD for Buses, Routes, Schedules, and Bookings.
* User account management: Role assignment (`USER`, `OPERATOR`, `ADMIN`) and account activation/deactivation toggling.
* Exportable financial ledger reports in CSV format.

---

## 🛠 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, React Router DOM v7, React Icons, Recharts, QRCode.react, Axios |
| **Backend** | Java 21/26, Spring Boot 3.3.4, Spring Data JPA, Spring Security 6, JJWT (0.12.6) |
| **Database** | MySQL 8.x / 9.x (InnoDB, Foreign Key Constraints, Transactions) |
| **Security** | BCrypt Password Hashing, JWT Stateless Authentication, Role-Based Access Control |
| **Styling** | Modern CSS Variables, Responsive Grids, Light & Dark Theme Support |

---

## 📁 System Architecture & Folder Structure

```text
bus-ticket-booking/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminNav.jsx            # Tab navigation for admin views
│   │   │   ├── BookingCard.jsx         # Booking item with cancellation/review triggers
│   │   │   ├── BusCard.jsx             # Search result card with times, price, ratings
│   │   │   ├── Footer.jsx              # Footer with route links and emergency support
│   │   │   ├── Loading.jsx             # Modern SVG loading spinner
│   │   │   ├── Modal.jsx               # Reusable backdrop modal dialog
│   │   │   ├── Navbar.jsx              # Responsive navigation with dark mode toggle
│   │   │   ├── ProtectedRoute.jsx      # Guard for authenticated & role-based routes
│   │   │   ├── SearchForm.jsx          # City select, date picker, swap button
│   │   │   └── SeatMap.jsx             # Visual bus seat grid and live price calculation
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # Global login, register, logout, and token state
│   │   │   ├── ThemeContext.jsx        # Dark/Light theme provider with localStorage sync
│   │   │   └── ToastContext.jsx        # Toast notification system
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx  # Metrics and Recharts visual analytics
│   │   │   │   ├── ManageBookings.jsx  # Admin booking inspection & cancellation
│   │   │   │   ├── ManageBuses.jsx     # Fleet CRUD with automated seat generation
│   │   │   │   ├── ManageRoutes.jsx    # Origin/Destination route management
│   │   │   │   ├── ManageSchedules.jsx # Schedule creation connecting Bus+Route+Time
│   │   │   │   ├── ManageUsers.jsx     # User role and status administration
│   │   │   │   └── Reports.jsx         # Ledger report & CSV summary export
│   │   │   ├── operator/
│   │   │   │   └── OperatorDashboard.jsx # Operator agency portal & manifests
│   │   │   ├── BookingConfirmation.jsx # E-Ticket display with printable QR code
│   │   │   ├── BusDetails.jsx          # Bus profile, amenities, policies, & reviews
│   │   │   ├── Home.jsx                # Landing page with hero, search & promo
│   │   │   ├── Login.jsx               # Sign in with 1-click demo login buttons
│   │   │   ├── MyBookings.jsx          # User dashboard (Upcoming, Completed, Cancelled)
│   │   │   ├── Notifications.jsx       # Alert system for tickets and schedule updates
│   │   │   ├── PassengerDetails.jsx    # Dynamic per-seat passenger form
│   │   │   ├── Payment.jsx             # Simulated eSewa, Khalti, Card, Cash gateway
│   │   │   ├── Profile.jsx             # User profile editor and password change
│   │   │   ├── Register.jsx            # Account sign-up with BCrypt hashing
│   │   │   ├── SearchResults.jsx       # Schedule search with sidebar filters & sorting
│   │   │   └── TrackTicket.jsx         # 5-stage live journey tracker
│   │   ├── services/
│   │   │   └── api.js                  # Axios instance with JWT interceptor
│   │   ├── App.jsx                     # Application routing definitions
│   │   ├── index.css                   # Global responsive CSS styling & tokens
│   │   └── main.jsx                    # Vite React root mounting
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── src/main/java/com/busbooking/
    │   ├── config/
    │   │   └── DataInitializer.java    # Seeds admin, operators, users, buses, schedules
    │   ├── controller/
    │   │   ├── AdminController.java     # Admin metrics, bookings, and user endpoints
    │   │   ├── AuthController.java      # Login & register REST endpoints
    │   │   ├── BookingController.java   # Booking, tracking, and cancellation APIs
    │   │   ├── BusController.java       # Bus vehicle endpoints
    │   │   ├── NotificationController.java # User alerts endpoints
    │   │   ├── OperatorController.java  # Operator agency portal endpoints
    │   │   ├── ReviewController.java    # Reviews and ratings endpoints
    │   │   ├── RouteController.java     # Route endpoints
    │   │   ├── ScheduleController.java  # Schedule search and CRUD endpoints
    │   │   └── UserController.java      # User profile & security endpoints
    │   ├── dto/                         # Data Transfer Objects
    │   ├── entity/                      # JPA Entities (User, Bus, Schedule, Seat, etc.)
    │   ├── exception/                   # Global exception handling
    │   ├── repository/                  # Spring Data JPA Repositories
    │   ├── security/                    # Spring Security 6, JwtUtils, AuthTokenFilter
    │   └── service/                     # Business logic services
    ├── src/main/resources/
    │   ├── application.properties      # MySQL, JPA, and JWT configuration
    │   └── init.sql                     # Full MySQL schema and seed data dump
    ├── .env.example
    └── pom.xml
```

---

## 🗄 Database Design & Relationships

The relational schema is normalized in MySQL (`bus_booking_db`):

* **`roles`** (`id`, `name`) — Stores `ROLE_ADMIN`, `ROLE_OPERATOR`, `ROLE_USER`.
* **`users`** (`id`, `name`, `email`, `phone`, `password`, `role_id`, `status`, `profile_image`, `created_at`).
* **`buses`** (`id`, `bus_name`, `bus_number`, `operator_id`, `bus_type`, `seat_capacity`, `amenities`, `status`, `created_at`).
* **`routes`** (`id`, `source`, `destination`, `distance`, `duration`, `base_price`, `created_at`).
* **`schedules`** (`id`, `bus_id`, `route_id`, `travel_date`, `departure_time`, `arrival_time`, `price`, `status`, `created_at`).
* **`seats`** (`id`, `bus_id`, `seat_number`, `seat_type`, `is_active`) — Unique constraint on `(bus_id, seat_number)`.
* **`bookings`** (`id`, `booking_code`, `user_id`, `schedule_id`, `total_amount`, `service_fee`, `booking_status`, `payment_status`, `tracking_status`, `cancellation_fee`, `refund_amount`, `created_at`).
* **`booking_passengers`** (`id`, `booking_id`, `seat_number`, `passenger_name`, `age`, `gender`, `phone`, `email`).
* **`payments`** (`id`, `booking_id`, `amount`, `payment_method`, `payment_status`, `transaction_reference`, `created_at`).
* **`reviews`** (`id`, `user_id`, `bus_id`, `booking_id`, `rating`, `cleanliness_rating`, `comfort_rating`, `service_rating`, `comment`, `created_at`).
* **`notifications`** (`id`, `user_id`, `title`, `message`, `is_read`, `created_at`).

---

## 👥 Seed Demo Accounts

All seed passwords are encrypted using BCrypt (`password123`):

| Role | Name | Email | Password | Phone |
|---|---|---|---|---|
| **ADMIN** | Super Admin | `admin@yatrabus.com` | `password123` | `9800000001` |
| **OPERATOR** | Sajha Yatayat Operations | `operator1@sajhayatayat.com` | `password123` | `9811111111` |
| **OPERATOR** | Greenline Tours | `operator2@greenline.com` | `password123` | `9822222222` |
| **USER** | Aarav Sharma | `aarav@gmail.com` | `password123` | `9841000001` |
| **USER** | Bipana Thapa | `bipana@gmail.com` | `password123` | `9841000002` |
| **USER** | Chandra Gurung | `chandra@gmail.com` | `password123` | `9841000003` |
| **USER** | Deepa Adhikari | `deepa@gmail.com` | `password123` | `9841000004` |
| **USER** | Elina Maharjan | `elina@gmail.com` | `password123` | `9841000005` |

*(Tip: On the Login page, click any of the 1-click **Quick Demo Account** buttons to autofill credentials instantly!)*

---

## ⚙️ Environment Configuration

### Backend (`backend/.env` or system environment):
```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bus_booking_db
DB_USERNAME=root
DB_PASSWORD=1234
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
PORT=8080
```

### Frontend (`frontend/.env`):
```bash
VITE_API_URL=http://localhost:8080
```

---

## 🚀 Local Installation & Setup Guide

### Prerequisites
- **Java**: JDK 17, 21, or 26 installed (`java -version`).
- **Maven**: Version 3.8+ (`mvn -version`).
- **Node.js**: v18+ and npm (`node -v`).
- **MySQL Server**: Running on port `3306`.

### 1. Database Setup
Start MySQL and create the database:
```sql
CREATE DATABASE bus_booking_db;
```
*(Optional)* You can import `backend/src/main/resources/init.sql` directly:
```bash
mysql -u root -p bus_booking_db < backend/src/main/resources/init.sql
```
*(Note: If you run Spring Boot with an empty database, `DataInitializer.java` will automatically seed all 8 buses, 10 routes, schedules, users, reviews, and sample bookings on first boot!)*

### 2. Backend Setup
Navigate into the backend folder:
```bash
cd bus-ticket-booking/backend
mvn clean compile
mvn spring-boot:run
```
The Spring Boot backend will start on **`http://localhost:8080`**.

### 3. Frontend Setup
In a new terminal window, navigate into the frontend folder:
```bash
cd bus-ticket-booking/frontend
npm install
npm run dev
```
Open your browser and navigate to **`http://localhost:5173`**.

---

## 📡 Complete REST API Documentation

### Authentication & Users
- `POST /api/auth/register` — Register a new account (`ROLE_USER` or `ROLE_OPERATOR`).
- `POST /api/auth/login` — Sign in and receive a JWT Bearer token.
- `GET /api/users/profile` — Fetch current user profile.
- `PUT /api/users/profile` — Update name, phone, email, and avatar.
- `PUT /api/users/change-password` — Change password with current password verification.

### Bus Vehicles
- `GET /api/buses` — View all active buses with ratings and review counts.
- `GET /api/buses/{id}` — Get single bus details with amenities and layout info.
- `POST /api/buses` — *(Admin/Operator)* Create new bus and automatically generate seat layout.
- `PUT /api/buses/{id}` — *(Admin/Operator)* Update bus vehicle details.
- `DELETE /api/buses/{id}` — *(Admin)* Delete bus vehicle.

### Routes
- `GET /api/routes` — List all routes with duration, distance, and base fares.
- `POST /api/routes` — *(Admin)* Create a new travel route.
- `PUT /api/routes/{id}` — *(Admin)* Update route details.
- `DELETE /api/routes/{id}` — *(Admin)* Delete route.

### Schedules
- `GET /api/schedules` — List all active schedules.
- `GET /api/schedules/search?from=Kathmandu&to=Pokhara&date=2026-09-29` — Search schedules with live booked seats and available counts.
- `GET /api/schedules/{id}` — Retrieve schedule by ID with seat map details.
- `POST /api/schedules` — *(Admin/Operator)* Create schedule linking Bus + Route + Date + Time.
- `PUT /api/schedules/{id}` — *(Admin/Operator)* Update schedule.
- `DELETE /api/schedules/{id}` — *(Admin)* Delete schedule.

### Bookings & Payments
- `POST /api/bookings` — *(User)* Create booking with concurrency transaction lock, passengers, and mock payment.
- `GET /api/bookings/my` — *(User)* View all bookings for the authenticated user.
- `GET /api/bookings/{id}` — View single booking details.
- `GET /api/bookings/track/{code}` — *(Public)* Real-time ticket tracking by booking code (e.g., `BUS-2026-10294`).
- `PUT /api/bookings/{id}/cancel` — Cancel booking, calculate refund, and release seats.
- `PUT /api/bookings/{id}/tracking` — *(Admin/Operator)* Update journey stage.

### Reviews & Notifications
- `GET /api/reviews/bus/{busId}` — Get all reviews and sub-ratings for a bus.
- `POST /api/reviews` — Submit trip review (cleanliness, comfort, service ratings, comment) for completed bookings.
- `GET /api/notifications` — View user notifications.
- `PUT /api/notifications/{id}/read` — Mark notification as read.
- `PUT /api/notifications/read-all` — Mark all notifications as read.

### Admin & Operator
- `GET /api/admin/dashboard` — Analytics KPIs, monthly bookings, monthly revenue, top routes, and status breakdown.
- `GET /api/admin/bookings` — Filterable bookings list by status, bus, and route.
- `GET /api/admin/users` — User directory with search and role filters.
- `PUT /api/admin/users/{id}/toggle-status` — Activate/deactivate user accounts.
- `PUT /api/admin/users/{id}/role` — Assign `ROLE_ADMIN`, `ROLE_OPERATOR`, or `ROLE_USER`.
- `GET /api/operator/buses` — View agency buses.
- `GET /api/operator/schedules` — View agency schedules.
- `GET /api/operator/bookings` — View passenger lists and booking manifests for agency buses.
- `GET /api/operator/stats` — Agency earnings and trip statistics.

---

## 🔒 Concurrency & Booking Logic

1. **Transaction Isolation:** `createBooking` executes under `Isolation.SERIALIZABLE` database transactions.
2. **Duplicate Prevention:** Before creating booking records, requested seat numbers are locked and compared against currently active bookings (`CONFIRMED` or `COMPLETED`). If a seat is claimed, the transaction aborts with a descriptive HTTP 400 error.
3. **Seat Release on Cancellation:** When a booking is cancelled, its status updates to `CANCELLED`. Subsequent queries immediately exclude cancelled bookings, freeing those seat numbers for new travelers without manual intervention.

---

## 🔮 Future Enhancements

- GPS Live Location tracking via onboard mobile device websocket feeds.
- Automated SMS alerts through SparrowSMS / Twilio.
- PDF E-Ticket generation with embedded barcodes and download options.
- Dynamic surge pricing based on holiday and seasonal demand.
