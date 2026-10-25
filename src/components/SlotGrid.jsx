/**
 * @file SlotGrid.jsx
 * @description Visual parking slot layout matrix. Highlights slots booked by the current user
 * as "Occupied By You" with a glowing cyan-emerald badge, while standard booked slots show "Occupied".
 */

import React from 'react';
import { Car, Zap, Accessibility, ShieldCheck, Lock, UserCheck } from 'lucide-react';
import './SlotGrid.css';

export default function SlotGrid({ floor, selectedSlot, onSelectSlot, currentUser, activeTicket }) {
  if (!floor || !floor.slots) return null;

  // Determine if a slot is booked by the currently logged-in user
  const isBookedByCurrentUser = (slot) => {
    if (!activeTicket || slot.status !== 'booked') return false;
    return activeTicket.slotId === slot.id && activeTicket.floorName.includes(floor.code);
  };

  return (
    <div className="slot-grid-container section-spacer">
      
      {/* Grid Header & Legend */}
      <div className="grid-header-row">
        <div>
          <h3 className="grid-title">{floor.name} Parking Map</h3>
          <p className="grid-subtitle">Select any green available slot to reserve your parking spot.</p>
        </div>

        {/* Status Legend */}
        <div className="slot-legend">
          <div className="legend-item">
            <span className="legend-dot green"></span> Available
          </div>
          <div className="legend-item">
            <span className="legend-dot cyan-glowing"></span> Occupied By You
          </div>
          <div className="legend-item">
            <span className="legend-dot red"></span> Occupied
          </div>
          <div className="legend-item">
            <span className="legend-dot blue"></span> Selected
          </div>
        </div>
      </div>

      {/* PARKING SLOTS GRID */}
      <div className="parking-matrix">
        {floor.slots.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id;
          const isBooked = slot.status === 'booked';
          const isMySlot = isBookedByCurrentUser(slot);

          return (
            <button
              key={slot.id}
              disabled={isBooked}
              className={`slot-card ${isMySlot ? 'my-occupied-slot' : isBooked ? 'booked' : 'available'} ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectSlot(slot)}
              title={isMySlot ? `Slot ${slot.id} - Reserved by You!` : isBooked ? `Slot ${slot.id} is occupied` : `Click to book Slot ${slot.id}`}
            >
              {/* Slot Header ID */}
              <div className="slot-top-bar">
                <span className="slot-code">{slot.id}</span>
                {slot.type === 'EV Charging' && <Zap size={14} className="slot-badge-icon ev" title="EV Charging Available" />}
                {slot.type === 'Handicapped' && <Accessibility size={14} className="slot-badge-icon handi" title="Accessible Parking" />}
              </div>

              {/* Slot Visual Icon */}
              <div className="slot-icon-center">
                {isMySlot ? (
                  <div className="car-my-slot-icon">
                    <Car size={26} />
                  </div>
                ) : isBooked ? (
                  <div className="car-occupied-icon">
                    <Car size={26} />
                  </div>
                ) : (
                  <div className="slot-vacant-indicator">
                    <Car size={24} />
                  </div>
                )}
              </div>

              {/* Slot Bottom Status */}
              <div className="slot-footer">
                {isMySlot ? (
                  <span className="status-text my-slot"><UserCheck size={10} /> Occupied By You</span>
                ) : isBooked ? (
                  <span className="status-text occupied"><Lock size={10} /> Occupied</span>
                ) : isSelected ? (
                  <span className="status-text selected">Selected</span>
                ) : (
                  <span className="status-text open">Reserve</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
