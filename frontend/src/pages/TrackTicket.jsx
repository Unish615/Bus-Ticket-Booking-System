import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import Loading from '../components/Loading';
import { 
  FaSearch, FaCheckCircle, FaBus, FaClock, FaCalendarAlt, 
  FaMapMarkerAlt, FaTicketAlt, FaExclamationTriangle, FaRoute 
} from 'react-icons/fa';

const TRACKING_STAGES = [
  { id: 'BOOKING_CONFIRMED', label: 'Booking Confirmed', desc: 'Seat reserved & payment verified' },
  { id: 'BUS_ASSIGNED', label: 'Bus Assigned', desc: 'Driver & vehicle assigned for route' },
  { id: 'BOARDING', label: 'Boarding', desc: 'Passenger check-in active at station' },
  { id: 'ON_THE_WAY', label: 'On The Way', desc: 'Bus in transit on highway' },
  { id: 'ARRIVED', label: 'Arrived', desc: 'Reached destination terminal' },
];

const TrackTicket = () => {
  const [searchParams] = useSearchParams();
  const queryCode = searchParams.get('code') || '';

  const [bookingCode, setBookingCode] = useState(queryCode);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (queryCode) {
      handleTrack(queryCode);
    }
  }, [queryCode]);

  const handleTrack = async (codeToSearch) => {
    const code = (codeToSearch || bookingCode).trim();
    if (!code) return;

    setLoading(true);
    setError(null);
    setTicket(null);

    try {
      const res = await bookingService.track(code);
      setTicket(res?.data);
    } catch (err) {
      setError(err.message || 'Ticket not found. Please verify your Booking ID.');
    } finally {
      setLoading(false);
    }
  };

  const currentStageIndex = ticket?.trackingStatus
    ? TRACKING_STAGES.findIndex((s) => s.id === ticket.trackingStatus.toUpperCase())
    : 0;

  const isCancelled = ticket?.bookingStatus === 'CANCELLED';

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>LIVE STATUS</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Track Your Bus Journey</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Enter your booking code (e.g. <strong>BUS-2026-10294</strong>) to view real-time trip status.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
          >
            <input
              type="text"
              placeholder="Enter Booking ID (e.g. BUS-2026-10294)"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
              className="form-input"
              style={{ flex: 1, minWidth: '220px', fontWeight: 700, letterSpacing: '0.05em' }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              <FaSearch /> Track Ticket
            </button>
          </form>
        </div>

        {loading && <Loading message="Looking up ticket details..." />}

        {error && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', borderLeft: '4px solid var(--danger)' }}>
            <FaExclamationTriangle style={{ fontSize: '2.5rem', color: 'var(--danger)', marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ticket Not Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{error}</p>
          </div>
        )}

        {ticket && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
            {/* Ticket Header */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '1.25rem',
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Booking ID
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>
                  {ticket.bookingCode}
                </h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={`badge ${
                  isCancelled ? 'badge-danger' : ticket.bookingStatus === 'COMPLETED' ? 'badge-success' : 'badge-primary'
                }`} style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                  {ticket.bookingStatus}
                </span>

                <Link to={`/confirmation/${ticket.bookingCode}`} className="btn btn-outline btn-sm">
                  <FaTicketAlt /> Full Ticket
                </Link>
              </div>
            </div>

            {/* Cancelled Warning or Progress Timeline */}
            {isCancelled ? (
              <div style={{
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}>
                <FaExclamationTriangle style={{ fontSize: '1.5rem', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontWeight: 700 }}>This journey was cancelled</h4>
                  <p style={{ fontSize: '0.85rem' }}>
                    Refund of Rs. {ticket.refundAmount?.toLocaleString()} was initiated.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                  Journey Timeline
                </h3>

                {/* Tracking Stepper */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  position: 'relative',
                  paddingLeft: '2.5rem',
                }}>
                  {/* Vertical connecting bar */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    bottom: '24px',
                    left: '11px',
                    width: '3px',
                    backgroundColor: 'var(--border)',
                    zIndex: 0,
                  }} />

                  {TRACKING_STAGES.map((stage, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage.id} style={{ position: 'relative', zIndex: 1 }}>
                        {/* Circle Bullet */}
                        <div style={{
                          position: 'absolute',
                          left: '-2.5rem',
                          top: '2px',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? 'var(--accent)' : 'var(--bg-elevated)',
                          border: `3px solid ${isCurrent ? 'var(--accent)' : 'var(--border)'}`,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          boxShadow: isCurrent ? '0 0 0 4px var(--accent-ring)' : 'none',
                        }}>
                          {isDone ? <FaCheckCircle /> : idx + 1}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h4 style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: isDone ? 'var(--text-main)' : 'var(--text-muted)',
                            }}>
                              {stage.label}
                            </h4>
                            {isCurrent && (
                              <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                                CURRENT STAGE
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trip Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              backgroundColor: 'var(--bg-elevated)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Route
                </span>
                <p style={{ fontWeight: 700 }}>{ticket.routeSource} → {ticket.routeDestination}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Date & Time
                </span>
                <p style={{ fontWeight: 700 }}>{ticket.travelDate} at {ticket.departureTime}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Bus Vehicle
                </span>
                <p style={{ fontWeight: 700 }}>{ticket.busName} ({ticket.busNumber})</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ticket.busType}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Reserved Seats
                </span>
                <p style={{ fontWeight: 800, color: 'var(--accent)' }}>
                  {ticket.passengers?.map((p) => p.seatNumber).join(', ') || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackTicket;
