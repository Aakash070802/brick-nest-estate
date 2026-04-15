import { motion } from "framer-motion";
import { FaHeart, FaBed, FaBath } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleFavorite } from "../../services/listingService";
import { toggleFavoriteLocal } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import { useTheme } from "../../hooks/useTheme";
import { useState, useMemo } from "react";

const PropertyCard = ({ listing }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [favLoading, setFavLoading] = useState(false);

  const listingId = listing?._id;

  const isFavorite = useMemo(() => {
    return currentUser?.favorites?.some(
      (favId) => favId?.toString() === listingId?.toString(),
    );
  }, [currentUser, listingId]);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (favLoading) return;

    setFavLoading(true);

    dispatch(toggleFavoriteLocal(listingId));

    try {
      await toggleFavorite(listingId);
    } catch (err) {
      dispatch(toggleFavoriteLocal(listingId));
      toast.error(err.message);
    } finally {
      setFavLoading(false);
    }
  };

  const shadowStyle =
    theme === "dark"
      ? "shadow-[0_10px_30px_rgba(255,255,255,0.08)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.12)]"
      : "shadow-md hover:shadow-xl";

  const goToListing = () => navigate(`/listing/${listingId}`);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      onClick={goToListing}
      className={`cursor-pointer rounded-2xl overflow-hidden 
      bg-[var(--color-card)] border border-[var(--color-border)] 
      ${shadowStyle} transition`}
    >
      {/* IMAGE */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={listing.imageUrls?.[0]?.url || "/fallback-property.jpg"}
          alt="property"
          className="w-full h-full object-cover"
        />

        <span className="absolute left-3 top-3 px-2 py-1 text-xs rounded-md bg-[var(--color-chart-1)] text-white shadow">
          {listing.type === "rent" ? "For Rent" : "For Sale"}
        </span>

        {listing.offer && (
          <span className="absolute left-3 bottom-3 px-2 py-1 text-xs rounded-md bg-[var(--color-chart-3)] text-black shadow">
            Offer
          </span>
        )}

        {currentUser && (
          <button
            type="button"
            aria-label="Toggle favorite"
            onClick={handleSave}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow"
          >
            <FaHeart
              className={`${
                isFavorite ? "text-red-500" : "text-gray-500"
              } ${favLoading ? "opacity-50" : ""}`}
            />
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full overflow-hidden border border-[var(--color-border)]"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${listing.userRef?._id}`);
              }}
            >
              <img
                src={listing.userRef?.avatar || "/default-user.png"}
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>

            <span className="text-xs font-medium text-[var(--color-foreground)]">
              {listing.userRef?.username || "Unknown"}
            </span>
          </div>

          <span className="text-[10px] text-[var(--color-muted-foreground)]">
            • just now
          </span>
        </div>

        <h3 className="text-sm font-semibold text-[var(--color-foreground)] line-clamp-1">
          {listing.name}
        </h3>

        <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-1">
          {listing.address}
        </p>

        <div className="flex items-center gap-4 text-xs text-[var(--color-muted-foreground)]">
          <span className="flex items-center gap-1">
            <FaBed /> {listing.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <FaBath /> {listing.bathrooms}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-bold text-[var(--color-primary)]">
            ₹{" "}
            {(
              listing.discountedPrice || listing.regularPrice
            )?.toLocaleString()}
          </p>

          {listing.discountedPrice && (
            <p className="text-xs line-through text-gray-400">
              ₹ {listing.regularPrice.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
