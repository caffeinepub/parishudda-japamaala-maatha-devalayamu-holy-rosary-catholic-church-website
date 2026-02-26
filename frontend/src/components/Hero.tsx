import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Hero() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/generated/church-hero.dim_1920x1080.png')`,
        }}
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Content */}
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Cross Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 60 80" className="w-12 h-16 fill-gold opacity-90">
              <rect x="24" y="0" width="12" height="80" rx="2" />
              <rect x="0" y="20" width="60" height="12" rx="2" />
            </svg>
          </div>
        </div>

        {/* Telugu Name */}
        <p className="font-cinzel text-gold text-sm md:text-base tracking-[0.3em] uppercase mb-3 text-shadow">
          Parishudda Japamaala Maatha Devalayamu
        </p>

        {/* English Name */}
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-shadow-lg leading-tight">
          Holy Rosary
          <br />
          <span className="text-gold">Catholic Church</span>
        </h1>

        {/* Location */}
        <p className="font-body text-white/80 text-lg md:text-xl mb-8 text-shadow tracking-wide">
          Nellore, Andhra Pradesh
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gold/60" />
          <div className="w-2 h-2 rounded-full bg-gold" />
          <div className="h-px w-16 bg-gold/60" />
        </div>

        {/* Tagline */}
        <p className="font-heading italic text-white/90 text-xl md:text-2xl text-shadow mb-10">
          "Come, let us worship and bow down"
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#mass-schedule"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#mass-schedule')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 bg-gold text-navy font-cinzel text-sm tracking-wider uppercase font-semibold hover:bg-gold-light transition-all duration-300 rounded-sm shadow-gold"
          >
            Mass Schedule
          </a>
          <a
            href="#location"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#location')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 border-2 border-white text-white font-cinzel text-sm tracking-wider uppercase hover:bg-white/10 transition-all duration-300 rounded-sm"
          >
            Find Us
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-gold/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
      </div>
    </section>
  );
}
