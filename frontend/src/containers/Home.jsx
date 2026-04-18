import { useEffect, useRef, useState, useCallback } from "react";
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
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const observerRef = useRef();
  const fetchIdRef = useRef(0);

  // PROPER DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = search.trim();

      if (trimmed.length === 0) {
        setDebouncedSearch("");
      } else if (trimmed.length >= 3) {
        setDebouncedSearch(trimmed);
      }
    }, 1000); // slightly increased

    return () => clearTimeout(timer);
  }, [search]);

  //  SINGLE SOURCE FETCH

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
        search: debouncedSearch,
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

  //  RESET + FIRST FETCH

  useEffect(() => {
    setListings([]);
    setPage(1);
    setHasMore(true);

    fetchListings(1, true); //  direct call (no chaining)
  }, [debouncedSearch, filters]);

  //  PAGINATION ONLY

  useEffect(() => {
    if (page === 1) return;
    fetchListings(page);
  }, [page]);

  // INFINITE SCROLL
  const lastElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/*  FIXED STICKY HEADER */}
        <div className="sticky top-14 z-40 -mx-4 px-4 py-4 bg-[var(--color-background)]/95 backdrop-blur-lg border-b border-[var(--color-border)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-[var(--color-foreground)] flex-shrink-0"
            >
              Explore Properties
            </motion.h1>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              {/* Search Input */}
              <div className="relative flex-1 min-w-0 md:w-80">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search like: 2BHK near school..."
                  className="w-full px-4 py-3 rounded-2xl border border-[var(--color-border)]
                    bg-[var(--color-card)] text-[var(--color-foreground)]
                    outline-none focus:ring-2 focus:ring-[var(--color-primary)]
                    placeholder:text-[var(--color-muted-foreground)]"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                      text-sm text-[var(--color-muted-foreground)]
                      hover:text-[var(--color-foreground)] transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Drawer */}
              <div className="flex-shrink-0">
                <FilterDrawer
                  onApply={(newFilters) => setFilters(newFilters)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH FEEDBACK */}
        {debouncedSearch && (
          <p className="text-sm text-[var(--color-muted-foreground)] mt-6 mb-6 pl-1">
            Showing results for{" "}
            <span className="font-medium text-[var(--color-foreground)]">
              "{debouncedSearch}"
            </span>
          </p>
        )}

        {/* INITIAL LOADING */}
        {initialLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!initialLoading && listings.length === 0 && (
          <p className="text-center text-[var(--color-muted-foreground)] mt-12 text-lg">
            No properties found. Try a different search.
          </p>
        )}

        {/* LISTINGS GRID */}
        {!initialLoading && listings.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            layout
            className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6"
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

        {/* LOADING MORE */}
        {loading && !initialLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* END OF LIST */}
        {!hasMore && !initialLoading && listings.length > 0 && (
          <p className="text-center mt-10 text-[var(--color-muted-foreground)]">
            No more listings
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
