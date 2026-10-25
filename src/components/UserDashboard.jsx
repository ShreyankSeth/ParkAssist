/**
 * @file UserDashboard.jsx
 * @description Mini-Project: Live User Parking Dashboard & Booking History.
 * Integrates Context API & Zustand Store (`useParkingStore`) to present user profile,
 * active parking countdown, historical bookings, and spend analytics for academic evaluation.
 */

import React from 'react';
import { X, User, Car, Clock, ShieldCheck, Ticket, Calendar, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import { useParkingStore } from '../store/useParkingStore';
import './UserDashboard.css';

export default function UserDashboard({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { activeTicket } = useParking();
  const bookingHistory = useParkingStore((state) => state.bookingHistory);

  if (!isOpen) return null;

  if (!currentUser) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card dashboard-modal animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
          <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#64748b' }}>
              <User size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>Parking Dashboard</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Please log in or register with your vehicle number to access your parking passes, live timers, and booking history.
            </p>
            <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalSpent = bookingHistory.reduce((acc, b) => acc + (b.amount || b.totalFare || 0), 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card dashboard-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-avatar">
            <User size={24} />
          </div>
          <div>
            <h2 className="modal-title">{currentUser.name} - Parking Dashboard</h2>
            <p className="modal-subtitle">
              <Car size={13} className="inline-icon" /> Registered Vehicle: <strong>{currentUser.carNo}</strong> • {currentUser.mobile}
            </p>
          </div>
        </div>

        {/* Analytics Counter Cards */}
        <div className="dashboard-stats-grid">
          <div className="dash-stat-card">
            <Ticket size={20} className="dash-stat-icon green" />
            <div className="dash-stat-info">
              <span className="dash-stat-val">{activeTicket ? '1 Active' : '0 Active'}</span>
              <span className="dash-stat-lbl">Current Passes</span>
            </div>
          </div>

          <div className="dash-stat-card">
            <History size={20} className="dash-stat-icon blue" />
            <div className="dash-stat-info">
              <span className="dash-stat-val">{bookingHistory.length}</span>
              <span className="dash-stat-lbl">Total Bookings</span>
            </div>
          </div>

          <div className="dash-stat-card">
            <span className="dash-stat-icon amber" style={{ fontSize: '1.3rem', fontWeight: 800 }}>₹</span>
            <div className="dash-stat-info">
              <span className="dash-stat-val">₹{totalSpent}</span>
              <span className="dash-stat-lbl">Total Spent</span>
            </div>
          </div>
        </div>

        {/* Active Booking Spotlight */}
        {activeTicket ? (
          <div className="active-pass-spotlight">
            <div className="spotlight-badge">
              <Clock size={14} /> Active Reservation
            </div>
            <div className="spotlight-body">
              <div>
                <h4 className="spotlight-mall">{activeTicket.mallName}</h4>
                <div className="spotlight-slot">Slot: <strong>{activeTicket.slotId}</strong> ({activeTicket.floorName})</div>
                <div className="spotlight-time">Window: {activeTicket.formattedStartTime || activeTicket.startTime} - {activeTicket.formattedEndTime || activeTicket.endTime}</div>
              </div>
              <div className="spotlight-fare">₹{activeTicket.totalFare}</div>
            </div>
          </div>
        ) : (
          <div className="no-active-pass-banner">
            <ShieldCheck size={18} className="text-green" />
            <span>No active parking session right now. Click any green slot on the map to reserve!</span>
          </div>
        )}

        {/* Booking History Table */}
        <div className="history-section">
          <h4 className="history-heading">Recent Booking History (Zustand Store)</h4>
          <div className="history-table-wrapper">
            {bookingHistory.length === 0 ? (
              <p className="empty-history-text">No previous bookings found.</p>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Pass ID</th>
                    <th>Mall</th>
                    <th>Slot</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingHistory.map((item, idx) => (
                    <tr key={`${item.id || 'hist'}-${idx}`}>
                      <td className="font-mono">{item.id}</td>
                      <td>{item.mallName}</td>
                      <td className="font-bold">{item.slotId}</td>
                      <td>{item.date}</td>
                      <td className="text-green font-bold">₹{item.amount}</td>
                      <td>
                        <span className={`status-pill ${item.status === 'Active' ? 'active' : 'completed'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
