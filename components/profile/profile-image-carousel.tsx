import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

export interface ProfileImageCarouselProps {
  photos: string[];
  alt: string;
}

export function ProfileImageCarousel({ photos, alt }: ProfileImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  return (
    <div className="relative w-full max-w-xs md:max-w-full aspect-[4/5] rounded-2xl overflow-hidden mx-auto md:mx-0 shadow-2xl border border-border bg-card">
      <div ref={emblaRef} className="embla w-full h-full">
        <div className="flex h-full">
          {photos.map((src, i) => (
            <div className="flex-[0_0_100%] h-full" key={i}>
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {photos.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to photo ${i + 1}`}
              className="w-2.5 h-2.5 rounded-full bg-white/70 border border-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              onClick={() => scrollTo(i)}
              tabIndex={0}
            />
          ))}
        </div>
      )}
    </div>
  );
} 