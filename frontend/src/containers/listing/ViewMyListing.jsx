import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMyListings, deleteListing } from "../../services/listingService";

import ListingCards from "../../components/listing/ListingCards";
import CreateListingModal from "../../components/listing/CreateListingModal";
import UpdateListingModal from "../../components/listing/UpdateListingModal";
import DeleteListingModal from "../../components/listing/DeleteListingModal";

import { toast } from "react-toastify";

const ViewMyListing = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedListing, setSelectedListing] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await getMyListings();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async () => {
    if (!selectedListing || deleting) return;

    try {
      setDeleting(true);

      await deleteListing(selectedListing._id);

      setListings((prev) =>
        prev.filter((item) => item._id !== selectedListing._id),
      );

      toast.success("Listing deleted");
      setDeleteOpen(false);
      setSelectedListing(null);
    } catch (err) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
              My Properties
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
            hover:opacity-90 transition"
          >
            + Create
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 text-[var(--color-muted-foreground)]">
            Loading your listings...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-24 space-y-3">
            <p className="text-lg text-[var(--color-muted-foreground)]">
              You haven't created any Properties yet.
            </p>
            <button
              onClick={() => setCreateOpen(true)}
              className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-white"
            >
              Create your first Property
            </button>
          </div>
        )}

        {/* LIST */}
        {!loading && listings.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
          loading={deleting}
        />
      </div>
    </div>
  );
};

export default ViewMyListing;
