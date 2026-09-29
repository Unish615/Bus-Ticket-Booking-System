import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { scheduleService } from '../services/api';
import SeatMap from '../components/SeatMap';
import Loading from '../components/Loading';
import { FaBus, FaArrowLeft, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const SeatSelection = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const requestedPassengers = parseInt(searchParams.get('passengers') || '1', 10);
  const [passengerCount, setPassengerCount] = useState(requestedPassengers);
  const [schedule, setSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const res = await scheduleService.getById(id);
        setSchedule(res?.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch schedule information.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  const handleContinue = () => {
    if (selectedSeats.length !== passengerCount) return;

    // Navigate to passenger details with state
    navigate('/passenger-details', {
      state: {
        schedule,
        selectedSeats,
        passengerCount,
        ticketPrice: schedule.price,
        serviceFee: 50,
        totalAmount: selectedSeats.length * schedule.price + 50,
      },
    });
  };

  if (loading) return <Loading message="Loading live bus layout and seat availability..." />;
  if (error || !schedule) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 600 }}>{error || 'Schedule not found'}</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      {/* Back button & Journey Overview Card */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline btn-sm"
          style={{ marginBottom: '1rem' }}
        >
          <FaArrowLeft /> Back to Search Results
        </button>

        <div className="card" style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.25rem',
          borderLeft: '5px solid var(--accent)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                {schedule.source} → {schedule.destination}
              </h2>
              <span className="badge badge-primary">{schedule.busType}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              <span><FaBus style={{ color: 'var(--accent)' }} /> {schedule.busName} ({schedule.busNumber})</span>
              <span>•</span>
              <span><FaCalendarAlt style={{ color: 'var(--accent)' }} /> {schedule.travelDate}</span>
              <span>•</span>
              <span><FaClock style={{ color: 'var(--accent)' }} /> {schedule.departureTime}</span>
            </div>
          </div>

          {/* Passenger count selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Passengers:</label>
            <select
              value={passengerCount}
              onChange={(e) => {
                const count = parseInt(e.target.value, 10);
                setPassengerCount(count);
                setSelectedSeats([]); // reset when passenger count changes
              }}
              className="form-select"
              style={{ width: '130px' }}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Seat' : 'Seats'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Seat Map */}
      <SeatMap
        seatCapacity={schedule.seatCapacity || 28}
        bookedSeats={schedule.bookedSeats || []}
        selectedSeats={selectedSeats}
        onSeatSelect={setSelectedSeats}
        maxSelectable={passengerCount}
        ticketPrice={schedule.price}
        serviceFee={50}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default SeatSelection;
