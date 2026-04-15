import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PropertyCard from "../components/home/PropertyCard";
import PropertyCardSkeleton from "../components/home/PropertyCardSkeleton";
import { getAllListings } from "../services/listingService";
import FilterDrawer from "../components/filters/FilterDrawer";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25 },
  },
};

const Home = () => {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  const observerRef = useRef();
  const fetchIdRef = useRef(0);
  const isFirstLoad = useRef(true);

  const fetchListings = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);

      const fetchId = ++fetchIdRef.current;

      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) =>
            value !== false && value !== "all" && value !== undefined,
        ),
      );

      const res = await getAllListings({
        page: pageNum,
        limit: 8,
        search,
        filters: cleanedFilters,
      });

      if (fetchId !== fetchIdRef.current) return;

      const safeListings = Array.isArray(res.properties) ? res.properties : [];

      setListings((prev) => {
        if (reset) return safeListings;

        const newItems = safeListings.filter(
          (item) => !prev.some((p) => p._id === item._id),
        );

        return [...prev, ...newItems];
      });

      setHasMore(res.pagination.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      fetchListings(1, true);
      return;
    }

    setPage(1);
    fetchListings(1, true);
  }, [filters, search]);

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

  useEffect(() => {
    if (page === 1) return;
    fetchListings(page);
  }, [page]);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            Explore Properties
          </motion.h1>

          <FilterDrawer onApply={(newFilters) => setFilters(newFilters)} />
        </div>

        {/* INITIAL LOADING */}
        {initialLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* GRID */}
        {!initialLoading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
            className="grid gap-4 grid-cols-2 md:grid-cols-4"
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
        )}

        {/* PAGINATION LOADER */}
        {loading && !initialLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!hasMore && !initialLoading && (
          <p className="text-center mt-6 text-muted-foreground">
            No more listings
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
