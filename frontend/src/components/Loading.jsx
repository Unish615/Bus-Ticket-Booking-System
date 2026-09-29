import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Loading = ({ message = 'Loading details...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      gap: '1rem',
      color: 'var(--text-muted)',
    }}>
      <FaSpinner style={{
        fontSize: '2.5rem',
        color: 'var(--accent)',
        animation: 'spin 1s linear infinite',
      }} />
      <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{message}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
