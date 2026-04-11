import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PropertyCard from "../components/home/PropertyCard";
import PropertyCardSkeleton from "../components/home/PropertyCardSkeleton";
import { getAllListings } from "../services/listingService";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getAllListings();
        setListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">
            Explore Properties
          </h1>
          <p className="text-[var(--color-muted-foreground)] mt-1">
            Find your perfect home
          </p>
        </motion.div>

        {/* GRID */}
        {loading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--color-muted-foreground)]">
              No properties found.
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.08 },
              },
            }}
            className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {listings.map((item) => (
              <PropertyCard key={item._id} listing={item} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
