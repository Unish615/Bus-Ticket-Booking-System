import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notificationService } from '../services/api';
import { 
  FaBus, FaMoon, FaSun, FaBars, FaTimes, FaUserCircle, 
  FaBell, FaSignOutAlt, FaTachometerAlt, FaTicketAlt, FaSearch
} from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isOperator, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      notificationService.getAll()
        .then((res) => {
          if (res?.data) {
            const count = res.data.filter((n) => !n.isRead).length;
            setUnreadCount(count);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            <FaBus />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)' }}>
            Yatra<span style={{ color: 'var(--accent)' }}>Bus</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: 600, fontSize: '0.925rem', color: location.pathname === '/' ? 'var(--accent)' : 'var(--text-main)' }}>
            Home
          </Link>
          <Link to="/search" style={{ fontWeight: 600, fontSize: '0.925rem', color: location.pathname === '/search' ? 'var(--accent)' : 'var(--text-main)' }}>
            Find Buses
          </Link>
          <Link to="/track" style={{ fontWeight: 600, fontSize: '0.925rem', color: location.pathname === '/track' ? 'var(--accent)' : 'var(--text-main)' }}>
            Track Ticket
          </Link>

          {isAdmin && (
            <Link to="/admin" className="badge badge-primary" style={{ padding: '0.35rem 0.75rem', textTransform: 'none', fontSize: '0.85rem' }}>
              <FaTachometerAlt /> Admin Panel
            </Link>
          )}

          {isOperator && (
            <Link to="/operator" className="badge badge-warning" style={{ padding: '0.35rem 0.75rem', textTransform: 'none', fontSize: '0.85rem' }}>
              <FaBus /> Operator Hub
            </Link>
          )}
        </div>

        {/* Right Controls: Theme + Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              fontSize: '1rem',
            }}
          >
            {isDark ? <FaSun style={{ color: '#fbbf24' }} /> : <FaMoon />}
          </button>

          {/* User Controls */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', position: 'relative' }}>
              {/* Notification icon */}
              <Link
                to="/notifications"
                title="Notifications"
                style={{
                  position: 'relative',
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border)',
                }}
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    backgroundColor: 'var(--danger)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.45rem 0.85rem',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                  }}
                >
                  <FaUserCircle style={{ fontSize: '1.25rem', color: 'var(--accent)' }} />
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '210px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      zIndex: 200,
                    }}
                  >
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.25rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>

                    <Link
                      to="/my-bookings"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      <FaTicketAlt style={{ color: 'var(--accent)' }} /> My Bookings
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      <FaUserCircle style={{ color: 'var(--accent)' }} /> Profile Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={{
                          padding: '0.55rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        <FaTachometerAlt style={{ color: 'var(--accent)' }} /> Admin Dashboard
                      </Link>
                    )}

                    {isOperator && (
                      <Link
                        to="/operator"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={{
                          padding: '0.55rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        <FaBus style={{ color: 'var(--warning)' }} /> Operator Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'var(--danger)',
                        background: 'transparent',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    >
                      <FaSignOutAlt /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            style={{
              background: 'transparent',
              fontSize: '1.35rem',
              color: 'var(--text-main)',
              display: 'none',
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Home</Link>
          <Link to="/search" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Find Buses</Link>
          <Link to="/track" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Track Ticket</Link>
          {isAuthenticated && (
            <>
              <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>My Bookings</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Profile</Link>
              <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600 }}>Notifications</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--accent)' }}>Admin Panel</Link>}
              {isOperator && <Link to="/operator" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--warning)' }}>Operator Dashboard</Link>}
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ alignSelf: 'flex-start' }}>Log Out</button>
            </>
          )}
        </div>
      )}

      {/* Responsive CSS helper */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
