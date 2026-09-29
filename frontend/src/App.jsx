import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import BusDetails from './pages/BusDetails';
import SeatSelection from './pages/SeatSelection';
import PassengerDetails from './pages/PassengerDetails';
import Payment from './pages/Payment';
import BookingConfirmation from './pages/BookingConfirmation';
import TrackTicket from './pages/TrackTicket';
import Login from './pages/Login';
import Register from './pages/Register';

// User Protected Pages
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import Notifications from './pages/Notifications';

// Operator Pages
import OperatorDashboard from './pages/operator/OperatorDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBuses from './pages/admin/ManageBuses';
import ManageRoutes from './pages/admin/ManageRoutes';
import ManageSchedules from './pages/admin/ManageSchedules';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';
import Reports from './pages/admin/Reports';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />

              <main style={{ flex: 1 }}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/bus/:id" element={<BusDetails />} />
                  <Route path="/select-seats/:id" element={<SeatSelection />} />
                  <Route path="/passenger-details" element={<PassengerDetails />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/confirmation/:code" element={<BookingConfirmation />} />
                  <Route path="/track" element={<TrackTicket />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Authenticated user routes */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    }
                  />

                  {/* Operator routes */}
                  <Route
                    path="/operator"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_OPERATOR', 'ROLE_ADMIN']}>
                        <OperatorDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/buses"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <ManageBuses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/routes"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <ManageRoutes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/schedules"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <ManageSchedules />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/bookings"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <ManageBookings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <ManageUsers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/reports"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <Reports />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
