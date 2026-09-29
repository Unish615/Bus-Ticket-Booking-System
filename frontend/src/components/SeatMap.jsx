import React from 'react';
import { FaCheck, FaLock, FaUser } from 'react-icons/fa';
import { GiSteeringWheel } from 'react-icons/gi';
import { MdEventSeat } from 'react-icons/md';

const SeatMap = ({
  seatCapacity = 28,
  bookedSeats = [],
  selectedSeats = [],
  onSeatSelect,
  maxSelectable = 1,
  ticketPrice = 1200,
  serviceFee = 50,
  onContinue
}) => {
  // Generate rows A, B, C, D... with 4 columns per row (col 1, 2 on left, col 3, 4 on right, aisle in middle)
  const rows = [];
  const totalRows = Math.ceil(seatCapacity / 4);
  let seatCounter = 0;

  for (let r = 0; r < totalRows; r++) {
    const rowLetter = String.fromCharCode(65 + r);
    const rowSeats = [];
    for (let c = 1; c <= 4; c++) {
      if (seatCounter < seatCapacity) {
        rowSeats.push(`${rowLetter}${c}`);
        seatCounter++;
      } else {
        rowSeats.push(null);
      }
    }
    rows.push({ letter: rowLetter, seats: rowSeats });
  }

  const handleSeatClick = (seatCode) => {
    if (!seatCode) return;
    if (bookedSeats.includes(seatCode)) return; // prevent clicking booked seats

    if (selectedSeats.includes(seatCode)) {
      onSeatSelect(selectedSeats.filter((s) => s !== seatCode));
    } else {
      if (selectedSeats.length >= maxSelectable) {
        // Replace first selected if at capacity or alert
        if (maxSelectable === 1) {
          onSeatSelect([seatCode]);
        } else {
          // Keep existing and replace oldest or just ignore
          onSeatSelect([...selectedSeats.slice(1), seatCode]);
        }
      } else {
        onSeatSelect([...selectedSeats, seatCode]);
      }
    }
  };

  const seatsCost = selectedSeats.length * ticketPrice;
  const calculatedTotal = selectedSeats.length > 0 ? seatsCost + serviceFee : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
      {/* Bus Seat Grid Visual */}
      <div
        className="card"
        style={{
          border: '2px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          backgroundColor: 'var(--bg-surface)',
          maxWidth: '380px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Front of Bus indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem',
          borderBottom: '2px dashed var(--border)',
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            FRONT OF BUS
          </div>
          <div
            title="Driver Cabin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--bg-elevated)',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
            }}
          >
            <GiSteeringWheel style={{ fontSize: '1.2rem', color: 'var(--accent)' }} /> DRIVER
          </div>
        </div>

        {/* Seat Rows Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {rows.map((row) => (
            <div
              key={row.letter}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 28px 1fr 1fr',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {/* Left Seat 1 */}
              {renderSeatButton(row.seats[0])}

              {/* Left Seat 2 */}
              {renderSeatButton(row.seats[1])}

              {/* Central Aisle */}
              <div style={{
                textAlign: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
              }}>
                {row.letter}
              </div>

              {/* Right Seat 3 */}
              {renderSeatButton(row.seats[2])}

              {/* Right Seat 4 */}
              {renderSeatButton(row.seats[3])}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border)',
          fontSize: '0.75rem',
          fontWeight: 600,
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }} />
            <span>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: 'var(--accent)' }} />
            <span>Selected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: '#94a3b8' }} />
            <span>Booked</span>
          </div>
        </div>
      </div>

      {/* Seat Selection Summary Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Fare Summary</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Selected Seats:</span>
            <span style={{ fontWeight: 700 }}>
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Passengers Count:</span>
            <span style={{ fontWeight: 700 }}>
              {selectedSeats.length} / {maxSelectable}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Ticket Price:</span>
            <span>
              Rs. {ticketPrice.toLocaleString()} × {selectedSeats.length} = <strong>Rs. {seatsCost.toLocaleString()}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Service Fee:</span>
            <span>Rs. {selectedSeats.length > 0 ? serviceFee : 0}</span>
          </div>

          <div style={{
            borderTop: '2px solid var(--border)',
            paddingTop: '0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total Payable:</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)' }}>
              Rs. {calculatedTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {selectedSeats.length !== maxSelectable && (
          <div style={{
            backgroundColor: 'var(--warning-bg)',
            color: 'var(--warning)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.825rem',
            fontWeight: 600,
          }}>
            Please select exactly {maxSelectable} {maxSelectable === 1 ? 'seat' : 'seats'} to continue.
          </div>
        )}

        <button
          onClick={onContinue}
          disabled={selectedSeats.length !== maxSelectable}
          className="btn btn-primary"
          style={{
            padding: '0.85rem',
            fontSize: '1rem',
            width: '100%',
            opacity: selectedSeats.length === maxSelectable ? 1 : 0.6,
            cursor: selectedSeats.length === maxSelectable ? 'pointer' : 'not-allowed',
          }}
        >
          Continue to Passenger Details
        </button>
      </div>
    </div>
  );

  function renderSeatButton(seatCode) {
    if (!seatCode) {
      return <div style={{ height: '36px' }} />;
    }

    const isBooked = bookedSeats.includes(seatCode);
    const isSelected = selectedSeats.includes(seatCode);

    let bgColor = 'var(--bg-elevated)';
    let borderColor = 'var(--border)';
    let textColor = 'var(--text-main)';

    if (isBooked) {
      bgColor = '#94a3b8';
      borderColor = '#94a3b8';
      textColor = '#ffffff';
    } else if (isSelected) {
      bgColor = 'var(--accent)';
      borderColor = 'var(--accent)';
      textColor = '#ffffff';
    }

    return (
      <button
        key={seatCode}
        type="button"
        disabled={isBooked}
        onClick={() => handleSeatClick(seatCode)}
        title={isBooked ? `Seat ${seatCode} (Already Booked)` : `Seat ${seatCode}`}
        style={{
          height: '38px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: bgColor,
          border: `1.5px solid ${borderColor}`,
          color: textColor,
          fontWeight: 700,
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          transition: 'all 0.15s ease',
          transform: isSelected ? 'scale(1.06)' : 'none',
          cursor: isBooked ? 'not-allowed' : 'pointer',
        }}
      >
        {isBooked ? <FaLock style={{ fontSize: '0.65rem' }} /> : isSelected ? <FaCheck style={{ fontSize: '0.7rem' }} /> : null}
        {seatCode}
      </button>
    );
  }
};

export default SeatMap;
