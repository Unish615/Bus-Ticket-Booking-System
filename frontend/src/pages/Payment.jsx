import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  FaShieldAlt, FaCreditCard, FaMoneyBillWave, FaCheckCircle, 
  FaArrowLeft, FaSpinner, FaLock, FaMobileAlt 
} from 'react-icons/fa';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const bookingState = location.state;

  useEffect(() => {
    if (!bookingState || !bookingState.passengers || bookingState.passengers.length === 0) {
      navigate('/search');
    }
  }, [bookingState, navigate]);

  if (!bookingState) return null;

  const { schedule, selectedSeats, passengers, ticketPrice, serviceFee, totalAmount } = bookingState;

  const [paymentMethod, setPaymentMethod] = useState('eSewa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mockAccount, setMockAccount] = useState('9841000000');
  const [mockOtp, setMockOtp] = useState('123456');

  // Card fields
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  const handlePayNow = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate realistic payment gateway handshake delay (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const payload = {
        scheduleId: schedule.id,
        passengers: passengers.map((p) => ({
          seatNumber: p.seatNumber,
          passengerName: p.passengerName,
          age: parseInt(p.age, 10),
          gender: p.gender,
          phone: p.phone,
          email: p.email,
        })),
        paymentMethod: paymentMethod,
      };

      const response = await bookingService.create(payload);
      const confirmedBooking = response?.data;

      toast.success('Payment successful! Your booking is confirmed.');
      navigate(`/confirmation/${confirmedBooking.bookingCode}`, {
        state: { booking: confirmedBooking },
      });
    } catch (err) {
      toast.error(err.message || 'Payment or booking reservation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline btn-sm"
        style={{ marginBottom: '1.5rem' }}
        disabled={isProcessing}
      >
        <FaArrowLeft /> Back to Passenger Details
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start',
      }}>
        {/* Payment Methods Selection */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Choose Payment Method</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Select your preferred gateway. This is a simulated test environment (no real funds deducted).
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* eSewa */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: paymentMethod === 'eSewa' ? 'var(--accent-light)' : 'var(--bg-surface)',
                border: `2px solid ${paymentMethod === 'eSewa' ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'eSewa'}
                  onChange={() => setPaymentMethod('eSewa')}
                />
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#16a34a' }}>eSewa Mobile Wallet</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay instantly using eSewa credentials</p>
                </div>
              </div>
              <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>POPULAR</span>
            </label>

            {/* Khalti */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: paymentMethod === 'Khalti' ? 'var(--accent-light)' : 'var(--bg-surface)',
                border: `2px solid ${paymentMethod === 'Khalti' ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Khalti'}
                  onChange={() => setPaymentMethod('Khalti')}
                />
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#9333ea' }}>Khalti Digital Wallet</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant payment with Khalti PIN / OTP</p>
                </div>
              </div>
              <span className="badge" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>FAST</span>
            </label>

            {/* Debit / Credit Card */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: paymentMethod === 'Card' ? 'var(--accent-light)' : 'var(--bg-surface)',
                border: `2px solid ${paymentMethod === 'Card' ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                />
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Visa / Mastercard / SCT</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Debit or Credit Card simulation</p>
                </div>
              </div>
              <FaCreditCard style={{ color: 'var(--accent)', fontSize: '1.25rem' }} />
            </label>

            {/* Cash at Counter */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: paymentMethod === 'Cash' ? 'var(--accent-light)' : 'var(--bg-surface)',
                border: `2px solid ${paymentMethod === 'Cash' ? 'var(--accent)' : 'var(--border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash'}
                  onChange={() => setPaymentMethod('Cash')}
                />
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cash at Counter</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay at bus park counter before boarding</p>
                </div>
              </div>
              <FaMoneyBillWave style={{ color: 'var(--success)', fontSize: '1.25rem' }} />
            </label>
          </div>

          {/* Simulated Gateway Fields Card */}
          <div className="card" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <FaLock style={{ color: 'var(--success)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Simulated {paymentMethod} Gateway
              </span>
            </div>

            {(paymentMethod === 'eSewa' || paymentMethod === 'Khalti') && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{paymentMethod} ID / Mobile</label>
                  <input
                    type="text"
                    value={mockAccount}
                    onChange={(e) => setMockAccount(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Mock OTP / PIN</label>
                  <input
                    type="password"
                    value={mockOtp}
                    onChange={(e) => setMockOtp(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'Cash' && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Your ticket will be reserved as confirmed. Please arrive at the station at least 30 minutes prior to departure to pay at the counter.
              </p>
            )}
          </div>
        </div>

        {/* Booking Summary Box */}
        <div className="card" style={{ position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Booking Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                {schedule.source} → {schedule.destination}
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div><strong>Bus:</strong> {schedule.busName} ({schedule.busNumber})</div>
              <div><strong>Date:</strong> {schedule.travelDate} at {schedule.departureTime}</div>
              <div><strong>Seats:</strong> {selectedSeats.join(', ')} ({passengers.length} {passengers.length === 1 ? 'Seat' : 'Seats'})</div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ticket Price:</span>
                <span>Rs. {ticketPrice} × {selectedSeats.length} = <strong>Rs. {(ticketPrice * selectedSeats.length).toLocaleString()}</strong></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Service Fee:</span>
                <span>Rs. {serviceFee}</span>
              </div>
            </div>

            <div style={{
              borderTop: '2px solid var(--border)',
              paddingTop: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total Payable:</span>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent)' }}>
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="btn btn-primary"
              style={{
                marginTop: '1rem',
                padding: '0.9rem',
                fontSize: '1rem',
                width: '100%',
              }}
            >
              {isProcessing ? (
                <>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> Processing Payment...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Pay Rs. {totalAmount.toLocaleString()} Now
                </>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              <FaShieldAlt style={{ color: 'var(--success)' }} /> Safe & Encrypted 256-Bit SSL Checkout
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Payment;
