import React from 'react';
import { Mail, Phone, MapPin, Clock, Send, Sparkles, User, HelpCircle, ArrowRight, Smile } from 'lucide-react';

interface ContactFormProps {
  phone: string;
  onAddNotification: (title: string, desc: string, type: 'success' | 'info' | 'error') => void;
  showAssessmentInitially?: boolean;
}

export default function ContactForm({ phone, onAddNotification, showAssessmentInitially = false }: ContactFormProps) {
  const [activeTab, setActiveTab] = React.useState<'contact' | 'assessment'>(
    showAssessmentInitially ? 'assessment' : 'contact'
  );

  // Contact Form State
  const [contactName, setContactName] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [contactPhone, setContactPhone] = React.useState('');
  const [contactMessage, setContactMessage] = React.useState('');
  const [submittingContact, setSubmittingContact] = React.useState(false);

  // Assessment State
  const [goal, setGoal] = React.useState('Straightening');
  const [sensitivity, setSensitivity] = React.useState('No');
  const [timing, setTiming] = React.useState('No');
  const [assessmentResult, setAssessmentResult] = React.useState<null | { doctor: string; desc: string; image: string }>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      onAddNotification("Form Incomplete", "Please complete all mandatory fields (Name, Email, and Message).", "error");
      return;
    }

    setSubmittingContact(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          message: contactMessage
        })
      });

      if (res.ok) {
        const data = await res.json();
        onAddNotification(
          "Message Dispatched", 
          `Inbox sync positive. Dynamic SMTP transaction processed fully to ${data.simulatedTransmission.recipient}.`, 
          "success"
        );
        // Clear state
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactMessage('');
      } else {
        throw new Error("Server rejected dispatch transaction");
      }
    } catch (e) {
      onAddNotification("Network Dispatch Fail", "SMTP pipeline request failed. Re-trying soon.", "error");
    } finally {
      setSubmittingContact(false);
    }
  };

  const handleRunAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    
    let doc = 'Dr. Elena Vance';
    let d = 'Based on your straightening and alignment goals, we heavily recommend Dr. Elena Vance who specializes in 3D-scanned invisible aligner treatment.';
    let img = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3XH4NJ5b0w3psI1efHW9QdRsicidIEbbmA1USvYF6qdpE4VxSf16T4WlEI9TizNOrJvZNuSimpcIKzrYEXDJUfMweZ6HQ3rymRNVinmYw8AG0HbOQUghYPWt36ewlhyc9v60KyLY1WAWHW_zKt7a07ASzUC5KQeg3ibXUXPbmDKfi7JMQQbnJTw87RTVQZzFbe0wvn84pvAWS8HOGE083nlPzslOqHGf55AYv3Oj1BBK_I5nbvJGDPiGa5yICH7HlyEgMlxVlKuSF';

    if (goal === 'Whitening' || goal === 'Cosmetics') {
      doc = 'Dr. Julian Thorne';
      d = 'Based on your smile enhancement objectives, Dr. Julian Thorne is the perfect practitioner to design customized porcelain veneers for your unique face outline.';
      img = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEFG1yvCqg_nWSlftTrMt_zcUKI-IgbQ6q-tkbkFsQCOLDPQ7lMX_tYwe7CXt7HUlLZ72a6NkNYAb8UqQPQYN6xy9PQruLiT8mi97jx3lvR2COu2WC3JVR89nS_mu2n_oypbPlTrMFRcEvTZUGS_q8cB8kFDWpPtKWBzME2WvpLSXZUvhexVha8nhrDFHE-mBZ2gVzGjiuc56TLozxwJr8VqzVOJVC7b0WMOR-orJJiZB9PO9hbLHq5yVXDd-3sNnlL3uYIJxyco8Y';
    } else if (goal === 'Implants' || timing === 'Yes') {
      doc = 'Dr. Sarah Chen';
      d = 'For high-precision restorative surgeries, implants, or guided immediate placement requests, Dr. Sarah Chen utilizes robot-assisted dental suites.';
      img = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUxKFh8wyEBlmpAek9gluyrR0g-hTDB7f4mYNcCTLE5-bnWfXNIa7sfxuUr-0Pv_9ERE-9kAHZC-rFq1mvYf3LojyyeMX2YbPkCliHvVtflLhtcYz6xRZoPcVUmTQ0Aom8VSXvSEUm6sCSSDJPG6phzuQQxo7nacMOmaBbbZFFxYSg6E4CCuLb75_X0U_f_p53g4u0C-78sIPLCW7FE6YyfLeCHu_1SEHUlJ4yJ8XWbkQpg_LVlnPd78E7j7mGNoXXZ3EAPdf252sN';
    }

    setAssessmentResult({
      doctor: doc,
      desc: d,
      image: img
    });

    onAddNotification("Assessment Compiled", `Specialist recommendation generated: ${doc}`, "info");
  };

  return (
    <div id="contact-view" className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left">
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">
              Contact Details
            </h2>
            <p className="font-sans text-sm text-on-surface-variant font-light">
              Don't hesitate to reach out or schedule a clinical tour.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {/* Phone */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-surface-container-high/60 shadow-sm">
              <span className="p-3 bg-primary/10 rounded-xl text-primary h-fit">
                <Phone className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-display font-semibold text-sm">Telephone Hotline</h4>
                <p className="font-sans text-sm text-on-surface-variant mt-1">{phone || "(555) 012-3456"}</p>
                <p className="font-sans text-[11px] text-primary mt-1 font-bold">Available for emergency triage 24/7</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-surface-container-high/60 shadow-sm">
              <span className="p-3 bg-primary/10 rounded-xl text-primary h-fit">
                <Mail className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-display font-semibold text-sm">Interactive Mailbox</h4>
                <p className="font-sans text-sm text-on-surface-variant mt-1">support@thedigitallounge.com</p>
                <p className="font-sans text-[11px] text-on-surface-variant">Avg reply latency: under 1 hr</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-surface-container-high/60 shadow-sm">
              <span className="p-3 bg-primary/10 rounded-xl text-primary h-fit">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-display font-semibold text-sm">Lounge Flagship</h4>
                <p className="font-sans text-sm text-on-surface-variant mt-1">440 High-Tech Avenue</p>
                <p className="font-sans text-xs text-on-surface-variant font-light">Suite 12, Level 2 (Opposite City Square)</p>
              </div>
            </div>

            {/* Operating Times */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-surface-container-high/60 shadow-sm">
              <span className="p-3 bg-primary/10 rounded-xl text-primary h-fit">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-display font-semibold text-sm">Operational Windows</h4>
                <p className="font-sans text-sm text-on-surface-variant mt-1">Mon — Fri: 08:00 - 20:00</p>
                <p className="font-sans text-sm text-on-surface-variant">Sat: 09:00 - 14:00 (Sundays Closed)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Switcher + Forms Block */}
        <div className="lg:col-span-8 bg-white border border-surface-container-high/60 shadow-sm p-8 rounded-[32px] flex flex-col gap-6">
          {/* Tab switches */}
          <div className="flex p-1 bg-surface-container rounded-xl w-fit">
            <button
              onClick={() => {
                setActiveTab('contact');
                setAssessmentResult(null);
              }}
              className={`px-6 py-2.5 rounded-lg font-sans text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'contact' 
                  ? 'bg-primary text-white shadow' 
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Enquiry Form
            </button>
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-6 py-2.5 rounded-lg font-sans text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'assessment' 
                  ? 'bg-primary text-white shadow' 
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Digital Assessment AI
            </button>
          </div>

          {activeTab === 'contact' ? (
            /* Enquiry Form */
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="font-display font-bold text-xl text-primary">
                  Submit Enquiry
                </h3>
                <p className="font-sans text-sm text-on-surface-variant font-light">
                  Complete the form below to immediately dispatch a copy notification to our admin inbox.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter your full name"
                    className="p-3 border border-outline-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-background"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="p-3 border border-outline-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-background"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-on-surface-variant">Telephone (Optional)</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="p-3 border border-outline-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-background"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-on-surface-variant">Message Content *</label>
                <textarea
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Draft your treatment or scheduling enquiry here..."
                  className="p-3 border border-outline-variant rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-background resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingContact}
                className="bg-primary text-white py-4 rounded-xl font-sans text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 mt-2"
              >
                {submittingContact ? "Compressing Dispatch Payload..." : "Send Message"}
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Digital Assessment AI */
            <form onSubmit={handleRunAssessment} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="font-display font-bold text-xl text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Smile Match Algorithmic Engine
                </h3>
                <p className="font-sans text-sm text-on-surface-variant font-light">
                  Tell us about your dental needs to instantly map your requirements to our specialists.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Smiley goal */}
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant">
                    1. What is your chief treatment goal?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Straightening', 'Whitening', 'Implants', 'Cosmetics'].map(t => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setGoal(t)}
                        className={`p-3 border rounded-xl text-xs font-semibold transition-all ${
                          goal === t 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-outline-variant bg-background text-on-surface-variant'
                        }`}
                      >
                        {t === 'Straightening' ? 'Straightening / Invisalign' : t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sensitivity */}
                <div className="flex flex-col gap-2 mt-2">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant">
                    2. Do you experience dental sensitivity when drinking cold liquids?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Yes', 'No'].map(v => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setSensitivity(v)}
                        className={`p-3 border rounded-xl text-xs font-semibold transition-all ${
                          sensitivity === v
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-outline-variant bg-background text-on-surface-variant'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Surgery */}
                <div className="flex flex-col gap-2 mt-2">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant">
                    3. Do you favor single-session treatment or robot-guided immediate implants?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Yes', 'No'].map(v => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setTiming(v)}
                        className={`p-3 border rounded-xl text-xs font-semibold transition-all ${
                          timing === v
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-outline-variant bg-background text-on-surface-variant'
                        }`}
                      >
                        {v === 'Yes' ? 'Yes (Favored)' : 'No (Standard Timeline)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {!assessmentResult ? (
                <button
                  type="submit"
                  className="bg-primary text-white py-4 rounded-xl font-sans text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 mt-4 cursor-pointer"
                >
                  Generate Doctor Recommendation
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-6 bg-surface-container rounded-2xl flex flex-col sm:flex-row gap-6 border border-white mt-4 animate-in fade-in duration-300">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-primary/20 shrink-0 select-none">
                    <img src={assessmentResult.image} alt={assessmentResult.doctor} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[10px] bg-secondary-container text-on-secondary-container font-extrabold px-2.5 py-0.5 rounded-full w-fit">
                      TARGET MATCH FOUND
                    </span>
                    <h4 className="font-display font-extrabold text-base text-primary">{assessmentResult.doctor}</h4>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed font-light mt-1 text-left">
                      {assessmentResult.desc}
                    </p>
                    <button
                      type="button"
                      onClick={() => setAssessmentResult(null)}
                      className="text-primary font-sans font-bold text-xs flex items-center gap-1 mt-3 w-fit hover:underline"
                    >
                      Restart Assessment
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
