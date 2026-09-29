import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AdminNav from '../../components/AdminNav';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';
import { FaUsers, FaSearch, FaUserShield, FaToggleOn, FaToggleOff, FaEdit } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const toast = useToast();

  // Role Edit Modal
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [savingRole, setSavingRole] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers();
      setUsers(res?.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.role === 'ROLE_ADMIN') {
      toast.error('Admin accounts cannot be deactivated.');
      return;
    }

    try {
      await adminService.toggleUserStatus(user.id);
      toast.success(`Account ${user.name} status updated.`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to toggle user status');
    }
  };

  const handleRoleChange = async () => {
    if (!editingUser || !newRole) return;
    try {
      setSavingRole(true);
      await adminService.updateUserRole(editingUser.id, newRole);
      toast.success(`Updated role for ${editingUser.name} to ${newRole}`);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update user role');
    } finally {
      setSavingRole(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm);
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem' }}>
      <AdminNav />

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Manage Users</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Overview of registered passenger accounts, operators, and administrators
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
            <FaSearch style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, email, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ border: 'none', padding: '0.4rem 0' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="">All Roles</option>
              <option value="ROLE_USER">USER</option>
              <option value="ROLE_OPERATOR">OPERATOR</option>
              <option value="ROLE_ADMIN">ADMIN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <Loading message="Loading registered accounts..." />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{u.id}</div>
                      </td>
                      <td>
                        <div>{u.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.phone}</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          u.role === 'ROLE_ADMIN'
                            ? 'badge-primary'
                            : u.role === 'ROLE_OPERATOR'
                            ? 'badge-warning'
                            : 'badge-secondary'
                        }`}>
                          {u.role?.replace('ROLE_', '')}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                          {u.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setNewRole(u.role);
                            }}
                            className="btn btn-outline btn-sm"
                            title="Edit User Role"
                          >
                            <FaEdit /> Role
                          </button>

                          {u.role !== 'ROLE_ADMIN' && (
                            <button
                              onClick={() => handleToggleStatus(u)}
                              className={`btn btn-sm ${u.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'}`}
                              title={u.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                            >
                              {u.status === 'ACTIVE' ? <FaToggleOff /> : <FaToggleOn />}
                              {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </button>
                          )}
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

      {/* Role Change Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title={`Change Role: ${editingUser?.name}`}
      >
        {editingUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Current email: <strong>{editingUser.email}</strong>
            </p>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Select System Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="form-select"
              >
                <option value="ROLE_USER">USER (Standard Passenger)</option>
                <option value="ROLE_OPERATOR">OPERATOR (Bus Agency Manager)</option>
                <option value="ROLE_ADMIN">ADMIN (Full System Administrator)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="btn btn-secondary"
                disabled={savingRole}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRoleChange}
                className="btn btn-primary"
                disabled={savingRole}
              >
                {savingRole ? 'Saving...' : 'Save Role'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageUsers;
