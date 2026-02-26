import { useState, useEffect } from 'react';
import { Menu, X, Cross } from 'lucide-react';

const navLinks = [
  { label: 'Mass Schedule', href: '#mass-schedule' },
  { label: 'Message', href: '#spiritual-message' },
  { label: 'Prayers', href: '#prayers' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Donate', href: '#donate' },
  { label: 'Location', href: '#location' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-navy shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Church Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold flex-shrink-0">
              <img
                src="/assets/generated/church-logo.dim_256x256.png"
                alt="Church Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-cinzel text-gold text-xs tracking-widest uppercase leading-tight hidden sm:block">
                Holy Rosary Catholic Church
              </p>
              <p className="font-heading text-white text-sm font-semibold leading-tight hidden md:block">
                Parishudda Japamaala Maatha
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-white/90 hover:text-gold font-body text-sm font-medium tracking-wide transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a
              href="/admin"
              className="ml-2 px-4 py-1.5 border border-gold text-gold hover:bg-gold hover:text-navy font-cinzel text-xs tracking-wider uppercase transition-all duration-200 rounded-sm"
            >
              Admin
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col gap-3 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-white/90 hover:text-gold font-body text-sm font-medium py-1 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/admin"
                className="mt-2 px-4 py-2 border border-gold text-gold text-center font-cinzel text-xs tracking-wider uppercase"
              >
                Admin Panel
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
