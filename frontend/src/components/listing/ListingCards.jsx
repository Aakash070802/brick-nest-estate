import { useState, useRef, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";

const ListingCard = ({ listing, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // ✅ CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ PRICE FORMATTER
  const formatPrice = (price) => {
    if (!price) return "N/A";
    return price.toLocaleString("en-IN");
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden 
      bg-[var(--color-card)] border border-[var(--color-border)] 
      shadow-sm hover:shadow-xl transition duration-300 group"
    >
      {/* IMAGE */}
      <div className="relative">
        <img
          src={listing.imageUrls?.[0]?.url || "/fallback.jpg"}
          alt={listing.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = "/fallback.jpg";
          }}
          className="h-48 sm:h-52 md:h-56 w-full object-cover 
          group-hover:scale-105 transition duration-300"
        />

        {/* GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* MENU */}
        <div className="absolute top-3 right-3" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
            className="bg-white/90 dark:bg-black/70 backdrop-blur-md 
            p-2 rounded-full shadow-md 
            text-gray-700 dark:text-white 
            hover:scale-110 transition"
          >
            <FaEllipsisV size={14} />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-32 
              bg-[var(--color-card)] border border-[var(--color-border)] 
              rounded-lg shadow-lg overflow-hidden z-50"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm 
                text-[var(--color-foreground)] 
                hover:bg-[var(--color-muted)] transition"
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm 
                text-[var(--color-destructive)] 
                hover:bg-red-500/10 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-4 space-y-2">
        {/* TITLE */}
        <h2 className="text-base sm:text-lg font-semibold text-[var(--color-foreground)] line-clamp-1">
          {listing.name || "Untitled Property"}
        </h2>

        {/* ADDRESS */}
        <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-1">
          {listing.address || "No address provided"}
        </p>

        {/* PRICE */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-lg font-bold text-[var(--color-primary)]">
              ₹ {formatPrice(listing.discountedPrice || listing.regularPrice)}
            </p>

            {listing.discountedPrice && (
              <p className="text-sm line-through text-[var(--color-muted-foreground)]">
                ₹ {formatPrice(listing.regularPrice)}
              </p>
            )}
          </div>

          {/* BADGE */}
          <span
            className="text-xs px-3 py-1 rounded-full 
            bg-[var(--color-secondary)] 
            text-[var(--color-secondary-foreground)] 
            capitalize shadow-sm"
          >
            {listing.type || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
