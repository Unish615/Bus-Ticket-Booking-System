import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/api';
import Loading from '../components/Loading';
import { FaUserCircle, FaSave, FaKey, FaShieldAlt, FaTicketAlt } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setProfileImage(user.profileImage || '');
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const res = await authService.updateProfile({ name, phone, email, profileImage });
      updateUser(res?.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      setUpdatingPassword(true);
      await authService.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Account & Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage your personal information and security credentials
          </p>
        </div>

        {/* Profile Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              overflow: 'hidden',
            }}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <FaUserCircle />
              )}
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user?.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <span className="badge badge-primary">{user?.role?.replace('ROLE_', '')}</span>
                <span className="badge badge-success">{user?.status || 'ACTIVE'}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Profile Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={updatingProfile} className="btn btn-primary">
                <FaSave /> {updatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaKey style={{ color: 'var(--accent)' }} /> Change Account Password
          </h3>

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" disabled={updatingPassword} className="btn btn-secondary">
                <FaShieldAlt /> {updatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
