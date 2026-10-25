/**
 * @file ActiveTimerPass.jsx
 * @description Active Digital Parking Ticket Pass component. Displays ticket details,
 * start time anchored countdown clock (HH:MM:SS), and triggers a 10-minute warning toast notification.
 */

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldCheck, Car, QrCode, Ticket, CalendarCheck } from 'lucide-react';
import './ActiveTimerPass.css';

export default function ActiveTimerPass({ ticket }) {
  if (!ticket) return null;

  const now = Date.now();
  const startTs = ticket.startTimestamp || (ticket.expiryTimestamp ? ticket.expiryTimestamp - (ticket.durationMins * 60 * 1000) : now);
  const endTs = ticket.endTimestamp || ticket.expiryTimestamp || (now + (ticket.durationMins * 60 * 1000));

  const isScheduled = now < startTs;

  // Time remaining state in seconds
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    const target = isScheduled ? startTs : endTs;
    return Math.max(0, Math.floor((target - Date.now()) / 1000));
  });

  // Ticking interval timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const currentNow = Date.now();
      const currentIsScheduled = currentNow < startTs;
      const target = currentIsScheduled ? startTs : endTs;
      const remaining = Math.max(0, Math.floor((target - currentNow) / 1000));
      setSecondsRemaining(remaining);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [startTs, endTs, isScheduled]);

  // Format seconds to HH:MM:SS
  const formatTime = (secs) => {
    const safeSecs = Math.max(0, isNaN(secs) ? 0 : Math.floor(secs));
    const hours = Math.floor(safeSecs / 3600);
    const minutes = Math.floor((safeSecs % 3600) / 60);
    const seconds = safeSecs % 60;
    
    return {
      h: hours.toString().padStart(2, '0'),
      m: minutes.toString().padStart(2, '0'),
      s: seconds.toString().padStart(2, '0')
    };
  };

  const { h, m, s } = formatTime(secondsRemaining);
  const is10MinWarning = !isScheduled && secondsRemaining > 0 && secondsRemaining <= 600; // 10 minutes left

  return (
    <div className="active-ticket-section section-spacer animate-fade-in" id="active-ticket-section">
      
      {/* SCHEDULED START NOTIFICATION BANNER */}
      {isScheduled && (
        <div className="scheduled-notice-banner animate-fade-in">
          <div className="scheduled-icon-bg">
            <CalendarCheck size={22} />
          </div>
          <div className="scheduled-content">
            <h4 className="scheduled-title">📅 Parking Booking Scheduled</h4>
            <p className="scheduled-text">
              Your reservation for <strong>{ticket.slotId}</strong> starts at <strong>{ticket.formattedStartTime || ticket.startTime}</strong> on {ticket.bookingDate || 'Today'}. The parking countdown will start when your Start Time begins.
            </p>
          </div>
        </div>
      )}

      {/* 10-MINUTE EXPIRY WARNING NOTIFICATION BANNER */}
      {is10MinWarning && (
        <div className="expiry-warning-banner animate-fade-in">
          <div className="warning-icon-bg">
            <AlertTriangle size={24} className="warning-pulse" />
          </div>
          <div className="warning-content">
            <h4 className="warning-title">⚠️ Attention: Only {Math.ceil(secondsRemaining / 60)} minutes remaining!</h4>
            <p className="warning-text">
              Your parking slot reservation for <strong>{ticket.slotId}</strong> at {ticket.mallName} will expire shortly. Please prepare to exit or extend your booking.
            </p>
          </div>
        </div>
      )}

      {/* TICKET PASS CONTAINER */}
      <div className="ticket-card-frame">
        
        {/* Ticket Top Header */}
        <div className="ticket-header">
          <div className="ticket-brand">
            <Ticket size={20} className="text-green" />
            <span className="ticket-title">Digital Parking Pass</span>
          </div>
          <span className="ticket-id">{ticket.ticketId}</span>
        </div>

        <div className="ticket-grid-body">
          
          {/* LEFT: Ticket Details */}
          <div className="ticket-details-left">
            
            <div className="ticket-mall-title">
              <h3>{ticket.mallName}</h3>
              <span className="badge-green">
                <ShieldCheck size={12} /> {ticket.paymentStatus}
              </span>
            </div>

            <div className="ticket-info-grid">
              
              <div className="info-block">
                <span className="info-label">Assigned Slot</span>
                <span className="info-value slot-highlight">{ticket.slotId}</span>
              </div>

              <div className="info-block">
                <span className="info-label">Vehicle Car No.</span>
                <span className="info-value car-highlight"><Car size={16} /> {ticket.carNo}</span>
              </div>

              <div className="info-block">
                <span className="info-label">Reserved Time Window</span>
                <span className="info-value">
                  {ticket.formattedStartTime || ticket.startTime} - {ticket.formattedEndTime || ticket.endTime}
                </span>
              </div>

              <div className="info-block">
                <span className="info-label">Duration</span>
                <span className="info-value">{ticket.durationMins} Minutes</span>
              </div>

            </div>

          </div>

          {/* RIGHT: Live Ticking Countdown Timer */}
          <div className="ticket-timer-right">
            
            <div className="timer-header-label">
              <Clock size={16} className="text-green" /> 
              {isScheduled ? 'Countdown to Booking Start' : 'Time Remaining'}
            </div>

            {/* LIVE COUNTDOWN DISPLAY */}
            <div className={`countdown-box ${is10MinWarning ? 'warning' : ''} ${isScheduled ? 'scheduled' : ''}`}>
              <div className="time-unit">
                <span className="time-num">{h}</span>
                <span className="time-lbl">HOURS</span>
              </div>
              <span className="time-colon">:</span>
              <div className="time-unit">
                <span className="time-num">{m}</span>
                <span className="time-lbl">MINS</span>
              </div>
              <span className="time-colon">:</span>
              <div className="time-unit">
                <span className="time-num">{s}</span>
                <span className="time-lbl">SECS</span>
              </div>
            </div>

            {/* QR Pass Code */}
            <div className="pass-qr-stub">
              <QrCode size={36} className="qr-stub-icon" />
              <span className="stub-label">Present Pass at Entrance</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
