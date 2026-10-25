/**
 * @file PaymentModal.jsx
 * @description Payment options modal for ParkAssist. Features UPI payment mode using the user-provided
 * Google Pay QR code scanner image (`/assets/gpay-qr.jpg`) and Cash payment option.
 */

import React, { useState } from 'react';
import { X, QrCode, Banknote, ShieldCheck, CheckCircle2, Smartphone } from 'lucide-react';
import './PaymentModal.css';

export default function PaymentModal({ isOpen, onClose, bookingDetails, onPaymentSuccess }) {
  if (!isOpen || !bookingDetails) return null;

  // Selected Payment Mode: 'upi' or 'cash'
  const [paymentMode, setPaymentMode] = useState('upi');
  
  // Payment processing state simulation
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Confirm booking & payment handler
  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);

      const confirmedTicket = {
        ...bookingDetails,
        ticketId: `PA-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentMode: paymentMode,
        paymentStatus: paymentMode === 'upi' ? 'PAID ONLINE (UPI)' : 'PAY AT EXIT (CASH)',
        bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expiryTimestamp: Date.now() + bookingDetails.durationMins * 60 * 1000
      };

      setTimeout(() => {
        onPaymentSuccess(confirmedTicket);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card payment-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <div className="badge-green">
            <ShieldCheck size={14} /> Secure Checkout
          </div>
          <h2 className="modal-title">Complete Payment</h2>
          <p className="modal-subtitle">
            Pay ₹{bookingDetails.totalFare} for Slot {bookingDetails.slotId} ({bookingDetails.durationMins} mins)
          </p>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="payment-mode-tabs">
          
          {/* UPI Mode Button */}
          <button 
            type="button"
            className={`mode-btn ${paymentMode === 'upi' ? 'active' : ''}`}
            onClick={() => setPaymentMode('upi')}
          >
            <QrCode size={20} />
            <span>UPI / GPay QR</span>
          </button>

          {/* Cash Mode Button */}
          <button 
            type="button"
            className={`mode-btn ${paymentMode === 'cash' ? 'active' : ''}`}
            onClick={() => setPaymentMode('cash')}
          >
            <Banknote size={20} />
            <span>Pay Cash at Exit</span>
          </button>

        </div>

        {/* PAYMENT CONTENT BODY */}
        <div className="payment-body">
          
          {/* UPI PAYMENT OPTION: Displays User-Provided Google Pay QR Code */}
          {paymentMode === 'upi' && (
            <div className="upi-payment-container animate-fade-in">
              <div className="qr-frame">
                <img 
                  src="/assets/gpay-qr.jpg" 
                  alt="ParkAssist Google Pay UPI QR Scanner Code" 
                  className="upi-qr-image"
                />
              </div>

              <div className="upi-instruction">
                <Smartphone size={16} className="text-green inline-icon" />
                <span>Scan using any UPI App (GPay, PhonePe, Paytm) to pay <strong>₹{bookingDetails.totalFare}</strong></span>
              </div>
            </div>
          )}

          {/* CASH PAYMENT OPTION */}
          {paymentMode === 'cash' && (
            <div className="cash-payment-container animate-fade-in">
              <div className="cash-icon-box">
                <Banknote size={40} className="text-green" />
              </div>
              <h4 className="cash-title">Pay ₹{bookingDetails.totalFare} in Cash at Exit</h4>
              <p className="cash-desc">
                Your parking slot is reserved immediately for car number <strong>{bookingDetails.carNo}</strong>. Show your digital parking pass at entrance and pay in cash when leaving the exit.
              </p>
            </div>
          )}

        </div>

        {/* Confirmation Button */}
        <div className="payment-actions">
          <button 
            className="btn-primary auth-submit-btn" 
            onClick={handleConfirmPayment}
            disabled={isProcessing || paymentDone}
          >
            {isProcessing ? (
              <span>Verifying & Confirming Slot...</span>
            ) : paymentDone ? (
              <span><CheckCircle2 size={18} /> Booking Confirmed!</span>
            ) : (
              <span>Confirm & Get Parking Pass</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
