import React, { useState, useEffect } from 'react';
import { operatorService, bookingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { 
  FaBus, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle, 
  FaTicketAlt, FaUsers, FaChair, FaEdit 
} from 'react-icons/fa';

const OperatorDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [buses, setBuses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab: OVERVIEW, BUSES, SCHEDULES, BOOKINGS
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  // Passenger Manifest Modal
  const [selectedBookingForPassengers, setSelectedBookingForPassengers] = useState(null);

  // Tracking stage update modal
  const [selectedBookingForTracking, setSelectedBookingForTracking] = useState(null);
  const [newTrackingStage, setNewTrackingStage] = useState('');
  const [updatingTracking, setUpdatingTracking] = useState(false);

  useEffect(() => {
    fetchOperatorData();
  }, []);

  const fetchOperatorData = async () => {
    try {
      setLoading(true);
      const [busRes, schedRes, bookRes, statRes] = await Promise.all([
        operatorService.getBuses(),
        operatorService.getSchedules(),
        operatorService.getBookings(),
        operatorService.getStats(),
      ]);
      setBuses(busRes?.data || []);
      setSchedules(schedRes?.data || []);
      setBookings(bookRes?.data || []);
      setStats(statRes?.data || null);
    } catch (err) {
      toast.error(err.message || 'Failed to load operator portal');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStage = async () => {
    if (!selectedBookingForTracking || !newTrackingStage) return;
    try {
      setUpdatingTracking(true);
      await bookingService.updateTracking(selectedBookingForTracking.id, newTrackingStage);
      toast.success('Trip tracking status updated.');
      setSelectedBookingForTracking(null);
      fetchOperatorData();
    } catch (err) {
      toast.error(err.message || 'Failed to update tracking');
    } finally {
      setUpdatingTracking(false);
    }
  };

  if (loading) return <Loading message="Loading operator agency records..." />;

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <span className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>OPERATOR PORTAL</span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{user?.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage fleet vehicles, assigned departures, manifests, and revenue
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>FLEET VEHICLES</span>
            <FaBus style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {stats?.totalBuses || buses.length}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>PASSENGER TICKETS</span>
            <FaTicketAlt style={{ color: '#0284c7' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {stats?.totalBookings || bookings.length}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>COMPLETED TRIPS</span>
            <FaCheckCircle style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {stats?.completedTrips || 0}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>AGENCY EARNINGS</span>
            <FaMoneyBillWave style={{ color: '#16a34a' }} />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--success)' }}>
            Rs. {stats?.totalEarnings ? stats.totalEarnings.toLocaleString() : '0'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '2rem',
      }}>
        {[
          { id: 'OVERVIEW', label: 'Recent Bookings & Passengers' },
          { id: 'SCHEDULES', label: `Schedules (${schedules.length})` },
          { id: 'BUSES', label: `My Buses (${buses.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: 'transparent',
              padding: '0.65rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderBottom: activeTab === t.id ? '3px solid var(--accent)' : '3px solid transparent',
              color: activeTab === t.id ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Recent Bookings */}
      {activeTab === 'OVERVIEW' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Route & Bus</th>
                  <th>Travel Date</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Tracking Stage</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No bookings recorded for your buses yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 800, color: 'var(--accent)' }}>{b.bookingCode}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.userName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.userPhone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.routeSource} → {b.routeDestination}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.busName}</div>
                      </td>
                      <td>{b.travelDate}</td>
                      <td>
                        <span className="badge badge-primary">
                          {b.passengers?.map((p) => p.seatNumber).join(', ') || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          b.bookingStatus === 'CONFIRMED' ? 'badge-primary' : b.bookingStatus === 'COMPLETED' ? 'badge-success' : 'badge-danger'
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
                            onClick={() => setSelectedBookingForPassengers(b)}
                            className="btn btn-outline btn-sm"
                            title="View Passengers List"
                          >
                            <FaUsers /> Passengers
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBookingForTracking(b);
                              setNewTrackingStage(b.trackingStatus || 'BOOKING_CONFIRMED');
                            }}
                            className="btn btn-secondary btn-sm"
                            title="Update Tracking Stage"
                          >
                            <FaEdit />
                          </button>
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

      {/* TAB 2: Schedules */}
      {activeTab === 'SCHEDULES' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Bus Assigned</th>
                  <th>Travel Date</th>
                  <th>Departure / Arrival</th>
                  <th>Fare</th>
                  <th>Available Seats</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.source} → {s.destination}</td>
                    <td>{s.busName} ({s.busNumber})</td>
                    <td>{s.travelDate}</td>
                    <td>{s.departureTime} - {s.arrivalTime}</td>
                    <td style={{ fontWeight: 800 }}>Rs. {s.price}</td>
                    <td>
                      <span className="badge badge-success">
                        {s.availableSeats} / {s.seatCapacity} seats left
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${s.status === 'ACTIVE' ? 'badge-primary' : 'badge-secondary'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Buses */}
      {activeTab === 'BUSES' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {buses.map((bus) => (
            <div key={bus.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{bus.busName}</h3>
                <span className="badge badge-primary">{bus.busType}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Plate: <strong>{bus.busNumber}</strong> • Capacity: <strong>{bus.seatCapacity} Seats</strong>
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>Amenities:</strong> {bus.amenities}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Passenger Manifest Modal */}
      <Modal
        isOpen={!!selectedBookingForPassengers}
        onClose={() => setSelectedBookingForPassengers(null)}
        title={`Passenger Manifest: ${selectedBookingForPassengers?.bookingCode}`}
      >
        {selectedBookingForPassengers && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Bus: <strong>{selectedBookingForPassengers.busName}</strong> • Date: <strong>{selectedBookingForPassengers.travelDate}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedBookingForPassengers.passengers?.map((p, i) => (
                <div key={i} style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.passengerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {p.gender}, {p.age} years • Contact: {p.phone}
                    </div>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '0.3rem 0.65rem' }}>
                    Seat {p.seatNumber}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button onClick={() => setSelectedBookingForPassengers(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Tracking Update Modal */}
      <Modal
        isOpen={!!selectedBookingForTracking}
        onClose={() => setSelectedBookingForTracking(null)}
        title="Update Trip Progress"
      >
        {selectedBookingForTracking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.9rem' }}>
              Ticket: <strong>{selectedBookingForTracking.bookingCode}</strong> ({selectedBookingForTracking.userName})
            </p>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Set Stage</label>
              <select
                value={newTrackingStage}
                onChange={(e) => setNewTrackingStage(e.target.value)}
                className="form-select"
              >
                <option value="BOOKING_CONFIRMED">Booking Confirmed</option>
                <option value="BUS_ASSIGNED">Bus Assigned</option>
                <option value="BOARDING">Boarding (At Terminal)</option>
                <option value="ON_THE_WAY">On The Way (En Route)</option>
                <option value="ARRIVED">Arrived (Completed)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedBookingForTracking(null)}
                className="btn btn-secondary"
                disabled={updatingTracking}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStage}
                className="btn btn-primary"
                disabled={updatingTracking}
              >
                {updatingTracking ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OperatorDashboard;
