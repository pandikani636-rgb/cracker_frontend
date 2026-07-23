import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { CreditCard, ShoppingBag, MapPin, Truck, PlusCircle, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { user, addAddress } = useAuth();
  const { cartItems, coupon, subTotal, gstTotal, discountTotal, deliveryFee, grandTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Redirect if cart is empty or user is not logged in
  useEffect(() => {
    if (!user) {
      addToast('Please login to checkout', 'info');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate]);

  // Form states
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD or Razorpay
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // New Address States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    if (!street || !city || !stateName || !zipCode) {
      return addToast('Please enter all address fields', 'warning');
    }

    setSavingAddress(true);
    const res = await addAddress({ street, city, state: stateName, zipCode, isDefault: false });
    setSavingAddress(false);

    if (res.success) {
      addToast('Address added!', 'success');
      setStreet('');
      setCity('');
      setStateName('');
      setZipCode('');
      setShowAddressForm(false);
      // Select the newly added address (which goes to end of array)
      setSelectedAddressIdx((user.addresses?.length || 0));
    } else {
      addToast(res.message, 'error');
    }
  };

  const handlePlaceOrderSubmit = async () => {
    if (!user.addresses || user.addresses.length === 0) {
      return addToast('Please select or add a shipping address', 'warning');
    }

    const shippingAddress = user.addresses[selectedAddressIdx];

    setIsPlacingOrder(true);
    try {
      const response = await axios.post('/orders', {
        items: cartItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
        })),
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
        },
        paymentMethod,
        couponCode: coupon?.code || '',
      });

      if (response.data.success) {
        addToast('Order placed successfully!', 'success');
        clearCart();
        navigate(`/dashboard?tab=orders&placed=${response.data.order._id}`);
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to place order.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!user || cartItems.length === 0) return null;

  return (
    <div className="pt-24 min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-wider mb-8">
        Secure <span className="text-gold">Checkout</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shipping Address & Payment Selection */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Shipping Address Container */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-glass">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-white/5 pb-3">
              <MapPin className="h-4.5 w-4.5 text-gold" /> Shipping Address
            </h3>

            {/* Address Selection List */}
            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {user.addresses.map((addr, idx) => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddressIdx(idx)}
                    className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedAddressIdx === idx
                        ? 'border-gold bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                        : 'border-white/10 hover:border-white/20 bg-darkBg/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-200">Address {idx + 1}</span>
                      {selectedAddressIdx === idx && <CheckCircle className="h-4 w-4 text-gold" />}
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      {addr.street}, <br />
                      {addr.city}, {addr.state} - {addr.zipCode}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-orange-400 bg-orange-400/5 border border-orange-400/10 p-3.5 rounded-lg mb-4">
                No shipping addresses saved yet. Please add a shipping address below.
              </div>
            )}

            {/* Toggle Address Form */}
            {!showAddressForm ? (
              <button
                onClick={() => setShowAddressForm(true)}
                className="flex items-center gap-1.5 text-xs text-gold font-bold hover:underline"
              >
                <PlusCircle className="h-4.5 w-4.5" /> Add New Address
              </button>
            ) : (
              <form onSubmit={handleAddAddressSubmit} className="border-t border-white/5 pt-4 mt-4 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-gray-300">Add Shipping Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Street Address, Area"
                    className="w-full bg-[#121318] border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full bg-[#121318] border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="State"
                    className="w-full bg-[#121318] border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="ZIP / Postal Code"
                    className="w-full bg-[#121318] border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="flex gap-2 justify-end text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="px-4 py-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold rounded-lg"
                  >
                    {savingAddress ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Payment Method Container */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-glass">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-white/5 pb-3">
              <CreditCard className="h-4.5 w-4.5 text-gold" /> Payment Option
            </h3>

            <div className="flex flex-col gap-3">
              {/* Cash On Delivery */}
              <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-[#0c0d12]/30 hover:border-gold/30 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="accent-gold h-4 w-4"
                />
                <div className="text-xs">
                  <strong className="text-gray-200 block">Cash On Delivery (COD)</strong>
                  <span className="text-gray-500">Pay cash upon secure doorstep delivery of firecrackers.</span>
                </div>
              </label>

              {/* Razorpay Online (Mock) */}
              <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-[#0c0d12]/30 hover:border-gold/30 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  className="accent-gold h-4 w-4"
                />
                <div className="text-xs">
                  <strong className="text-gray-200 block">Online Payment (Razorpay API Mock)</strong>
                  <span className="text-gray-500">Instant validation secure sandbox checkout gateway.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary and Actions */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-glass">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-4 mb-4">
              <ShoppingBag className="h-4.5 w-4.5 text-gold animate-bounce" /> Order Summary
            </h3>

            {/* Cart list scrollable */}
            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto mb-4 border-b border-white/5 pb-4 pr-1">
              {cartItems.map((item) => (
                <div key={item.product} className="flex justify-between items-center text-xs text-gray-400">
                  <span className="line-clamp-1 flex-grow pr-3">
                    {item.name} <strong className="text-gray-300">x{item.quantity}</strong>
                  </span>
                  <span className="text-gray-200 font-bold shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations summaries */}
            <div className="flex flex-col gap-3 text-xs text-gray-400 border-b border-white/5 pb-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-gray-200">₹{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (Incl.):</span>
                <span className="text-gold">₹{gstTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                {deliveryFee === 0 ? (
                  <span className="text-green-400 font-semibold">FREE</span>
                ) : (
                  <span className="text-gray-200">₹{deliveryFee}</span>
                )}
              </div>
              {coupon && (
                <div className="flex justify-between text-green-400">
                  <span>Coupon Discount ({coupon.code}):</span>
                  <span>- ₹{discountTotal}</span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-xs font-bold text-white uppercase">Grand Total:</span>
              <span className="text-xl font-black text-glow-gold text-gold">₹{grandTotal}</span>
            </div>

            {/* Order Placement CTA */}
            <button
              onClick={handlePlaceOrderSubmit}
              disabled={isPlacingOrder || !user.addresses || user.addresses.length === 0}
              className="w-full btn-glow-gold text-white font-extrabold text-xs py-3.5 rounded-full uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
            >
              <Truck className="h-4.5 w-4.5" /> {isPlacingOrder ? 'Processing Order...' : 'Place Secure Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
