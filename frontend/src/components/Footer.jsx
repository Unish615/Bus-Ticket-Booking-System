import React from 'react';
import { Link } from 'react-router-dom';
import { FaBus, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-surface)',
      borderTop: '1px solid var(--border)',
      marginTop: 'auto',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FaBus />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Yatra<span style={{ color: 'var(--accent)' }}>Bus</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Nepal's premier bus ticketing platform. Book deluxe, AC, and sleeper buses across the country with instant confirmation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaPhoneAlt style={{ color: 'var(--accent)' }} /> +977-1-4455667
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaEnvelope style={{ color: 'var(--accent)' }} /> support@yatrabus.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaMapMarkerAlt style={{ color: 'var(--accent)' }} /> New Buspark, Gongabu, Kathmandu
              </div>
            </div>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Popular Routes
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <Link to="/search?from=Kathmandu&to=Pokhara" style={{ transition: 'color 0.2s' }}>Kathmandu → Pokhara</Link>
              <Link to="/search?from=Pokhara&to=Kathmandu" style={{ transition: 'color 0.2s' }}>Pokhara → Kathmandu</Link>
              <Link to="/search?from=Kathmandu&to=Chitwan" style={{ transition: 'color 0.2s' }}>Kathmandu → Chitwan</Link>
              <Link to="/search?from=Kathmandu&to=Butwal" style={{ transition: 'color 0.2s' }}>Kathmandu → Butwal</Link>
              <Link to="/search?from=Kathmandu&to=Lumbini" style={{ transition: 'color 0.2s' }}>Kathmandu → Lumbini</Link>
              <Link to="/search?from=Kathmandu&to=Dharan" style={{ transition: 'color 0.2s' }}>Kathmandu → Dharan</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <Link to="/search">Find Schedules</Link>
              <Link to="/track">Track Ticket Status</Link>
              <Link to="/my-bookings">My Bookings</Link>
              <Link to="/login">Account Login</Link>
              <Link to="/register">Create Account</Link>
            </div>
          </div>

          {/* Trust & Guarantees */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Why YatraBus
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <FaShieldAlt style={{ color: 'var(--success)', fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: 600 }}>100% Secure Booking</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Direct database seat reservation.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <FaHeadset style={{ color: 'var(--accent)', fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h5 style={{ fontSize: '0.875rem', fontWeight: 600 }}>24/7 Helpline</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assistance anytime before departure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.825rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            © {new Date().getFullYear()} YatraBus System. All rights reserved.
          </div>
          <div>
            Developed by Unish Gautam • React JS + Spring Boot + MySQL
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
