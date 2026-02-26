import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Heart } from 'lucide-react';

export default function DonationCTA() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="donate"
      className="py-20 bg-ivory"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Rosary Image */}
        <div className="mb-8">
          <img
            src="/assets/generated/rosary-bg.dim_1200x600.png"
            alt="Holy Rosary"
            className="mx-auto w-48 h-24 object-cover rounded-full opacity-80"
          />
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-gold" />
          <Heart size={20} className="text-gold fill-gold" />
          <div className="h-px w-12 bg-gold" />
        </div>

        <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
          Support Our Parish
        </h2>
        <p className="font-body text-navy/65 text-lg mb-3 leading-relaxed">
          Your generous contributions help us maintain our sacred space, support community programs,
          and spread the love of God throughout Nellore.
        </p>
        <p className="font-heading italic text-gold text-xl mb-10">
          "Give, and it will be given to you." — Luke 6:38
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="animate-pulse-gold px-10 py-4 bg-gold text-navy font-cinzel text-base tracking-wider uppercase font-bold rounded-sm shadow-gold hover:bg-gold-light hover:shadow-gold-lg transition-all duration-300 flex items-center gap-3"
            onClick={() => alert('Online donation portal coming soon. Please contact the parish office for donation details.')}
          >
            <Heart size={20} className="fill-navy" />
            Donate Online
          </button>
          <div className="text-navy/50 font-body text-sm">
            <p>Or visit us at the church office</p>
            <p className="text-navy/40 text-xs mt-0.5">Nellore, Andhra Pradesh</p>
          </div>
        </div>

        <div className="mt-12">
          <img
            src="/assets/generated/divider-ornament.dim_800x80.png"
            alt=""
            className="mx-auto max-w-xs opacity-50"
          />
        </div>
      </div>
    </section>
  );
}
