/**
 * @file SlotBookingModal.jsx
 * @description Slot booking configuration modal featuring a clock-style scrollable/select time picker
 * with Hour (1-12), Minute (00-55), and AM/PM options. Enforces minimum 30-minute booking duration.
 */

import React, { useState, useEffect } from 'react';
import { X, Clock, ShieldCheck, ArrowRight, MapPin, Calendar, AlertCircle } from 'lucide-react';
import './SlotBookingModal.css';

export default function SlotBookingModal({ 
  isOpen, 
  onClose, 
  slot, 
  mall, 
  currentUser, 
  onProceedToPayment 
}) {
  if (!isOpen || !slot || !mall) return null;

  // Helper to format Date object to YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Clock picker states: Hour (1-12), Minute (00-55 step 5), AM/PM
  const [bookingDate, setBookingDate] = useState(getTodayString());

  // Initial time defaults (e.g. Current Time for Start, +1 Hour for End)
  const [startHour, setStartHour] = useState('01');
  const [startMin, setStartMin] = useState('00');
  const [startAmpm, setStartAmpm] = useState('PM');

  const [endHour, setEndHour] = useState('02');
  const [endMin, setEndMin] = useState('00');
  const [endAmpm, setEndAmpm] = useState('PM');

  // Calculated duration & time validation error state
  const [durationMins, setDurationMins] = useState(60);
  const [timeError, setTimeError] = useState('');

  // Auto-initialize start time to current time on open
  useEffect(() => {
    const d = new Date();
    let h = d.getHours();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    const m = Math.ceil(d.getMinutes() / 5) * 5;
    const formattedM = (m >= 60 ? 0 : m).toString().padStart(2, '0');
    const formattedH = h.toString().padStart(2, '0');

    setStartHour(formattedH);
    setStartMin(formattedM);
    setStartAmpm(ampm);

    // End time default +1 hour
    const endH = (h % 12) + 1;
    const endH12 = endH.toString().padStart(2, '0');
    setEndHour(endH12);
    setEndMin(formattedM);
    setEndAmpm(h === 11 ? (ampm === 'AM' ? 'PM' : 'AM') : ampm);
  }, [isOpen]);

  // Convert 12-hr (Hour, Min, AM/PM) to total minutes from midnight
  const getMinutesFromMidnight = (hStr, mStr, ampmStr) => {
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (ampmStr === 'PM' && h < 12) h += 12;
    if (ampmStr === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  // Convert 12-hr to 24-hr HH:MM string
  const to24HourString = (hStr, mStr, ampmStr) => {
    let h = parseInt(hStr, 10);
    if (ampmStr === 'PM' && h < 12) h += 12;
    if (ampmStr === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${mStr}`;
  };

  // Format display string e.g. "01:00 PM"
  const toDisplayString = (hStr, mStr, ampmStr) => `${hStr}:${mStr} ${ampmStr}`;

  // Recalculate duration & validate 30-minute minimum rule
  useEffect(() => {
    const startMins = getMinutesFromMidnight(startHour, startMin, startAmpm);
    const endMins = getMinutesFromMidnight(endHour, endMin, endAmpm);

    let diff = endMins - startMins;

    if (diff <= 0) {
      setTimeError('End time must be after Start time');
      setDurationMins(0);
      return;
    }

    setDurationMins(diff);

    // Enforce 30-minute minimum booking duration
    if (diff < 30) {
      setTimeError(`Minimum booking duration must be at least 30 minutes (Current: ${diff} mins). E.g., ${toDisplayString(startHour, startMin, startAmpm)} to ${toDisplayString(startHour, (parseInt(startMin, 10)+30)%60, startAmpm)}`);
    } else {
      setTimeError('');
    }
  }, [startHour, startMin, startAmpm, endHour, endMin, endAmpm]);

  // Calculate total fare based on computed duration
  const calculateTotalFare = (mins) => {
    const base = slot.baseRate30Min || mall.baseRate30Min || 30;
    const hourly = slot.hourlyRate || mall.hourlyRate || 50;
    if (mins <= 30) return base;
    const extraHours = Math.ceil((mins - 30) / 60);
    return base + (extraHours * hourly);
  };

  const totalFare = calculateTotalFare(durationMins);
  const baseRateToUse = slot.baseRate30Min || mall.baseRate30Min || 30;

  // Submit handler
  const handleProceed = (e) => {
    e.preventDefault();

    if (durationMins < 30 || timeError) return;

    const start24 = to24HourString(startHour, startMin, startAmpm);
    const end24 = to24HourString(endHour, endMin, endAmpm);

    const startDateTimeStr = `${bookingDate}T${start24}:00`;
    const endDateTimeStr = `${bookingDate}T${end24}:00`;

    const carNo = currentUser?.carNo || 'CH01AB1234';

    const bookingDetails = {
      slotId: slot.id,
      floorName: slot.floor,
      isEV: Boolean(slot.isEV),
      chargerType: slot.chargerType || null,
      mallName: mall.name,
      mallId: mall.id,
      bookingDate: bookingDate,
      startTime: start24,
      endTime: end24,
      formattedStartTime: toDisplayString(startHour, startMin, startAmpm),
      formattedEndTime: toDisplayString(endHour, endMin, endAmpm),
      startTimestamp: new Date(startDateTimeStr).getTime(),
      endTimestamp: new Date(endDateTimeStr).getTime(),
      durationMins: durationMins,
      carNo: carNo.toUpperCase(),
      totalFare: totalFare,
      timestamp: new Date().toISOString()
    };

    onProceedToPayment(bookingDetails);
  };

  // Generate options arrays for clock drop-downs
  const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card booking-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="badge-green">
            <ShieldCheck size={14} /> {slot.isEV ? '⚡ EV Fast Charging Bay' : 'Slot Reservation'}
          </div>
          <h2 className="modal-title">Book Parking Slot {slot.id}</h2>
          <p className="modal-subtitle">
            <MapPin size={14} className="inline-icon" /> {mall.name} • {slot.floor} {slot.isEV ? '• ⚡ 60kW DC Fast' : ''}
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleProceed} className="booking-form" noValidate>
          
          {/* Date Selector */}
          <div className="form-group">
            <label className="form-label">Select Booking Date</label>
            <div className="input-icon-wrapper">
              <Calendar className="input-icon" size={18} />
              <input 
                type="date" 
                className="form-input"
                min={getTodayString()}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>
          </div>

          {/* USER-FRIENDLY CLOCK-STYLE TIME PICKER WITH AM/PM */}
          <div className="form-group">
            <label className="form-label flex-between">
              <span>Clock Time Slot Picker</span>
              <span className="text-green font-bold"><Clock size={14} /> Min 30 minutes</span>
            </label>

            {/* START TIME CLOCK PICKER */}
            <div className="clock-picker-box">
              <span className="clock-label">From (Start Time):</span>
              <div className="clock-select-row">
                <select className="clock-select" value={startHour} onChange={(e) => setStartHour(e.target.value)}>
                  {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span className="clock-colon">:</span>
                <select className="clock-select" value={startMin} onChange={(e) => setStartMin(e.target.value)}>
                  {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select className="clock-select ampm" value={startAmpm} onChange={(e) => setStartAmpm(e.target.value)}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* END TIME CLOCK PICKER */}
            <div className="clock-picker-box">
              <span className="clock-label">To (End Time):</span>
              <div className="clock-select-row">
                <select className="clock-select" value={endHour} onChange={(e) => setEndHour(e.target.value)}>
                  {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span className="clock-colon">:</span>
                <select className="clock-select" value={endMin} onChange={(e) => setEndMin(e.target.value)}>
                  {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select className="clock-select ampm" value={endAmpm} onChange={(e) => setEndAmpm(e.target.value)}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Time Slot Validation Error Message */}
            {timeError ? (
              <div className="time-error-banner animate-fade-in">
                <AlertCircle size={15} />
                <span>{timeError}</span>
              </div>
            ) : (
              <div className="time-success-hint">
                Selected Window: <strong>{toDisplayString(startHour, startMin, startAmpm)}</strong> to <strong>{toDisplayString(endHour, endMin, endAmpm)}</strong> ({durationMins} Mins)
              </div>
            )}
          </div>

          {/* Fare Summary Breakdown */}
          <div className="fare-summary-card">
            <div className="fare-row">
              <span>Base Fare (First 30 Mins){slot.isEV ? ' [EV Fast Charger]' : ''}</span>
              <span>₹{baseRateToUse}</span>
            </div>
            {durationMins > 30 && (
              <div className="fare-row">
                <span>Additional Duration ({durationMins - 30} Mins @ ₹{slot.hourlyRate || mall.hourlyRate || 50}/hr)</span>
                <span>+ ₹{totalFare - baseRateToUse}</span>
              </div>
            )}
            <div className="fare-row total">
              <span>Total Payable Amount</span>
              <span className="total-amount">₹{totalFare}</span>
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            className="btn-primary auth-submit-btn"
            disabled={!!timeError || durationMins < 30}
          >
            Proceed to Payment
            <ArrowRight size={18} />
          </button>

        </form>

      </div>
    </div>
  );
}
