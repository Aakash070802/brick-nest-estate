import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PropertyCard from "../components/home/PropertyCard";
import PropertyCardSkeleton from "../components/home/PropertyCardSkeleton";
import { getAllListings } from "../services/listingService";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const Home = () => {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef();

  const fetchListings = async (pageNum = 1) => {
    try {
      setLoading(true);

      const res = await getAllListings({
        page: pageNum,
        limit: 8,
      });

      setListings((prev) => [...prev, ...res.listings]);
      setHasMore(res.pagination.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchListings(1);
  }, []);

  // OBSERVER
  const lastElementRef = (node) => {
    if (loading || !hasMore) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  };

  // NEXT PAGE
  useEffect(() => {
    if (page === 1) return;
    fetchListings(page);
  }, [page]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)]">
            Explore Properties
          </h1>
        </motion.div>

        {/* GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
          className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {listings.map((item, index) => {
            const isLast = index === listings.length - 1;

            return (
              <motion.div
                key={item._id}
                variants={itemVariants}
                layout
                ref={isLast ? lastElementRef : null}
              >
                <PropertyCard listing={item} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* LOADING SKELETON (BOTTOM) */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* END */}
        {!hasMore && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6 text-[var(--color-muted-foreground)]"
          >
            No more listings
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Home;
