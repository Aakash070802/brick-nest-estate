import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Carousel = ({ images = [] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
  });

  const scrollPrev = useCallback(() => {
    emblaApi && emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi && emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      {/* VIEWPORT */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className="min-w-full">
              <img
                src={img.url}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ARROWS (hidden on mobile) */}
      <button
        onClick={scrollPrev}
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 
        bg-black/50 text-white p-2 rounded-full"
      >
        <ArrowLeft size={18} />
      </button>

      <button
        onClick={scrollNext}
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 
        bg-black/50 text-white p-2 rounded-full"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default Carousel;
