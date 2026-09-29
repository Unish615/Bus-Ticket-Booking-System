import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminNav from '../../components/AdminNav';
import Loading from '../../components/Loading';
import { 
  FaUsers, FaBus, FaTicketAlt, FaCalendarDay, FaMoneyBillWave, 
  FaBan, FaChartLine, FaChartPie, FaRoute 
} from 'react-icons/fa';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      setStats(res?.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Compiling analytics & dashboard statistics..." />;
  if (error || !stats) {
    return (
      <div className="container" style={{ padding: '2rem 1.25rem' }}>
        <AdminNav />
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 600 }}>{error || 'Could not load data'}</p>
          <button onClick={fetchStats} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: <FaUsers />, color: 'var(--accent)', bg: 'var(--accent-light)' },
    { title: 'Total Buses', value: stats.totalBuses, icon: <FaBus />, color: '#0284c7', bg: '#f0f9ff' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: <FaTicketAlt />, color: '#8b5cf6', bg: '#f5f3ff' },
    { title: "Today's Bookings", value: stats.todayBookings, icon: <FaCalendarDay />, color: '#10b981', bg: '#ecfdf5' },
    { title: 'Total Revenue', value: `Rs. ${stats.totalRevenue?.toLocaleString()}`, icon: <FaMoneyBillWave />, color: '#16a34a', bg: '#f0fdf4' },
    { title: 'Cancelled Bookings', value: stats.cancelledBookings, icon: <FaBan />, color: '#ef4444', bg: '#fef2f2' },
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem' }}>
      <AdminNav />

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Admin Operations Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time metrics, revenue performance, and fleet occupancy analytics
        </p>
      </div>

      {/* 6 Key Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        {statCards.map((c, i) => (
          <div key={i} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {c.title}
              </span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: c.bg,
                color: c.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}>
                {c.icon}
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '2rem',
      }}>
        {/* Monthly Bookings Bar Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaChartLine style={{ color: 'var(--accent)' }} /> Monthly Bookings
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <BarChart data={stats.monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis allowDecimals={false} stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
                <Bar dataKey="bookings" name="Tickets Booked" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue Line Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaMoneyBillWave style={{ color: '#10b981' }} /> Monthly Revenue (Rs.)
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <LineChart data={stats.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  formatter={(val) => `Rs. ${val.toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (Rs.)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Routes Bar Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaRoute style={{ color: '#8b5cf6' }} /> Top Popular Routes
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <BarChart data={stats.popularRoutes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" allowDecimals={false} stroke="var(--text-muted)" fontSize={12} />
                <YAxis dataKey="route" type="category" width={160} stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
                <Bar dataKey="bookings" name="Bookings" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Distribution Pie Chart */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaChartPie style={{ color: '#f59e0b' }} /> Booking Status Breakdown
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={stats.statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.statusDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
