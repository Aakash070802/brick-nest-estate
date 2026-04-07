import { useEffect, useState } from "react";
import { getMyListings, deleteListing } from "../../services/listingService";
import ListingCard from "../../components/listing/ListingCards";
import CreateListingForm from "../../components/listing/CreateListingForm";
import UpdateListingForm from "../../components/listing/UpdateListingForm";
import DeleteListingModal from "../../components/listing/DeleteListingModal";
import { toast } from "react-toastify";
import CreateListingModal from "../../components/listing/CreateListingModal";

const ViewMyListing = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedListing, setSelectedListing] = useState(null);

  const fetchListings = async () => {
    try {
      const data = await getMyListings();
      setListings(data);
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
    try {
      await deleteListing(selectedListing._id);
      toast.success("Deleted");

      setListings((prev) =>
        prev.filter((item) => item._id !== selectedListing._id),
      );

      setDeleteOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6">
      {/* CREATE BUTTON */}
      <button
        onClick={() => setCreateOpen(true)}
        className="mb-6 px-5 py-2 bg-green-500 text-white rounded-lg"
      >
        + Create Listing
      </button>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : listings.length === 0 ? (
        <p>No listings found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <ListingCard
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
        </div>
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

      {/* {updateOpen && (
        <UpdateListingModal
          listing={selectedListing}
          onClose={() => setUpdateOpen(false)}
          onSuccess={(updated) => {
            setListings((prev) =>
              prev.map((l) => (l._id === updated._id ? updated : l)),
            );
            setUpdateOpen(false);
          }}
        />
      )} */}

      {deleteOpen && (
        <DeleteListingModal
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ViewMyListing;
