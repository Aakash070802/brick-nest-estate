import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListingById, toggleFavorite } from "../services/listingService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaHeart, FaBed, FaBath, FaCar, FaCouch } from "react-icons/fa";
import Carousel from "../components/ui/Carousel";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const PropertyDetails = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getListingById(id);
      setListing(data);
    };
    fetch();
  }, [id]);

  const handleSave = async () => {
    if (!currentUser) {
      localStorage.setItem("pendingFavorite", id);
      toast.info("Login to save properties");
      return;
    }

    try {
      await toggleFavorite(id);
      toast.success("Updated favorites");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!listing)
    return (
      <div className="p-6 text-center text-[var(--color-muted-foreground)]">
        Loading property...
      </div>
    );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[var(--color-background)] p-4 md:p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* 🔥 IMAGE CAROUSEL */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.div whileHover={{ scale: 1.01 }}>
            <Carousel images={listing.imageUrls} />
          </motion.div>
        </motion.div>

        {/* 🔥 HEADER */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:justify-between md:items-start gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">
              {listing.name}
            </h1>

            <p className="text-[var(--color-muted-foreground)] mt-1">
              {listing.address}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl 
            bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
          >
            <FaHeart />
            Save
          </motion.button>
        </motion.div>

        {/* 🔥 PRICE */}
        <motion.div
          variants={itemVariants}
          className="mt-4 text-3xl font-bold text-[var(--color-primary)]"
        >
          ₹{" "}
          {listing?.regularPrice
            ? listing.regularPrice.toLocaleString()
            : "N/A"}
        </motion.div>

        {/* 🔥 BADGES */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-2 mt-4"
        >
          <span className="bg-[var(--color-chart-1)] text-white px-3 py-1 rounded-full text-sm">
            {listing.type === "rent" ? "For Rent" : "For Sale"}
          </span>

          {listing.offer && (
            <span className="bg-[var(--color-chart-3)] px-3 py-1 rounded-full text-sm">
              Offer Available
            </span>
          )}

          {listing.furnished && (
            <span className="bg-[var(--color-chart-2)] px-3 py-1 rounded-full text-sm">
              Furnished
            </span>
          )}

          {listing.parking && (
            <span className="bg-[var(--color-chart-5)] px-3 py-1 rounded-full text-sm">
              Parking
            </span>
          )}
        </motion.div>

        {/* 🔥 FEATURE CARDS */}
        <motion.div
          variants={itemVariants}
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <motion.div
            whileHover={{ y: -4 }}
            className="p-4 rounded-xl bg-[var(--color-card)] border text-center"
          >
            <FaBed className="mx-auto mb-2" />
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Bedrooms
            </p>
            <p className="font-semibold">{listing.bedrooms}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-4 rounded-xl bg-[var(--color-card)] border text-center"
          >
            <FaBath className="mx-auto mb-2" />
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Bathrooms
            </p>
            <p className="font-semibold">{listing.bathrooms}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-4 rounded-xl bg-[var(--color-card)] border text-center"
          >
            <FaCouch className="mx-auto mb-2" />
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Furnished
            </p>
            <p className="font-semibold">{listing.furnished ? "Yes" : "No"}</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-4 rounded-xl bg-[var(--color-card)] border text-center"
          >
            <FaCar className="mx-auto mb-2" />
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Parking
            </p>
            <p className="font-semibold">
              {listing.parking ? "Available" : "No"}
            </p>
          </motion.div>
        </motion.div>

        {/* 🔥 DESCRIPTION */}
        <motion.div variants={itemVariants} className="mt-8">
          <h2 className="text-lg font-semibold mb-2 text-[var(--color-foreground)]">
            Description
          </h2>

          <p className="text-[var(--color-muted-foreground)] leading-relaxed">
            {listing.description}
          </p>
        </motion.div>

        {/* 🔥 META INFO */}
        <motion.div
          variants={itemVariants}
          className="mt-6 text-sm text-[var(--color-muted-foreground)]"
        >
          <p>Listed on: {new Date(listing.createdAt).toDateString()}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;
