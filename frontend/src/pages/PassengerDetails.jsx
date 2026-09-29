import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FaUser, FaPhoneAlt, FaEnvelope, FaChair, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const PassengerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated } = useAuth();

  const bookingState = location.state;

  useEffect(() => {
    if (!bookingState || !bookingState.selectedSeats || bookingState.selectedSeats.length === 0) {
      navigate('/search');
    }
  }, [bookingState, navigate]);

  if (!bookingState) return null;

  const { schedule, selectedSeats, ticketPrice, serviceFee, totalAmount } = bookingState;

  // Initialize passenger list for each seat
  const [passengers, setPassengers] = useState(() => {
    return selectedSeats.map((seat, index) => ({
      seatNumber: seat,
      passengerName: index === 0 ? (user?.name || 'Unish Gautam') : '',
      age: index === 0 ? '24' : '',
      gender: 'Male',
      phone: index === 0 ? (user?.phone || '9841000001') : '',
      email: index === 0 ? (user?.email || 'unish@gmail.com') : '',
    }));
  });

  const handleInputChange = (index, field, value) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.passengerName.trim()) {
        toast.error(`Please enter passenger name for Seat ${p.seatNumber}`);
        return;
      }
      if (!p.age || parseInt(p.age, 10) <= 0 || parseInt(p.age, 10) > 120) {
        toast.error(`Please enter a valid age for Seat ${p.seatNumber}`);
        return;
      }
      if (!p.phone || p.phone.trim().length < 8) {
        toast.error(`Please enter a valid phone number for Seat ${p.seatNumber}`);
        return;
      }
    }

    if (!isAuthenticated) {
      toast.info('Please log in or register to complete your booking.');
      navigate('/login', { state: { returnUrl: '/passenger-details', bookingState } });
      return;
    }

    // Proceed to Payment
    navigate('/payment', {
      state: {
        ...bookingState,
        passengers,
      },
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <FaArrowLeft /> Back to Seat Selection
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Left Form: Passenger Cards */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Passenger Details</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Please enter accurate identification details for each reserved seat.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {passengers.map((passenger, index) => (
              <div key={passenger.seatNumber} className="card" style={{ borderTop: '4px solid var(--accent)' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '0.75rem',
                }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaUser style={{ color: 'var(--accent)' }} /> Passenger {index + 1}
                  </h3>
                  <span className="badge badge-primary">
                    <FaChair /> Seat {passenger.seatNumber}
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                }}>
                  {/* Name */}
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Unish Gautam"
                      value={passenger.passengerName}
                      onChange={(e) => handleInputChange(index, 'passengerName', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Age */}
                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input
                      type="number"
                      placeholder="e.g. 28"
                      min="1"
                      max="120"
                      value={passenger.age}
                      onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select
                      value={passenger.gender}
                      onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
                      className="form-select"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9841234567"
                      value={passenger.phone}
                      onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={passenger.email}
                      onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.85rem', fontSize: '1rem', width: '100%' }}
            >
              Proceed to Payment
            </button>
          </form>
        </div>

        {/* Right Summary Sidebar */}
        <div className="card" style={{ position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Trip Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Route</span>
              <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>{schedule.source} → {schedule.destination}</p>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Bus & Date</span>
              <p style={{ fontWeight: 600 }}>{schedule.busName} ({schedule.busNumber})</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>{schedule.travelDate} at {schedule.departureTime}</p>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Reserved Seats:</span>
                <span style={{ fontWeight: 700 }}>{selectedSeats.join(', ')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ticket Fare:</span>
                <span>Rs. {ticketPrice} × {selectedSeats.length} = Rs. {ticketPrice * selectedSeats.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Service Fee:</span>
                <span>Rs. {serviceFee}</span>
              </div>
            </div>

            <div style={{
              borderTop: '2px solid var(--border)',
              paddingTop: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>Total Amount:</span>
              <span style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--accent)' }}>
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
