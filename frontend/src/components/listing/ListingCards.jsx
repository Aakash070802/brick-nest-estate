import { useState } from "react";
import { FaEllipsisV, FaHeart } from "react-icons/fa";

const ListingCard = ({ listing, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative bg-(--color-card) rounded-xl shadow hover:scale-[1.02] transition">
      {/* IMAGE */}
      <img
        src={listing.imageUrls?.[0]?.url}
        className="h-48 w-full object-cover"
      />

      {/* TOP RIGHT MENU */}
      <div className="absolute top-2 right-2">
        <button onClick={() => setOpen(!open)}>
          <FaEllipsisV />
        </button>

        {open && (
          <div className="absolute right-0 bg-white shadow rounded">
            <button onClick={onEdit} className="block px-4 py-2">
              Edit
            </button>
            <button onClick={onDelete} className="block px-4 py-2 text-red-500">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* HEART */}
      <div className="absolute top-2 left-2 text-red-500">
        <FaHeart />
      </div>

      {/* DETAILS */}
      <div className="p-3">
        <h2 className="font-semibold">{listing.name}</h2>
        <p className="text-sm text-gray-500">{listing.address}</p>

        <p className="font-bold">₹ {listing.regularPrice}</p>

        {listing.discountedPrice && (
          <p className="text-green-500">₹ {listing.discountedPrice}</p>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
