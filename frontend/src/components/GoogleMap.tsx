import { useScrollAnimation } from '../hooks/useScrollAnimation';
import SectionHeader from './SectionHeader';
import { MapPin, Navigation, Phone, Mail } from 'lucide-react';

export default function GoogleMap() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="location"
      className="py-20"
      style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3260 100%)' }}
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <SectionHeader title="Find Us" subtitle="Visit our sacred home in Nellore" light />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Map Placeholder */}
          <div className="relative rounded-xl overflow-hidden card-gold-border aspect-video lg:aspect-square bg-navy-light flex flex-col items-center justify-center gap-6 p-8">
            <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center">
              <MapPin size={36} className="text-gold" />
            </div>
            <div className="text-center">
              <p className="font-heading text-white text-xl font-bold mb-2">
                Parishudda Japamaala Maatha Devalayamu
              </p>
              <p className="font-body text-white/70 text-sm">
                Holy Rosary Catholic Church
              </p>
              <p className="font-body text-gold/80 text-sm mt-1">
                Nellore, Andhra Pradesh, India
              </p>
            </div>
            <a
              href="https://share.google/RgB7sMob1CDcBHUIp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gold text-navy font-cinzel text-sm tracking-wider uppercase font-semibold rounded-sm hover:bg-gold-light transition-all duration-300 shadow-gold"
            >
              <Navigation size={16} />
              View on Google Maps
            </a>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-2xl font-bold text-white mb-6">
                Contact & Visit
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-gold/40 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-gold" />
                </div>
                <div>
                  <p className="font-cinzel text-gold text-xs tracking-wider uppercase mb-1">Address</p>
                  <p className="font-body text-white/80 text-sm leading-relaxed">
                    Parishudda Japamaala Maatha Devalayamu<br />
                    (Holy Rosary Catholic Church)<br />
                    Nellore, Andhra Pradesh, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-gold/40 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-gold" />
                </div>
                <div>
                  <p className="font-cinzel text-gold text-xs tracking-wider uppercase mb-1">Parish Office</p>
                  <p className="font-body text-white/80 text-sm">Contact the parish office for inquiries</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-gold/40 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-gold" />
                </div>
                <div>
                  <p className="font-cinzel text-gold text-xs tracking-wider uppercase mb-1">Get Directions</p>
                  <a
                    href="https://share.google/RgB7sMob1CDcBHUIp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-gold/80 text-sm hover:text-gold underline underline-offset-2 transition-colors"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Mass Times Quick Reference */}
            <div className="p-4 bg-gold/10 rounded-lg border border-gold/30">
              <p className="font-cinzel text-gold text-xs tracking-wider uppercase mb-2">Sunday Masses</p>
              <p className="font-body text-white/80 text-sm">6:30 AM — Telugu Mass</p>
              <p className="font-body text-white/80 text-sm">8:30 AM — English Mass</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
