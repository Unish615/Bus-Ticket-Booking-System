import React, { useState, useEffect } from 'react';
import { adminService, bookingService, busService, routeService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AdminNav from '../../components/AdminNav';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { FaTicketAlt, FaSearch, FaFilter, FaUser, FaChair, FaEdit, FaBan, FaCheckCircle } from 'react-icons/fa';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBusId, setSelectedBusId] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState('');

  // Selected Booking Details / Status Update Modal
  const [detailModalBooking, setDetailModalBooking] = useState(null);
  const [newTrackingStatus, setNewTrackingStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus, selectedBusId, selectedRouteId]);

  const fetchFiltersData = async () => {
    try {
      const [busRes, routeRes] = await Promise.all([
        busService.getAll(),
        routeService.getAll(),
      ]);
      setBuses(busRes?.data || []);
      setRoutes(routeRes?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedStatus) params.status = selectedStatus;
      if (selectedBusId) params.busId = selectedBusId;
      if (selectedRouteId) params.routeId = selectedRouteId;

      const res = await adminService.getBookings(params);
      setBookings(res?.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!detailModalBooking || !newTrackingStatus) return;
    try {
      setUpdatingStatus(true);
      await bookingService.updateTracking(detailModalBooking.id, newTrackingStatus);
      toast.success('Tracking status updated successfully!');
      setDetailModalBooking(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.message || 'Failed to update tracking');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAdminCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking and initiate refund?')) return;
    try {
      await bookingService.cancel(bookingId);
      toast.success('Booking cancelled and seats released.');
      fetchBookings();
    } catch (err) {
      toast.error(err.message || 'Cancellation failed');
    }
  };

  const filteredBookings = bookings.filter((b) =>
    b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.busName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem' }}>
      <AdminNav />

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Manage Bookings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Inspect passenger tickets, change trip stages, and handle administrative cancellations
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          alignItems: 'center',
        }}>
          {/* Search */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Search Booking / User</label>
            <input
              type="text"
              placeholder="Booking ID or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Status Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Booking Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-select"
            >
              <option value="">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          {/* Bus Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Filter by Bus</label>
            <select
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
              className="form-select"
            >
              <option value="">All Buses</option>
              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.busName} ({b.busNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Route Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Filter by Route</label>
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="form-select"
            >
              <option value="">All Routes</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.source} → {r.destination}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <Loading message="Loading tickets..." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User / Customer</th>
                  <th>Route & Bus</th>
                  <th>Travel Date</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Tracking Stage</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 800, color: 'var(--accent)' }}>
                        {b.bookingCode}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.userName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.routeSource} → {b.routeDestination}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.busName}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{b.travelDate}</td>
                      <td>
                        <span className="badge badge-primary">
                          {b.passengers?.map((p) => p.seatNumber).join(', ') || 'N/A'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 800 }}>Rs. {b.totalAmount}</td>
                      <td>
                        <span className={`badge ${
                          b.bookingStatus === 'CONFIRMED'
                            ? 'badge-primary'
                            : b.bookingStatus === 'COMPLETED'
                            ? 'badge-success'
                            : 'badge-danger'
                        }`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-secondary" style={{ textTransform: 'none', fontSize: '0.75rem' }}>
                          {b.trackingStatus?.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => {
                              setDetailModalBooking(b);
                              setNewTrackingStatus(b.trackingStatus || 'BOOKING_CONFIRMED');
                            }}
                            className="btn btn-outline btn-sm"
                            title="Update Tracking Stage / Details"
                          >
                            <FaEdit />
                          </button>
                          {b.bookingStatus === 'CONFIRMED' && (
                            <button
                              onClick={() => handleAdminCancel(b.id)}
                              className="btn btn-danger btn-sm"
                              title="Cancel Ticket"
                            >
                              <FaBan />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket Details & Tracking Update Modal */}
      <Modal
        isOpen={!!detailModalBooking}
        onClose={() => setDetailModalBooking(null)}
        title={`Booking Details: ${detailModalBooking?.bookingCode}`}
      >
        {detailModalBooking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              backgroundColor: 'var(--bg-elevated)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              fontSize: '0.875rem',
            }}>
              <div><strong>Route:</strong> {detailModalBooking.routeSource} → {detailModalBooking.routeDestination}</div>
              <div><strong>Bus:</strong> {detailModalBooking.busName} ({detailModalBooking.busNumber})</div>
              <div><strong>Date & Time:</strong> {detailModalBooking.travelDate} at {detailModalBooking.departureTime}</div>
              <div><strong>Customer:</strong> {detailModalBooking.userName} ({detailModalBooking.userPhone})</div>
              <div><strong>Payment Method:</strong> {detailModalBooking.paymentMethod || 'eSewa'}</div>
              <div><strong>Total Paid:</strong> Rs. {detailModalBooking.totalAmount}</div>
            </div>

            {/* Passenger Manifest */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>Passenger Manifest</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {detailModalBooking.passengers?.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                    <span>Seat <strong>{p.seatNumber}</strong>: {p.passengerName} ({p.gender}, {p.age} yrs)</span>
                    <span style={{ color: 'var(--text-muted)' }}>{p.phone}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Tracking Status */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <label className="form-label">Update Journey Tracking Status</label>
              <select
                value={newTrackingStatus}
                onChange={(e) => setNewTrackingStatus(e.target.value)}
                className="form-select"
              >
                <option value="BOOKING_CONFIRMED">Booking Confirmed</option>
                <option value="BUS_ASSIGNED">Bus Assigned</option>
                <option value="BOARDING">Boarding (At Station)</option>
                <option value="ON_THE_WAY">On The Way (Transit)</option>
                <option value="ARRIVED">Arrived (Completed)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setDetailModalBooking(null)}
                className="btn btn-secondary"
                disabled={updatingStatus}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleUpdateTracking}
                className="btn btn-primary"
                disabled={updatingStatus}
              >
                {updatingStatus ? 'Updating...' : 'Save Tracking Update'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageBookings;
