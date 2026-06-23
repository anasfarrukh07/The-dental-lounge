import React from 'react';
import { ShieldAlert, Smile, KeyRound, Mail, Sparkles, User, LogIn, Laptop, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (role: 'admin' | 'patient', name: string) => void;
  onAddNotification: (title: string, desc: string, type: 'success' | 'info' | 'error') => void;
}

export default function LoginView({ onLoginSuccess, onAddNotification }: LoginViewProps) {
  const [activeTab, setActiveTab2] = React.useState<'login' | 'signup'>('login');
  const [email, setEmail] = React.useState('dr.vance@thedigitallounge.com');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'login') {
      if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('dr.vance')) {
        onLoginSuccess('admin', 'Dr. Elena Vance');
        onAddNotification("Logged In", "Head Administrator Session authorized. Redirecting to Patient Queue Dashboard...", "success");
      } else {
        onLoginSuccess('patient', name || 'Patient Guest');
        onAddNotification("Logged In", "Patient Guest session success.", "info");
      }
    } else {
      onLoginSuccess('patient', name || 'New Patient User');
      onAddNotification("Account Activated", "Welcome to The Digital Lounge digital family!", "success");
    }
  };

  const handleBypassAdmin = () => {
    onLoginSuccess('admin', 'Dr. Elena Vance');
    onAddNotification("Admin Bypass", "Head Clinician authorization active. Loading Queue Controls...", "success");
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center p-6 bg-background">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 glass-panel rounded-[40px] shadow-2xl overflow-hidden border border-white/30">
        
        {/* Left Side: Innovation callout details */}
        <div className="md:col-span-5 bg-gradient-to-tr from-primary to-secondary p-8 md:p-12 text-white text-left flex flex-col justify-between relative min-h-[360px] md:min-h-[500px]">
          {/* Subtle graphical glow */}
          <div className="absolute inset-0 bg-black/10 z-0"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <span className="p-1.5 bg-white/20 rounded-lg">
                <Sparkles className="w-5 h-5 fill-current" />
              </span>
              <span className="font-display font-extrabold text-sm tracking-widest text-primary-container">
                THE LOUNGE STUDY
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-extrabold leading-tight mb-4 text-white">
              Innovation in Care.
            </h2>
            <p className="font-sans text-xs md:text-sm text-white/80 leading-relaxed font-light">
              We replace old tactile anxieties with state-of-the-art precision tools, automated 3D scanners, and immediate digital mappings.
            </p>
          </div>

          <div className="relative z-10">
            <span className="inline-block bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[10px] md:text-xs font-semibold leading-none mb-4 uppercase tracking-widest text-primary-container">
              🚀 OVER 10,000 SCANS ANNUALLY
            </span>

            {/* Avatar Stack Overlay */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img 
                  className="w-9 h-9 rounded-full border-2 border-primary object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO6Ug-2wcVe1g78BTQDnHTv-1DnvbCX-U0n9XLJ0PsRAqb6sbmcELmateA8KRyTMRnK7fYvKtsBZ7JiT9hku1FaFe231JqhzqiHhtLrLiqHx0shpk5EThDeHlKBAwe7JmQu_SbAQqgSXvCXO-R4gyQ05fuZsP5h5mI57azzw_sqG_UVsS3n0dSV-xSrOW0p-d_0PfPQRKjo9S1EO3622yvX0A_3lsYZgv0PFneLnno2B11CDlMGGZYS3QA361UawgbR6dwMbw22fYj" 
                  alt="Avatar 1"
                  referrerPolicy="no-referrer"
                />
                <img 
                  className="w-9 h-9 rounded-full border-2 border-primary object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEFG1yvCqg_nWSlftTrMt_zcUKI-IgbQ6q-tkbkFsQCOLDPQ7lMX_tYwe7CXt7HUlLZ72a6NkNYAb8UqQPQYN6xy9PQruLiT8mi97jx3lvR2COu2WC3JVR89nS_mu2n_oypbPlTrMFRcEvTZUGS_q8cB8kFDWpPtKWBzME2WvpLSXZUvhexVha8nhrDFHE-mBZ2gVzGjiuc56TLozxwJr8VqzVOJVC7b0WMOR-orJJiZB9PO9hbLHq5yVXDd-3sNnlL3uYIJxyco8Y" 
                  alt="Avatar 2"
                  referrerPolicy="no-referrer"
                />
                <div className="w-9 h-9 rounded-full bg-primary-container border-2 border-primary flex items-center justify-center font-bold text-[10px] text-primary">
                  10k+
                </div>
              </div>
              <p className="font-sans text-[11px] md:text-xs text-white/85">
                Join our patient registry.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form & Inputs */}
        <div className="md:col-span-7 p-8 md:p-12 text-left bg-white flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex border-b border-surface-container mb-6">
            <button
              onClick={() => {
                setActiveTab2('login');
                setEmail('dr.vance@thedigitallounge.com');
              }}
              className={`pb-4 px-4 font-display font-medium text-sm transition-all focus:outline-none ${
                activeTab === 'login' 
                  ? 'border-b-2 border-primary text-primary font-bold' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab2('signup');
                setEmail('');
              }}
              className={`pb-4 px-4 font-display font-medium text-sm transition-all focus:outline-none ${
                activeTab === 'signup' 
                  ? 'border-b-2 border-primary text-primary font-bold' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Join the Lounge
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {activeTab === 'signup' && (
              <div className="flex flex-col gap-1.5ClassName">
                <label className="font-sans text-xs font-bold text-on-surface-variant">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-on-surface-variant" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-background"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs font-bold text-on-surface-variant">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-on-surface-variant" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-background"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="font-sans text-xs font-bold text-on-surface-variant">Security Password</label>
                {activeTab === 'login' && (
                  <button type="button" className="text-[10px] text-primary hover:underline font-bold">
                    Forgot Key?
                  </button>
                )}
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-on-surface-variant" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-outline-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-background"
                />
              </div>
            </div>

            {/* Quick staff / admin helper overlay box */}
            {activeTab === 'login' && (
              <div className="p-4 bg-secondary-container/30 border border-secondary-container rounded-xl flex gap-3 text-left">
                <Laptop className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans font-bold text-xs text-on-secondary-container">Staff / Administrator Account</h4>
                  <p className="font-sans text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                    Log in with <code className="font-mono bg-white px-1.5 py-0.5 rounded border">dr.vance@thedigitallounge.com</code> to modify the clinic website copies, view customer contact forms, and update patient queue logs dynamically.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3.5 rounded-xl font-sans text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/10"
            >
              {activeTab === 'login' ? "Sign In" : "Register and Enter"}
              <LogIn className="w-4 h-4" />
            </button>
          </form>

          {/* Super cool, easy credentials bypass for clinic testing */}
          {activeTab === 'login' && (
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-surface-container"></div>
              <span className="flex-shrink mx-4 text-[10px] text-on-surface-variant font-bold uppercase tracking-widest font-sans">
                OR
              </span>
              <div className="flex-grow border-t border-surface-container"></div>
            </div>
          )}

          {activeTab === 'login' && (
            <button
              onClick={handleBypassAdmin}
              className="w-full border-2 border-dashed border-primary/40 hover:border-primary text-primary bg-primary/5 hover:bg-primary/10 py-3.5 rounded-xl font-sans text-xs font-bold leading-none flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <ShieldAlert className="w-4.5 h-4.5 text-primary animate-bounce" />
              Developer Bypass: Login as lead Admin Doctor
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
