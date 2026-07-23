import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingCart, User, Search, Menu, X, ChevronDown, 
  Sparkles, LogOut, LayoutDashboard, Heart, Flame,
  Crown, Gift, Rocket, PartyPopper, Star, Zap
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    fetchCategories();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.log('Error fetching categories in navbar, using static fallbacks.');
      setCategories([
        { _id: '1', name: 'Sparklers', icon: '✨' },
        { _id: '2', name: 'Ground Wheels', icon: '🎡' },
        { _id: '3', name: 'Flower Pots', icon: '🌸' },
        { _id: '4', name: 'Rockets', icon: '🚀' },
        { _id: '5', name: 'Aerial Shells', icon: '🎆' },
      ]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchFocused(false);
    }
  };

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-[#0a080c]/95 backdrop-blur-2xl border-b border-amber-200/10 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]'
          : 'bg-transparent py-5'
      }`}
    >
      {/* Animated gradient line */}
      <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent transition-all duration-1000 ${
        scrolled ? 'opacity-100' : 'opacity-0'
      }`} style={{ width: '100%' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo - Premium Design */}
          <Link to="/" className="flex items-center gap-3 group relative">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-2 bg-gradient-to-br from-amber-400/20 to-amber-600/10 rounded-full border border-amber-400/30 group-hover:border-amber-400/60 transition-all duration-500 shadow-lg shadow-amber-400/10">
                <Sparkles className="h-6 w-6 text-amber-300 group-hover:rotate-12 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-wider bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                Sparklers
              </span>
              <span className="text-[8px] font-medium text-amber-400/60 tracking-[0.3em] uppercase -mt-0.5">
                Premium Fireworks
              </span>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className="relative px-4 py-2 text-sm font-medium text-amber-100/70 hover:text-amber-200 transition-colors group"
            >
              <span>Home</span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-200 group-hover:w-full group-hover:left-0 transition-all duration-300" />
            </Link>
            
            {/* Category Dropdown - Premium */}
            <div className="relative">
              <button
                onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-amber-100/70 hover:text-amber-200 transition-colors group"
              >
                <span>Categories</span>
                <motion.div
                  animate={{ rotate: catDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-200 group-hover:w-full group-hover:left-0 transition-all duration-300" />
              </button>
              
              <AnimatePresence>
                {(catDropdownOpen || isHovering) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-[#0a080c]/95 backdrop-blur-2xl rounded-2xl border border-amber-200/15 shadow-2xl shadow-black/50 py-2 overflow-hidden"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-400/5 to-transparent" />
                    {categories.map((cat, index) => (
                      <motion.div
                        key={cat._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={`/shop?category=${encodeURIComponent(cat.name)}`}
                          className="relative flex items-center gap-3 px-5 py-2.5 text-sm text-amber-100/70 hover:text-amber-200 hover:bg-amber-400/5 transition-all duration-300 group"
                          onClick={() => setCatDropdownOpen(false)}
                        >
                          <span className="text-lg">{cat.icon || '🎆'}</span>
                          <span>{cat.name}</span>
                          <span className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-amber-400/50">
                            →
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/shop" 
              className="relative px-4 py-2 text-sm font-medium text-amber-100/70 hover:text-amber-200 transition-colors group"
            >
              <span>Showroom</span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-200 group-hover:w-full group-hover:left-0 transition-all duration-300" />
            </Link>
          </div>

          {/* Search bar & Actions (Desktop) - Premium */}
          <div className="hidden md:flex items-center gap-3">
            <motion.form 
              onSubmit={handleSearchSubmit} 
              className="relative"
              animate={{ width: searchFocused ? '280px' : '200px' }}
              transition={{ duration: 0.3 }}
            >
              <div className={`relative transition-all duration-300 ${
                searchFocused ? 'shadow-lg shadow-amber-400/10' : ''
              }`}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  placeholder="Search crackers..."
                  className="w-full bg-[#0a080c]/60 backdrop-blur-sm border border-amber-200/20 hover:border-amber-400/40 focus:border-amber-400/60 rounded-full px-4 py-2.5 pl-10 text-xs text-amber-100 placeholder-amber-400/30 focus:outline-none transition-all duration-300"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/40" />
              </div>
            </motion.form>

            {/* Cart Icon - Premium */}
            <Link to="/cart" className="relative group">
              <div className="p-2 rounded-full bg-amber-400/5 border border-amber-400/10 group-hover:border-amber-400/30 group-hover:bg-amber-400/10 transition-all duration-300">
                <ShoppingCart className="h-5 w-5 text-amber-100/70 group-hover:text-amber-200 transition-colors" />
              </div>
              {totalCartItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-400 to-amber-600 text-black text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-amber-400/30"
                >
                  {totalCartItems}
                </motion.span>
              )}
            </Link>

            {/* Profile Dropdown - Premium */}
            {user ? (
              <div className="flex items-center gap-2 border-l border-amber-200/10 pl-4">
                <div className="flex items-center gap-2">
                  {user.role === 'admin' ? (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 hover:border-amber-400/40 text-amber-300 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" /> 
                      <span>Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 hover:border-amber-400/40 text-amber-300 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300"
                    >
                      <User className="h-3.5 w-3.5" /> 
                      <span>Profile</span>
                    </Link>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-amber-400/10 text-amber-100/50 hover:text-amber-400 transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </motion.button>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs px-5 py-2.5 rounded-full shadow-lg shadow-amber-400/20 hover:shadow-amber-400/40 transition-all duration-300"
                >
                  <User className="h-3.5 w-3.5" /> 
                  <span>Sign In</span>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Hamburger Menu (Mobile) - Premium */}
          <div className="flex items-center md:hidden gap-2">
            {/* Mobile Cart Link */}
            <Link to="/cart" className="relative group">
              <div className="p-2 rounded-full bg-amber-400/5 border border-amber-400/10">
                <ShoppingCart className="h-5 w-5 text-amber-100/70" />
              </div>
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-400 to-amber-600 text-black text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-amber-400/30">
                  {totalCartItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-amber-400/5 border border-amber-400/10 hover:bg-amber-400/10 hover:border-amber-400/30 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-amber-300" />
              ) : (
                <Menu className="h-5 w-5 text-amber-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu - Premium */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-x-0 top-[72px] bg-[#0a080c]/98 backdrop-blur-2xl border-b border-amber-200/10 shadow-2xl shadow-black/50 py-6 px-6 flex flex-col gap-4 max-h-[calc(100vh-72px)] overflow-y-auto"
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-[#0a080c]/80 backdrop-blur-sm border border-amber-200/20 focus:border-amber-400/60 rounded-full px-4 py-3 pl-12 text-sm text-amber-100 placeholder-amber-400/30 focus:outline-none transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/40" />
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-400/5 transition-all duration-300 text-amber-100/70 hover:text-amber-200"
              >
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">Home</span>
              </Link>
              
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-400/5 transition-all duration-300 text-amber-100/70 hover:text-amber-200"
              >
                <Rocket className="h-4 w-4" />
                <span className="font-medium">Showroom</span>
              </Link>

              {/* Mobile Categories */}
              <div className="space-y-1 mt-2">
                <p className="px-4 text-[10px] font-bold text-amber-400/40 uppercase tracking-[0.2em]">Categories</p>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 ml-4 rounded-xl hover:bg-amber-400/5 transition-all duration-300 text-amber-100/50 hover:text-amber-200 text-sm"
                  >
                    <span className="text-base">{cat.icon || '🎆'}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Auth Section */}
            {user ? (
              <div className="border-t border-amber-200/10 pt-4 mt-2 space-y-2">
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 transition-all duration-300"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="font-medium">Admin Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 transition-all duration-300"
                  >
                    <User className="h-4 w-4" />
                    <span className="font-medium">My Account</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-400/5 text-amber-100/50 hover:text-amber-400 transition-all duration-300 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-amber-200/10 pt-4 mt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-amber-400/20 transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In / Register</span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;