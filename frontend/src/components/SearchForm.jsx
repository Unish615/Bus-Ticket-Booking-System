import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaExchangeAlt, FaSearch } from 'react-icons/fa';

const CITIES = [
  'Kathmandu',
  'Pokhara',
  'Chitwan',
  'Butwal',
  'Lumbini',
  'Dharan',
  'Biratnagar',
  'Nepalgunj'
];

const SearchForm = ({ initialValues = {}, compact = false }) => {
  const navigate = useNavigate();
  const [from, setFrom] = useState(initialValues.from || 'Kathmandu');
  const [to, setTo] = useState(initialValues.to || 'Pokhara');
  
  // Format today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(initialValues.date || todayStr);
  const [passengers, setPassengers] = useState(initialValues.passengers || 1);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (date) params.append('date', date);
    if (passengers) params.append('passengers', passengers);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      padding: compact ? '1.25rem' : '2rem',
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)',
    }}>
      <form onSubmit={handleSearch}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end',
        }}>
          {/* FROM */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaMapMarkerAlt style={{ color: 'var(--accent)' }} /> From
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="form-select"
                required
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} disabled={c === to}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleSwap}
                title="Swap From and To"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  flexShrink: 0,
                }}
              >
                <FaExchangeAlt />
              </button>
            </div>
          </div>

          {/* TO */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaMapMarkerAlt style={{ color: 'var(--danger)' }} /> To
            </label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="form-select"
              required
            >
              {CITIES.map((c) => (
                <option key={c} value={c} disabled={c === from}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaCalendarAlt style={{ color: 'var(--accent)' }} /> Travel Date
            </label>
            <input
              type="date"
              value={date}
              min={todayStr}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* PASSENGERS */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaUsers style={{ color: 'var(--accent)' }} /> Passengers
            </label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="form-select"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Passenger' : 'Passengers'}
                </option>
              ))}
            </select>
          </div>

          {/* SUBMIT BUTTON */}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '42px',
                fontSize: '1rem',
              }}
            >
              <FaSearch /> Search Buses
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
