import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, ShieldAlert, Key, User, Mail, Phone, Lock } from 'lucide-react';

const Auth = () => {
  const { login, register, verifyOTP } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Tabs state
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return addToast('Please enter credentials', 'warning');
    
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      addToast('Logged in successfully!', 'success');
      if (res.user && res.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      addToast(res.message, 'error');
      // If unverified, automatically show the OTP input panel!
      if (res.unverified) {
        setVerifyEmail(res.email);
        setIsVerifying(true);
      }
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return addToast('Please fill required fields', 'warning');

    setSubmitting(true);
    const res = await register(name, email, password, phone);
    setSubmitting(false);

    if (res.success) {
      addToast(res.message, 'success');
      setActiveTab('login'); // Switch directly to login tab
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return addToast('Please enter a valid 6-digit OTP', 'warning');

    setSubmitting(true);
    const res = await verifyOTP(verifyEmail, otp);
    setSubmitting(false);

    if (res.success) {
      addToast('Email verified! Account registered successfully.', 'success');
      if (res.user && res.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } else {
      addToast(res.message, 'error');
    }
  };

  return (
    <div className="pt-28 min-h-screen pb-20 flex items-center justify-center bg-[#050609] px-4 relative">
      {/* Decorative glows */}
      <div className="absolute top-[20%] left-[30%] h-72 w-72 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[30%] h-72 w-72 bg-fire/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full glass-panel border border-gold/15 p-8 rounded-2xl shadow-2xl relative z-10">
        
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 justify-center mb-3">
            <Sparkles className="h-6 w-6 text-gold" />
            <span className="font-extrabold text-lg tracking-wider text-glow-gold uppercase bg-gradient-to-r from-gold to-orange-500 bg-clip-text text-transparent">
              Sparklers
            </span>
          </Link>
          <p className="text-xs text-gray-500">Premium Celebration Partner</p>
        </div>

        {/* OTP VERIFICATION STEP */}
        {isVerifying ? (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-white uppercase flex items-center justify-center gap-1.5">
                <Key className="h-4.5 w-4.5 text-gold" /> OTP Verification
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                We sent a 6-digit code to <strong>{verifyEmail}</strong>. Check your console log if SMTP is offline.
              </p>
            </div>

            <form onSubmit={handleOTPSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">Enter OTP Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full bg-[#121318] border border-white/10 rounded-lg px-4 py-3 text-center font-bold text-lg text-gold tracking-widest focus:outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-glow-gold text-white font-extrabold text-xs py-3 rounded-lg uppercase tracking-wider mt-2"
              >
                {submitting ? 'Verifying...' : 'Verify OTP & Log In'}
              </button>

              <button
                type="button"
                onClick={() => setIsVerifying(false)}
                className="text-xs text-gray-500 hover:text-white transition-colors text-center block mt-3 underline"
              >
                Back to Auth Form
              </button>
            </form>
          </div>
        ) : (
          /* LOGIN & SIGNUP FORMS */
          <div>
            {/* Toggle tabs */}
            <div className="flex border-b border-white/5 mb-6">
              <button
                onClick={() => setActiveTab('login')}
                className={`w-1/2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors focus:outline-none ${
                  activeTab === 'login'
                    ? 'border-gold text-gold font-black'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`w-1/2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors focus:outline-none ${
                  activeTab === 'signup'
                    ? 'border-gold text-gold font-black'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                Sign Up
              </button>
            </div>

            {activeTab === 'login' ? (
              /* LOGIN */
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-[#121318] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold text-gray-200"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-600" />
                  </div>
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest block">Password</label>
                    <a href="#" className="text-[10px] text-gold hover:underline">Forgot?</a>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full bg-[#121318] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold text-gray-200"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-600" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-glow-gold text-white font-extrabold text-xs py-3 rounded-lg uppercase tracking-wider mt-4"
                >
                  {submitting ? 'Logging in...' : 'Sign In'}
                </button>

                {/* Quick Info */}
                <div className="flex items-start gap-2 bg-gold/5 border border-gold/15 p-3 rounded-lg mt-4 text-[10px] text-gold/80 leading-relaxed">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    To test admin dashboard, login with <strong>admin@sparklersadmin.com</strong> / <strong>adminpassword</strong>
                  </span>
                </div>
              </form>
            ) : (
              /* SIGNUP */
              <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-[#121318] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold text-gray-200"
                    />
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-600" />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-[#121318] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold text-gray-200"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-600" />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-[#121318] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold text-gray-200"
                    />
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-600" />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full bg-[#121318] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-gold text-gray-200"
                    />
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-600" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-glow-gold text-white font-extrabold text-xs py-3 rounded-lg uppercase tracking-wider mt-4"
                >
                  {submitting ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
