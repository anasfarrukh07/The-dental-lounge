import React from 'react';
import { ShieldCheck, Star, ArrowRight, Sparkles, Activity } from 'lucide-react';
import { ClinicContent } from '../types.js';

interface HeroProps {
  content: ClinicContent;
  onExploreServices: () => void;
  onBookAppointment: () => void;
}

export default function Hero({ content, onExploreServices, onBookAppointment }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 px-6 md:px-16 overflow-hidden bg-background">
      {/* Background Orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary-container/15 via-background to-primary-container/10 opacity-60"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full hero-glow animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full hero-glow animate-pulse duration-[8000ms]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left column: Text copy & Call to Action */}
        <div className="flex flex-col gap-6 text-left max-w-2xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full w-fit font-sans text-xs font-bold leading-none tracking-wider">
            <ShieldCheck className="w-4 h-4 text-secondary fill-current/10" />
            {content.announcement || "The Future of Dental Care"}
          </span>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-background leading-tight">
            {content.heroTitle || "Experience the Digital Lounge."}
          </h1>
          
          <p className="font-sans text-base sm:text-lg text-on-surface-variant leading-relaxed font-light">
            {content.heroSubtitle || "Precision oral health meets high-tech comfort. We've redesigned dentistry from the ground up to provide a serene, data-driven experience for the modern lifestyle."}
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={onBookAppointment}
              className="bg-primary text-white px-8 py-4 rounded-xl font-sans text-sm font-semibold flex items-center gap-2 hover:opacity-90 hover:shadow-xl hover:shadow-primary/20 active:scale-95 transition-all duration-200"
            >
              Book Your Appointment
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={onExploreServices}
              className="glass-panel px-8 py-4 rounded-xl font-sans text-sm font-semibold text-primary flex items-center gap-2 hover:bg-white/80 active:scale-95 transition-all duration-200"
            >
              Explore Services
            </button>
          </div>
        </div>

        {/* Right column: Immersive Glassmorphic Cards Stack */}
        <div className="relative h-[480px] lg:h-[580px] w-full flex items-center justify-center lg:block">
          {/* Main Hero Background Illustration with pristine frame */}
          <div className="absolute inset-x-4 lg:inset-x-0 w-full lg:w-[480px] h-[360px] lg:h-[460px] top-10 lg:top-12 rounded-[32px] overflow-hidden shadow-2xl z-10 select-none">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPoFohPSoK6Io85sPOu-cvSNUxFA7UFp1F_0FgYbRSvnG1hLkIFuyIZ7_lheKPDni6Xe5gMgSn0CgJaeirUAo8SI2AQh7Yktr78FZdVnjDqvpxm4Y5UvmOzAegUcA1Pn7HqUuAsvXloVRy3XoOgwxBTJNQg4qfF0HbnHR8AFRAobNCQS_ZYABaYlBqn7R5zPU-dOZldL_3t36GKxx2-2uE0KmefyC8lXyvgv6_XLM6achqpQZWMvJ_JJW5i1ZeuxivHLKAYl1LVmLX" 
              alt="The Digital Lounge Suite"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Glass Card 1: Live AI Scan */}
          <div className="absolute top-0 right-4 lg:-right-4 glass-panel p-6 rounded-3xl w-60 sm:w-64 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 z-30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-primary/10 rounded-xl text-primary">
                <Activity className="w-5 h-5 fill-current/10" />
              </span>
              <span className="bg-primary-container text-primary text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-current" />
                LIVE AI
              </span>
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-on-surface">Digital Scan</h4>
              <p className="text-on-surface-variant font-sans text-xs mt-1 leading-relaxed">
                3D intraoral rendering complete. No goop, no gagging.
              </p>
            </div>
          </div>

          {/* Glass Card 2: Doctor Testimonial */}
          <div className="absolute -bottom-4 left-4 lg:-left-6 glass-panel p-6 rounded-3xl w-72 sm:w-80 shadow-2xl transform -rotate-3 hover:rotate-0 transition-all duration-500 z-30 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-primary/20 select-none">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO6Ug-2wcVe1g78BTQDnHTv-1DnvbCX-U0n9XLJ0PsRAqb6sbmcELmateA8KRyTMRnK7fYvKtsBZ7JiT9hku1FaFe231JqhzqiHhtLrLiqHx0shpk5EThDeHlKBAwe7JmQu_SbAQqgSXvCXO-R4gyQ05fuZsP5h5mI57azzw_sqG_UVsS3n0dSV-xSrOW0p-d_0PfPQRKjo9S1EO3622yvX0A_3lsYZgv0PFneLnno2B11CDlMGGZYS3QA361UawgbR6dwMbw22fYj" 
                  alt="Dr. Elara Vance"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <h4 className="font-sans font-bold text-xs text-on-surface leading-none">Dr. Elara Vance</h4>
                <p className="text-[10px] text-on-surface-variant font-sans tracking-wide mt-1 leading-none">
                  Lead Precision Specialist
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-0.5 text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-on-surface-variant font-sans text-xs italic leading-relaxed text-left">
                "The most relaxed I've ever felt in a dental chair. Truly futuristic."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
