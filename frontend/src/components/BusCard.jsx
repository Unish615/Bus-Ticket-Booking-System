import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaWifi, FaSnowflake, FaPlug, FaTv, FaCoffee, FaClock, FaChair, FaBus } from 'react-icons/fa';

const BusCard = ({ schedule, passengerCount = 1 }) => {
  if (!schedule) return null;

  // Split amenities
  const amenitiesList = schedule.amenities
    ? schedule.amenities.split(',').map((a) => a.trim())
    : ['AC', 'WiFi'];

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const standardHour = h % 12 || 12;
    return `${standardHour}:${minutes} ${suffix}`;
  };

  const isSoldOut = schedule.availableSeats <= 0;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        borderLeft: '4px solid var(--accent)',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Top Header Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            <FaBus />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{schedule.busName}</h3>
              <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                {schedule.busNumber}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              <span>Operator: <strong>{schedule.operatorName}</strong></span>
              <span>•</span>
              <span className="badge badge-primary" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>
                {schedule.busType}
              </span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'var(--warning-bg)',
          color: 'var(--warning)',
          padding: '0.35rem 0.65rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          fontSize: '0.9rem',
        }}>
          <FaStar />
          <span>{schedule.averageRating || '4.5'}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
            ({schedule.reviewCount || 0})
          </span>
        </div>
      </div>

      {/* Middle Trip Times Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: 'var(--bg-elevated)',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
      }}>
        {/* Departure */}
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Departure</span>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{formatTime(schedule.departureTime)}</h4>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{schedule.source}</span>
        </div>

        {/* Duration */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            <FaClock /> {schedule.duration || '6 hours'}
          </div>
          <div style={{ height: '2px', backgroundColor: 'var(--border)', position: 'relative', margin: '0 1rem' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              position: 'absolute',
              top: '-3px',
              left: '50%',
              transform: 'translateX(-50%)',
            }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{schedule.distance || 'Direct'}</span>
        </div>

        {/* Arrival */}
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Arrival</span>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{formatTime(schedule.arrivalTime)}</h4>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{schedule.destination}</span>
        </div>
      </div>

      {/* Amenities Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        {amenitiesList.slice(0, 5).map((amenity, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '0.75rem',
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            {amenity.toLowerCase().includes('wifi') && <FaWifi style={{ color: 'var(--accent)' }} />}
            {amenity.toLowerCase().includes('ac') && <FaSnowflake style={{ color: '#0284c7' }} />}
            {amenity.toLowerCase().includes('charge') && <FaPlug style={{ color: '#10b981' }} />}
            {amenity.toLowerCase().includes('tv') && <FaTv style={{ color: '#8b5cf6' }} />}
            {amenity}
          </span>
        ))}
      </div>

      {/* Bottom Action & Price Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border)',
        paddingTop: '1rem',
        gap: '1rem',
      }}>
        {/* Availability */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaChair style={{ color: isSoldOut ? 'var(--danger)' : 'var(--success)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isSoldOut ? 'var(--danger)' : 'var(--success)' }}>
            {isSoldOut ? 'Sold Out' : `${schedule.availableSeats} seats available`}
          </span>
        </div>

        {/* Price & Select Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Per Seat</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Rs. {schedule.price?.toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to={`/bus/${schedule.busId}`}
              className="btn btn-outline btn-sm"
              title="View Bus details & reviews"
            >
              Details
            </Link>

            {isSoldOut ? (
              <button disabled className="btn btn-secondary btn-sm" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                Full
              </button>
            ) : (
              <Link
                to={`/select-seats/${schedule.id}?passengers=${passengerCount}`}
                className="btn btn-primary btn-sm"
              >
                View Seats
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusCard;
