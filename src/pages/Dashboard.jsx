import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { User, ShoppingBag, MapPin, Settings, Key, Phone, Mail, Edit, Plus, Trash2, Printer, MapPinOff } from 'lucide-react';

const Dashboard = () => {
  const { user, updateProfile, addAddress, deleteAddress } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if logged out
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Tab Control
  const queryTab = new URLSearchParams(location.search).get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(queryTab);
  
  // Orders history state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null); // active tracking timeline

  // Profile Edit fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);

  useEffect(() => {
    setActiveTab(queryTab);
    if (queryTab === 'orders') {
      fetchOrders();
    }
  }, [queryTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await axios.get('/orders/myorders');
      if (response.data.success) {
        setOrders(response.data.orders);
        
        // If query parameters indicate a freshly placed order, highlight / track it!
        const placedId = new URLSearchParams(location.search).get('placed');
        if (placedId) {
          const found = response.data.orders.find(o => o._id === placedId);
          if (found) setTrackingOrder(found);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    const res = await updateProfile(name, phone, password);
    setProfileSaving(false);
    if (res.success) {
      addToast('Profile updated!', 'success');
      setPassword('');
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!street || !city || !stateName || !zipCode) return;
    setAddressSaving(true);
    const res = await addAddress({ street, city, state: stateName, zipCode });
    setAddressSaving(false);
    if (res.success) {
      addToast('Address added!', 'success');
      setStreet('');
      setCity('');
      setStateName('');
      setZipCode('');
      setShowAddressForm(false);
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleAddressDelete = async (id) => {
    const res = await deleteAddress(id);
    if (res.success) {
      addToast('Address deleted successfully!', 'success');
    } else {
      addToast(res.message, 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="pt-24 min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="md:col-span-1 flex flex-col gap-2">
          {/* User profile Summary Card */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-glass mb-4 flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-gold/15 border border-gold/30 rounded-full flex items-center justify-center font-extrabold text-gold text-xl uppercase mb-3 shadow-goldGlow">
              {user.name.charAt(0)}
            </div>
            <h3 className="font-bold text-sm text-white">{user.name}</h3>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{user.role} Account</span>
          </div>

          <button
            onClick={() => navigate('/dashboard?tab=profile')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === 'profile'
                ? 'bg-gold border-l-4 border-orange-500 text-darkBg shadow-goldGlow font-black'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <User className="h-4.5 w-4.5" /> My Profile
          </button>

          <button
            onClick={() => navigate('/dashboard?tab=orders')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === 'orders'
                ? 'bg-gold border-l-4 border-orange-500 text-darkBg shadow-goldGlow font-black'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="h-4.5 w-4.5" /> Order History
          </button>

          <button
            onClick={() => navigate('/dashboard?tab=addresses')}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === 'addresses'
                ? 'bg-gold border-l-4 border-orange-500 text-darkBg shadow-goldGlow font-black'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <MapPin className="h-4.5 w-4.5" /> Shipping Addresses
          </button>
        </aside>

        {/* Content Panels */}
        <main className="md:col-span-3">
          
          {/* PROFILE PANEL */}
          {activeTab === 'profile' && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 shadow-glass">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
                <Settings className="h-5 w-5 text-gold" /> Profile Settings
              </h2>

              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#121318] border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#121318] border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold text-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">Email Address (Read Only)</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-darkBg border border-white/5 rounded-lg p-2.5 text-xs text-gray-600 outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">Change Password (Leave empty to keep current)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password (min 6 chars)"
                    className="w-full bg-[#121318] border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold text-gray-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="bg-gradient-to-r from-fire to-gold text-white text-xs font-bold py-2.5 px-6 rounded-lg self-start mt-2 shadow-goldGlow"
                >
                  {profileSaving ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
              </form>
            </div>
          )}

          {/* ADDRESSES PANEL */}
          {activeTab === 'addresses' && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 shadow-glass">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gold" /> Shipping Address Manager
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="bg-gold/15 border border-gold/30 hover:bg-gold/25 text-gold text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Address
                </button>
              </div>

              {/* Form to Add */}
              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="bg-darkBg/40 border border-white/5 p-4 rounded-xl mb-6 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-gray-300">Add New Shipping Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Street, Locality"
                      className="bg-[#121318] border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                    />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="bg-[#121318] border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                    />
                    <input
                      type="text"
                      required
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="State"
                      className="bg-[#121318] border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                    />
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="ZIP / Pin Code"
                      className="bg-[#121318] border border-white/10 rounded-lg p-2.5 text-xs focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="flex gap-2 justify-end text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border border-white/10 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addressSaving}
                      className="px-4 py-2 bg-gold text-darkBg rounded-lg"
                    >
                      {addressSaving ? 'Saving...' : 'Add Address'}
                    </button>
                  </div>
                </form>
              )}

              {/* List */}
              {user.addresses?.length === 0 ? (
                <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                  <MapPinOff className="h-10 w-10 text-gray-600 mb-3" />
                  <p className="text-xs">No saved shipping addresses yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses?.map((addr) => (
                    <div key={addr._id} className="p-4 rounded-xl border border-white/10 bg-[#0c0d12]/30 flex justify-between items-start">
                      <div className="text-xs text-gray-400 leading-relaxed">
                        <p className="font-bold text-white mb-1">
                          Address Details {addr.isDefault && <span className="text-[10px] text-gold font-bold bg-gold/10 px-2 py-0.5 rounded-full ml-2">Default</span>}
                        </p>
                        <p>{addr.street}</p>
                        <p>{addr.city}, {addr.state}</p>
                        <p>Zip: {addr.zipCode}</p>
                      </div>
                      <button
                        onClick={() => handleAddressDelete(addr._id)}
                        className="p-1.5 text-gray-500 hover:text-crimson hover:bg-crimson/5 rounded border border-transparent hover:border-crimson/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS HISTORY PANEL */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-6">
              
              {/* Order Tracking Timeline (if active) */}
              {trackingOrder && (
                <div className="glass-panel p-6 rounded-2xl border border-gold/20 shadow-glass">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-6">
                    <h3 className="font-extrabold text-sm text-gold uppercase tracking-wider">
                      ✨ Order Tracking Status: #{trackingOrder._id.substring(0, 8).toUpperCase()}
                    </h3>
                    <button
                      onClick={() => setTrackingOrder(null)}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Close Tracker
                    </button>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="relative pl-6 border-l border-white/10 flex flex-col gap-6">
                    {trackingOrder.trackingTimeline?.map((t, idx) => (
                      <div key={idx} className="relative">
                        {/* Dot indicator */}
                        <div className="absolute -left-[30px] top-1.5 h-3.5 w-3.5 rounded-full bg-gold border border-darkBg shadow-goldGlow flex items-center justify-center animate-pulse" />
                        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-1">
                          <strong className="text-xs text-white uppercase tracking-wider">{t.status}</strong>
                          <span className="text-[10px] text-gray-500">{new Date(t.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 font-light">{t.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders List */}
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 shadow-glass">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
                  <ShoppingBag className="h-5 w-5 text-gold" /> Order History
                </h2>

                {loadingOrders ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <p className="text-xs">You haven't placed any orders yet.</p>
                    <Link to="/shop" className="text-gold hover:underline font-bold text-xs mt-3 block">Go to Showroom</Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                      <div key={order._id} className="p-5 rounded-xl border border-white/10 bg-[#0c0d12]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-xs text-gray-400">
                          <div className="flex items-center gap-2 mb-1.5">
                            <strong className="text-white">ID: #{order._id.substring(0, 8).toUpperCase()}</strong>
                            <span className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="line-clamp-1">Items: {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}</p>
                          <p className="mt-1">
                            Grand Total:{' '}
                            <strong className="text-gold text-sm font-black">₹{order.totalAmount}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          {/* Tracking badge */}
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                              : 'bg-orange-500/10 border border-orange-500/20 text-orange-400 animate-pulse'
                          }`}>
                            {order.orderStatus}
                          </span>

                          <button
                            onClick={() => setTrackingOrder(order)}
                            className="bg-white/5 border border-white/10 hover:border-gold/30 hover:text-gold text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Track
                          </button>

                          <a
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/${order._id}/invoice`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-gold/10 hover:bg-gold/20 text-gold rounded border border-gold/25"
                            title="Print Invoice"
                          >
                            <Printer className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
