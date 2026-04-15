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
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const observerRef = useRef();
  const fetchIdRef = useRef(0);
  const isFirstLoad = useRef(true);

  /**
   * 🚀 FETCH LISTINGS
   */
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

  /**
   * 🔄 TRIGGER FETCH ON FILTER / SEARCH
   */
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      fetchListings(1, true);
      return;
    }

    setPage(1);
    fetchListings(1, true);
  }, [filters, debouncedSearch]);

  /**
   * 🔥 IMPROVED DEBOUNCE (NO FLICKER)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = search.trim();

      if (trimmed.length === 0) {
        setDebouncedSearch("");
      } else if (trimmed.length >= 3) {
        setDebouncedSearch(trimmed);
      }
      // 👇 do nothing if 1-2 chars → keep previous results
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /**
   * 📄 PAGINATION
   */
  useEffect(() => {
    if (page === 1) return;
    fetchListings(page);
  }, [page]);

  /**
   * 👀 INFINITE SCROLL
   */
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
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* 🔥 STICKY SEARCH BAR */}
        <div
          className="sticky top-0 z-30 backdrop-blur-md 
          bg-[var(--color-background)]/80 
          border-b border-[var(--color-border)] 
          pb-4 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold"
            >
              Explore Properties
            </motion.h1>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* 🔍 SEARCH */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search like: 2BHK near school..."
                  className="w-full px-4 py-2 pr-10 rounded-xl border
                  border-[var(--color-border)]
                  bg-[var(--color-card)]
                  text-[var(--color-foreground)]
                  outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2
                    text-sm text-[var(--color-muted-foreground)]
                    hover:text-[var(--color-foreground)]"
                  >
                    ✕
                  </button>
                )}
              </div>

              <FilterDrawer onApply={(newFilters) => setFilters(newFilters)} />
            </div>
          </div>
        </div>

        {/* 🔥 SEARCH FEEDBACK */}
        {debouncedSearch && (
          <p className="text-sm text-[var(--color-muted-foreground)] mb-3">
            Showing results for{" "}
            <span className="font-medium">"{debouncedSearch}"</span>
          </p>
        )}

        {/* INITIAL LOADING */}
        {initialLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!initialLoading && listings.length === 0 && (
          <p className="text-center text-[var(--color-muted-foreground)] mt-10">
            No properties found. Try a different search.
          </p>
        )}

        {/* GRID */}
        {!initialLoading && listings.length > 0 && (
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

        {/* LOADING MORE */}
        {loading && !initialLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!hasMore && !initialLoading && listings.length > 0 && (
          <p className="text-center mt-6 text-muted-foreground">
            No more listings
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
