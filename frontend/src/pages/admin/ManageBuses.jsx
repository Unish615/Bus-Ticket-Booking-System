import React, { useState, useEffect } from 'react';
import { busService, adminService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AdminNav from '../../components/AdminNav';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { FaBus, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    busName: '',
    busNumber: '',
    operatorId: '',
    busType: 'AC Deluxe',
    seatCapacity: 28,
    amenities: 'WiFi, AC, Charging Port, Water Bottle',
    status: 'ACTIVE',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [busRes, userRes] = await Promise.all([
        busService.getAll(),
        adminService.getUsers(),
      ]);
      setBuses(busRes?.data || []);
      const opList = (userRes?.data || []).filter((u) => u.role === 'ROLE_OPERATOR' || u.role === 'ROLE_ADMIN');
      setOperators(opList);
      if (opList.length > 0 && !formData.operatorId) {
        setFormData((prev) => ({ ...prev, operatorId: opList[0].id }));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch buses data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (bus = null) => {
    if (bus) {
      setEditingBus(bus);
      setFormData({
        busName: bus.busName,
        busNumber: bus.busNumber,
        operatorId: bus.operatorId,
        busType: bus.busType,
        seatCapacity: bus.seatCapacity,
        amenities: bus.amenities || '',
        status: bus.status,
      });
    } else {
      setEditingBus(null);
      setFormData({
        busName: '',
        busNumber: '',
        operatorId: operators[0]?.id || '',
        busType: 'AC Deluxe',
        seatCapacity: 28,
        amenities: 'WiFi, AC, Charging Port, Water Bottle',
        status: 'ACTIVE',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.busName.trim() || !formData.busNumber.trim()) {
      toast.error('Bus name and number are required');
      return;
    }

    try {
      setSubmitting(true);
      if (editingBus) {
        await busService.update(editingBus.id, formData);
        toast.success('Bus updated successfully!');
      } else {
        await busService.create(formData);
        toast.success('New bus added and seat layout generated!');
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
    if (!window.confirm('Are you sure you want to delete this bus?')) return;
    try {
      await busService.delete(id);
      toast.success('Bus deleted successfully.');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete bus. Bus might have active bookings.');
    }
  };

  const filteredBuses = buses.filter((b) =>
    b.busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.operatorName?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Manage Buses</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Add, edit, and configure bus vehicles and seat capacities
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <FaPlus /> Add New Bus
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FaSearch style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by bus name, number, or operator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ border: 'none', padding: '0.4rem 0' }}
          />
        </div>
      </div>

      {/* Buses Table */}
      {loading ? (
        <Loading message="Loading buses fleet..." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Bus Name</th>
                  <th>Bus Number</th>
                  <th>Operator</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuses.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No buses found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredBuses.map((bus) => (
                    <tr key={bus.id}>
                      <td style={{ fontWeight: 700 }}>{bus.busName}</td>
                      <td>
                        <span className="badge badge-secondary">{bus.busNumber}</span>
                      </td>
                      <td>{bus.operatorName}</td>
                      <td>
                        <span className="badge badge-primary">{bus.busType}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{bus.seatCapacity} Seats</td>
                      <td>
                        <span className={`badge ${bus.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                          {bus.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenModal(bus)}
                            className="btn btn-outline btn-sm"
                            title="Edit Bus"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(bus.id)}
                            className="btn btn-danger btn-sm"
                            title="Delete Bus"
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

      {/* Add / Edit Bus Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBus ? 'Edit Bus Vehicle' : 'Add New Bus'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Bus Name *</label>
            <input
              type="text"
              placeholder="e.g. Mountain Deluxe"
              value={formData.busName}
              onChange={(e) => setFormData({ ...formData, busName: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Bus Number / Plate *</label>
              <input
                type="text"
                placeholder="e.g. BA 2 KHA 1001"
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Assigned Operator *</label>
              <select
                value={formData.operatorId}
                onChange={(e) => setFormData({ ...formData, operatorId: Number(e.target.value) })}
                className="form-select"
                required
              >
                {operators.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name} ({op.role.replace('ROLE_', '')})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Bus Type</label>
              <select
                value={formData.busType}
                onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
                className="form-select"
              >
                <option value="AC Deluxe">AC Deluxe</option>
                <option value="Super Deluxe">Super Deluxe</option>
                <option value="Tourist AC">Tourist AC</option>
                <option value="Luxury Sleeper">Luxury Sleeper</option>
                <option value="Standard AC">Standard AC</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Seat Capacity</label>
              <select
                value={formData.seatCapacity}
                onChange={(e) => setFormData({ ...formData, seatCapacity: Number(e.target.value) })}
                className="form-select"
              >
                {[20, 24, 26, 28, 30, 32, 36, 40].map((num) => (
                  <option key={num} value={num}>
                    {num} Seats
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Amenities (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. WiFi, AC, Charging Port, Water Bottle, TV"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Operational Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-select"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="INACTIVE">INACTIVE</option>
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
              {submitting ? 'Saving...' : editingBus ? 'Update Bus' : 'Create Bus & Seats'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageBuses;
