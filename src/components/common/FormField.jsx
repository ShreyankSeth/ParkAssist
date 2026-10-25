/**
 * @file FormField.jsx
 * @description Reusable Form Field Wrapper Component in React.
 * Encapsulates label, required badge, child input component, and inline error feedback.
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function FormField({ label, error, required = false, children, helperText, className = '' }) {
  return (
    <div className={`form-field-wrapper ${className}`} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {label && (
        <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span>{label}</span>
          {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}

      {children}

      {error ? (
        <span className="field-error-msg" style={{ fontSize: '0.76rem', fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
          <AlertCircle size={12} /> {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{helperText}</span>
      ) : null}
    </div>
  );
}
