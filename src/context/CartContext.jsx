import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const { addToast } = useToast();

  // Load cart items on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart');
      }
    }
  }, []);

  // Save cart items on changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product === product._id);
      if (existingItem) {
        // Check stock limit
        if (existingItem.quantity + quantity > product.stock) {
          addToast(`Only ${product.stock} units of ${product.name} are available in stock.`, 'warning');
          return prevItems;
        }
        addToast(`Increased ${product.name} quantity in your cart!`, 'success');
        return prevItems.map((item) =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      addToast(`Added ${product.name} to your cart!`, 'success');
      return [
        ...prevItems,
        {
          product: product._id,
          name: product.name,
          price: product.offerPrice,
          image: product.images?.[0] || '/uploads/default-product.png',
          gst: product.gst || 18,
          quantity,
          maxStock: product.stock,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
    addToast('Item removed from cart', 'info');
  };

  const increaseQty = (productId) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          if (item.quantity + 1 > item.maxStock) {
            addToast(`Cannot add more. Max stock limit reached.`, 'warning');
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQty = (productId) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          return { ...item, quantity: Math.max(1, item.quantity - 1) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    try {
      const response = await axios.post('/coupons/apply', { code });
      if (response.data.success) {
        setCoupon(response.data.coupon);
        addToast(`Coupon "${code}" applied successfully!`, 'success');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid coupon code';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Calculations
  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const gstTotal = cartItems.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    const gstAmt = Math.round(itemTotal * (item.gst / 100));
    return acc + gstAmt;
  }, 0);

  let discountTotal = 0;
  if (coupon) {
    const potentialDiscount = Math.round(subTotal * (coupon.discountPercentage / 100));
    discountTotal = Math.min(potentialDiscount, coupon.maxDiscount);
  }

  const deliveryFee = subTotal > 1500 || subTotal === 0 ? 0 : 150;
  const grandTotal = subTotal + gstTotal + deliveryFee - discountTotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        coupon,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        applyCoupon,
        removeCoupon,
        subTotal,
        gstTotal,
        discountTotal,
        deliveryFee,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
