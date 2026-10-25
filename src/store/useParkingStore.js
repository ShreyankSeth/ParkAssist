/**
 * @file useParkingStore.js
 * @description Zustand Store Implementation.
 * Demonstrates modern atomic state management (Intro to Zustand vs Context API) for academic evaluation.
 * Zustand avoids unnecessary component re-renders through selector-based subscriptions:
 * `const history = useParkingStore(state => state.bookingHistory)`
 */

import { create } from 'zustand';

export const useParkingStore = create((set, get) => ({
  // Recent searches state
  recentSearches: ['Elante Mall, Chandigarh', 'CP67 Mall, Mohali'],

  // User booking history log
  bookingHistory: JSON.parse(localStorage.getItem('parkassist_history')) || [
    {
      id: 'PA-842192',
      mallName: 'Elante Mall, Chandigarh',
      slotId: 'B1-A-04',
      date: '2026-10-18',
      amount: 80,
      status: 'Completed'
    },
    {
      id: 'PA-519204',
      mallName: 'CP67 Mall, Mohali',
      slotId: 'EV-A-02',
      date: '2026-10-12',
      amount: 150,
      status: 'Completed'
    }
  ],

  // Actions
  addSearchQuery: (query) =>
    set((state) => {
      const filtered = state.recentSearches.filter((s) => s !== query);
      return { recentSearches: [query, ...filtered].slice(0, 5) };
    }),

  addBookingToHistory: (ticket) =>
    set((state) => {
      const newHistoryItem = {
        id: ticket.ticketId,
        mallName: ticket.mallName,
        slotId: ticket.slotId,
        date: ticket.bookingDate || new Date().toISOString().split('T')[0],
        amount: ticket.totalFare,
        status: 'Active'
      };
      const updatedHistory = [newHistoryItem, ...state.bookingHistory];
      localStorage.setItem('parkassist_history', JSON.stringify(updatedHistory));
      return { bookingHistory: updatedHistory };
    }),

  clearHistory: () => {
    localStorage.removeItem('parkassist_history');
    set({ bookingHistory: [] });
  }
}));
