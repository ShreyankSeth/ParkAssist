/**
 * @file App.jsx
 * @description Main application container for ParkAssist Smart Automated Parking System.
 * Fully integrated with:
 *  1. React Context API (AuthContext, ParkingContext, CartContext)
 *  2. Zustand Store (useParkingStore)
 *  3. Async State lifecycle handlers
 *  4. Mini-Projects: Add-on Shopping Cart & User Analytics Dashboard
 *  5. Reusable form components & validation
 *  6. BookMyShow Single-View Parking Matrix with dedicated EV Floor.
 */

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import HeroSearch from './components/HeroSearch';
import HowItWorks from './components/HowItWorks';
import MallDetails from './components/MallDetails';
import SlotBookingModal from './components/SlotBookingModal';
import PaymentModal from './components/PaymentModal';
import ActiveTimerPass from './components/ActiveTimerPass';
import UserDashboard from './components/UserDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ParkingProvider, useParking } from './context/ParkingContext';
import { CartProvider } from './context/CartContext';
import { useParkingStore } from './store/useParkingStore';
import { Car, AlertCircle, X } from 'lucide-react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './App.css';

function MainParkAssistApp() {
  const { currentUser, setCurrentUser, logoutUser } = useAuth();
  const { malls, selectedMall, selectMall, activeTicket, bookSlot, clearActiveTicket } = useParking();
  const addBookingToHistory = useParkingStore((state) => state.addBookingToHistory);

  // Active floor index for overview tab (if needed)
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptMsg, setAuthPromptMsg] = useState('');

  // Booking modal & payment modal states
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [pendingBookingDetails, setPendingBookingDetails] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Dashboard modal state
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);

  // Single active booking error alert state
  const [singleBookingAlert, setSingleBookingAlert] = useState('');

  // Handle user sign-out: Clears user session, active pass, and selected slot states
  const handleLogout = () => {
    logoutUser();
    clearActiveTicket();
    setSelectedSlot(null);
    setSingleBookingAlert('');
  };

  // Handle slot selection with Auth Guard & Single Active Booking Guard
  const handleSelectSlot = (slot) => {
    if (!currentUser) {
      setAuthPromptMsg('Please login or sign up to book a parking slot.');
      setIsAuthModalOpen(true);
      return;
    }

    if (activeTicket && (activeTicket.endTimestamp || activeTicket.expiryTimestamp) > Date.now()) {
      setSingleBookingAlert(
        `You already have an active parking booking (Slot ${activeTicket.slotId} at ${activeTicket.mallName}). Each account can only book one parking spot at a time.`
      );
      return;
    }

    setSingleBookingAlert('');
    setSelectedSlot(slot);
    setIsBookingModalOpen(true);
  };

  // Handle proceeding from booking modal to payment
  const handleProceedToPayment = (bookingDetails) => {
    setPendingBookingDetails(bookingDetails);
    setIsBookingModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  // Handle successful payment confirmation
  const handlePaymentSuccess = (confirmedTicket) => {
    bookSlot(confirmedTicket);
    addBookingToHistory(confirmedTicket);
    setSelectedSlot(null);

    setTimeout(() => {
      const el = document.getElementById('active-ticket-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <div className="app-container">
      
      {/* 1. Header Navbar */}
      <Navbar 
        currentUser={currentUser}
        onOpenAuth={() => { setAuthPromptMsg(''); setIsAuthModalOpen(true); }}
        onLogout={handleLogout}
        onOpenDashboard={() => setIsDashboardModalOpen(true)}
      />

      {/* SINGLE ACTIVE BOOKING ALERT POPUP */}
      {singleBookingAlert && (
        <div className="single-booking-alert-banner section-spacer animate-fade-in">
          <div className="alert-content">
            <AlertCircle size={20} className="text-amber" />
            <span>{singleBookingAlert}</span>
          </div>
          <button className="alert-close-btn" onClick={() => setSingleBookingAlert('')}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. Hero Search Section with Autocomplete Search */}
      <HeroSearch 
        malls={malls}
        selectedMall={selectedMall}
        onSelectMall={(mall) => {
          selectMall(mall);
          setActiveFloorIndex(0);
          setSelectedSlot(null);
        }}
      />

      {/* 3. HOW IT WORKS 4-STEP GUIDANCE SECTION */}
      <HowItWorks />

      {/* 4. Active Booking Ticket Pass & Countdown Timer */}
      {currentUser && activeTicket && (
        <ActiveTimerPass ticket={activeTicket} />
      )}

      {/* 5. Mall Details & BookMyShow All-Floor Slot Grid Section */}
      <MallDetails 
        selectedMall={selectedMall}
        activeFloorIndex={activeFloorIndex}
        onSelectFloor={(idx) => setActiveFloorIndex(idx)}
        selectedSlot={selectedSlot}
        onSelectSlot={handleSelectSlot}
        currentUser={currentUser}
        activeTicket={currentUser ? activeTicket : null}
      />

      {/* FOOTER */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Car size={20} className="text-green" />
            <span className="footer-title">ParkAssist</span>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} ParkAssist. Smart Online Parking System.
          </p>
        </div>
      </footer>

      {/* MODALS */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
        authPromptMsg={authPromptMsg}
      />

      <SlotBookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        slot={selectedSlot}
        mall={selectedMall}
        currentUser={currentUser}
        onProceedToPayment={handleProceedToPayment}
      />

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bookingDetails={pendingBookingDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Live User Parking Dashboard & History */}
      <UserDashboard 
        isOpen={isDashboardModalOpen}
        onClose={() => setIsDashboardModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ParkingProvider>
          <CartProvider>
            <MainParkAssistApp />
          </CartProvider>
        </ParkingProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

