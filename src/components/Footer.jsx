import React, { useState } from 'react';
import { Sparkles, Phone, Mail, MapPin, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      addToast('Thank you for subscribing to our newsletter!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#030406] border-t border-gold/10 pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & About */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-gold" />
              <span className="font-extrabold text-lg tracking-wider text-glow-gold uppercase bg-gradient-to-r from-gold to-orange-500 bg-clip-text text-transparent">
                Sparklers
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Experience the magic of premium fireworks. Bringing vibrant lights, beautiful colors, and spectacular sounds to Sivakasi and beyond since 1998.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="p-2 bg-white/5 hover:bg-gold/15 rounded-full border border-white/5 hover:border-gold/30 text-gray-400 hover:text-gold transition-all">
                <Facebook className="h-4.5 w-4.5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-gold/15 rounded-full border border-white/5 hover:border-gold/30 text-gray-400 hover:text-gold transition-all">
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-gold/15 rounded-full border border-white/5 hover:border-gold/30 text-gray-400 hover:text-gold transition-all">
                <Twitter className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-gold transition-colors">Home</a></li>
              <li><a href="/shop" className="hover:text-gold transition-colors">All Products</a></li>
              <li><a href="/cart" className="hover:text-gold transition-colors">Shopping Cart</a></li>
              <li><a href="/dashboard" className="hover:text-gold transition-colors">My Profile</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">Contact Showroom</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span>45 Bypass Road, Fireworks Complex, Sivakasi, Tamil Nadu - 626123</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-gold shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-gold shrink-0" />
                <span>sales@sparklersshowroom.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Subscribe to get alerts on new arrivals, safety guides, and exclusive festival discount coupons.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#121318] border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1 text-gold hover:text-orange-400 transition-colors"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/5 pt-8 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-4">
          <p>&copy; 2026 Sparklers Premium Showroom. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <span>&middot;</span>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
