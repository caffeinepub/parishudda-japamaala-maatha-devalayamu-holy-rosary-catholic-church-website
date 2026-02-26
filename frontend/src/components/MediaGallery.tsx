import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useMediaGallery } from '../hooks/useQueries';
import SectionHeader from './SectionHeader';
import { Play, Image, X } from 'lucide-react';

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

export default function MediaGallery() {
  const { ref, isVisible } = useScrollAnimation();
  const { data: items, isLoading } = useMediaGallery();
  const [lightboxItem, setLightboxItem] = useState<{ url: string; caption: string; type: string } | null>(null);

  return (
    <section
      id="gallery"
      className="py-20 bg-navy"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <SectionHeader title="Church Gallery" subtitle="Moments of faith and community" light />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-video bg-white/10 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : !items || items.length === 0 ? (
          <div className="text-center py-16">
            <Image size={48} className="mx-auto text-white/20 mb-4" />
            <p className="font-body text-white/40 italic">Gallery content will be added soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, idx) => {
              const isVideo = item.mediaType === 'video' || isYouTubeUrl(item.url);
              return (
                <div
                  key={idx}
                  className="group relative rounded-lg overflow-hidden card-gold-border cursor-pointer hover:shadow-gold-lg transition-all duration-300"
                  onClick={() => setLightboxItem({ url: item.url, caption: item.caption, type: item.mediaType })}
                >
                  {isVideo ? (
                    <div className="aspect-video bg-black/40 flex items-center justify-center relative">
                      <img
                        src={`https://img.youtube.com/vi/${getYouTubeEmbedUrl(item.url).split('/embed/')[1]}/hqdefault.jpg`}
                        alt={item.caption}
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="relative z-10 w-14 h-14 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play size={24} className="text-navy ml-1" fill="currentColor" />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/90 to-transparent px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="font-body text-white text-sm">{item.caption}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setLightboxItem(null)}
          >
            <X size={28} />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {lightboxItem.type === 'video' || isYouTubeUrl(lightboxItem.url) ? (
              <div className="aspect-video">
                <iframe
                  src={getYouTubeEmbedUrl(lightboxItem.url)}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={lightboxItem.caption}
                />
              </div>
            ) : (
              <img
                src={lightboxItem.url}
                alt={lightboxItem.caption}
                className="max-w-full max-h-[80vh] mx-auto rounded-lg object-contain"
              />
            )}
            {lightboxItem.caption && (
              <p className="text-center text-white/80 font-body text-sm mt-3">{lightboxItem.caption}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
