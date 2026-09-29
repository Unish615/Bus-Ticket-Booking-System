import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';
import Loading from '../components/Loading';
import { QRCodeSVG } from 'qrcode.react';
import { 
  FaCheckCircle, FaPrint, FaDownload, FaTicketAlt, 
  FaBus, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaChair, FaTachometerAlt 
} from 'react-icons/fa';

const BookingConfirmation = () => {
  const { code } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!booking && code) {
      bookingService.track(code)
        .then((res) => {
          setBooking(res?.data);
        })
        .catch((err) => {
          setError(err.message || 'Ticket confirmation details not found.');
        })
        .finally(() => setLoading(false));
    }
  }, [code, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <Loading message="Loading confirmed ticket details..." />;
  if (error || !booking) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 600 }}>{error || 'Booking not found.'}</p>
          <Link to="/" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const seats = booking.passengers?.map((p) => p.seatNumber).join(', ') || 'N/A';

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const standardHour = h % 12 || 12;
    return `${standardHour}:${minutes} ${suffix}`;
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        {/* Printable Ticket Card */}
        <div
          id="printable-ticket"
          className="card"
          style={{
            padding: '2.5rem',
            border: '2px dashed var(--border)',
            position: 'relative',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              fontSize: '2.2rem',
              marginBottom: '0.75rem',
            }}>
              <FaCheckCircle />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--success)' }}>
              Booking Confirmed
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Your electronic ticket has been generated. Please keep this code handy during travel.
            </p>
          </div>

          {/* Ticket Information Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            backgroundColor: 'var(--bg-elevated)',
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
          }}>
            {/* Left Trip Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Booking ID
                </span>
                <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.05em' }}>
                  {booking.bookingCode}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Route
                </span>
                <p style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                  {booking.routeSource} → {booking.routeDestination}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Travel Date
                  </span>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{booking.travelDate}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Departure
                  </span>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{formatTime(booking.departureTime)}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Bus
                  </span>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{booking.busName}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.busNumber}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Seats
                  </span>
                  <p style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent)' }}>{seats}</p>
                </div>
              </div>
            </div>

            {/* Right QR Code Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              borderLeft: '1px solid var(--border)',
              paddingLeft: '1.5rem',
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <QRCodeSVG
                  value={booking.qrData || booking.bookingCode}
                  size={140}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Scan QR at conductor check-in
              </span>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Amount Paid</span>
                <p style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  Rs. {booking.totalAmount?.toLocaleString()}
                </p>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                  {booking.paymentStatus || 'PAID'}
                </span>
              </div>
            </div>
          </div>

          {/* Passengers List on Ticket */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Passenger Manifest</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {booking.passengers?.map((p, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>{p.passengerName}</span>
                    <span style={{ color: 'var(--accent)' }}>Seat {p.seatNumber}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {p.gender} • {p.age} yrs • {p.phone}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            borderTop: '1px solid var(--border)',
            paddingTop: '1.5rem',
          }} className="no-print">
            <button onClick={handlePrint} className="btn btn-primary">
              <FaPrint /> Print / Download Ticket
            </button>
            <Link to="/my-bookings" className="btn btn-secondary">
              <FaTicketAlt /> View My Bookings
            </Link>
            <Link to="/track" className="btn btn-outline">
              Track Ticket
            </Link>
          </div>
        </div>
      </div>

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-ticket, #printable-ticket * {
            visibility: visible;
          }
          #printable-ticket {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmation;
