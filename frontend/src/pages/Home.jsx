import React from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import { 
  FaShieldAlt, FaClock, FaPercent, FaBus, FaMobileAlt, 
  FaStar, FaRoute, FaArrowRight, FaTicketAlt, FaCheckCircle 
} from 'react-icons/fa';

const POPULAR_ROUTES = [
  { from: 'Kathmandu', to: 'Pokhara', duration: '6 hrs', price: 'Rs. 1,200', image: '🏔️' },
  { from: 'Kathmandu', to: 'Chitwan', duration: '5 hrs', price: 'Rs. 950', image: '🦏' },
  { from: 'Kathmandu', to: 'Lumbini', duration: '9 hrs', price: 'Rs. 1,600', image: '☸️' },
  { from: 'Kathmandu', to: 'Butwal', duration: '8 hrs', price: 'Rs. 1,400', image: '🌳' },
  { from: 'Pokhara', to: 'Kathmandu', duration: '6 hrs', price: 'Rs. 1,200', image: '🏙️' },
  { from: 'Kathmandu', to: 'Dharan', duration: '11 hrs', price: 'Rs. 1,900', image: '🌄' },
];

const POPULAR_DESTINATIONS = [
  { name: 'Pokhara', tag: 'City of Lakes', desc: 'Phewa Lake, Annapurna Views & Adventure', icon: '🛶' },
  { name: 'Chitwan', tag: 'Wildlife Safari', desc: 'National Park, Rhinos, Jungle Safari', icon: '🐘' },
  { name: 'Lumbini', tag: 'Birthplace of Buddha', desc: 'Peace Pagoda, Maya Devi Temple & Monasteries', icon: '🕊️' },
  { name: 'Kathmandu', tag: 'Cultural Capital', desc: 'Historic Temples, Durbar Squares & Nightlife', icon: '⛩️' },
];

const Home = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(59,130,246,0.02) 100%)',
        padding: '4rem 0 3rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container">
          <div style={{ maxWidth: '750px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
            <span className="badge badge-primary" style={{ marginBottom: '1rem', padding: '0.4rem 0.85rem' }}>
              🚌 Nepal's Trusted Smart Bus Booking Platform
            </span>
            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
              color: 'var(--text-main)',
            }}>
              Book Your Bus Journey <span style={{ color: 'var(--accent)' }}>Easily</span>
            </h1>
            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
            }}>
              Search, select your seat and book your bus ticket in just a few steps. Instant QR ticket confirmation & verified operators.
            </p>
          </div>

          {/* Large Search Box */}
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Offers & Discount Banner */}
      <section className="container">
        <div style={{
          background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 2.5rem',
          color: '#ffffff',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div>
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              FESTIVAL PROMO
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem' }}>
              Save up to 15% on Advance Bookings!
            </h3>
            <p style={{ opacity: 0.9, fontSize: '0.925rem', marginTop: '0.25rem' }}>
              Use promo code <strong>YATRA2026</strong> during checkout on selected AC Deluxe routes.
            </p>
          </div>
          <Link
            to="/search?from=Kathmandu&to=Pokhara"
            className="btn"
            style={{
              backgroundColor: '#ffffff',
              color: '#1e3a8a',
              fontWeight: 700,
              padding: '0.75rem 1.5rem',
            }}
          >
            Explore Routes <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>TOP JOURNEYS</span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Popular Bus Routes
            </h2>
          </div>
          <Link to="/search" style={{ color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            View all schedules <FaArrowRight />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}>
          {POPULAR_ROUTES.map((route, i) => (
            <Link
              key={i}
              to={`/search?from=${route.from}&to=${route.to}`}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>{route.image}</span>
                <span className="badge badge-secondary">{route.duration}</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {route.from} → {route.to}
              </h3>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border)',
                paddingTop: '0.75rem',
                marginTop: 'auto',
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Starting from</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent)' }}>
                  {route.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ backgroundColor: 'var(--bg-elevated)', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>SIMPLE PROCESS</span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>How YatraBus Works</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Booking your travel takes less than 2 minutes.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
          }}>
            {[
              { step: '01', title: 'Search Buses', desc: 'Select your origin, destination, travel date, and number of passengers.' },
              { step: '02', title: 'Choose Seats', desc: 'Pick your preferred window or aisle seats on our live interactive seat layout.' },
              { step: '03', title: 'Quick Checkout', desc: 'Enter passenger details and pay securely via eSewa, Khalti, or Cards.' },
              { step: '04', title: 'Instant QR Ticket', desc: 'Receive your verified digital ticket with QR code ready for boarding.' },
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <span style={{
                  fontSize: '3rem',
                  fontWeight: 900,
                  color: 'var(--accent-ring)',
                  position: 'absolute',
                  top: '0.5rem',
                  right: '1rem',
                  lineHeight: 1,
                }}>
                  {item.step}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="container">
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>EXPLORE NEPAL</span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Popular Destinations</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          {POPULAR_DESTINATIONS.map((d, i) => (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '2.5rem' }}>{d.icon}</div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {d.tag}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{d.name}</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{d.desc}</p>
              <Link
                to={`/search?to=${d.name}`}
                className="btn btn-outline btn-sm"
                style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
              >
                Find Buses to {d.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container">
        <div className="card" style={{
          padding: '3rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Why Travel With Us?</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Built for reliability, safety, and modern convenience across Nepal.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                <FaCheckCircle />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Zero Double Booking</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Real-time transactional seat reservation ensures that once you select your seat, it is uniquely yours.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                <FaShieldAlt />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Transparent Refunds</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Clear cancellation policies with automatic refund calculation directly back to your account.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'var(--warning-bg)',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                <FaStar />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Verified Passenger Reviews</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Read authentic ratings on bus cleanliness, comfort, and punctuality submitted only by travellers who completed the ride.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'var(--info-bg)',
                color: 'var(--info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                <FaTicketAlt />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Live Ticket Tracking</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Track your bus journey progress from boarding to arrival using your booking code.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
