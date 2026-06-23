import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Calendar, Heart, Shield, Activity, Phone, MapPin, 
  Clock, CheckCircle, AlertTriangle, Info, X, ChevronRight, UserCheck 
} from 'lucide-react';

import NavBar from './components/NavBar.js';
import Hero from './components/Hero.js';
import Services from './components/Services.js';
import DoctorsList from './components/DoctorsList.js';
import ContactForm from './components/ContactForm.js';
import LoginView from './components/LoginView.js';
import AdminDashboard from './components/AdminDashboard.js';

import { ClinicContent, Doctor, Appointment, PatientRecord, ContactMessage } from './types.js';

export default function App() {
  const [currentView, setCurrentView] = React.useState<string>('home');
  const [role, setRole] = React.useState<'patient' | 'admin' | null>(null);
  const [userName, setUserName] = React.useState<string>('');

  // Domain data states
  const [content, setContent] = React.useState<ClinicContent>({
    heroTitle: "Experience the Digital Lounge.",
    heroSubtitle: "Precision oral health meets high-tech comfort. We've redesigned dentistry from the ground up to provide a serene, data-driven experience.",
    announcement: "The Future of Dental Care",
    phone: "(555) 012-3456",
    tagline: "The Digital Lounge"
  });

  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [patients, setPatients] = React.useState<PatientRecord[]>([]);
  const [messages, setMessages] = React.useState<ContactMessage[]>([]);

  // Layout UI states
  const [notifications, setNotifications] = React.useState<Array<{
    id: string;
    title: string;
    desc: string;
    type: 'success' | 'info' | 'error';
  }>>([]);
  const [bookingModalOpen, setBookingModalOpen] = React.useState(false);
  const [preSelectedDoctor, setPreSelectedDoctor] = React.useState<Doctor | null>(null);
  
  // Booking Form state
  const [bookingName, setBookingName] = React.useState('');
  const [bookingEmail, setBookingEmail] = React.useState('');
  const [bookingPhone, setBookingPhone] = React.useState('');
  const [bookingService, setBookingService] = React.useState('Laser Whitening');
  const [bookingDate, setBookingDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = React.useState('10:00');
  const [submittingBooking, setSubmittingBooking] = React.useState(false);

  // Focus assessment helper flag
  const [showAssessment, setShowAssessment] = React.useState(false);

  // Fetching dynamic storage
  const fetchAllData = async () => {
    try {
      // 1. Content copies
      const contentRes = await fetch('/api/content');
      if (contentRes.ok) {
        const data = await contentRes.json();
        setContent(data);
      }

      // 2. Doctors team
      const docsRes = await fetch('/api/doctors');
      if (docsRes.ok) {
        const data = await docsRes.json();
        setDoctors(data);
      }

      // 3. Appointments list
      const apptsRes = await fetch('/api/appointments');
      if (apptsRes.ok) {
        const data = await apptsRes.json();
        setAppointments(data);
      }

      // 4. Patients database list
      const patientsRes = await fetch('/api/patients');
      if (patientsRes.ok) {
        const data = await patientsRes.json();
        setPatients(data);
      }

      // 5. Contact Enquiries Inbox
      const messagesRes = await fetch('/api/messages');
      if (messagesRes.ok) {
        const data = await messagesRes.json();
        setMessages(data);
      }
    } catch (e) {
      console.warn("Backend dynamic APIs offline. Running with seamless mock memory sync.", e);
    }
  };

  React.useEffect(() => {
    fetchAllData();
  }, []);

  // Notifications manager
  const addNotification = (title: string, desc: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, title, desc, type }]);
    
    // Auto erase
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  };

  const handleBookSelectedDoctor = (doc: Doctor) => {
    setPreSelectedDoctor(doc);
    setBookingModalOpen(true);
  };

  // Submit appointment scheduling booking form
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName) {
      addNotification("Validation Error", "Patient name is required to book a clinic queue slot.", "error");
      return;
    }

    setSubmittingBooking(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientName: bookingName,
          phoneNumber: bookingPhone || '555-010-0909',
          email: bookingEmail || `${bookingName.toLowerCase().replace(/\s+/g, '')}@example.com`,
          date: bookingDate,
          time: bookingTime,
          serviceType: preSelectedDoctor ? `${preSelectedDoctor.specialty} Consult` : bookingService
        })
      });

      if (res.ok) {
        addNotification(
          "Appointment Scheduled", 
          `Registered successfully. A clinical slot is authorized for ${bookingDate} at ${bookingTime}.`, 
          "success"
        );
        setBookingModalOpen(false);
        setBookingName('');
        setBookingEmail('');
        setBookingPhone('');
        setPreSelectedDoctor(null);
        
        // Refresh local memory and sync list
        fetchAllData();
      } else {
        throw new Error();
      }
    } catch (err) {
      addNotification("Network Timeout", "Failed to finalize database registration.", "error");
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-on-surface antialiased overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      
      {/* Dynamic Toast Alerts Container Overlay */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3.5 max-w-sm w-full">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`p-4 rounded-2xl glass-panel shadow-xl flex gap-3 text-left border ${
                n.type === 'success' 
                  ? 'border-emerald-200 bg-emerald-50/95 text-emerald-900 shadow-emerald-700/5' 
                  : n.type === 'error'
                  ? 'border-red-200 bg-red-50/95 text-red-900 shadow-red-700/5'
                  : 'border-primary/20 bg-white/95 text-on-surface shadow-primary/5'
              }`}
            >
              <span className="shrink-0 mt-0.5">
                {n.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                {n.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                {n.type === 'info' && <Info className="w-5 h-5 text-primary" />}
              </span>
              <div className="flex-1">
                <h4 className="font-display font-bold text-xs leading-tight">{n.title}</h4>
                <p className="font-sans text-[11px] font-light leading-relaxed mt-1 opacity-90">{n.desc}</p>
              </div>
              <button 
                onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}
                className="hover:opacity-75 h-fit p-0.5"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-black" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <NavBar 
        currentView={currentView} 
        onViewChange={(view) => {
          if (view === 'admin' && role !== 'admin') {
            setCurrentView('login');
            addNotification("Authentication Required", "Please log in with admin credentials to access the Admin Panel.", "error");
            return;
          }
          setCurrentView(view);
          setShowAssessment(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBookClick={() => setBookingModalOpen(true)}
        role={role}
      />

      {/* Primary Context Workspace with Stagger Transitions */}
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (showAssessment ? '_assess' : '')}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentView === 'home' && (
              <>
                <Hero 
                  content={content} 
                  onExploreServices={() => {
                    const el = document.getElementById('services-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onBookAppointment={() => setBookingModalOpen(true)}
                />
                
                {/* Dynamic Science of Smile custom list section */}
                <section className="py-24 px-6 md:px-16 bg-white border-y border-surface-container">
                  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
                    <div className="lg:col-span-6 flex flex-col gap-6">
                      <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
                        The Science of a Perfect Smile
                      </h2>
                      <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed font-light">
                        We blend dynamic AI tooth diagnostics with micro-robotic surgery tools to deliver painless precision, comfortable relaxation, and elite custom treatment files.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        {[
                          { title: "Dynamic AI Diagnostics", desc: "Predictive smile mapping accuracy." },
                          { title: "Comfort Tech Suites", desc: "No tactile noise, relaxing layout." },
                          { title: "Robotic Surgi-Guides", desc: "Same-day restoration implants." },
                          { title: "Modern Lounge Living", desc: "Premium bar & tech screens." }
                        ].map((item, idx) => (
                          <div key={idx} className="flex gap-2.5">
                            <span className="p-1 h-fit rounded bg-primary/10 text-primary mt-0.5">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </span>
                            <div>
                              <h4 className="font-display font-semibold text-xs text-on-surface">{item.title}</h4>
                              <p className="font-sans text-[11px] text-on-surface-variant font-light mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => setCurrentView('services')}
                        className="bg-neutral-900 hover:bg-neutral-800 text-white font-sans text-xs font-semibold uppercase tracking-wider px-6.5 py-3 rounded-full w-fit flex items-center gap-1.5 mt-4 transition-all"
                      >
                        Our Technology Stack
                        <ChevronRight className="w-4 h-4 text-[#00f0ff]" />
                      </button>
                    </div>

                    <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                      <div className="p-8 bg-surface-container-low rounded-[28px] border text-center flex flex-col items-center justify-center gap-2">
                        <h2 className="font-display font-extrabold text-3xl text-primary">10k+</h2>
                        <span className="font-sans text-[11px] font-bold text-on-surface-variant tracking-wider uppercase">Scans Completed</span>
                      </div>
                      <div className="p-8 bg-surface-container-low rounded-[28px] border text-center flex flex-col items-center justify-center gap-2">
                        <h2 className="font-display font-extrabold text-3xl text-secondary">99.2%</h2>
                        <span className="font-sans text-[11px] font-bold text-on-surface-variant tracking-wider uppercase">Smile Satisfaction</span>
                      </div>
                      <div className="col-span-2 p-6 bg-secondary-container text-on-secondary-container rounded-[28px] text-center border">
                        <h3 className="font-display font-bold text-sm">Need automated smile recommendations?</h3>
                        <button 
                          onClick={() => {
                            setCurrentView('contact');
                            setShowAssessment(true);
                          }}
                          className="mt-3 bg-white text-on-surface text-xs font-bold py-2 px-5 rounded-full shadow-sm hover:shadow hover:bg-neutral-50 transition-all font-sans"
                        >
                          Launch Smile Diagnosis
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <Services onLearnMore={(title) => {
                  addNotification("Service Insight", `Learn more widget loaded for ${title}.`, "info");
                  setBookingService(title);
                  setBookingModalOpen(true);
                }} />

                {/* Elegant Dynamic Upgrade Prompt Block */}
                <section className="py-24 px-6 md:px-16 text-center bg-neutral-900 text-white relative overflow-hidden select-none">
                  <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
                    <span className="p-2 bg-primary/20 rounded-2xl text-[#00f0ff] animate-pulse">
                      <Sparkles className="w-6 h-6 fill-current" />
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white">
                      Ready for a digital upgrade?
                    </h2>
                    <p className="font-sans text-sm sm:text-base text-gray-300 font-light leading-relaxed max-w-xl">
                      Experience dental care aligned with modern standards. Schedule secure appointments in seconds.
                    </p>
                    <div className="flex flex-wrap gap-4 mt-2 justify-center">
                      <button 
                        onClick={() => setBookingModalOpen(true)}
                        className="bg-primary hover:opacity-90 hover:scale-105 hover:shadow-xl hover:shadow-primary/25 text-white font-sans text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-all"
                      >
                        Schedule Online Instantly
                      </button>
                      <a 
                        href={`tel:${content.phone}`}
                        className="border border-white/20 bg-white/5 hover:bg-white/10 font-sans text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-all flex items-center gap-2"
                      >
                        Call Lounge Suite
                      </a>
                    </div>
                  </div>
                  
                  {/* Glowing decoration rings in margins */}
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full border border-white/5 pointer-events-none"></div>
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 rounded-full border border-white/5 pointer-events-none"></div>
                </section>
              </>
            )}

            {currentView === 'services' && (
              <Services onLearnMore={(title) => {
                setBookingService(title);
                setBookingModalOpen(true);
              }} />
            )}

            {currentView === 'doctors' && (
              <DoctorsList 
                doctors={doctors}
                onBookDoctor={handleBookSelectedDoctor}
                onStartAssessment={() => {
                  setCurrentView('contact');
                  setShowAssessment(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentView === 'contact' && (
              <ContactForm 
                phone={content.phone}
                onAddNotification={addNotification}
                showAssessmentInitially={showAssessment}
              />
            )}

            {currentView === 'login' && (
              <LoginView 
                onLoginSuccess={(userRole, name) => {
                  setRole(userRole);
                  setUserName(name);
                  if (userRole === 'admin') {
                    setCurrentView('admin');
                  } else {
                    setCurrentView('home');
                  }
                }}
                onAddNotification={addNotification}
              />
            )}

            {currentView === 'admin' && (
              <AdminDashboard 
                content={content}
                doctors={doctors}
                appointments={appointments}
                patients={patients}
                messages={messages}
                onUpdateContent={(updatedContent) => setContent(updatedContent)}
                onAddNotification={addNotification}
                onLogout={() => {
                  setRole(null);
                  setUserName('');
                  setCurrentView('home');
                  addNotification("Logged Out", "Admin session closed successfully.", "info");
                }}
                onRefreshAll={fetchAllData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating instantaneous Book Instantly widget bar in page margin */}
      {currentView !== 'admin' && (
        <div className="fixed bottom-6 right-6 z-30 select-none">
          <button
            onClick={() => setBookingModalOpen(true)}
            className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-full hover:shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all text-xs font-bold leading-none tracking-wider shadow-xl shadow-primary/10 cursor-pointer animate-bounce"
          >
            <Calendar className="w-4 h-4 shrink-0" />
            Book Instantly
          </button>
        </div>
      )}

      {/* Premium overlay Booking Scheduler modal */}
      <AnimatePresence>
        {bookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border rounded-[36px] w-full max-w-lg shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto border-surface-container-high/60 text-left flex flex-col gap-6"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setBookingModalOpen(false);
                  setPreSelectedDoctor(null);
                }}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-1.5 pt-2">
                <span className="p-2 bg-primary/10 text-primary w-fit rounded-xl">
                  <Calendar className="w-6 h-6" />
                </span>
                <h3 className="font-display font-extrabold text-2xl text-on-surface mt-2">
                  {preSelectedDoctor ? `Book Team Specialist` : `Book Appointment`}
                </h3>
                <p className="font-sans text-xs text-on-surface-variant font-light">
                  {preSelectedDoctor 
                    ? `Schedule consultation directly with ${preSelectedDoctor.name}.`
                    : `Enter your profile to confirm high-tech clinical queue placement.`
                  }
                </p>
              </div>

              {preSelectedDoctor && (
                <div className="p-3.5 bg-secondary-container/30 border border-secondary bg-background/50 rounded-2xl flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden border border-primary/20 shrink-0 select-none">
                    <img src={preSelectedDoctor.image} alt={preSelectedDoctor.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-primary">{preSelectedDoctor.name}</h5>
                    <p className="font-sans text-[10px] text-on-surface-variant mt-0.5">{preSelectedDoctor.specialty} • Lead Specialist</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    placeholder="Enter your first and last name"
                    className="p-3 border border-outline-variant bg-background rounded-xl text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-semibold text-on-surface-variant font-medium">Telephone Address *</label>
                    <input
                      type="tel"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      placeholder="+1 (555) 012-3456"
                      className="p-3 border border-outline-variant bg-background rounded-xl text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 text-left">
                    <label className="font-sans text-xs font-semibold text-on-surface-variant font-medium">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="p-3 border border-outline-variant bg-background rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                {!preSelectedDoctor && (
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-semibold text-on-surface-variant">Select Clinical Treatment Opportunity</label>
                    <select
                      value={bookingService}
                      onChange={(e) => setBookingService(e.target.value)}
                      className="p-3 border border-outline-variant bg-background rounded-xl text-sm outline-none focus:border-primary"
                    >
                      <option value="Laser Whitening">Laser Whitening (Brilliant White)</option>
                      <option value="Annual Checkup">Routine Clinical Diagnostics</option>
                      <option value="Invisalign Consult">Invisalign Studio Mapping</option>
                      <option value="Precision Implants">Guided Robot Implants Surgery</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-semibold text-on-surface-variant font-medium">Select Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="p-3 border border-outline-variant rounded-xl text-xs bg-background outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 text-left">
                    <label className="font-sans text-xs font-semibold text-on-surface-variant font-medium">Select Time *</label>
                    <input
                      type="time"
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="p-3 border border-outline-variant rounded-xl text-xs bg-background outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-secondary-container/20 border rounded-xl flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-secondary" />
                  <span className="font-sans text-[11px] text-on-surface-variant">
                    Schedules map directly to lead records for administrative queue approval.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="bg-primary hover:opacity-90 text-white rounded-xl py-3.5 font-sans text-sm font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 mt-2"
                >
                  {submittingBooking ? "Confirming..." : "Publish Appointment"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-white/5 text-gray-400 py-16 px-6 md:px-16 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#00f0ff]">
              <Sparkles className="w-5 h-5 fill-current" />
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                The Digital Lounge
              </span>
            </div>
            <p className="font-sans text-xs font-light leading-relaxed">
              We've redesigned dentistry from the ground up to provide a serene, data-driven experience for the modern aesthetic lifestyle.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-white mb-4">Core Directory</h4>
            <div className="flex flex-col gap-2.5 font-sans text-xs">
              <button onClick={() => setCurrentView('home')} className="hover:text-primary text-left">Services</button>
              <button onClick={() => setCurrentView('doctors')} className="hover:text-primary text-left">Visionary Doctors</button>
              <button onClick={() => setCurrentView('contact')} className="hover:text-primary text-left">SMTP enquiries</button>
              <button onClick={() => setCurrentView('login')} className="hover:text-primary text-left">Lounge Login</button>
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-white mb-4">Next-Gen Treatment</h4>
            <div className="flex flex-col gap-2.5 font-sans text-xs">
              <span className="text-gray-400">Precision Surgi-Implants</span>
              <span className="text-gray-400">Invisalign Studio 3D</span>
              <span className="text-gray-400">Laser Sensitivity Whitening</span>
              <span className="text-gray-400">Low-Dose AI X-Rays</span>
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-white mb-4">Hotline Lounge</h4>
            <div className="flex flex-col gap-1.5 font-sans text-xs text-gray-300">
              <a href={`tel:${content.phone}`} className="hover:text-primary font-semibold">{content.phone}</a>
              <span>support@thedigitallounge.com</span>
              <span>440 High-Tech Avenue</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs gap-4">
          <span>&copy; {new Date().getFullYear()} The Digital Lounge Practice. Clinical Rights Reserved.</span>
          <span className="text-primary-container font-mono tracking-widest text-[10px] bg-white/5 border border-white/5 px-3 py-1 rounded">
            ROBOTIC AIDED ORAL HEALTH
          </span>
        </div>
      </footer>

    </div>
  );
}
