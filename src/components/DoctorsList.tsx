import React from 'react';
import { Calendar, Clock, Star, ArrowRight, UserCheck, Smartphone, Sparkles, Bot } from 'lucide-react';
import { Doctor } from '../types.js';

interface DoctorsListProps {
  doctors: Doctor[];
  onBookDoctor: (doctor: Doctor) => void;
  onStartAssessment: () => void;
}

export default function DoctorsList({ doctors, onBookDoctor, onStartAssessment }: DoctorsListProps) {
  const [selectedSpecialty, setSelectedSpecialty] = React.useState<string>('All');

  const categories = [
    { id: 'All', label: 'All Specialists' },
    { id: 'Orthodontist', label: 'Orthodontists' },
    { id: 'Cosmetic Dentist', label: 'Cosmetic Dentists' },
    { id: 'Implantologist', label: 'Implantologists' }
  ];

  const filteredDoctors = selectedSpecialty === 'All'
    ? doctors
    : doctors.filter(doc => doc.specialty === selectedSpecialty);

  return (
    <div className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="mb-16 text-center max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight text-on-surface">
          Meet Your <span className="text-primary">Visionary</span> Care Team
        </h1>
        <p className="text-base sm:text-lg font-sans text-on-surface-variant font-light leading-relaxed">
          Our specialists combine high-tech diagnostic precision with a human-centric approach to craft your perfect smile in a relaxed, digital environment.
        </p>
      </div>

      {/* Filter Category Chips */}
      <div className="flex flex-wrap gap-3 mb-12 justify-center">
        {categories.map(cat => {
          const isActive = selectedSpecialty === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedSpecialty(cat.id)}
              className={`px-6 py-2.5 rounded-full font-sans text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed shadow-sm'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map(doc => {
          return (
            <div 
              key={doc.id}
              className="glass-panel rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col group border-white/20"
            >
              <div className="relative h-80 overflow-hidden select-none">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src={doc.image} 
                  alt={doc.name}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-secondary-container/95 text-on-secondary-container text-xs font-bold font-sans tracking-wide px-4.5 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                    {doc.specialty}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col text-left justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold text-xl text-on-surface">
                      {doc.name}
                    </h3>
                    <div className="flex items-center gap-0.5 text-primary">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs font-bold font-sans text-on-surface">
                        {doc.rating}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-on-surface-variant font-sans text-sm font-light leading-relaxed mb-6">
                    {doc.bio}
                  </p>

                  {/* Operational Schedules list */}
                  <div className="space-y-3 mb-8 border-t border-b border-surface-container py-4">
                    {doc.schedule.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between font-sans text-xs">
                        <span className="text-on-surface-variant flex items-center gap-2 font-medium">
                          <Calendar className="w-4 h-4 text-primary" />
                          {slot.days}
                        </span>
                        <span className="text-on-surface font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
                          {slot.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onBookDoctor(doc)}
                  className="w-full bg-primary text-white py-4 rounded-xl font-sans text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Book Appointment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action Section Helper */}
      <section className="mt-24 bg-surface-container rounded-[32px] p-8 md:p-16 relative overflow-hidden text-left border border-white">
        <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 flex flex-col gap-4">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Can't decide on a <span className="text-primary">specialist?</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-on-surface-variant font-light leading-relaxed">
              Try our Digital Assessment tool. We'll analyze your smile goals and match you with the right expert in under 2 minutes.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <button
                onClick={onStartAssessment}
                className="bg-primary text-white px-8 py-3.5 rounded-full font-sans text-xs font-semibold tracking-wider hover:opacity-90 transition-all cursor-pointer"
              >
                Start Assessment
              </button>
              <a
                href="tel:5550123456"
                className="border border-outline text-on-surface px-8 py-3.5 rounded-full font-sans text-xs font-semibold tracking-wider hover:bg-surface-variant/40 transition-colors flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-primary" />
                Call Concierge
              </a>
            </div>
          </div>
          
          <div className="hidden md:block md:col-span-5 h-[180px]">
            <div className="w-full h-full bg-white/40 backdrop-blur rounded-2xl flex items-center justify-center border border-white/40 p-4">
              <div className="w-full h-full bg-surface-container/60 rounded-xl flex flex-col items-center justify-center gap-3 text-primary">
                <Bot className="w-12 h-12 stroke-[1.5]" />
                <span className="font-sans font-semibold text-xs text-on-surface-variant">
                  AI Recommendation Diagnostic Model
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Aesthetic Background Orbs */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
      </section>
    </div>
  );
}
