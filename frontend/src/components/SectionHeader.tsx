interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

export default function SectionHeader({ title, subtitle, light = false }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-px w-12 bg-gold" />
        <svg viewBox="0 0 20 28" className="w-4 h-5 fill-gold">
          <rect x="8" y="0" width="4" height="28" rx="1" />
          <rect x="0" y="7" width="20" height="4" rx="1" />
        </svg>
        <div className="h-px w-12 bg-gold" />
      </div>
      <h2 className={`font-heading text-3xl md:text-4xl font-bold mb-3 ${light ? 'text-white' : 'text-navy'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`font-body text-base md:text-lg ${light ? 'text-white/70' : 'text-navy/60'}`}>
          {subtitle}
        </p>
      )}
      <div className="gold-divider mt-4" />
    </div>
  );
}
