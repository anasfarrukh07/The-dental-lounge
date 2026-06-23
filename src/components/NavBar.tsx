import React from 'react';
import { Sparkles, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface NavBarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onBookClick: () => void;
  role?: 'patient' | 'admin' | null;
}

export default function NavBar({ currentView, onViewChange, onBookClick, role }: NavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'services', label: 'Services' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'contact', label: 'Contact' },
    ...(role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', badge: 'Live Content Editor' }] : [])
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300 h-20 flex justify-between items-center px-6 md:px-16">
      {/* Brand Logo */}
      <div 
        onClick={() => onViewChange('home')}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <span className="p-1.5 bg-primary/10 rounded-lg text-primary group-hover:rotate-12 transition-transform duration-300">
          <Sparkles className="w-5 h-5 fill-current" />
        </span>
        <span className="font-display font-extrabold text-xl tracking-tight text-primary">
          The Digital Lounge
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = currentView === item.id || (item.id === 'services' && currentView === 'home');
          return (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`font-sans text-sm font-medium transition-colors hover:text-primary relative py-1 flex items-center gap-1.5 ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {item.label}
              {item.badge && (
                <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-secondary" />
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Action Buttons */}
      <div className="hidden sm:flex items-center gap-4">
        <button 
          onClick={() => onViewChange('login')}
          className={`font-sans tracking-tight text-sm font-semibold hover:opacity-80 transition-all ${
            currentView === 'login' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          Login
        </button>
        <button 
          onClick={onBookClick}
          className="bg-primary text-white border border-transparent px-6 py-2.5 rounded-full font-sans text-sm font-semibold hover:opacity-80 transition-all active:scale-95 shadow-lg shadow-primary/20 hover:shadow-primary/30"
        >
          Book Now
        </button>
      </div>

      {/* Mobile Hamburger toggle */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="block lg:hidden text-on-surface-variant hover:text-primary p-2"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white border-b border-surface-container-high shadow-xl p-6 flex flex-col gap-4 lg:hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`font-sans text-left text-base font-semibold py-2.5 border-b border-surface-container/50 flex justify-between items-center ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.label}
                  {item.badge && (
                    <span className="text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </span>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </button>
            );
          })}
          <div className="flex flex-col gap-3 pt-4">
            <button 
              onClick={() => {
                onViewChange('login');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-center font-semibold text-on-surface-variant border border-outline-variant/30 rounded-xl hover:bg-surface-container-low"
            >
              Login
            </button>
            <button 
              onClick={() => {
                onBookClick();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-primary text-white py-3 text-center font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
