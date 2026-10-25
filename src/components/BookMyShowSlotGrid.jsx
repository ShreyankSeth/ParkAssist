/**
 * @file BookMyShowSlotGrid.jsx
 * @description Cinema/BookMyShow-style Parking Slot Matrix Component.
 * - Displays all floors in a single continuous view.
 * - Compact slot boxes (~34px) with ONLY NUMBERS inside.
 * - Alphabetical row indicators (A, B, C, D) at the start of each row.
 * - Central aisle separating Left Bay and Right Bay.
 * - Color rules:
 *    - Green outline: Not booked (Available)
 *    - Light grey: Already booked (Occupied)
 *    - Blue outline: User's booked slot (Occupied by you)
 *    - Amber/Yellow filled: Currently selected
 * - Dedicated EV Floor with fewer slots, ⚡ EV charger indicators, and higher pricing.
 */

import React from 'react';
import { Zap, ShieldCheck, Info } from 'lucide-react';
import './BookMyShowSlotGrid.css';

export default function BookMyShowSlotGrid({
  mall,
  selectedSlot,
  onSelectSlot,
  currentUser,
  activeTicket
}) {
  if (!mall || !mall.floors) return null;

  // Helper: check if a slot is booked by the current logged-in user
  const isBookedByCurrentUser = (slot) => {
    if (!activeTicket || slot.status !== 'booked') return false;
    return activeTicket.slotId === slot.id;
  };

  return (
    <div className="bms-container section-spacer">
      
      {/* BMS Legend Bar */}
      <div className="bms-legend-bar">
        <div className="bms-legend-item">
          <div className="bms-slot-box sample available">01</div>
          <span>Available (Green Outline)</span>
        </div>

        <div className="bms-legend-item">
          <div className="bms-slot-box sample my-slot">02</div>
          <span>Booked By You (Blue Outline)</span>
        </div>

        <div className="bms-legend-item">
          <div className="bms-slot-box sample booked">03</div>
          <span>Already Booked (Light Grey)</span>
        </div>

        <div className="bms-legend-item">
          <span className="ev-legend-icon">⚡</span>
          <span>EV Fast Charger</span>
        </div>
      </div>

      {/* ALL FLOORS RENDERED IN A SINGLE VIEW */}
      <div className="bms-all-floors-wrapper">
        {mall.floors.map((floor) => {
          const isEv = floor.isEvFloor;

          return (
            <div key={floor.code} className={`bms-floor-card ${isEv ? 'ev-floor-theme' : ''}`}>
              
              {/* Floor Header Bar */}
              <div className="bms-floor-header">
                <div className="bms-floor-title-group">
                  <h4 className="bms-floor-name">{floor.name}</h4>
                  {isEv && (
                    <span className="bms-ev-pill">
                      <Zap size={13} /> Dedicated EV Zone • High-Speed Charging
                    </span>
                  )}
                </div>

                <div className="bms-floor-pricing-badge">
                  <span className="price-tag">
                    ₹{floor.baseRate30Min} / 30m
                  </span>
                  <span className="price-sub">
                    {isEv ? '(Higher EV Rate + Power Included)' : '(Standard Rate)'}
                  </span>
                </div>
              </div>

              {/* Floor Rows Container (Rows A, B, C...) */}
              <div className="bms-rows-container">
                {floor.rows.map((row) => (
                  <div key={row.letter} className="bms-row-line">
                    
                    {/* Alphabetical Row Letter at starting */}
                    <div className="bms-row-letter">{row.letter}</div>

                    {/* Left Bay Slots */}
                    <div className="bms-bay left-bay">
                      {row.leftBay.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;
                        const isBooked = slot.status === 'booked';
                        const isMySlot = isBookedByCurrentUser(slot);

                        let stateClass = 'available';
                        if (isSelected) stateClass = 'selected';
                        else if (isMySlot) stateClass = 'my-slot';
                        else if (isBooked) stateClass = 'booked';

                        return (
                          <button
                            key={slot.id}
                            disabled={isBooked}
                            className={`bms-slot-box ${stateClass}`}
                            onClick={() => onSelectSlot(slot)}
                            title={
                              isMySlot
                                ? `Slot ${slot.id}: Reserved by You!`
                                : isBooked
                                ? `Slot ${slot.id}: Already Booked`
                                : `Slot ${slot.id}: Click to Reserve (₹${floor.baseRate30Min}/30m)`
                            }
                          >
                            {/* Inside box: ONLY NUMBERS */}
                            <span className="slot-num">{slot.displayNumber}</span>

                            {/* Mini EV bolt indicator if EV slot */}
                            {slot.hasEvCharger && <span className="mini-ev-bolt">⚡</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Central Aisle / Driveway */}
                    <div className="bms-aisle">
                      <span className="aisle-line"></span>
                    </div>

                    {/* Right Bay Slots */}
                    <div className="bms-bay right-bay">
                      {row.rightBay.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;
                        const isBooked = slot.status === 'booked';
                        const isMySlot = isBookedByCurrentUser(slot);

                        let stateClass = 'available';
                        if (isSelected) stateClass = 'selected';
                        else if (isMySlot) stateClass = 'my-slot';
                        else if (isBooked) stateClass = 'booked';

                        return (
                          <button
                            key={slot.id}
                            disabled={isBooked}
                            className={`bms-slot-box ${stateClass}`}
                            onClick={() => onSelectSlot(slot)}
                            title={
                              isMySlot
                                ? `Slot ${slot.id}: Reserved by You!`
                                : isBooked
                                ? `Slot ${slot.id}: Already Booked`
                                : `Slot ${slot.id}: Click to Reserve (₹${floor.baseRate30Min}/30m)`
                            }
                          >
                            {/* Inside box: ONLY NUMBERS */}
                            <span className="slot-num">{slot.displayNumber}</span>

                            {/* Mini EV bolt indicator if EV slot */}
                            {slot.hasEvCharger && <span className="mini-ev-bolt">⚡</span>}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>

              {/* Way to Elevator / Driveway Indicator */}
              <div className="bms-driveway-indicator">
                <span>◀ DRIVEWAY ENTRY & ELEVATOR ACCESS ▶</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
