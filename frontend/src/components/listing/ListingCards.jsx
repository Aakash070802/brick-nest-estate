import { Link } from "react-router-dom";

const ListingCard = ({ listing }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls?.[0]}
          alt="listing"
          className="h-48 w-full object-cover"
        />
        <div className="p-3">
          <h2 className="text-lg font-semibold truncate">{listing.name}</h2>
          <p className="text-gray-500 text-sm">{listing.address}</p>
          <p className="text-green-600 font-bold mt-2">₹ {listing.price}</p>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
