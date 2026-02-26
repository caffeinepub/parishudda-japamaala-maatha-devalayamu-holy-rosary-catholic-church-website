import { Heart, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown-app';
  const utmContent = encodeURIComponent(hostname);

  return (
    <footer className="bg-navy-dark py-12 border-t border-gold/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Church Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold flex-shrink-0">
                <img
                  src="/assets/generated/church-logo.dim_256x256.png"
                  alt="Church Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-cinzel text-gold text-xs tracking-widest uppercase">Holy Rosary</p>
                <p className="font-heading text-white text-sm font-semibold">Catholic Church</p>
              </div>
            </div>
            <p className="font-body text-white/60 text-sm leading-relaxed">
              Parishudda Japamaala Maatha Devalayamu<br />
              Nellore, Andhra Pradesh
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-gold text-xs tracking-widest uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Mass Schedule', href: '#mass-schedule' },
                { label: 'Spiritual Message', href: '#spiritual-message' },
                { label: 'Prayers', href: '#prayers' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Donate', href: '#donate' },
                { label: 'Location', href: '#location' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="font-body text-white/60 text-sm hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-cinzel text-gold text-xs tracking-widest uppercase mb-4">Visit Us</h4>
            <div className="flex items-start gap-2 mb-3">
              <MapPin size={14} className="text-gold mt-0.5 flex-shrink-0" />
              <p className="font-body text-white/60 text-sm leading-relaxed">
                Nellore, Andhra Pradesh, India
              </p>
            </div>
            <a
              href="https://share.google/RgB7sMob1CDcBHUIp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold/80 hover:text-gold text-sm font-body transition-colors"
            >
              View on Google Maps →
            </a>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="font-cinzel text-gold text-xs tracking-wider uppercase mb-2">Sunday Masses</p>
              <p className="font-body text-white/60 text-xs">6:30 AM — Telugu Mass</p>
              <p className="font-body text-white/60 text-xs">8:30 AM — English Mass</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-white/40 text-xs text-center md:text-left">
              © {year} Parishudda Japamaala Maatha Devalayamu (Holy Rosary Catholic Church). All rights reserved.
            </p>
            <p className="font-body text-white/40 text-xs flex items-center gap-1">
              Built with{' '}
              <Heart size={12} className="text-gold fill-gold mx-0.5" />{' '}
              using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${utmContent}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/70 hover:text-gold transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
