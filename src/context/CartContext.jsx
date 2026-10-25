/**
 * @file CartContext.jsx
 * @description React Context API architecture for Mini-Project: Parking Add-on Services Shopping Cart.
 * Demonstrates Shopping Cart state management (items, quantity increment/decrement, subtotal calculation,
 * tax calculation, and checkout persistence) for academic evaluation.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const AVAILABLE_SERVICES = [
  {
    id: 'ev-charge',
    name: '⚡ EV Ultra-Fast Charging Booster',
    category: 'Charging',
    price: 150,
    desc: '30kW fast DC top-up while your car is parked.',
    icon: 'Zap'
  },
  {
    id: 'eco-wash',
    name: '🧼 Eco Foam Exterior Car Wash',
    category: 'Cleaning',
    price: 199,
    desc: 'Waterless scratch-free shine before you return to your vehicle.',
    icon: 'Sparkles'
  },
  {
    id: 'vip-valet',
    name: '🔑 VIP Valet Retrieval Assistance',
    category: 'Convenience',
    price: 99,
    desc: 'Vehicle brought directly to mall exit gate upon exit.',
    icon: 'Key'
  },
  {
    id: 'scratch-shield',
    name: '🛡️ Zero-Dent Parking Protection',
    category: 'Security',
    price: 49,
    desc: 'Comprehensive parking protection insurance for your duration.',
    icon: 'ShieldCheck'
  }
];

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('parkassist_services_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart changes to localStorage
  useEffect(() => {
    localStorage.setItem('parkassist_services_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add service to cart
  const addToCart = (service) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === service.id);
      if (existing) {
        return prev.map(item =>
          item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  // Remove service from cart
  const removeFromCart = (serviceId) => {
    setCartItems(prev => prev.filter(item => item.id !== serviceId));
  };

  // Update item quantity
  const updateQuantity = (serviceId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === serviceId ? { ...item, quantity } : item))
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('parkassist_services_cart');
  };

  // Calculate cart subtotal, taxes (18% GST), and total
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
    itemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
