import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllListings } from "../services/listingService";
import PropertyCard from "../components/home/PropertyCard";
import { motion } from "framer-motion";

const Favorites = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await getAllListings({ page: 1, limit: 100 });

        const favListings = res.properties.filter((listing) =>
          currentUser?.favorites?.some(
            (fav) => fav.toString() === listing._id.toString(),
          ),
        );

        setFavorites(favListings);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  if (loading) {
    return <div className="p-6 text-center">Loading favorites...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6 text-[var(--color-foreground)]"
        >
          ❤️ Your Favorites
        </motion.h1>

        {favorites.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[var(--color-muted-foreground)]"
          >
            No favorite properties yet.
          </motion.p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((listing, i) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PropertyCard listing={listing} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
