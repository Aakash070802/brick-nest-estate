import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Carousel = ({ images = [] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const [selectedIndex, setSelectedIndex] = useState(0);

  // INIT
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  // ❌ EMPTY STATE FIX
  if (!images || images.length === 0) {
    return (
      <div
        className="w-full h-[300px] flex items-center justify-center 
      bg-[var(--color-muted)] rounded-2xl"
      >
        <p className="text-sm text-[var(--color-muted-foreground)]">
          No images available
        </p>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* VIEWPORT */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className="min-w-full">
              <img
                src={img?.url || "/fallback.jpg"}
                alt={`property-${i}`}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/fallback.jpg";
                }}
                className="w-full h-[350px] md:h-[450px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ARROWS */}
      <button
        onClick={scrollPrev}
        disabled={!emblaApi}
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 
        bg-black/50 text-white p-2 rounded-full opacity-0 
        group-hover:opacity-100 transition disabled:opacity-30"
      >
        <ArrowLeft size={18} />
      </button>

      <button
        onClick={scrollNext}
        disabled={!emblaApi}
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 
        bg-black/50 text-white p-2 rounded-full opacity-0 
        group-hover:opacity-100 transition disabled:opacity-30"
      >
        <ArrowRight size={18} />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {emblaApi?.scrollSnapList().map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition 
              ${i === selectedIndex ? "bg-white scale-110" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
