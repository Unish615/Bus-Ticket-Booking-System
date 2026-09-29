import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, FaBus, FaRoute, FaCalendarAlt, 
  FaTicketAlt, FaUsers, FaChartBar 
} from 'react-icons/fa';

const AdminNav = () => {
  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt />, end: true },
    { to: '/admin/buses', label: 'Buses', icon: <FaBus /> },
    { to: '/admin/routes', label: 'Routes', icon: <FaRoute /> },
    { to: '/admin/schedules', label: 'Schedules', icon: <FaCalendarAlt /> },
    { to: '/admin/bookings', label: 'Bookings', icon: <FaTicketAlt /> },
    { to: '/admin/users', label: 'Users', icon: <FaUsers /> },
    { to: '/admin/reports', label: 'Reports', icon: <FaChartBar /> },
  ];

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '0.5rem',
      marginBottom: '2rem',
      overflowX: 'auto',
    }}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          style={({ isActive }) => ({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.875rem',
            color: isActive ? '#ffffff' : 'var(--text-muted)',
            backgroundColor: isActive ? 'var(--accent)' : 'transparent',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          })}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </div>
  );
};

export default AdminNav;
