/**
 * @file ParkingContext.jsx
 * @description React Context API architecture for Global Parking System State.
 * Manages malls data, real-time slot bookings, single active booking validation,
 * persistence across browser refreshes, and dynamic availability calculations.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_MALLS } from '../data/mallsData';

const ParkingContext = createContext(null);

export const ParkingProvider = ({ children }) => {
  // Map of booked slots across malls: { "mallId_slotId": true }
  const [bookedSlotsMap, setBookedSlotsMap] = useState(() => {
    try {
      const saved = localStorage.getItem('parkassist_booked_slots');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Global Malls state initialized with booked slots mapped
  const [malls, setMalls] = useState(() => {
    try {
      const saved = localStorage.getItem('parkassist_booked_slots');
      const map = saved ? JSON.parse(saved) : {};

      return INITIAL_MALLS.map(m => {
        const updatedFloors = m.floors.map(f => {
          const updatedSlots = f.slots.map(s => {
            const key = `${m.id}_${s.id}`;
            if (map[key]) {
              return { ...s, status: 'booked' };
            }
            return s;
          });

          // Also update rows structure for BookMyShow matrix
          const updatedRows = f.rows.map(row => ({
            ...row,
            leftBay: row.leftBay.map(s => (map[`${m.id}_${s.id}`] ? { ...s, status: 'booked' } : s)),
            rightBay: row.rightBay.map(s => (map[`${m.id}_${s.id}`] ? { ...s, status: 'booked' } : s))
          }));

          return { ...f, slots: updatedSlots, rows: updatedRows };
        });
        return { ...m, floors: updatedFloors };
      });
    } catch {
      return INITIAL_MALLS;
    }
  });

  // Selected Mall (Default: Elante Mall)
  const [selectedMall, setSelectedMall] = useState(INITIAL_MALLS[0]);

  // Active digital parking ticket state
  const [activeTicket, setActiveTicket] = useState(() => {
    try {
      const saved = localStorage.getItem('parkassist_active_ticket');
      if (saved) {
        const ticket = JSON.parse(saved);
        const endTs = ticket.endTimestamp || ticket.expiryTimestamp;
        if (endTs > Date.now()) {
          return ticket;
        } else {
          localStorage.removeItem('parkassist_active_ticket');
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Synchronize selectedMall with updated malls data
  useEffect(() => {
    const updated = malls.find(m => m.id === selectedMall.id);
    if (updated) {
      setSelectedMall(updated);
    }
  }, [malls]);

  // Select Mall handler
  const selectMall = (mall) => {
    const current = malls.find(m => m.id === mall.id) || mall;
    setSelectedMall(current);
  };

  // Complete a booking & persist
  const bookSlot = (confirmedTicket) => {
    // 1. Update active pass
    setActiveTicket(confirmedTicket);
    localStorage.setItem('parkassist_active_ticket', JSON.stringify(confirmedTicket));

    // 2. Update booked slots map in localStorage
    const updatedMap = {
      ...bookedSlotsMap,
      [`${confirmedTicket.mallId}_${confirmedTicket.slotId}`]: true
    };
    setBookedSlotsMap(updatedMap);
    localStorage.setItem('parkassist_booked_slots', JSON.stringify(updatedMap));

    // 3. Update malls matrix state
    const updatedMalls = malls.map(m => {
      if (m.id === confirmedTicket.mallId) {
        const updatedFloors = m.floors.map(f => {
          const updatedSlots = f.slots.map(s => {
            if (s.id === confirmedTicket.slotId) {
              return { ...s, status: 'booked' };
            }
            return s;
          });

          const updatedRows = f.rows.map(row => ({
            ...row,
            leftBay: row.leftBay.map(s => (s.id === confirmedTicket.slotId ? { ...s, status: 'booked' } : s)),
            rightBay: row.rightBay.map(s => (s.id === confirmedTicket.slotId ? { ...s, status: 'booked' } : s))
          }));

          return { ...f, slots: updatedSlots, rows: updatedRows };
        });
        return { ...m, floors: updatedFloors };
      }
      return m;
    });

    setMalls(updatedMalls);
  };

  // Clear Active Ticket
  const clearActiveTicket = () => {
    setActiveTicket(null);
    localStorage.removeItem('parkassist_active_ticket');
  };

  const value = {
    malls,
    selectedMall,
    selectMall,
    activeTicket,
    bookSlot,
    clearActiveTicket,
    bookedSlotsMap
  };

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
