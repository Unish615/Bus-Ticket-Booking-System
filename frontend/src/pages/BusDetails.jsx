import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { busService, reviewService, scheduleService } from '../services/api';
import Loading from '../components/Loading';
import { 
  FaBus, FaStar, FaWifi, FaSnowflake, FaPlug, FaTv, FaCheckCircle, 
  FaInfoCircle, FaCalendarAlt, FaClock, FaChair, FaShieldAlt 
} from 'react-icons/fa';

const BusDetails = () => {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        const [busRes, revRes, schedRes] = await Promise.all([
          busService.getById(id),
          reviewService.getByBus(id),
          scheduleService.getAll(),
        ]);
        setBus(busRes?.data);
        setReviews(revRes?.data || []);
        // Find schedules for this bus
        const relatedSchedules = (schedRes?.data || []).filter(
          (s) => s.busId === parseInt(id, 10) && s.status === 'ACTIVE'
        );
        setSchedules(relatedSchedules);
      } catch (err) {
        setError(err.message || 'Failed to load bus details');
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [id]);

  if (loading) return <Loading message="Loading bus details..." />;
  if (error || !bus) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 600 }}>{error || 'Bus not found'}</p>
          <Link to="/search" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const amenities = bus.amenities ? bus.amenities.split(',').map((a) => a.trim()) : [];

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      {/* Top Banner Card */}
      <div className="card" style={{ marginBottom: '2rem', borderLeft: '6px solid var(--accent)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
            }}>
              <FaBus />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{bus.busName}</h1>
                <span className="badge badge-secondary">{bus.busNumber}</span>
                <span className="badge badge-primary">{bus.busType}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Operated by: <strong>{bus.operatorName}</strong> • Total Capacity: <strong>{bus.seatCapacity} Seats</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              backgroundColor: 'var(--warning-bg)',
              color: 'var(--warning)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 800,
              fontSize: '1.15rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <FaStar /> {bus.averageRating || '4.5'}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                ({reviews.length} reviews)
              </span>
            </div>

            {schedules.length > 0 && (
              <Link
                to={`/select-seats/${schedules[0].id}`}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Select Seats
              </Link>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Amenities, Policies, & Schedules */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Amenities */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Bus Amenities & Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {amenities.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-elevated)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  <FaCheckCircle style={{ color: 'var(--success)' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Available Schedules */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Upcoming Schedules For This Bus</h3>
            {schedules.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No active upcoming departures found for this bus.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {schedules.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.85rem 1rem',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {s.source} → {s.destination}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Date: {s.travelDate} • Departure: {s.departureTime}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                        Rs. {s.price}
                      </span>
                      <Link to={`/select-seats/${s.id}`} className="btn btn-primary btn-sm">
                        Book Seats
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cancellation Policy */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Cancellation & Refund Policy
            </h3>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.8 }}>
              <li>Cancellations requested before departure date are eligible for refund.</li>
              <li>A standard processing cancellation fee of Rs. 100 per seat applies.</li>
              <li>Refund amount will be automatically initiated to your original payment method.</li>
              <li>Departed or completed trips cannot be cancelled or refunded.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Passenger Reviews */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Passenger Reviews ({reviews.length})</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified Trips Only</span>
          </div>

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <FaStar style={{ fontSize: '2.5rem', color: 'var(--border)', marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: 600 }}>No passenger reviews yet for this bus.</p>
              <p style={{ fontSize: '0.825rem' }}>Reviews can be submitted by travellers after completing their journey.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rev.userName}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--warning)', fontSize: '0.85rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} style={{ opacity: i < rev.rating ? 1 : 0.25 }} />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Cleanliness: ★{rev.cleanlinessRating || rev.rating}</span>
                    <span>Comfort: ★{rev.comfortRating || rev.rating}</span>
                    <span>Service: ★{rev.serviceRating || rev.rating}</span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5, marginTop: '0.25rem' }}>
                    "{rev.comment}"
                  </p>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'flex-end' }}>
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusDetails;
