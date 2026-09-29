import React, { useState, useEffect } from 'react';
import { scheduleService, busService, routeService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AdminNav from '../../components/AdminNav';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaClock, FaBus, FaRoute, FaSearch } from 'react-icons/fa';

const ManageSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    travelDate: todayStr,
    departureTime: '07:00:00',
    arrivalTime: '13:00:00',
    price: '1200',
    status: 'ACTIVE',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedRes, busRes, routeRes] = await Promise.all([
        scheduleService.getAll(),
        busService.getAll(),
        routeService.getAll(),
      ]);
      setSchedules(schedRes?.data || []);
      setBuses(busRes?.data || []);
      setRoutes(routeRes?.data || []);

      if (busRes?.data?.length > 0 && routeRes?.data?.length > 0 && !formData.busId) {
        setFormData((prev) => ({
          ...prev,
          busId: busRes.data[0].id,
          routeId: routeRes.data[0].id,
          price: routeRes.data[0].basePrice || '1200',
        }));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch schedule data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        busId: schedule.busId,
        routeId: schedule.routeId,
        travelDate: schedule.travelDate,
        departureTime: schedule.departureTime.length === 5 ? `${schedule.departureTime}:00` : schedule.departureTime,
        arrivalTime: schedule.arrivalTime.length === 5 ? `${schedule.arrivalTime}:00` : schedule.arrivalTime,
        price: schedule.price,
        status: schedule.status,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        busId: buses[0]?.id || '',
        routeId: routes[0]?.id || '',
        travelDate: todayStr,
        departureTime: '07:00:00',
        arrivalTime: '13:00:00',
        price: routes[0]?.basePrice || '1200',
        status: 'ACTIVE',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      // Format time string to HH:mm:ss
      const dep = formData.departureTime.length === 5 ? `${formData.departureTime}:00` : formData.departureTime;
      const arr = formData.arrivalTime.length === 5 ? `${formData.arrivalTime}:00` : formData.arrivalTime;

      const payload = {
        ...formData,
        departureTime: dep,
        arrivalTime: arr,
      };

      if (editingSchedule) {
        await scheduleService.update(editingSchedule.id, payload);
        toast.success('Schedule updated successfully!');
      } else {
        await scheduleService.create(payload);
        toast.success('Schedule created successfully!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await scheduleService.delete(id);
      toast.success('Schedule deleted successfully.');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Cannot delete schedule with active bookings.');
    }
  };

  const filteredSchedules = schedules.filter((s) =>
    s.busName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.travelDate?.includes(searchTerm)
  );

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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Manage Schedules</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Schedule bus departures by connecting Buses, Routes, Dates, and Times
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <FaPlus /> Create Schedule
        </button>
      </div>

      {/* Search Input */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FaSearch style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search schedules by route, bus name, or travel date (YYYY-MM-DD)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ border: 'none', padding: '0.4rem 0' }}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loading message="Loading schedules..." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Bus Assigned</th>
                  <th>Travel Date</th>
                  <th>Times</th>
                  <th>Fare</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No schedules match your search.
                    </td>
                  </tr>
                ) : (
                  filteredSchedules.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 700 }}>
                        {s.source} → {s.destination}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s.busName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.busNumber} • {s.busType}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{s.travelDate}</td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>Dep: <strong>{s.departureTime}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Arr: {s.arrivalTime}</div>
                      </td>
                      <td style={{ fontWeight: 800 }}>Rs. {s.price}</td>
                      <td>
                        <span className={`badge ${s.availableSeats > 5 ? 'badge-success' : s.availableSeats > 0 ? 'badge-warning' : 'badge-danger'}`}>
                          {s.availableSeats} / {s.seatCapacity} left
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${s.status === 'ACTIVE' ? 'badge-primary' : 'badge-secondary'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenModal(s)}
                            className="btn btn-outline btn-sm"
                            title="Edit Schedule"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="btn btn-danger btn-sm"
                            title="Delete Schedule"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Schedule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSchedule ? 'Edit Bus Schedule' : 'Create Bus Schedule'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select Bus *</label>
              <select
                value={formData.busId}
                onChange={(e) => setFormData({ ...formData, busId: Number(e.target.value) })}
                className="form-select"
                required
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.busName} ({b.busNumber} - {b.seatCapacity} seats)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select Route *</label>
              <select
                value={formData.routeId}
                onChange={(e) => {
                  const rId = Number(e.target.value);
                  const selectedR = routes.find((r) => r.id === rId);
                  setFormData({
                    ...formData,
                    routeId: rId,
                    price: selectedR?.basePrice || formData.price,
                  });
                }}
                className="form-select"
                required
              >
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.source} → {r.destination} (Base: Rs. {r.basePrice})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Travel Date *</label>
              <input
                type="date"
                min={todayStr}
                value={formData.travelDate}
                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Fare Price (Rs.) *</label>
              <input
                type="number"
                min="100"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Departure Time *</label>
              <input
                type="time"
                value={formData.departureTime.slice(0, 5)}
                onChange={(e) => setFormData({ ...formData, departureTime: `${e.target.value}:00` })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Arrival Time *</label>
              <input
                type="time"
                value={formData.arrivalTime.slice(0, 5)}
                onChange={(e) => setFormData({ ...formData, arrivalTime: `${e.target.value}:00` })}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Schedule Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-select"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingSchedule ? 'Update Schedule' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageSchedules;
