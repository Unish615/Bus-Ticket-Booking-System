import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminNav from '../../components/AdminNav';
import Loading from '../../components/Loading';
import { FaChartBar, FaFileDownload, FaMoneyBillWave, FaBus, FaCalendarAlt } from 'react-icons/fa';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardStats()
      .then((res) => setStats(res?.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
    if (!stats || !stats.monthlyBookings) return;
    let csv = 'Month,Bookings,Revenue (Rs.)\n';
    stats.monthlyBookings.forEach((b, i) => {
      const rev = stats.monthlyRevenue[i]?.revenue || 0;
      csv += `${b.month},${b.bookings},${rev}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yatrabus-monthly-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <Loading message="Generating performance reports..." />;

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem' }}>
      <AdminNav />

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Financial & Operations Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Historical sales logs, route volume breakdown, and revenue exports
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn btn-primary">
          <FaFileDownload /> Export CSV Summary
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Monthly Summary Breakdown Table */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Monthly Performance Ledger
          </h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Billing Month</th>
                  <th>Total Tickets</th>
                  <th style={{ textAlign: 'right' }}>Gross Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats?.monthlyBookings?.map((item, idx) => {
                  const rev = stats.monthlyRevenue[idx]?.revenue || 0;
                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700 }}>{item.month}</td>
                      <td>{item.bookings} tickets</td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--success)' }}>
                        Rs. {rev.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Routes Volume Table */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Route Performance
          </h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Route Corridor</th>
                  <th style={{ textAlign: 'right' }}>Passenger Bookings</th>
                </tr>
              </thead>
              <tbody>
                {stats?.popularRoutes?.map((r, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{r.route}</td>
                    <td style={{ textAlign: 'right', fontWeight: 800 }}>
                      <span className="badge badge-primary">{r.bookings} Trips</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
