import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/home/PropertyCard";
import PropertyCardSkeleton from "../components/home/PropertyCardSkeleton";
import { getAllListings } from "../services/listingService";

const Search = () => {
  const [searchParams] = useSearchParams();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef();

  // params
  const query = searchParams.get("search") || "";
  const type = searchParams.get("type") || "all";
  const offer = searchParams.get("offer") === "true";

  const fetchListings = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);

      const res = await getAllListings({
        page: pageNum,
        limit: 8,
        search: query,
        filters: {
          type,
          offer,
        },
      });

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
    }
  };

  // 🔁 reset on query change
  useEffect(() => {
    setPage(1);
    fetchListings(1, true);
  }, [searchParams]);

  // 📄 next page
  useEffect(() => {
    if (page === 1) return;
    fetchListings(page);
  }, [page]);

  // 👇 infinite scroll
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

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-semibold mb-6">Search Results</h1>

        {/* RESULTS */}
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

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!hasMore && (
          <p className="text-center mt-6 text-[var(--color-muted-foreground)]">
            No more listings
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
