import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api';
import { useToast } from '../context/ToastContext';
import Loading from '../components/Loading';
import { FaBell, FaCheckDouble, FaCircle, FaCalendarAlt } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getAll();
      setNotifications(res?.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      toast.error('Could not mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read.');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Notifications</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Stay updated on trip confirmations, schedules, and alerts
            </p>
          </div>

          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="btn btn-outline btn-sm">
              <FaCheckDouble /> Mark All Read
            </button>
          )}
        </div>

        {loading ? (
          <Loading message="Loading notifications..." />
        ) : notifications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <FaBell style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No notifications yet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              You'll receive alerts here when your bookings are confirmed or trip statuses update.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.25rem',
                  backgroundColor: n.isRead ? 'var(--bg-surface)' : 'var(--accent-light)',
                  borderLeft: n.isRead ? '1px solid var(--border)' : '4px solid var(--accent)',
                  cursor: n.isRead ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: n.isRead ? 'var(--bg-elevated)' : 'var(--accent)',
                  color: n.isRead ? 'var(--text-muted)' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  <FaBell style={{ fontSize: '0.9rem' }} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: n.isRead ? 600 : 800 }}>
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>
                        <FaCircle style={{ fontSize: '0.5rem' }} /> New
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '0.25rem' }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
