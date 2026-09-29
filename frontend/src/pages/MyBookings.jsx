import React, { useState, useEffect } from 'react';
import { bookingService, reviewService } from '../services/api';
import { useToast } from '../context/ToastContext';
import BookingCard from '../components/BookingCard';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import { FaTicketAlt, FaStar, FaExclamationTriangle, FaCheck } from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('UPCOMING'); // UPCOMING, COMPLETED, CANCELLED
  const toast = useToast();

  // Cancel Modal state
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Review Modal state
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    cleanlinessRating: 5,
    comfortRating: 5,
    serviceRating: 5,
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getMyBookings();
      setBookings(res?.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter((b) => b.bookingStatus === 'CONFIRMED');
  const completedBookings = bookings.filter((b) => b.bookingStatus === 'COMPLETED');
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'CANCELLED');

  const displayedBookings =
    activeTab === 'UPCOMING'
      ? upcomingBookings
      : activeTab === 'COMPLETED'
      ? completedBookings
      : cancelledBookings;

  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel) return;
    try {
      setCancelling(true);
      const res = await bookingService.cancel(selectedBookingForCancel.id);
      toast.success('Booking cancelled successfully. Seats released and refund initiated.');
      setSelectedBookingForCancel(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.message || 'Cancellation failed.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toast.error('Please write a brief comment.');
      return;
    }

    try {
      setSubmittingReview(true);
      await reviewService.create({
        bookingId: selectedBookingForReview.id,
        ...reviewForm,
      });
      toast.success('Review submitted successfully! Thank you.');
      setSelectedBookingForReview(null);
      setReviewForm({ rating: 5, cleanlinessRating: 5, comfortRating: 5, serviceRating: 5, comment: '' });
      fetchBookings();
    } catch (err) {
      toast.error(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>My Bookings</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              View and manage your current trips, completed journeys, and cancellations
            </p>
          </div>
        </div>

        {/* Status Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '2rem',
          paddingBottom: '0.25rem',
        }}>
          {[
            { id: 'UPCOMING', label: `Upcoming Trips (${upcomingBookings.length})` },
            { id: 'COMPLETED', label: `Completed Trips (${completedBookings.length})` },
            { id: 'CANCELLED', label: `Cancelled Trips (${cancelledBookings.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'transparent',
                padding: '0.65rem 1.25rem',
                fontWeight: 700,
                fontSize: '0.925rem',
                borderBottom: activeTab === tab.id ? '3px solid var(--accent)' : '3px solid transparent',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content List */}
        {loading ? (
          <Loading message="Loading your bookings..." />
        ) : displayedBookings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <FaTicketAlt style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              No {activeTab.toLowerCase()} bookings found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {activeTab === 'UPCOMING'
                ? "You don't have any upcoming trips scheduled. Ready for your next journey?"
                : `No ${activeTab.toLowerCase()} trips in your travel history.`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {displayedBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancelClick={(b) => setSelectedBookingForCancel(b)}
                onReviewClick={(b) => setSelectedBookingForReview(b)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={!!selectedBookingForCancel}
        onClose={() => setSelectedBookingForCancel(null)}
        title="Confirm Ticket Cancellation"
      >
        {selectedBookingForCancel && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              backgroundColor: 'var(--warning-bg)',
              color: 'var(--warning)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.9rem',
            }}>
              <FaExclamationTriangle style={{ fontSize: '1.25rem', flexShrink: 0 }} />
              <span>Are you sure you want to cancel ticket <strong>{selectedBookingForCancel.bookingCode}</strong>?</span>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-elevated)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ticket Price:</span>
                <span>Rs. {selectedBookingForCancel.totalAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cancellation Fee:</span>
                <span>Rs. {100 * (selectedBookingForCancel.passengers?.length || 1)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                borderTop: '1px solid var(--border)',
                paddingTop: '0.5rem',
                color: 'var(--success)',
              }}>
                <span>Estimated Refund:</span>
                <span>Rs. {Math.max(0, selectedBookingForCancel.totalAmount - (100 * (selectedBookingForCancel.passengers?.length || 1)))}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Note: Once confirmed, your reserved seats will be released immediately and refunded to your payment method.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedBookingForCancel(null)}
                className="btn btn-secondary"
                disabled={cancelling}
              >
                Never Mind
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="btn btn-danger"
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel & Refund'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Review Submission Modal */}
      <Modal
        isOpen={!!selectedBookingForReview}
        onClose={() => setSelectedBookingForReview(null)}
        title="Rate & Review Your Bus Trip"
      >
        {selectedBookingForReview && (
          <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <p style={{ fontWeight: 700 }}>{selectedBookingForReview.busName} ({selectedBookingForReview.busNumber})</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {selectedBookingForReview.routeSource} → {selectedBookingForReview.routeDestination} • {selectedBookingForReview.travelDate}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Overall Rating (1 - 5)</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="form-select"
                >
                  <option value={5}>★★★★★ (5 - Excellent)</option>
                  <option value={4}>★★★★☆ (4 - Good)</option>
                  <option value={3}>★★★☆☆ (3 - Average)</option>
                  <option value={2}>★★☆☆☆ (2 - Poor)</option>
                  <option value={1}>★☆☆☆☆ (1 - Terrible)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Cleanliness</label>
                <select
                  value={reviewForm.cleanlinessRating}
                  onChange={(e) => setReviewForm({ ...reviewForm, cleanlinessRating: Number(e.target.value) })}
                  className="form-select"
                >
                  <option value={5}>5 - Spotless</option>
                  <option value={4}>4 - Clean</option>
                  <option value={3}>3 - Acceptable</option>
                  <option value={2}>2 - Dusty</option>
                  <option value={1}>1 - Dirty</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Seat Comfort</label>
                <select
                  value={reviewForm.comfortRating}
                  onChange={(e) => setReviewForm({ ...reviewForm, comfortRating: Number(e.target.value) })}
                  className="form-select"
                >
                  <option value={5}>5 - Very Comfy</option>
                  <option value={4}>4 - Comfortable</option>
                  <option value={3}>3 - Moderate</option>
                  <option value={2}>2 - Cramped</option>
                  <option value={1}>1 - Uncomfortable</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Staff & Service</label>
                <select
                  value={reviewForm.serviceRating}
                  onChange={(e) => setReviewForm({ ...reviewForm, serviceRating: Number(e.target.value) })}
                  className="form-select"
                >
                  <option value={5}>5 - Excellent Service</option>
                  <option value={4}>4 - Helpful</option>
                  <option value={3}>3 - Neutral</option>
                  <option value={2}>2 - Slow</option>
                  <option value={1}>1 - Rude</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Written Feedback</label>
              <textarea
                rows={3}
                placeholder="Share details of your journey experience..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="form-textarea"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedBookingForReview(null)}
                className="btn btn-secondary"
                disabled={submittingReview}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingReview}
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default MyBookings;
