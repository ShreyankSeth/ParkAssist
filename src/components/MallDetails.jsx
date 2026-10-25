/**
 * @file MallDetails.jsx
 * @description Mall details & slot selection view.
 * - Overview tab: Real OpenStreetMap reverse geocoding using `useAsync` hook, live slot counters, rates, and photo.
 * - Slots tab: BookMyShow-style cinema seating matrix showing all floors (including dedicated EV floor) in a single continuous view.
 */

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ShieldCheck, Car, CheckCircle, AlertCircle, RefreshCw, Info, LayoutGrid, Zap } from 'lucide-react';
import BookMyShowSlotGrid from './BookMyShowSlotGrid';
import { useAsync } from '../hooks/useAsync';
import './MallDetails.css';

// Reusable async function to fetch location via OpenStreetMap Nominatim API
const fetchMallGpsLocation = async (mall) => {
  if (!mall || !mall.latitude || !mall.longitude) return null;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${mall.latitude}&lon=${mall.longitude}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return `${mall.area}, ${mall.city}, ${mall.pincode || 'India'}`;
    const data = await res.json();
    return data.display_name || `${mall.area}, ${mall.city}, ${mall.pincode || 'India'}`;
  } catch {
    return `${mall.area}, ${mall.city}, ${mall.pincode || 'India'}`;
  }
};

export default function MallDetails({
  selectedMall,
  selectedSlot,
  onSelectSlot,
  currentUser,
  activeTicket
}) {
  // Main View Tab: 'overview' or 'slots'
  const [activeMainTab, setActiveMainTab] = useState('slots');

  // Integration of useAsync hook for academic async state handling
  const { execute: loadGpsLocation, data: realApiAddress } = useAsync(fetchMallGpsLocation);

  // Trigger GPS lookup only on mall id change
  useEffect(() => {
    if (selectedMall) {
      loadGpsLocation(selectedMall).catch(() => {});
    }
  }, [selectedMall?.id]);

  // Dynamically calculate slot counters across all floors (including EV Floor)
  const totalSlots = selectedMall.totalSlots || 0;
  let totalBooked = 0;
  let totalAvailable = 0;

  selectedMall.floors.forEach((floor) => {
    floor.slots.forEach((slot) => {
      if (slot.status === 'booked') totalBooked++;
      else totalAvailable++;
    });
  });

  return (
    <section className="mall-details-section section-spacer animate-fade-in" id="mall-section">
      
      {/* MALL TITLE & TAB HEADER BAR */}
      <div className="mall-header-card">
        
        {/* Mall Title Block */}
        <div className="mall-title-block">
          <div className="badge-green">
            <ShieldCheck size={14} /> Partner Mall Parking
          </div>
          <h2 className="mall-name">{selectedMall.name}</h2>
          
          {/* Location Address with Real API resolution */}
          <div className="real-api-address">
            <MapPin size={16} className="text-green" />
            <span className="api-address-text">
              <strong>Location:</strong> {realApiAddress || `${selectedMall.area}, ${selectedMall.city}, ${selectedMall.pincode || 'Punjab/UT, India'}`}
            </span>
          </div>
        </div>

        {/* VIEW NAVIGATION TABS: Select Slots vs Mall Overview */}
        <div className="view-navigation-tabs">
          <button
            className={`view-tab ${activeMainTab === 'slots' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('slots')}
          >
            <LayoutGrid size={18} />
            <span>Live Parking Map (All Floors)</span>
          </button>

          <button
            className={`view-tab ${activeMainTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('overview')}
          >
            <Info size={18} />
            <span>Mall Overview & Rates</span>
          </button>
        </div>

      </div>

      {/* TAB 1: BOOKMYSHOW-STYLE PARKING MATRIX (ALL FLOORS IN SINGLE VIEW) */}
      {activeMainTab === 'slots' && (
        <div className="tab-content-container animate-fade-in">
          
          {/* Mini Real-Time Counter Bar */}
          <div className="bms-live-counts-strip">
            <div className="count-pill">
              <span>Total Capacity:</span> <strong>{totalSlots}</strong>
            </div>
            <div className="count-pill available">
              <span>Available Now:</span> <strong>{totalAvailable}</strong>
            </div>
            <div className="count-pill booked">
              <span>Currently Occupied:</span> <strong>{totalBooked}</strong>
            </div>
            <div className="count-pill ev">
              <Zap size={14} /> <span>EV Fast-Charger Zone Included</span>
            </div>
          </div>

          {/* BookMyShow Single View Matrix */}
          <BookMyShowSlotGrid
            mall={selectedMall}
            selectedSlot={selectedSlot}
            onSelectSlot={onSelectSlot}
            currentUser={currentUser}
            activeTicket={activeTicket}
          />

        </div>
      )}

      {/* TAB 2: MALL OVERVIEW & STATS */}
      {activeMainTab === 'overview' && (
        <div className="tab-content-container animate-fade-in">
          
          {/* Detailed Parking Stats Grid */}
          <div className="parking-stats-grid">
            <div className="stat-card total">
              <div className="stat-icon-wrapper">
                <Car size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{totalSlots}</span>
                <span className="stat-label">Total Parking Slots</span>
              </div>
            </div>

            <div className="stat-card available">
              <div className="stat-icon-wrapper">
                <CheckCircle size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-value text-green">{totalAvailable}</span>
                <span className="stat-label">Available Right Now</span>
              </div>
            </div>

            <div className="stat-card booked">
              <div className="stat-icon-wrapper">
                <AlertCircle size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-value text-amber">{totalBooked}</span>
                <span className="stat-label">Currently Booked</span>
              </div>
            </div>
          </div>

          {/* Info Card with User Parking Image */}
          <div className="overview-details-card">
            <div className="overview-text-side">
              <h3 className="overview-heading">Parking Information & Rates</h3>
              <p className="overview-desc">
                Clean, safe, and covered underground facility equipped with dedicated fast-charging EV bays, accessible bays, and automated surveillance.
              </p>
              
              <div className="meta-list">
                <div className="meta-row">
                  <Clock size={16} className="text-green" />
                  <span>Operating Hours: <strong>{selectedMall.operatingHours}</strong></span>
                </div>
                <div className="meta-row">
                  <span className="currency-badge">₹</span>
                  <span>Standard Rate: <strong>₹{selectedMall.baseRate30Min} for first 30 mins</strong></span>
                </div>
                <div className="meta-row">
                  <Zap size={16} style={{ color: '#ca8a04' }} />
                  <span>EV Charger Floor Rate: <strong>₹80 for first 30 mins (Power Included)</strong></span>
                </div>
              </div>

              <button 
                className="btn-primary switch-slots-btn"
                onClick={() => setActiveMainTab('slots')}
              >
                <LayoutGrid size={18} /> View All Parking Floors Map
              </button>
            </div>

            <div className="overview-image-side">
              <img 
                src="/assets/parking.jpg" 
                alt="Mall parking facility" 
                className="user-parking-photo"
              />
              <span className="photo-caption">Real Mall Multi-Level Parking Facility</span>
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
