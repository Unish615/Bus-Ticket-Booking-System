import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { scheduleService } from '../services/api';
import BusCard from '../components/BusCard';
import SearchForm from '../components/SearchForm';
import Loading from '../components/Loading';
import { FaFilter, FaSortAmountDown, FaBus, FaSearch, FaTimes } from 'react-icons/fa';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const passengers = parseInt(searchParams.get('passengers') || '1', 10);

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [minRating, setMinRating] = useState(0);
  const [departureTimeSlot, setDepartureTimeSlot] = useState('ALL'); // ALL, MORNING, AFTERNOON, EVENING, NIGHT
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('CHEAPEST'); // CHEAPEST, EARLIEST, LATEST, HIGHEST_RATED
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, [from, to, date]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await scheduleService.search(from, to, date);
      setSchedules(res?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  // Extract distinct bus types from results
  const availableBusTypes = useMemo(() => {
    const types = new Set(schedules.map((s) => s.busType).filter(Boolean));
    return Array.from(types);
  }, [schedules]);

  // Apply filters and sorting
  const filteredSchedules = useMemo(() => {
    return schedules
      .filter((s) => {
        // Price filter
        if (s.price > maxPrice) return false;

        // Rating filter
        if (s.averageRating < minRating) return false;

        // Available seats
        if (onlyAvailable && s.availableSeats <= 0) return false;

        // Bus type filter
        if (selectedTypes.length > 0 && !selectedTypes.includes(s.busType)) {
          return false;
        }

        // Departure time slot
        if (departureTimeSlot !== 'ALL' && s.departureTime) {
          const hour = parseInt(s.departureTime.split(':')[0], 10);
          if (departureTimeSlot === 'MORNING' && (hour < 5 || hour >= 12)) return false;
          if (departureTimeSlot === 'AFTERNOON' && (hour < 12 || hour >= 17)) return false;
          if (departureTimeSlot === 'EVENING' && (hour < 17 || hour >= 21)) return false;
          if (departureTimeSlot === 'NIGHT' && (hour < 21 && hour >= 5)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'CHEAPEST') return a.price - b.price;
        if (sortBy === 'EARLIEST') return a.departureTime.localeCompare(b.departureTime);
        if (sortBy === 'LATEST') return b.departureTime.localeCompare(a.departureTime);
        if (sortBy === 'HIGHEST_RATED') return (b.averageRating || 0) - (a.averageRating || 0);
        return 0;
      });
  }, [schedules, maxPrice, minRating, onlyAvailable, selectedTypes, departureTimeSlot, sortBy]);

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleResetFilters = () => {
    setSelectedTypes([]);
    setMaxPrice(3000);
    setMinRating(0);
    setDepartureTimeSlot('ALL');
    setOnlyAvailable(false);
    setSortBy('CHEAPEST');
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      {/* Top Search Modify Box */}
      <div style={{ marginBottom: '2rem' }}>
        <SearchForm
          initialValues={{ from, to, date, passengers }}
          compact={true}
        />
      </div>

      {/* Header with Title and Sorting */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {from && to ? `${from} to ${to}` : 'All Bus Schedules'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {date ? `Travel Date: ${date}` : 'Showing available departures'} • {filteredSchedules.length} buses found
          </p>
        </div>

        {/* Mobile Filter Toggle + Desktop Sorting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setMobileFilterOpen((prev) => !prev)}
            className="btn btn-secondary btn-sm mobile-filter-btn"
            style={{ display: 'none' }}
          >
            <FaFilter /> Filters
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="CHEAPEST">Cheapest Fare</option>
              <option value="EARLIEST">Earliest Departure</option>
              <option value="LATEST">Latest Departure</option>
              <option value="HIGHEST_RATED">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Bus Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '2rem',
        alignItems: 'start',
      }} className="search-grid">
        {/* Filter Sidebar */}
        <aside
          className={`card filter-sidebar ${mobileFilterOpen ? 'open' : ''}`}
          style={{
            position: 'sticky',
            top: '90px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FaFilter style={{ color: 'var(--accent)', fontSize: '0.9rem' }} /> Filters
            </h3>
            <button
              onClick={handleResetFilters}
              style={{ background: 'transparent', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}
            >
              Reset All
            </button>
          </div>

          {/* Departure Time Slots */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Departure Time</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
              {[
                { id: 'ALL', label: 'Any Time' },
                { id: 'MORNING', label: 'Morning (05:00 - 12:00)' },
                { id: 'AFTERNOON', label: 'Afternoon (12:00 - 17:00)' },
                { id: 'EVENING', label: 'Evening (17:00 - 21:00)' },
                { id: 'NIGHT', label: 'Night (21:00 - 05:00)' },
              ].map((slot) => (
                <label key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="timeSlot"
                    checked={departureTimeSlot === slot.id}
                    onChange={() => setDepartureTimeSlot(slot.id)}
                  />
                  <span>{slot.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Price Range */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label">Max Price</label>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Rs. {maxPrice}</span>
            </div>
            <input
              type="range"
              min="500"
              max="3000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>

          {/* Bus Type */}
          {availableBusTypes.length > 0 && (
            <div>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Bus Type</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
                {availableBusTypes.map((type) => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Minimum Rating</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
              {[0, 3, 4, 4.5].map((stars) => (
                <label key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === stars}
                    onChange={() => setMinRating(stars)}
                  />
                  <span>{stars === 0 ? 'All Ratings' : `★ ${stars} & above`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Available Seats Only */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
              />
              <span style={{ fontWeight: 600 }}>Available Seats Only</span>
            </label>
          </div>
        </aside>

        {/* Results Bus Cards List */}
        <div>
          {loading ? (
            <Loading message="Fetching real-time bus schedules..." />
          ) : error ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--danger)', fontWeight: 600 }}>{error}</p>
              <button onClick={fetchSchedules} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                Retry Search
              </button>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <FaBus style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No buses match your criteria</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                We couldn't find active departures for the selected route, date, or filters. Try adjusting your filters or choosing another travel date.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredSchedules.map((schedule) => (
                <BusCard
                  key={schedule.id}
                  schedule={schedule}
                  passengerCount={passengers}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .search-grid {
            grid-template-columns: 1fr !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
          .filter-sidebar {
            display: none !important;
          }
          .filter-sidebar.open {
            display: flex !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            z-index: 999 !important;
            overflow-y: auto !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
