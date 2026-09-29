import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '500px' }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      zIndex: 1000,
    }}>
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth,
          backgroundColor: 'var(--bg-surface)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'modalFadeIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.75rem',
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '1.2rem',
              display: 'flex',
              padding: '0.25rem',
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Modal;
