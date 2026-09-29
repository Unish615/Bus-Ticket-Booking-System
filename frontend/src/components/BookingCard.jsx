import React from 'react';
import { Link } from 'react-router-dom';
import { FaBus, FaCalendarAlt, FaClock, FaChair, FaMapMarkerAlt, FaTicketAlt, FaStar, FaBan, FaSearchLocation } from 'react-icons/fa';

const BookingCard = ({ booking, onCancelClick, onReviewClick }) => {
  if (!booking) return null;

  const isConfirmed = booking.bookingStatus === 'CONFIRMED';
  const isCompleted = booking.bookingStatus === 'COMPLETED';
  const isCancelled = booking.bookingStatus === 'CANCELLED';

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
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        borderLeft: isConfirmed
          ? '4px solid var(--accent)'
          : isCompleted
          ? '4px solid var(--success)'
          : '4px solid var(--danger)',
      }}
    >
      {/* Top Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.02em' }}>
            {booking.bookingCode}
          </span>
          <span className={`badge ${
            isConfirmed ? 'badge-primary' : isCompleted ? 'badge-success' : 'badge-danger'
          }`}>
            {booking.bookingStatus}
          </span>
          {booking.trackingStatus && (
            <span className="badge badge-secondary" style={{ textTransform: 'none' }}>
              Status: {booking.trackingStatus.replace('_', ' ')}
            </span>
          )}
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Booked: {new Date(booking.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Main Trip Information */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
            <FaBus style={{ color: 'var(--accent)' }} /> {booking.busName}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {booking.busNumber} • {booking.busType}
          </span>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, fontSize: '0.925rem' }}>
            <FaMapMarkerAlt style={{ color: 'var(--accent)' }} /> {booking.routeSource} → {booking.routeDestination}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            <span><FaCalendarAlt /> {booking.travelDate}</span>
            <span><FaClock /> {formatTime(booking.departureTime)}</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.9rem', fontWeight: 600 }}>
            <FaChair style={{ color: 'var(--accent)' }} /> Seats: {seats}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {booking.passengers?.length || 1} {(booking.passengers?.length || 1) === 1 ? 'Passenger' : 'Passengers'}
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Paid</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Rs. {booking.totalAmount?.toLocaleString()}
          </span>
          {isCancelled && booking.refundAmount > 0 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'block' }}>
              Refunded: Rs. {booking.refundAmount?.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '0.65rem',
        borderTop: '1px solid var(--border)',
        paddingTop: '0.75rem',
      }}>
        <Link
          to={`/confirmation/${booking.bookingCode}`}
          className="btn btn-outline btn-sm"
        >
          <FaTicketAlt /> View Ticket & QR
        </Link>

        <Link
          to={`/track?code=${booking.bookingCode}`}
          className="btn btn-outline btn-sm"
        >
          <FaSearchLocation /> Track Trip
        </Link>

        {isCompleted && (
          <button
            onClick={() => onReviewClick(booking)}
            className="btn btn-primary btn-sm"
          >
            <FaStar /> Rate & Review
          </button>
        )}

        {isConfirmed && onCancelClick && (
          <button
            onClick={() => onCancelClick(booking)}
            className="btn btn-danger btn-sm"
          >
            <FaBan /> Cancel Ticket
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
