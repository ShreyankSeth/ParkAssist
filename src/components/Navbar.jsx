/**
 * @file Navbar.jsx
 * @description Header Navigation Component for ParkAssist.
 * Displays "ParkAssist" branding on top left. Top right displays user badge (Name & Vehicle No only)
 * which opens a popover dropdown menu containing a Sign Out button when clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Car, User, LogOut, ShieldCheck, ChevronDown, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ currentUser, onOpenAuth, onLogout, onOpenDashboard }) {
  // Dropdown toggle state
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        
        {/* TOP LEFT: Brand Logo & Title */}
        <div className="navbar-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon-wrapper">
            <Car className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Park<span className="text-green">Assist</span></span>
            <span className="brand-tagline">Smart Automated Parking</span>
          </div>
        </div>

        {/* TOP RIGHT: Navigation Actions & User Profile */}
        <div className="navbar-user-area" ref={dropdownRef}>
          
          {/* Quick Dashboard Action */}
          <button 
            className="navbar-icon-btn dashboard-btn"
            onClick={onOpenDashboard}
            title="Open Parking Dashboard"
          >
            <LayoutDashboard size={18} />
            <span className="nav-btn-label">Dashboard</span>
          </button>

          {currentUser ? (
            /* Logged In User State: Shows Name & Vehicle Number */
            <div className="user-dropdown-wrapper">
              <button 
                className="user-profile-badge interactive" 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                title="Account Options"
              >
                <div className="user-info">
                  <span className="user-name">{currentUser.name}</span>
                  <span className="user-car"><Car size={12} /> {currentUser.carNo}</span>
                </div>
                <ChevronDown size={14} className={`dropdown-chevron ${showUserDropdown ? 'open' : ''}`} />
              </button>

              {/* POPOVER DROPDOWN MENU */}
              {showUserDropdown && (
                <div className="user-popover-menu animate-fade-in">
                  <div className="popover-header">
                    <div className="popover-user-title">{currentUser.name}</div>
                    <div className="popover-user-sub"><Car size={12} /> Vehicle: {currentUser.carNo}</div>
                    {currentUser.mobile && <div className="popover-user-sub">📱 {currentUser.mobile}</div>}
                  </div>

                  <div className="popover-divider"></div>

                  <button 
                    className="popover-action-btn"
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenDashboard();
                    }}
                  >
                    <LayoutDashboard size={16} />
                    <span>My Parking Passes</span>
                  </button>

                  <div className="popover-divider"></div>

                  <button 
                    className="popover-action-btn logout-btn" 
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out / Auth Trigger Button */
            <button 
              className="btn-user-icon" 
              onClick={onOpenAuth}
              title="Login / Sign-up"
            >
              <div className="avatar-circle">
                <User size={20} />
              </div>
              <span className="auth-btn-label">Login / Sign-Up</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
