/**
 * @file TextInput.jsx
 * @description Reusable Text Input Component supporting left icons, right elements,
 * uppercase formatting, and automatic validation error border highlighting.
 */

import React from 'react';

export default function TextInput({
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  icon: Icon,
  rightElement,
  uppercase = false,
  maxLength,
  disabled = false,
  className = ''
}) {
  return (
    <div className="input-icon-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
      {Icon && (
        <Icon
          className="input-icon"
          size={18}
          style={{ position: 'absolute', left: '0.85rem', color: 'var(--text-muted)', pointerEvents: 'none' }}
        />
      )}

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        maxLength={maxLength}
        style={{
          width: '100%',
          padding: `0.75rem 0.85rem 0.75rem ${Icon ? '2.6rem' : '0.85rem'}`,
          paddingRight: rightElement ? '2.5rem' : '0.85rem',
          border: error ? '1.5px solid #ef4444' : '1.5px solid var(--border-light)',
          backgroundColor: error ? '#fff5f5' : 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.92rem',
          color: 'var(--text-main)',
          outline: 'none',
          textTransform: uppercase ? 'uppercase' : 'none',
          letterSpacing: uppercase ? '0.05em' : 'normal',
          fontWeight: uppercase ? 600 : 400,
          transition: 'var(--transition-fast)'
        }}
        className={`form-input ${error ? 'invalid' : ''} ${className}`}
      />

      {rightElement && (
        <div style={{ position: 'absolute', right: '0.75rem', display: 'flex', alignItems: 'center' }}>
          {rightElement}
        </div>
      )}
    </div>
  );
}
