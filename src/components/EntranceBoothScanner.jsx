/**
 * @file EntranceBoothScanner.jsx
 * @description Automated Entrance Gate Booth Scanner Simulator for ParkAssist.
 * Simulates car camera OCR plate scanning upon arrival at the mall entrance booth,
 * matching registered car plate numbers, and automatically opening the gate barrier.
 */

import React, { useState } from 'react';
import { Camera, ShieldCheck, CheckCircle2, Car, ArrowRight, Play, RefreshCw, Zap } from 'lucide-react';
import './EntranceBoothScanner.css';

export default function EntranceBoothScanner({ activeTicket, currentUser }) {
  // Scanner state: 'idle', 'scanning', 'verified', 'error'
  const [scanState, setScanState] = useState('idle');
  const [scannedPlate, setScannedPlate] = useState('');

  // Target car plate to match
  const targetPlate = activeTicket?.carNo || currentUser?.carNo || 'CH01AB1234';
  const targetSlot = activeTicket?.slotId || 'B1-12';
  const targetMall = activeTicket?.mallName || 'Elante Mall, Chandigarh';

  // Trigger automated scan simulation
  const handleStartScan = () => {
    setScanState('scanning');
    setScannedPlate('SCANNING PLATE...');

    // Phase 1: Camera scanning animation (2 seconds)
    setTimeout(() => {
      setScannedPlate(targetPlate);
      setScanState('verified');
    }, 2200);
  };

  const handleResetScan = () => {
    setScanState('idle');
    setScannedPlate('');
  };

  return (
    <section className="booth-scanner-section section-spacer animate-fade-in">
      <div className="booth-card">
        
        {/* Booth Section Header */}
        <div className="booth-header">
          <div className="badge-green">
            <Zap size={14} /> Automated Barrier Gate System
          </div>
          <h2 className="booth-title">Mall Entrance Booth Car Plate Scanner</h2>
          <p className="booth-subtitle">
            Simulate your vehicle arriving at the mall entry barrier. Our AI scanner reads your license plate and opens the gate automatically.
          </p>
        </div>

        <div className="booth-grid">
          
          {/* LEFT: Scanner Camera Screen Viewport */}
          <div className="scanner-viewport-box">
            
            <div className={`camera-screen ${scanState}`}>
              
              {/* Scan Beam Effect */}
              {scanState === 'scanning' && <div className="scan-beam animate-scan"></div>}

              {/* Viewport Overlay Markers */}
              <div className="viewport-corner top-left"></div>
              <div className="viewport-corner top-right"></div>
              <div className="viewport-corner bottom-left"></div>
              <div className="viewport-corner bottom-right"></div>

              {/* Center License Plate Graphics */}
              <div className="license-plate-display">
                <div className="ind-strip">IND</div>
                <div className="plate-number">
                  {scanState === 'idle' ? 'APPROACH BOOTH' : scannedPlate}
                </div>
              </div>

              {/* Status Overlay Badge */}
              <div className="viewport-status">
                {scanState === 'idle' && <span>📷 CAMERA READY (WAITING FOR VEHICLE)</span>}
                {scanState === 'scanning' && <span className="text-amber"><RefreshCw size={14} className="spin" /> OCR SCANNING PLATE...</span>}
                {scanState === 'verified' && <span className="text-green font-bold"><CheckCircle2 size={14} /> MATCH VERIFIED • BARRIER OPEN</span>}
              </div>

            </div>

          </div>

          {/* RIGHT: Gate & Barrier Simulation Controls */}
          <div className="booth-controls-column">
            
            <div className="booth-info-card">
              <h4 className="info-heading">Barrier Gate Status</h4>
              
              <div className="gate-indicator-row">
                <div className={`gate-light ${scanState === 'verified' ? 'green-light' : 'red-light'}`}></div>
                <span className="gate-state-text">
                  {scanState === 'verified' ? 'BARRIER GATE OPEN 🟢' : 'GATE CLOSED 🔴'}
                </span>
              </div>

              <div className="booth-details-list">
                <div className="detail-row">
                  <span>Target Mall:</span>
                  <strong>{targetMall}</strong>
                </div>
                <div className="detail-row">
                  <span>Target Vehicle Plate:</span>
                  <strong className="text-green">{targetPlate}</strong>
                </div>
                <div className="detail-row">
                  <span>Reserved Slot:</span>
                  <strong>{targetSlot}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="booth-btn-group">
                {scanState === 'idle' && (
                  <button className="btn-primary start-scan-btn" onClick={handleStartScan}>
                    <Play size={18} /> Simulate Car Arrival & Scan Plate
                  </button>
                )}
                {scanState === 'scanning' && (
                  <button className="btn-primary start-scan-btn" disabled>
                    <RefreshCw size={18} className="spin" /> Scanning License Plate...
                  </button>
                )}
                {scanState === 'verified' && (
                  <button className="btn-outline reset-scan-btn" onClick={handleResetScan}>
                    <RefreshCw size={16} /> Reset Booth Scanner
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
