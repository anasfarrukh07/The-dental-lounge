import React from 'react';
import { Cpu, Sparkles, Zap, ArrowUpRight, CheckCircle2, ChevronRight, Binary } from 'lucide-react';

interface ServicesProps {
  onLearnMore: (title: string) => void;
}

export default function Services({ onLearnMore }: ServicesProps) {
  const serviceHighlights = [
    {
      title: "Precision Implants",
      desc: "Using robot-assisted surgery for 100% placement accuracy and significantly faster healing times.",
      icon: Cpu,
      tags: ["Guided Surgery", "Same Day"],
      span: "md:col-span-2 min-h-[380px] text-left text-white relative bg-neutral-900 group",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrLAxRwGeEerg8rlYM5RIbzLbruh7ANlL-dpJywueIXRlzoVyysPaN0CqSm6F7DG_lxLAbAvwohMed6PZu-aKpjUaxJRCF90XAyiVeD9ywaDu7IoZAU7NkVbSg0jhzQIBMux6VZasB81OIrn5d3-O2J5wd_B2e5oRnQbOcxWp5AhJ7gPopZwuwNbr53xjwh7J2FW4HeXgAagPncxB_dmEsT8ZJyVCgpf5vzYym9pylwRJeiWjG_bTgVQTlDm3Z3XMPt_DP1w9-yp-0"
    },
    {
      title: "Digital Whitening",
      desc: "Laser-targeted whitening that minimizes sensitivity and maximizes brilliance in 45 minutes.",
      icon: Sparkles,
      tags: ["Cosmetic", "Laser"],
      span: "col-span-1 min-h-[380px] bg-white text-left text-on-background border border-surface-container-high/60 shadow-sm"
    },
    {
      title: "Low-Dose X-Rays",
      desc: "High-resolution AI-enhanced diagnostics with 90% less radiation than traditional films.",
      icon: Zap,
      tags: ["Safety-First", "Diagnostics"],
      span: "col-span-1 min-h-[380px] bg-white text-left text-on-background border border-surface-container-high/60 shadow-sm"
    },
    {
      title: "Invisalign Digital Studio",
      desc: "Visualize your perfect smile before you even start. Our 3D mapping predicts your alignment with 99% accuracy.",
      icon: Binary,
      tags: ["Interactive Scan", "Free Consult"],
      span: "md:col-span-2 min-h-[380px] bg-secondary text-white text-left flex flex-col md:flex-row gap-8 items-center overflow-hidden",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHLzwckviQZZE9stOif676SdAGrZSNv3ty44uvzNQSCRK3zM14-BQR2K6xsK88R8AWNCu5IXInIToljbK96sJW098g0oqT7VesEELxTl5WrRqKaXHGdYfhDIX49Lj36pFea5vnhkRLB7Cx4ufnbArywHE8TalbWcW39RZfzVKXkZyaTxa_BIW8NILsON7_Y3Vd7GzGI0nVjFep-BEoxXaZBiE440aqVx3R_ptFs-WuxFWNwoO9wqyM-G7xM8h4GSQ78R3uDkv8rnqB"
    }
  ];

  return (
    <section id="services-section" className="py-24 px-6 md:px-16 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        {/* Section Header copies */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface mb-4">
              Next-Gen Services
            </h2>
            <p className="font-sans text-base sm:text-lg text-on-surface-variant font-light">
              We leverage advanced imaging and precision robotics to deliver results that are more accurate, less invasive, and aesthetic-first.
            </p>
          </div>
          <button 
            onClick={() => onLearnMore("All Services")}
            className="text-primary font-sans font-bold text-sm flex items-center gap-2 hover:gap-4 transition-all"
          >
            View All Services 
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceHighlights.map((item, index) => {
            const IconComponent = item.icon;
            
            // Image-focused design (Precision Implants / Invisalign)
            if (item.image) {
              if (item.title === "Precision Implants") {
                return (
                  <div 
                    key={index} 
                    className={`${item.span} p-10 rounded-[32px] overflow-hidden flex flex-col justify-end group transition-all duration-300 hover:shadow-xl hover:shadow-primary/5`}
                  >
                    {/* Background styled Image with slight opacity overlay */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        className="w-full h-full object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-300 select-none" 
                        src={item.image} 
                        alt={item.title}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <h3 className="font-display font-bold text-xl sm:text-2xl mb-2 text-white">
                        {item.title}
                      </h3>
                      <p className="font-sans text-sm sm:text-base text-gray-300 mb-6 max-w-md font-light leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="flex gap-2">
                        {item.tags.map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="px-4 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              } else {
                // Invisalign Digital Studio bento card
                return (
                  <div 
                    key={index} 
                    className={`${item.span} p-10 rounded-[32px] transition-all duration-300 hover:shadow-xl hover:shadow-secondary/5`}
                  >
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <h3 className="font-display font-bold text-xl sm:text-2xl mb-2 text-white">
                        {item.title}
                      </h3>
                      <p className="font-sans text-sm sm:text-base text-white/80 mb-6 max-w-md font-light leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="flex gap-2">
                        {item.tags.map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold hover:bg-white/20 transition-all pointer-events-none"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Aligner product display on the right */}
                    <div className="w-full md:w-1/3 aspect-square bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center p-6 border border-white/10 select-none">
                      <img 
                        className="w-full h-full object-contain filter drop-shadow-xl" 
                        src={item.image} 
                        alt="Invisalign transparent case"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                );
              }
            }

            // Text-focused bento designs
            return (
              <div 
                key={index} 
                className={`${item.span} p-10 rounded-[32px] flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:scale-[1.01]`}
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    item.title === "Digital Whitening" 
                      ? 'bg-secondary/10 text-secondary' 
                      : 'bg-tertiary/10 text-tertiary'
                  }`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl mb-2">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-on-surface-variant font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <button 
                  onClick={() => onLearnMore(item.title)}
                  className="mt-8 text-primary/95 font-sans font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all text-left w-fit"
                >
                  Learn more 
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
