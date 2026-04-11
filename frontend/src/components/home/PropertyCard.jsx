import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleFavorite } from "../../services/listingService";
import { toast } from "react-toastify";

const PropertyCard = ({ listing }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.stopPropagation(); // 🔥 VERY IMPORTANT (prevents navigation)

    if (!currentUser) {
      localStorage.setItem("pendingFavorite", listing._id);
      toast.info("Login to save properties");
      navigate("/login");
      return;
    }

    try {
      await toggleFavorite(listing._id);
      toast.success("Updated favorites");
    } catch (err) {
      toast.error(err.message);
    }

    console.log("LISTING:", listing);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => navigate(`/listing/${listing._id}`)}
      className="cursor-pointer rounded-2xl overflow-hidden 
      bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm"
    >
      {/* IMAGE */}
      <div className="relative">
        <img
          src={listing.imageUrls?.[0]?.url}
          alt="property"
          className="w-full h-44 object-cover"
          loading="lazy"
        />

        {/* TYPE BADGE */}
        <span
          className="absolute left-2 top-2 px-2 py-1 text-xs rounded-md 
        bg-[var(--color-chart-1)] text-white"
        >
          {listing.type === "rent" ? "For Rent" : "For Sale"}
        </span>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur p-2 rounded-full"
        >
          <FaHeart className="text-gray-600" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-[var(--color-foreground)] line-clamp-1">
          {listing.name}
        </h3>

        <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-1">
          {listing.address}
        </p>

        <p className="mt-1 font-semibold text-[var(--color-primary)]">
          ₹{" "}
          {listing?.regularPrice
            ? listing.regularPrice.toLocaleString()
            : "N/A"}
        </p>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
