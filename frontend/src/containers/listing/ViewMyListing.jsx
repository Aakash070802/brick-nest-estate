import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMyListings, deleteListing } from "../../services/listingService";

import ListingCards from "../../components/listing/ListingCards";
import ListingSkeleton from "../../components/skeletons/ListingSkeleton";

import CreateListingModal from "../../components/listing/CreateListingModal";
import UpdateListingModal from "../../components/listing/UpdateListingModal";
import DeleteListingModal from "../../components/listing/DeleteListingModal";

import { toast } from "react-toastify";

const ViewMyListing = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedListing, setSelectedListing] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await getMyListings();
      setListings(data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async () => {
    if (!selectedListing) return;

    try {
      await deleteListing(selectedListing._id);

      setListings((prev) =>
        prev.filter((item) => item._id !== selectedListing._id),
      );

      toast.success("Listing deleted");
      setDeleteOpen(false);
      setSelectedListing(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
              My Listings
            </h1>
            <p className="text-[var(--color-muted-foreground)]">
              Manage your properties
            </p>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="px-5 py-2 rounded-xl font-medium 
            text-[var(--color-primary-foreground)] 
            bg-[var(--color-chart-5)] 
            hover:opacity-90 transition cursor-pointer"
          >
            + Create
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--color-muted-foreground)]">
              You have no listings yet.
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
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {listings.map((listing) => (
              <ListingCards
                key={listing._id}
                listing={listing}
                onEdit={() => {
                  setSelectedListing(listing);
                  setUpdateOpen(true);
                }}
                onDelete={() => {
                  setSelectedListing(listing);
                  setDeleteOpen(true);
                }}
              />
            ))}
          </motion.div>
        )}

        {/* MODALS */}
        <CreateListingModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={(newListing) => {
            setListings((prev) => [newListing, ...prev]);
            setCreateOpen(false);
          }}
        />

        <UpdateListingModal
          open={updateOpen}
          onClose={() => {
            setUpdateOpen(false);
            setSelectedListing(null);
          }}
          form={selectedListing || {}}
          setForm={setSelectedListing}
          onSuccess={(updated) => {
            setListings((prev) =>
              prev.map((l) => (l._id === updated._id ? updated : l)),
            );
            setUpdateOpen(false);
            setSelectedListing(null);
          }}
        />

        <DeleteListingModal
          open={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setSelectedListing(null);
          }}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
};

export default ViewMyListing;
