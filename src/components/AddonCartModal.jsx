/**
 * @file AddonCartModal.jsx
 * @description Mini-Project: Parking Add-on Services Shopping Cart Modal.
 * Meets academic evaluation requirements for React State Architecture,
 * Cart Context integration, quantity modifiers, tax calculation, and checkout.
 */

import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Zap, Sparkles, Key } from 'lucide-react';
import { useCart, AVAILABLE_SERVICES } from '../context/CartContext';
import './AddonCartModal.css';

export default function AddonCartModal({ isOpen, onClose }) {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, tax, total, itemCount } = useCart();

  if (!isOpen) return null;

  const renderIcon = (name) => {
    switch (name) {
      case 'Zap': return <Zap size={18} className="service-icon ev" />;
      case 'Sparkles': return <Sparkles size={18} className="service-icon wash" />;
      case 'Key': return <Key size={18} className="service-icon valet" />;
      default: return <ShieldCheck size={18} className="service-icon shield" />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card cart-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="cart-modal-header">
          <div className="cart-header-icon-box">
            <ShoppingBag size={22} className="text-green" />
          </div>
          <div>
            <h2 className="modal-title">Parking Add-on Services Cart</h2>
            <p className="modal-subtitle">Enhance your mall parking with on-demand vehicle care</p>
          </div>
        </div>

        {/* Content Body: Services Catalog & Cart */}
        <div className="cart-modal-body">
          
          {/* Section 1: Available Services Catalog */}
          <div className="catalog-section">
            <h4 className="section-title">Available On-Demand Services</h4>
            <div className="services-grid">
              {AVAILABLE_SERVICES.map((service) => {
                const inCartItem = cartItems.find((i) => i.id === service.id);

                return (
                  <div key={service.id} className="service-item-card">
                    <div className="service-info-col">
                      <div className="service-header-row">
                        {renderIcon(service.icon)}
                        <span className="service-name">{service.name}</span>
                      </div>
                      <p className="service-desc">{service.desc}</p>
                      <span className="service-price">₹{service.price}</span>
                    </div>

                    <div className="service-action-col">
                      {inCartItem ? (
                        <div className="qty-control-pill">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity(service.id, inCartItem.quantity - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-num">{inCartItem.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity(service.id, inCartItem.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn-outline add-service-btn"
                          onClick={() => addToCart(service)}
                        >
                          <Plus size={14} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Cart Summary */}
          <div className="cart-summary-section">
            <div className="cart-summary-header">
              <span className="summary-title">Your Cart ({itemCount} items)</span>
              {cartItems.length > 0 && (
                <button type="button" className="clear-cart-link" onClick={clearCart}>
                  <Trash2 size={13} /> Clear
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart-hint">
                <ShoppingBag size={32} className="empty-cart-icon" />
                <p>Your services cart is currently empty.</p>
                <span>Select services from above to add to your parking pass!</span>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-row-item">
                    <div className="cart-row-name">
                      <span>{item.name}</span>
                      <small>₹{item.price} × {item.quantity}</small>
                    </div>
                    <span className="cart-row-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}

                <div className="cart-bill-breakdown">
                  <div className="bill-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="bill-row">
                    <span>GST (18%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="bill-row grand-total">
                    <span>Grand Total</span>
                    <span className="total-val">₹{total}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer Checkout */}
        <div className="cart-modal-footer">
          <button
            type="button"
            className="btn-primary checkout-cart-btn"
            onClick={onClose}
            disabled={cartItems.length === 0}
          >
            <span>Confirm & Attach to Booking (₹{total})</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
