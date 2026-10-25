/**
 * @file AuthModal.jsx
 * @description Authentication modal providing Sign-Up and Login functionality with field-specific validations,
 * +91 Indian mobile validation, alphanumeric car plate validation (max 13 chars), and direct password auto-fill.
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, User, Phone, Car, Lock, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, authPromptMsg }) {
  // Mode: 'login' or 'signup'
  const [authMode, setAuthMode] = useState('signup');

  // Form input states
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    carNo: '',
    password: '',
    rememberPassword: true
  });

  // Per-field error messages
  const [fieldErrors, setFieldErrors] = useState({});
  // General feedback messages
  const [generalError, setGeneralError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Track mouse down target to prevent modal close when dragging text selection outside card
  const mouseDownTargetRef = useRef(null);

  // Load auto-filled saved account details on open / tab switch
  useEffect(() => {
    setFieldErrors({});
    setGeneralError('');
    setSuccessMsg('');

    // Direct password auto-fill if a saved account exists
    const savedAccountRaw = localStorage.getItem('parkassist_saved_remembered_account') || localStorage.getItem('parkassist_user');
    if (savedAccountRaw) {
      try {
        const savedAccount = JSON.parse(savedAccountRaw);
        if (authMode === 'login' && savedAccount) {
          setFormData(prev => ({
            ...prev,
            name: savedAccount.name || '',
            carNo: savedAccount.carNo || '',
            password: savedAccount.password || ''
          }));
        }
      } catch (err) {}
    }
  }, [isOpen, authMode]);

  if (!isOpen) return null;

  // Real-time field validation logic
  const validateField = (name, value) => {
    let error = '';

    // 1. Full Name Validation (Letters & spaces only)
    if (name === 'name') {
      if (!value.trim()) {
        error = 'Full name is required';
      } else if (!/^[A-Za-z\s]+$/.test(value.trim())) {
        error = 'Name can only contain letters and spaces (no numbers or symbols)';
      }
    }

    // 2. Mobile Number Validation (+91 Real Indian Mobile: Starts with 6-9, 10 digits)
    if (name === 'mobile') {
      const cleanMob = value.trim().replace(/^\+91/, '').replace(/\s+/g, '');
      if (!cleanMob) {
        error = 'Mobile number is required';
      } else if (!/^[6-9]\d{9}$/.test(cleanMob)) {
        error = 'Invalid Indian mobile number (+91). Must start with 6, 7, 8, or 9 and be a valid 10-digit number.';
      }
    }

    // 3. Car Plate Number Validation (Alphanumeric, state code + numbers, 4 to 13 chars)
    if (name === 'carNo') {
      const cleanCar = value.trim().replace(/\s+/g, '').toUpperCase();
      if (!cleanCar) {
        error = 'Car plate number is required';
      } else if (cleanCar.length > 13) {
        error = 'Car number length should be at most 13 characters';
      } else if (!/^(?=.*[A-Z])(?=.*\d)[A-Z0-9-]{4,13}$/.test(cleanCar)) {
        error = 'Car number is not valid. Must be alphanumeric containing state code & numbers (e.g. CH01AB1234, max 13 chars).';
      }
    }

    // 4. Password Validation (Min 4 chars)
    if (name === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 4) {
        error = 'Password must be at least 4 characters';
      }
    }

    return error;
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    setGeneralError('');

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Retrieve all registered accounts from localStorage
  const getRegisteredAccounts = () => {
    const raw = localStorage.getItem('parkassist_registered_accounts');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMsg('');

    const errors = {};

    if (authMode === 'signup') {
      // Validate Sign-Up fields
      const nameErr = validateField('name', formData.name);
      if (nameErr) errors.name = nameErr;

      const mobileErr = validateField('mobile', formData.mobile);
      if (mobileErr) errors.mobile = mobileErr;

      const carNoErr = validateField('carNo', formData.carNo);
      if (carNoErr) errors.carNo = carNoErr;

      const passwordErr = validateField('password', formData.password);
      if (passwordErr) errors.password = passwordErr;

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      // Check duplicate accounts
      const accounts = getRegisteredAccounts();
      const cleanMob = formData.mobile.trim().replace(/^\+91/, '').replace(/\s+/g, '');
      const formattedCarNo = formData.carNo.trim().replace(/\s+/g, '').toUpperCase();

      const existing = accounts.find(acc => 
        acc.mobile === cleanMob || acc.carNo === formattedCarNo
      );

      if (existing) {
        setGeneralError('An account with this Mobile Number or Car Number already exists. Please login.');
        return;
      }

      // Create new account profile
      const newAccount = {
        name: formData.name.trim(),
        mobile: `+91 ${cleanMob}`,
        carNo: formattedCarNo,
        password: formData.password
      };

      const updatedAccounts = [...accounts, newAccount];
      localStorage.setItem('parkassist_registered_accounts', JSON.stringify(updatedAccounts));
      localStorage.setItem('parkassist_user', JSON.stringify(newAccount));

      if (formData.rememberPassword) {
        localStorage.setItem('parkassist_saved_remembered_account', JSON.stringify(newAccount));
      }

      setSuccessMsg('Account created successfully! Logging you in...');
      
      setTimeout(() => {
        onAuthSuccess(newAccount);
        onClose();
      }, 900);

    } else {
      // Validate Login fields (Name, Car Number, Password)
      const nameErr = validateField('name', formData.name);
      if (nameErr) errors.name = nameErr;

      const carNoErr = validateField('carNo', formData.carNo);
      if (carNoErr) errors.carNo = carNoErr;

      const passwordErr = validateField('password', formData.password);
      if (passwordErr) errors.password = passwordErr;

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      // Strict Authentication matching against registered accounts
      const accounts = getRegisteredAccounts();
      const searchName = formData.name.trim().toLowerCase();
      const searchCarNo = formData.carNo.trim().replace(/\s+/g, '').toUpperCase();

      const matchedAccount = accounts.find(acc => 
        acc.name.toLowerCase() === searchName &&
        acc.carNo.replace(/\s+/g, '').toUpperCase() === searchCarNo &&
        acc.password === formData.password
      );

      // Check single saved user fallback
      const savedUserRaw = localStorage.getItem('parkassist_user');
      let fallbackMatch = null;
      if (savedUserRaw) {
        try {
          const u = JSON.parse(savedUserRaw);
          if (
            u.name.toLowerCase() === searchName &&
            u.carNo.replace(/\s+/g, '').toUpperCase() === searchCarNo &&
            u.password === formData.password
          ) {
            fallbackMatch = u;
          }
        } catch (err) {}
      }

      const validUser = matchedAccount || fallbackMatch;

      if (validUser) {
        localStorage.setItem('parkassist_user', JSON.stringify(validUser));
        setSuccessMsg('Login successful! Welcome back.');
        setTimeout(() => {
          onAuthSuccess(validUser);
          onClose();
        }, 800);
      } else {
        // EXACT ERROR TEXT AS REQUESTED
        setGeneralError('Invalid Credentials: The Name or Password is not valid.');
      }
    }
  };

  // Backdrop click handler that prevents accidental close when dragging text selection outside card
  const handleBackdropMouseDown = (e) => {
    mouseDownTargetRef.current = e.target;
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && mouseDownTargetRef.current === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onMouseDown={handleBackdropMouseDown}
      onClick={handleBackdropClick}
    >
      <div className="modal-card animate-fade-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-badge">ParkAssist Account</div>
          <h2 className="modal-title">
            {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="modal-subtitle">
            {authPromptMsg 
              ? authPromptMsg 
              : authMode === 'signup' 
                ? 'Sign up to quickly book mall parking slots online.' 
                : 'Enter your registered credentials to access your parking passes.'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="auth-tab-group">
          <button 
            type="button"
            className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
            onClick={() => { setAuthMode('signup'); setFieldErrors({}); setGeneralError(''); }}
          >
            Sign-Up
          </button>
          <button 
            type="button"
            className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => { setAuthMode('login'); setFieldErrors({}); setGeneralError(''); }}
          >
            Login
          </button>
        </div>

        {/* Feedback Banners */}
        {generalError && (
          <div className="feedback-banner error">
            <AlertCircle size={16} />
            <span>{generalError}</span>
          </div>
        )}
        {successMsg && (
          <div className="feedback-banner success">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrapper">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                name="name" 
                className={`form-input ${fieldErrors.name ? 'invalid' : ''}`}
                placeholder="e.g. Rahul Sharma" 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {fieldErrors.name && (
              <span className="field-error-msg"><AlertCircle size={12} /> {fieldErrors.name}</span>
            )}
          </div>

          {/* Sign-Up specific fields */}
          {authMode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div className="input-icon-wrapper mobile-prefix-wrapper">
                <span className="country-prefix">+91</span>
                <input 
                  type="tel" 
                  name="mobile" 
                  className={`form-input mobile-with-prefix ${fieldErrors.mobile ? 'invalid' : ''}`}
                  placeholder="e.g. 9998887776" 
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
              {fieldErrors.mobile && (
                <span className="field-error-msg"><AlertCircle size={12} /> {fieldErrors.mobile}</span>
              )}
            </div>
          )}

          {/* Car Vehicle Number (Max 13 chars) */}
          <div className="form-group">
            <label className="form-label">Car Vehicle Number</label>
            <div className="input-icon-wrapper">
              <Car className="input-icon" size={18} />
              <input 
                type="text" 
                name="carNo" 
                className={`form-input uppercase-input ${fieldErrors.carNo ? 'invalid' : ''}`}
                placeholder="e.g. CH01AB1234" 
                maxLength={13}
                value={formData.carNo}
                onChange={handleChange}
              />
            </div>
            {fieldErrors.carNo && (
              <span className="field-error-msg"><AlertCircle size={12} /> {fieldErrors.carNo}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Password</label>
            
            <div className="input-icon-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password" 
                className={`form-input ${fieldErrors.password ? 'invalid' : ''}`}
                placeholder="Enter password" 
                value={formData.password}
                onChange={handleChange}
              />

              <button 
                type="button" 
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {fieldErrors.password && (
              <span className="field-error-msg"><AlertCircle size={12} /> {fieldErrors.password}</span>
            )}
          </div>

          {/* Remember Password Checkbox during Sign-Up */}
          {authMode === 'signup' && (
            <div className="remember-checkbox-row">
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  name="rememberPassword"
                  checked={formData.rememberPassword}
                  onChange={handleChange}
                />
                <span>Auto-save password for quick revisit login</span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn-primary auth-submit-btn">
            {authMode === 'signup' ? 'Complete Sign-Up' : 'Login to ParkAssist'}
            <ArrowRight size={18} />
          </button>

        </form>

      </div>
    </div>
  );
}
