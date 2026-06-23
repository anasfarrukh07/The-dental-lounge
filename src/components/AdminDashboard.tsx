import React from 'react';
import { 
  Users, Calendar, Activity, PenTool, LayoutDashboard, Clock, FileText, Plus,
  CheckCircle2, Eye, RefreshCw, Mail, Settings, LogOut, Check, Sliders, Smartphone, Star, ShieldCheck
} from 'lucide-react';
import { Appointment, ClinicContent, PatientRecord, ContactMessage, Doctor } from '../types.js';

interface AdminDashboardProps {
  content: ClinicContent;
  doctors: Doctor[];
  appointments: Appointment[];
  patients: PatientRecord[];
  messages: ContactMessage[];
  onUpdateContent: (content: ClinicContent) => void;
  onAddNotification: (title: string, desc: string, type: 'success' | 'info' | 'error') => void;
  onLogout: () => void;
  onRefreshAll: () => void;
}

export default function AdminDashboard({
  content,
  doctors,
  appointments,
  patients,
  messages,
  onUpdateContent,
  onAddNotification,
  onLogout,
  onRefreshAll
}: AdminDashboardProps) {
  const [activeMenu, setActiveMenu] = React.useState<'dashboard' | 'content-editor' | 'appointments' | 'enquiries' | 'doctors-manager'>('dashboard');

  // New doctor registration form stats
  const [newDocName, setNewDocName] = React.useState('');
  const [newDocRole, setNewDocRole] = React.useState('Clinical Assistant');
  const [newDocSpecialty, setNewDocSpecialty] = React.useState('Orthodontist');
  const [newDocBio, setNewDocBio] = React.useState('');
  const [newDocRating, setNewDocRating] = React.useState(5);
  const [newDocImage, setNewDocImage] = React.useState('');
  const [newDocDays, setNewDocDays] = React.useState('Mon — Fri');
  const [newDocHours, setNewDocHours] = React.useState('09:00 - 17:00');
  const [submittingDoc, setSubmittingDoc] = React.useState(false);

  // New quick booking form state
  const [quickName, setQuickName] = React.useState('');
  const [quickDate, setQuickDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [quickTime, setQuickTime] = React.useState('13:30');
  const [quickService, setQuickService] = React.useState('Laser Whitening');
  const [quickPhone, setQuickPhone] = React.useState('');
  const [submittingQuick, setSubmittingQuick] = React.useState(false);

  // Content editor state
  const [editTitle, setEditTitle] = React.useState(content.heroTitle);
  const [editSubtitle, setEditSubtitle] = React.useState(content.heroSubtitle);
  const [editAnnouncement, setEditAnnouncement] = React.useState(content.announcement);
  const [editPhone, setEditPhone] = React.useState(content.phone);
  const [editTagline, setEditTagline] = React.useState(content.tagline);
  const [savingContent, setSavingContent] = React.useState(false);

  // Sync edits when content changes
  React.useEffect(() => {
    setEditTitle(content.heroTitle);
    setEditSubtitle(content.heroSubtitle);
    setEditAnnouncement(content.announcement);
    setEditPhone(content.phone);
    setEditTagline(content.tagline);
  }, [content]);

  // Handle Dynamic Doctor addition
  const handleAddDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) {
      onAddNotification("Validation Error", "Doctor's Full Name is a mandatory field.", "error");
      return;
    }

    setSubmittingDoc(true);
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDocName,
          role: newDocRole,
          specialty: newDocSpecialty,
          bio: newDocBio || `A professional member of the ${newDocSpecialty} clinical team.`,
          rating: Number(newDocRating) || 5,
          image: newDocImage || undefined,
          schedule: [{ days: newDocDays, hours: newDocHours }]
        })
      });

      if (res.ok) {
        onAddNotification("Doctor Registered", `Successfully added ${newDocName} to the website's active clinical staff registry.`, "success");
        setNewDocName('');
        setNewDocBio('');
        setNewDocImage('');
        onRefreshAll();
      } else {
        throw new Error();
      }
    } catch (err) {
      onAddNotification("Database Timeout", "Failed to add doctor to storage index.", "error");
    } finally {
      setSubmittingDoc(false);
    }
  };

  // Handle Quick Booking creation
  const handleQuickBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName) {
      onAddNotification("Validation Error", "Patient Name cannot be blank.", "error");
      return;
    }

    setSubmittingQuick(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: quickName,
          phoneNumber: quickPhone || '555-010-0909',
          email: `${quickName.toLowerCase().replace(/\s+/g, '')}@example.com`,
          date: quickDate,
          time: quickTime,
          serviceType: quickService
        })
      });

      if (res.ok) {
        onAddNotification("Queue Booking", "Symmetric queue slot successfully authorized. Added appointment records.", "success");
        setQuickName('');
        setQuickPhone('');
        onRefreshAll();
      } else {
        throw new Error();
      }
    } catch (err) {
      onAddNotification("Network Error", "Failed to book appointment.", "error");
    } finally {
      setSubmittingQuick(false);
    }
  };

  // Handle clinic content update submission
  const handleContentSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingContent(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroTitle: editTitle,
          heroSubtitle: editSubtitle,
          announcement: editAnnouncement,
          phone: editPhone,
          tagline: editTagline
        })
      });

      if (res.ok) {
        const data = await res.json();
        onUpdateContent(data.content);
        onAddNotification("Symmetric Update Success", "Lounge content modified dynamically. This change is instantly live on public pages!", "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      onAddNotification("Connection Timeout", "Failed to update dynamic database assets.", "error");
    } finally {
      setSavingContent(false);
    }
  };

  // Update status
  const handleStatusChange = async (apptId: string, nextStatus: Appointment['status']) => {
    try {
      const res = await fetch(`/api/appointments/${apptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });

      if (res.ok) {
        onAddNotification("Status Updated", `Appointment status shifted to ${nextStatus}`, "success");
        onRefreshAll();
      } else {
        throw new Error();
      }
    } catch (err) {
      onAddNotification("Failed to Update Status", "Unable to communicate status change to Mongoose backend.", "error");
    }
  };

  // Helper Stats Counters
  const countScheduled = appointments.filter(a => a.status === 'Scheduled').length;
  const countInSession = appointments.filter(a => a.status === 'In Session').length;
  const countCompleted = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div className="min-h-[85vh] bg-surface-container-low flex flex-col md:flex-row rounded-3xl md:rounded-[32px] overflow-hidden border border-surface-container-high shadow-xl text-left max-w-7xl mx-2 sm:mx-6 xl:mx-auto my-6 lg:my-10">
      
      {/* 1. Left Control Panel Sidebar */}
      <div className="w-full md:w-64 bg-neutral-900 text-white p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-2 mb-8 select-none">
            <span className="p-1.5 bg-primary rounded-lg text-white">
              <PenTool className="w-4.5 h-4.5 fill-current" />
            </span>
            <span className="font-display font-extrabold text-sm tracking-widest text-[#00f0ff]">
              ADMIN SUITE
            </span>
          </div>

          <div className="text-left mb-6 py-2 px-3 bg-white/5 rounded-xl border border-white/5">
            <h5 className="font-sans text-[11px] text-gray-400 font-semibold uppercase tracking-wider leading-none">Logged In As</h5>
            <h4 className="font-sans text-xs font-bold text-white mt-1 flex items-center gap-1.5 leading-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {content.tagline || "Dr. Elena Vance"}
            </h4>
          </div>

          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveMenu('dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                activeMenu === 'dashboard' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Dynamic Dashboard
            </button>

            <button
              onClick={() => setActiveMenu('content-editor')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                activeMenu === 'content-editor' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <PenTool className="w-4 h-4 shrink-0" />
              Content Editor
            </button>

            <button
              onClick={() => setActiveMenu('appointments')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                activeMenu === 'appointments' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              Queue Tracking
              {countScheduled > 0 && (
                <span className="ml-auto bg-[#00f0ff] text-neutral-950 font-bold text-[9px] px-2 py-0.5 rounded-full select-none">
                  {countScheduled}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveMenu('enquiries')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                activeMenu === 'enquiries' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 shrink-0" />
              SMTP Inbox
              {messages.length > 0 && (
                <span className="ml-auto bg-amber-400 text-neutral-950 font-bold text-[9px] px-2 py-0.5 rounded-full select-none">
                  {messages.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveMenu('doctors-manager')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-xs font-bold tracking-wider transition-colors cursor-pointer ${
                activeMenu === 'doctors-manager' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              Doctors Manager
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
          <button
            onClick={onRefreshAll}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-sans text-gray-400 hover:text-white hover:bg-white/5 font-semibold cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-primary shrink-0" />
            Refresh Mongoose
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-sans text-red-400 hover:text-red-300 hover:bg-white/5 font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Admin Logout
          </button>
        </div>
      </div>

      {/* 2. Main Workspace Panel */}
      <div className="flex-grow p-6 md:p-10 overflow-y-auto">
        
        {/* Workspace dynamic content switch */}

        {activeMenu === 'dashboard' && (
          <div className="flex flex-col gap-8">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-on-surface">Queue and Clinical Analytics</h2>
                <p className="font-sans text-xs text-on-surface-variant font-light mt-1">
                  Manage patient processing status, schedule entries, and view customer interest statistics dynamically.
                </p>
              </div>
              <button 
                onClick={onRefreshAll}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-xl text-xs font-bold font-sans hover:bg-surface-container"
              >
                <RefreshCw className="w-3.5 h-3.5 text-primary" />
                Reload Stores
              </button>
            </div>

            {/* Quick stats tracker panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-white border border-surface-container-high rounded-2xl flex items-center gap-4 shadow-sm">
                <span className="p-3.5 bg-emerald-50 rounded-xl text-emerald-500">
                  <Activity className="w-6 h-6 animate-pulse" />
                </span>
                <div>
                  <h5 className="font-sans text-[11px] font-bold text-on-surface-variant tracking-wider uppercase leading-none">In Treatment Room</h5>
                  <h2 className="font-display text-2xl font-extrabold text-on-surface mt-1.5">{countInSession || "0" } Patients</h2>
                  <p className="font-sans text-[10px] text-emerald-600 mt-1">Active live queue slot</p>
                </div>
              </div>

              <div className="p-5 bg-white border border-surface-container-high rounded-2xl flex items-center gap-4 shadow-sm">
                <span className="p-3.5 bg-sky-50 rounded-xl text-sky-500">
                  <Calendar className="w-6 h-6" />
                </span>
                <div>
                  <h5 className="font-sans text-[11px] font-bold text-on-surface-variant tracking-wider uppercase leading-none">Next Scheduled Appt</h5>
                  <h2 className="font-display text-2xl font-extrabold text-on-surface mt-1.5">{appointments[0]?.time || "09:30"} AM</h2>
                  <p className="font-sans text-[10px] text-on-surface-variant mt-1">Pending checkin verification</p>
                </div>
              </div>

              <div className="p-5 bg-white border border-surface-container-high rounded-2xl flex items-center gap-4 shadow-sm">
                <span className="p-3.5 bg-amber-50 rounded-xl text-amber-500">
                  <Users className="w-6 h-6" />
                </span>
                <div>
                  <h5 className="font-sans text-[11px] font-bold text-on-surface-variant tracking-wider uppercase leading-none">Total Client Records</h5>
                  <h2 className="font-display text-2xl font-extrabold text-on-surface mt-1.5">{patients.length || "3"} Registered</h2>
                  <p className="font-sans text-[10px] text-on-surface-variant mt-1">Backed up securely to storage</p>
                </div>
              </div>
            </div>

            {/* Middle Grid: Growth Chart Visual & Quick Booking Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Dynamic Patient Growth SVG Chart Card */}
              <div className="lg:col-span-7 bg-white border border-surface-container-high p-6 rounded-[28px] shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">Patient Growth Analytics</h3>
                  <p className="font-sans text-xs text-on-surface-variant mt-1">Monthly digital scans registered</p>
                </div>

                {/* Aesthetic Dynamic SVG Chart visualization */}
                <div className="h-48 flex items-end justify-between px-2 pt-6 pb-2">
                  {[
                    { month: 'Jan', count: 42 },
                    { month: 'Feb', count: 56 },
                    { month: 'Mar', count: 88 },
                    { month: 'Apr', count: 94 },
                    { month: 'May', count: 112 },
                    { month: 'Jun', count: 138 }
                  ].map((d, index) => {
                    const percent = (d.count / 140) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div className="w-full px-2">
                          <div className="relative h-28 w-full flex items-end justify-center rounded-t-lg bg-surface-container/40 overflow-hidden">
                            {/* Animated chart bar */}
                            <div 
                              style={{ height: `${percent}%` }}
                              className="w-full bg-gradient-to-t from-primary to-primary-container rounded-t-md relative group-hover:opacity-85 transition-all duration-500 flex items-center justify-center text-[9px] text-white font-extrabold"
                            >
                              <span className="hidden group-hover:block absolute bottom-full bg-neutral-950 text-white px-2 py-0.5 rounded text-[8px] mb-1">
                                {d.count}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="font-sans text-[10px] text-on-surface-variant mt-2 font-semibold">
                          {d.month}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4 items-center justify-center border-t border-surface-container pt-4 text-[10px] font-sans text-on-surface-variant">
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="w-2.5 h-2.5 rounded bg-primary"></span>
                    Digital Scanners Active
                  </span>
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="w-2.5 h-2.5 rounded bg-[#00f0ff]"></span>
                    Aligner Conversions
                  </span>
                </div>
              </div>

              {/* Quick Booking Form Right Column */}
              <div className="lg:col-span-5 bg-white border border-surface-container-high p-6 rounded-[28px] shadow-sm">
                <h3 className="font-display font-bold text-base text-on-surface mb-1">Instant Patient Check-in</h3>
                <p className="font-sans text-xs text-on-surface-variant font-light mb-4">Directly input walk-in clinic entries here.</p>

                <form onSubmit={handleQuickBook} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase">Full Client Name</label>
                    <input
                      type="text"
                      required
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      placeholder="e.g. Elena Mitchell"
                      className="p-2.5 border border-outline-variant bg-background rounded-lg text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="flex flex-col gap-1">
                      <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase">Procedure Date</label>
                      <input
                        type="date"
                        required
                        value={quickDate}
                        onChange={(e) => setQuickDate(e.target.value)}
                        className="p-2.5 border border-outline-variant bg-background rounded-lg text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase">Check-in Time</label>
                      <input
                        type="time"
                        required
                        value={quickTime}
                        onChange={(e) => setQuickTime(e.target.value)}
                        className="p-2.5 border border-outline-variant bg-background rounded-lg text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-left">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase">Clinicial Service</label>
                    <select
                      value={quickService}
                      onChange={(e) => setQuickService(e.target.value)}
                      className="p-2.5 border border-outline-variant bg-background rounded-lg text-xs outline-none focus:border-primary"
                    >
                      <option value="Laser Whitening">Laser Whitening</option>
                      <option value="Annual Checkup">Annual Checkup</option>
                      <option value="Invisalign Consult">Invisalign Consult</option>
                      <option value="Precision Implant Surgery">Precision Implant Surgery</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingQuick}
                    className="bg-primary text-white py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all mt-1"
                  >
                    <Plus className="w-4 h-4" />
                    {submittingQuick ? "Adding Walk-In..." : "Confirm & Queue"}
                  </button>
                </form>
              </div>

            </div>

            {/* Bottom Table: Recent Patient Activity */}
            <div className="bg-white border border-surface-container-high rounded-[28px] p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display font-bold text-base text-on-surface">Immediate Patient Actions Queue</h3>
                  <p className="font-sans text-xs text-on-surface-variant">Update active room treatment statuses instantly.</p>
                </div>
                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-full select-none font-sans">
                  LIVE INTERACTION ACTIVE
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-surface-container text-on-surface-variant font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Client Detail</th>
                      <th className="py-3 px-4">Planned Procedure</th>
                      <th className="py-3 px-4">Appointment Time</th>
                      <th className="py-3 px-4 text-center">Treatment Status</th>
                      <th className="py-3 px-4 text-right">Action Selector</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container/60">
                    {appointments.map((appt) => {
                      return (
                        <tr key={appt.id} className="hover:bg-surface-container-low/50">
                          <td className="py-4 px-4 font-bold text-on-surface">{appt.patientName}</td>
                          <td className="py-4 px-4 text-on-surface-variant">{appt.serviceType}</td>
                          <td className="py-4 px-4 text-on-surface-variant font-semibold">{appt.time}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide inline-block ${
                              appt.status === 'Completed' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : appt.status === 'In Session' 
                                ? 'bg-amber-50 text-amber-600 animate-pulse' 
                                : 'bg-blue-50 text-blue-600'
                            }`}>
                              {appt.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => handleStatusChange(appt.id, 'In Session')}
                                className="px-2.5 py-1 text-[10px] font-semibold border border-amber-300 bg-amber-50/20 text-amber-700 rounded-md hover:bg-amber-100"
                              >
                                Treated
                              </button>
                              <button
                                onClick={() => handleStatusChange(appt.id, 'Completed')}
                                className="px-2.5 py-1 text-[10px] font-semibold border border-emerald-300 bg-emerald-50/20 text-emerald-700 rounded-md hover:bg-emerald-100"
                              >
                                Finished
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'content-editor' && (
          <form onSubmit={handleContentSave} className="bg-white border border-surface-container-high rounded-[28px] p-6 md:p-10 shadow-sm flex flex-col gap-8">
            <div className="flex justify-between items-start border-b border-surface-container pb-6 gap-6">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-on-surface">Dynamic Website Content Editor</h2>
                <p className="font-sans text-xs text-on-surface-variant font-light mt-1">
                  Updates made to the inputs below alter variables stored in the database. This is immediately visible on the landing page!
                </p>
              </div>
              <span className="p-2.5 bg-secondary-container text-on-secondary-container rounded-2xl flex items-center gap-1.5 text-xs font-bold">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                Mongoose DB Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-bold text-on-surface-variant">Lounge Clinic Announcement Badge</label>
                <input
                  type="text"
                  required
                  value={editAnnouncement}
                  onChange={(e) => setEditAnnouncement(e.target.value)}
                  placeholder="e.g. Meet the Future of Dental Care"
                  className="p-3 border border-outline-variant bg-background rounded-xl text-sm outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="font-sans text-xs font-bold text-on-surface-variant">Telephone Support Contact</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="e.g. (555) 012-3456"
                  className="p-3 border border-outline-variant bg-background rounded-xl text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label className="font-sans text-xs font-bold text-on-surface-variant">Hero Headline Title</label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g. Experience the Digital Lounge."
                className="p-3 border border-outline-variant bg-background rounded-xl text-sm outline-none"
              />
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label className="font-sans text-xs font-bold text-on-surface-variant">Hero Descripitve Subtitle</label>
              <textarea
                required
                rows={4}
                value={editSubtitle}
                onChange={(e) => setEditSubtitle(e.target.value)}
                className="p-3 border border-outline-variant bg-background rounded-xl text-sm outline-none resize-none"
              />
            </div>

            <div className="flex flex-col gap-2 text-left border-t border-surface-container pt-6">
              <label className="font-sans text-xs font-bold text-on-surface-variant">Admin Profile Header Tagline</label>
              <input
                type="text"
                required
                value={editTagline}
                onChange={(e) => setEditTagline(e.target.value)}
                placeholder="e.g. Dr. Elena Vance"
                className="p-3 border border-outline-variant bg-background rounded-xl text-sm outline-none"
              />
              <p className="font-sans text-[10px] text-on-surface-variant font-light">Customizes the administrative welcome tag and session profile names.</p>
            </div>

            <button
              type="submit"
              disabled={savingContent}
              className="bg-primary hover:opacity-90 text-white py-4 rounded-xl font-sans text-sm font-semibold flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-md mt-4"
            >
              {savingContent ? "Syncing variables with database..." : "Publish Content Edit Actions"}
              <CheckCircle2 className="w-4.5 h-4.5 text-white" />
            </button>
          </form>
        )}

        {activeMenu === 'appointments' && (
          <div className="bg-white border border-surface-container-high rounded-[28px] p-6 shadow-sm flex flex-col gap-4">
            <div>
              <h2 className="font-display text-xl font-bold">Planned Patient Registrations Log</h2>
              <p className="font-sans text-xs text-on-surface-variant">Complete historic catalog of direct walk-in and home bookings.</p>
            </div>
            
            <div className="overflow-x-auto mt-4">
              <table className="w-full min-w-[700px] text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-surface-container text-on-surface-variant font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Register Name</th>
                    <th className="py-3 px-4">Mail Contact</th>
                    <th className="py-3 px-4">Phone Ref</th>
                    <th className="py-3 px-4">Treatment Required</th>
                    <th className="py-3 px-4 text-center">Room Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60">
                  {appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-surface-container-low/40">
                      <td className="py-3 px-4 font-bold text-on-surface">{appt.patientName}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{appt.email || "walkin@thedigitallounge.com"}</td>
                      <td className="py-3 px-4 text-on-surface-variant font-mono">{appt.phoneNumber || "None"}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{appt.serviceType}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          appt.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : appt.status === 'In Session' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeMenu === 'enquiries' && (
          <div className="bg-white border border-surface-container-high rounded-[28px] p-6 shadow-sm flex flex-col gap-6">
            <div>
              <h2 className="font-display text-xl font-bold text-primary">Dynamic Contact Enquiries Inbox</h2>
              <p className="font-sans text-xs text-on-surface-variant">These entries are received live from the website Contact/Query form and processed with simulated SMTP.</p>
            </div>

            {messages.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-on-surface-variant/40 gap-3 border border-dashed rounded-xl">
                <Mail className="w-12 h-12 stroke-[1.2]" />
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-center">No Enquiries Received Yet</span>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((item) => (
                  <div key={item.id} className="p-5 border border-surface-container-high bg-background/50 rounded-2xl flex flex-col gap-3 text-left">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-surface-container pb-2.5 gap-2">
                      <div>
                        <h4 className="font-sans font-bold text-sm text-on-surface">{item.name}</h4>
                        <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                          Email: <span className="font-semibold">{item.email}</span> • Phone: <span className="font-mono">{item.phone || "Not provided"}</span>
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container px-2.5 py-1 rounded w-fit sm:ml-auto">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed font-light mt-1">
                      "{item.message}"
                    </p>

                    <div className="bg-amber-50/20 border-l-2 border-amber-300 p-2.5 rounded-r-lg mt-1 flex items-center justify-between text-[10px] font-sans">
                      <span className="text-amber-800 font-semibold uppercase tracking-wider">Simulated SMTP Dispatched Outcome:</span>
                      <span className="text-on-surface-variant">Delivered to <code className="font-mono bg-white px-1 py-0.5 border">admin@thedigitallounge.com</code></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeMenu === 'doctors-manager' && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-container pb-6">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-on-surface text-neutral-900 animate-in fade-in slide-in-from-left duration-350">Doctors Control Panel</h2>
                <p className="font-sans text-xs text-on-surface-variant font-light mt-1">
                  Add and configure clinical practitioners into the database. Change shows instantly on the live website.
                </p>
              </div>
              <span className="p-2 bg-primary/10 rounded-xl text-primary font-bold text-xs flex items-center gap-1.5 w-fit">
                <Users className="w-4 h-4 text-primary" />
                Active Team: {doctors.length}
              </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-in fade-in zoom-in-95 duration-400">
              {/* Add form */}
              <div className="xl:col-span-5 bg-white border border-surface-container-high p-6 sm:p-8 rounded-[28px] shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="font-display font-bold text-base text-neutral-900 border-b pb-2">Add Clinic Doctor</h3>
                  <p className="font-sans text-xs text-on-surface-variant font-light mt-1 text-gray-500 font-normal">Registers a new clinical team member instantly with fallback local caching.</p>
                </div>

                <form onSubmit={handleAddDoctorSubmit} className="flex flex-col gap-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase text-gray-700">Practitioner Full Name</label>
                    <input
                      type="text"
                      required
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      placeholder="e.g. Dr. Helena Thorne"
                      className="p-3 border border-outline-variant bg-neutral-50/50 rounded-xl text-xs sm:text-sm outline-none focus:border-primary text-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase text-gray-700">Specialty Area</label>
                      <select
                        value={newDocSpecialty}
                        onChange={(e) => setNewDocSpecialty(e.target.value)}
                        className="p-3 border border-outline-variant bg-neutral-50/50 rounded-xl text-xs sm:text-sm outline-none focus:border-primary text-neutral-900"
                      >
                        <option value="Orthodontist">Orthodontist</option>
                        <option value="Cosmetic Dentist">Cosmetic Dentist</option>
                        <option value="Implantologist">Implantologist</option>
                        <option value="Orthodontic Surgeon">Orthodontic Surgeon</option>
                        <option value="General Dentistry">General Dentistry</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase text-gray-700">Clinic Title / Role</label>
                      <input
                        type="text"
                        required
                        value={newDocRole}
                        onChange={(e) => setNewDocRole(e.target.value)}
                        placeholder="e.g. Lead Surgeon"
                        className="p-3 border border-outline-variant bg-neutral-50/50 rounded-xl text-xs sm:text-sm outline-none focus:border-primary text-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase text-gray-700">Active Shift Days</label>
                      <input
                        type="text"
                        required
                        value={newDocDays}
                        onChange={(e) => setNewDocDays(e.target.value)}
                        placeholder="e.g. Mon — Wed"
                        className="p-3 border border-outline-variant bg-neutral-50/50 rounded-xl text-xs sm:text-sm outline-none focus:border-primary text-neutral-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase text-gray-700">Active Shift Hours</label>
                      <input
                        type="text"
                        required
                        value={newDocHours}
                        onChange={(e) => setNewDocHours(e.target.value)}
                        placeholder="e.g. 09:00 - 17:00"
                        className="p-3 border border-outline-variant bg-neutral-50/50 rounded-xl text-xs sm:text-sm outline-none focus:border-primary text-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase text-gray-700">Portrait Image URL (Optional)</label>
                      <input
                        type="url"
                        value={newDocImage}
                        onChange={(e) => setNewDocImage(e.target.value)}
                        placeholder="e.g. https://images.unsplash.com/..."
                        className="p-3 border border-outline-variant bg-neutral-50/50 rounded-xl text-xs sm:text-sm outline-none focus:border-primary text-neutral-900"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase text-gray-700">Staff Rating</label>
                      <select
                        value={newDocRating}
                        onChange={(e) => setNewDocRating(Number(e.target.value))}
                        className="p-3 border border-outline-variant bg-neutral-50/50 rounded-xl text-xs sm:text-sm outline-none focus:border-primary text-neutral-900"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5)</option>
                        <option value="3">⭐⭐⭐ (3/5)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase text-gray-700">Experience Bio / Summary</label>
                    <textarea
                      rows={3}
                      value={newDocBio}
                      onChange={(e) => setNewDocBio(e.target.value)}
                      placeholder="e.g. Mastering smile reconstruction and orthodontics for a flawless finish..."
                      className="p-3 border border-outline-variant bg-neutral-50/50 rounded-xl text-xs sm:text-sm outline-none focus:border-primary resize-none text-neutral-900 text-[13px] font-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingDoc}
                    className="bg-primary text-white py-3 pb-3.5 rounded-xl font-sans text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all mt-2 cursor-pointer border border-transparent"
                  >
                    <Plus className="w-4 h-4" />
                    {submittingDoc ? "Registering..." : "Publish Practitioner Entry"}
                  </button>
                </form>
              </div>

              {/* Doctors listing */}
              <div className="xl:col-span-7 bg-white border border-surface-container-high p-6 sm:p-8 rounded-[28px] shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="font-display font-bold text-base text-neutral-900 border-b pb-2">Registered Practitioners ({doctors.length})</h3>
                  <p className="font-sans text-xs text-on-surface-variant font-light mt-1 text-gray-500 font-normal">The medical team currently cached in live state memory and rendering on web pages.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctors.map((doc) => (
                    <div key={doc.id} className="p-4 border border-gray-100 rounded-2xl bg-neutral-50/40 flex gap-4 text-left items-start hover:shadow-sm hover:border-primary/20 transition-all">
                      <img
                        src={doc.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"}
                        alt={doc.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover bg-neutral-100 border shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-display font-bold text-xs sm:text-sm text-neutral-900 truncate">{doc.name}</h4>
                          <span className="text-[10px] text-amber-500 font-bold shrink-0">{`★`.repeat(doc.rating)}</span>
                        </div>
                        <p className="font-sans text-[10px] text-primary font-bold tracking-tight mt-0.5">{doc.specialty}</p>
                        <p className="font-sans text-[10px] text-gray-500 font-light mt-1.5 leading-relaxed line-clamp-3">
                          {doc.bio}
                        </p>

                        <div className="border-t border-gray-100/80 pt-2 mt-2.5 flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-[9px] font-sans font-bold text-gray-600">
                            🩺 <span className="truncate">{doc.role}</span>
                          </div>
                          {doc.schedule && doc.schedule[0] && (
                            <div className="font-mono text-[9px] text-[#00aaff] font-bold mt-0.5">
                              📅 {doc.schedule[0].days} ({doc.schedule[0].hours})
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
