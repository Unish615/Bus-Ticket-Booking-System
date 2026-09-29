import React, { useState, useEffect } from 'react';
import { routeService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AdminNav from '../../components/AdminNav';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { FaRoute, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    distance: '',
    duration: '',
    basePrice: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await routeService.getAll();
      setRoutes(res?.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch routes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (route = null) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        source: route.source,
        destination: route.destination,
        distance: route.distance,
        duration: route.duration,
        basePrice: route.basePrice,
      });
    } else {
      setEditingRoute(null);
      setFormData({
        source: '',
        destination: '',
        distance: '200 km',
        duration: '6 hours',
        basePrice: '1200',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.source.trim() || !formData.destination.trim()) {
      toast.error('Source and destination are required.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingRoute) {
        await routeService.update(editingRoute.id, formData);
        toast.success('Route updated successfully!');
      } else {
        await routeService.create(formData);
        toast.success('Route added successfully!');
      }
      setIsModalOpen(false);
      fetchRoutes();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this route?')) return;
    try {
      await routeService.delete(id);
      toast.success('Route deleted successfully.');
      fetchRoutes();
    } catch (err) {
      toast.error(err.message || 'Failed to delete route. Schedules may be attached.');
    }
  };

  const filteredRoutes = routes.filter((r) =>
    r.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.destination.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Manage Routes</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Configure travel origins, destinations, distances, and base ticket rates
          </p>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <FaPlus /> Add New Route
        </button>
      </div>

      {/* Search Input */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FaSearch style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search routes by source or destination city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ border: 'none', padding: '0.4rem 0' }}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loading message="Loading routes..." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Origin (From)</th>
                  <th>Destination (To)</th>
                  <th>Distance</th>
                  <th>Est. Duration</th>
                  <th>Base Price</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No routes found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRoutes.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 700 }}>{r.source}</td>
                      <td style={{ fontWeight: 700 }}>{r.destination}</td>
                      <td>{r.distance}</td>
                      <td>{r.duration}</td>
                      <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                        Rs. {r.basePrice?.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenModal(r)}
                            className="btn btn-outline btn-sm"
                            title="Edit Route"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="btn btn-danger btn-sm"
                            title="Delete Route"
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

      {/* Add / Edit Route Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoute ? 'Edit Route' : 'Add New Route'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Origin (From) *</label>
              <input
                type="text"
                placeholder="e.g. Kathmandu"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Destination (To) *</label>
              <input
                type="text"
                placeholder="e.g. Pokhara"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Distance</label>
              <input
                type="text"
                placeholder="e.g. 205 km"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Estimated Duration</label>
              <input
                type="text"
                placeholder="e.g. 6 hours"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Base Price (Rs.) *</label>
            <input
              type="number"
              min="100"
              placeholder="e.g. 1200"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
              className="form-input"
              required
            />
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
              {submitting ? 'Saving...' : editingRoute ? 'Update Route' : 'Create Route'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageRoutes;
