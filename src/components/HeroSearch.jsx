/**
 * @file HeroSearch.jsx
 * @description Hero component featuring headline "Book Online Parking with ParkAssist",
 * interactive search bar with real-time autocomplete recommendations, and clean girl hero image.
 * Automatically scrolls window down to #mall-section upon searching or selecting a mall.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Building2, ChevronRight, CheckCircle2 } from 'lucide-react';
import './HeroSearch.css';

export default function HeroSearch({ malls, selectedMall, onSelectMall }) {
  // Search query input state
  const [query, setQuery] = useState('');
  // Autocomplete dropdown toggle
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // Filter mall recommendations based on user search input
  const filteredMalls = malls.filter(mall =>
    mall.name.toLowerCase().includes(query.toLowerCase()) ||
    mall.city.toLowerCase().includes(query.toLowerCase()) ||
    mall.area.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smooth scroll down to mall details section
  const scrollToMallSection = () => {
    setTimeout(() => {
      const el = document.getElementById('mall-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Selection handler for autocomplete dropdown item
  const handleSelectRecommendation = (mall) => {
    setQuery(mall.name);
    setShowDropdown(false);
    onSelectMall(mall);
    scrollToMallSection();
  };

  // Search button click handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredMalls.length > 0) {
      onSelectMall(filteredMalls[0]);
    }
    setShowDropdown(false);
    scrollToMallSection();
  };

  return (
    <section className="hero-section section-spacer">
      <div className="hero-grid">
        
        {/* LEFT COLUMN: Search & Headlines */}
        <div className="hero-left animate-fade-in">
          
          {/* Tagline Badge */}
          <div className="hero-badge">
            <CheckCircle2 size={16} /> Instant Mall Slot Reservations
          </div>

          {/* Main Headline */}
          <h1 className="hero-title">
            Book Online Parking with <span className="text-green">ParkAssist</span>
          </h1>

          <p className="hero-subtitle">
            Find guaranteed, hassle-free parking at your nearest mall. Check real-time slot metrics, reserve for minimum 30 minutes, and pay effortlessly via UPI QR or cash.
          </p>

          {/* SEARCH BAR CONTAINER with Autocomplete & Auto-Scroll */}
          <form className="search-box-wrapper" ref={searchRef} onSubmit={handleSearchSubmit}>
            <div className="search-input-container">
              <MapPin className="search-icon green" size={22} />
              <input 
                type="text"
                className="search-input"
                placeholder="Search mall location (e.g., Elante Mall, CP67 Mohali)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
              <button type="submit" className="btn-primary search-submit-btn">
                <Search size={18} />
                <span className="btn-text">Find Slot</span>
              </button>
            </div>

            {/* REAL-TIME AUTOCOMPLETE RECOMMENDATION DROPDOWN */}
            {showDropdown && (
              <div className="autocomplete-dropdown animate-fade-in">
                <div className="dropdown-header">
                  <Building2 size={14} /> Recommended Mall Locations
                </div>
                {filteredMalls.length > 0 ? (
                  filteredMalls.map(mall => (
                    <div 
                      key={mall.id} 
                      className={`dropdown-item ${selectedMall?.id === mall.id ? 'selected' : ''}`}
                      onClick={() => handleSelectRecommendation(mall)}
                    >
                      <div className="item-icon-wrapper">
                        <MapPin size={18} />
                      </div>
                      <div className="item-info">
                        <div className="item-name">{mall.name}</div>
                        <div className="item-details">{mall.area}, {mall.city} • Min ₹{mall.baseRate30Min} / 30m</div>
                      </div>
                      <ChevronRight className="item-arrow" size={16} />
                    </div>
                  ))
                ) : (
                  <div className="dropdown-no-results">
                    No matching mall found. Try typing "Elante" or "CP67".
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Quick Mall Chips */}
          <div className="quick-malls-container">
            <span className="quick-label">Featured Malls:</span>
            {malls.map(mall => (
              <button 
                key={mall.id} 
                className={`chip-mall ${selectedMall?.id === mall.id ? 'active' : ''}`}
                onClick={() => {
                  setQuery(mall.name);
                  onSelectMall(mall);
                  scrollToMallSection();
                }}
              >
                <Building2 size={14} />
                {mall.shortName}
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Clean Girl Image */}
        <div className="hero-right animate-fade-in">
          <div className="hero-image-frame">
            <img 
              src="/assets/girl.jpg" 
              alt="ParkAssist smartphone user searching for mall parking slot" 
              className="hero-girl-img"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
