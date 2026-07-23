import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, Ticket, Sparkles, AlertCircle } from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    coupon,
    removeFromCart,
    increaseQty,
    decreaseQty,
    applyCoupon,
    removeCoupon,
    subTotal,
    gstTotal,
    discountTotal,
    deliveryFee,
    grandTotal,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponSubmitting, setCouponSubmitting] = useState(false);

  const handleApplyCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponSubmitting(true);
    await applyCoupon(couponInput);
    setCouponSubmitting(false);
    setCouponInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-36 pb-20 min-h-screen max-w-2xl mx-auto px-4 text-center flex flex-col items-center justify-center">
        <div className="p-4 bg-white/5 rounded-full border border-white/5 text-gray-500 mb-6 animate-pulse">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Your Showroom Cart is Empty</h2>
        <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
          Add some high-altitude sparklers, ground spinning wheels, or luxury flower pots to launch your celebration!
        </p>
        <Link
          to="/shop"
          className="btn-glow-gold text-white font-extrabold text-xs py-3.5 px-8 rounded-full border border-gold/30 uppercase tracking-widest"
        >
          Explore Showroom
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-wider mb-8">
        Shopping <span className="text-gold">Cart</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="h-20 w-20 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-darkBg">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <Link to={`/product/${item.product}`} className="font-bold text-sm text-white hover:text-gold transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <span className="text-[10px] text-gold font-bold block mt-0.5">GST Incl: {item.gst}%</span>
                  <span className="text-sm font-black text-gray-200 block mt-1.5">₹{item.price} each</span>
                </div>
              </div>

              {/* Quantity Changer */}
              <div className="flex items-center gap-6 justify-between w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                <div className="flex items-center border border-white/10 bg-[#0e0f13] rounded-full px-2.5 py-1">
                  <button
                    onClick={() => decreaseQty(item.product)}
                    className="p-0.5 hover:text-gold transition-colors focus:outline-none"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-gray-200">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.product)}
                    className="p-0.5 hover:text-gold transition-colors focus:outline-none"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Sub Total */}
                <div className="text-right shrink-0">
                  <span className="text-xs text-gray-500 block">Total</span>
                  <span className="text-sm font-black text-white">₹{item.price * item.quantity}</span>
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="p-2 text-gray-500 hover:text-crimson transition-colors rounded-full hover:bg-crimson/5 border border-transparent hover:border-crimson/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary calculations */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Coupon Application Panel */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-glass">
            <h3 className="font-extrabold text-sm text-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Ticket className="h-4.5 w-4.5" /> Promotion Coupon
            </h3>
            {coupon ? (
              <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-xs">
                <div>
                  <strong>{coupon.code}</strong> Applied ({coupon.discountPercentage}% Off)
                </div>
                <button onClick={removeCoupon} className="text-green-400 hover:text-white font-bold ml-2">
                  ✕
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCouponSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter code (FESTIVE50)"
                  className="flex-grow bg-[#121318] border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold uppercase"
                />
                <button
                  type="submit"
                  disabled={couponSubmitting}
                  className="bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Pricing calculations */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-glass">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider border-b border-white/5 pb-4 mb-4">
              Cart Summary
            </h3>

            <div className="flex flex-col gap-3.5 text-xs text-gray-400 border-b border-white/5 pb-4 mb-4">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-gray-200 font-semibold">₹{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (Included):</span>
                <span className="text-gold font-semibold">₹{gstTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                {deliveryFee === 0 ? (
                  <span className="text-green-400 font-semibold">FREE</span>
                ) : (
                  <span className="text-gray-200 font-semibold">₹{deliveryFee}</span>
                )}
              </div>
              {coupon && (
                <div className="flex justify-between text-green-400">
                  <span>Coupon Discount:</span>
                  <span>- ₹{discountTotal}</span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-sm font-bold text-white uppercase">Grand Total:</span>
              <span className="text-2xl font-black text-glow-gold text-gold">₹{grandTotal}</span>
            </div>

            {/* Threshold free shipping tip */}
            {subTotal < 1500 && (
              <div className="flex items-start gap-2 bg-orange-500/5 border border-orange-500/10 text-orange-400 p-3 rounded-lg text-[10px] leading-relaxed mb-6">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Add <strong>₹{1500 - subTotal}</strong> more to your cart to trigger <strong>FREE shipping</strong>! (Delivery threshold is ₹1500)
                </span>
              </div>
            )}

            {/* Checkout CTA */}
            <Link
              to="/checkout"
              className="w-full btn-glow-gold text-white font-extrabold text-center block py-3.5 rounded-full text-xs uppercase tracking-wider"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              className="w-full bg-white/5 border border-white/10 text-gray-300 hover:border-gold/30 hover:text-gold text-center block py-3 rounded-full text-xs font-bold uppercase mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
