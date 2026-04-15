import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/home/PropertyCard";
import PropertyCardSkeleton from "../components/home/PropertyCardSkeleton";
import { getAllListings } from "../services/listingService";

const Search = () => {
  const [searchParams] = useSearchParams();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef();
  const fetchIdRef = useRef(0);

  // 🔥 params
  const query = searchParams.get("search") || "";
  const type = searchParams.get("type") || "all";
  const offer = searchParams.get("offer") === "true";

  /**
   * 🚀 FETCH LISTINGS
   */
  const fetchListings = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);

      const fetchId = ++fetchIdRef.current;

      const res = await getAllListings({
        page: pageNum,
        limit: 8,
        search: query,
        filters: {
          type,
          offer,
        },
      });

      // 🔥 prevent race condition
      if (fetchId !== fetchIdRef.current) return;

      const safeListings = Array.isArray(res.properties) ? res.properties : [];

      setListings((prev) => {
        if (reset) return safeListings;

        const newItems = safeListings.filter(
          (item) => !prev.some((p) => p._id === item._id),
        );

        return [...prev, ...newItems];
      });

      setHasMore(res.pagination?.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  /**
   * 🔁 RESET ON PARAM CHANGE
   */
  useEffect(() => {
    setPage(1);
    fetchListings(1, true);
  }, [searchParams]);

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
        {/* 🔥 HEADER */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Search Results</h1>

          {/* 🔥 QUERY FEEDBACK */}
          {query && (
            <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
              Showing results for <span className="font-medium">"{query}"</span>
            </p>
          )}
        </div>

        {/* 🔥 INITIAL LOADING */}
        {initialLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* 🔥 EMPTY STATE */}
        {!initialLoading && listings.length === 0 && (
          <p className="text-center text-[var(--color-muted-foreground)] mt-10">
            No properties found. Try a different search.
          </p>
        )}

        {/* 🔥 RESULTS */}
        {!initialLoading && listings.length > 0 && (
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {listings.map((item, index) => {
              const isLast = index === listings.length - 1;

              return (
                <div key={item._id} ref={isLast ? lastElementRef : null}>
                  <PropertyCard listing={item} />
                </div>
              );
            })}
          </div>
        )}

        {/* 🔥 PAGINATION LOADER */}
        {loading && !initialLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* 🔥 END MESSAGE */}
        {!hasMore && !initialLoading && listings.length > 0 && (
          <p className="text-center mt-6 text-[var(--color-muted-foreground)]">
            No more listings
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
