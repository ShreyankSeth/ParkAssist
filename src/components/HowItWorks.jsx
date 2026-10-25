/**
 * @file HowItWorks.jsx
 * @description Step-by-step guidance section displayed below the mall & search section on scroll.
 * Guides users on searching mall parking, selecting slots for 30+ mins, paying via UPI/Cash, and entering the mall.
 */

import React from 'react';
import { Search, Calendar, QrCode, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import './HowItWorks.css';

export default function HowItWorks() {
  const STEPS = [
    {
      number: '01',
      icon: Search,
      title: 'Search & Select Mall',
      desc: 'Type your nearby mall location like Elante Mall Chandigarh or CP67 Mohali in our search bar to view live parking slot availability.'
    },
    {
      number: '02',
      icon: Calendar,
      title: 'Pick Slot & Duration',
      desc: 'Switch to the slot grid tab and select your preferred parking spot. Choose your parking time period with a minimum duration of 30 minutes.'
    },
    {
      number: '03',
      icon: QrCode,
      title: 'Pay via UPI QR or Cash',
      desc: 'Complete your payment instantly by scanning our Google Pay UPI QR code, or choose to pay cash at the mall exit booth.'
    },
    {
      number: '04',
      icon: CheckCircle2,
      title: 'Guaranteed Parking Pass',
      desc: 'Receive your instant digital parking pass on your phone with live timer tracking for easy, hassle-free mall entry!'
    }
  ];

  return (
    <section className="how-it-works-section section-spacer animate-fade-in" id="how-it-works">
      
      {/* Section Title */}
      <div className="how-header">
        <div className="badge-green">
          <ShieldCheck size={14} /> Simple 4-Step Process
        </div>
        <h2 className="how-title">How to Book Parking with ParkAssist</h2>
        <p className="how-subtitle">
          Follow these easy steps to reserve your mall parking slot online in under 60 seconds.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="steps-grid">
        {STEPS.map((step) => {
          const IconComp = step.icon;
          return (
            <div key={step.number} className="step-card">
              
              <div className="step-top">
                <span className="step-number">{step.number}</span>
                <div className="step-icon-box">
                  <IconComp size={24} />
                </div>
              </div>

              <h3 className="step-card-title">{step.title}</h3>
              <p className="step-card-desc">{step.desc}</p>

            </div>
          );
        })}
      </div>

    </section>
  );
}
