import { useState } from "react";
import { createListing } from "../../services/listingService";
import { toast } from "react-toastify";

const CreateListingForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: "",
    discountedPrice: "",
    bedrooms: "",
    bathrooms: "",
    furnished: false,
    parking: false,
    offer: false,
    type: "rent",
    images: [],
  });

  const [preview, setPreview] = useState([]);

  const handleChange = (e) => {
    const { id, value, type, checked, files } = e.target;

    if (id === "images") {
      const filesArr = Array.from(files);
      setForm({ ...form, images: filesArr });

      setPreview(filesArr.map((file) => URL.createObjectURL(file)));
    } else if (type === "checkbox") {
      setForm({ ...form, [id]: checked });
    } else {
      setForm({ ...form, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        if (key === "images") {
          form.images.forEach((file) => data.append("images", file));
        } else {
          data.append(key, form[key]);
        }
      });

      const res = await createListing(data);

      toast.success("Listing created");
      onSuccess(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mb-6 p-4 sm:p-6 rounded-xl bg-[var(--color-surface)] shadow-lg">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Create Listing</h2>
        <button onClick={onClose} className="text-red-400">
          Close
        </button>
      </div>

      {/* FORM */}
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        <input
          id="name"
          placeholder="Name"
          onChange={handleChange}
          className="input"
        />
        <input
          id="address"
          placeholder="Address"
          onChange={handleChange}
          className="input"
        />

        <textarea
          id="description"
          placeholder="Description"
          onChange={handleChange}
          className="input md:col-span-2"
        />

        <input
          type="number"
          id="regularPrice"
          placeholder="Regular Price"
          onChange={handleChange}
          className="input"
        />
        <input
          type="number"
          id="discountedPrice"
          placeholder="Discount Price"
          onChange={handleChange}
          className="input"
        />

        <input
          type="number"
          id="bedrooms"
          placeholder="Bedrooms"
          onChange={handleChange}
          className="input"
        />
        <input
          type="number"
          id="bathrooms"
          placeholder="Bathrooms"
          onChange={handleChange}
          className="input"
        />

        <select id="type" onChange={handleChange} className="input">
          <option value="rent">Rent</option>
          <option value="sell">Sell</option>
          <option value="buy">Buy</option>
        </select>

        {/* FILE UPLOAD */}
        <label className="md:col-span-2 border border-dashed border-gray-500 rounded-lg p-4 text-center cursor-pointer hover:bg-[var(--color-card)] transition">
          <p className="text-sm text-gray-400">Click to upload images</p>
          <input
            type="file"
            id="images"
            multiple
            hidden
            onChange={handleChange}
          />
        </label>

        {/* IMAGE PREVIEW */}
        {preview.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:col-span-2">
            {preview.map((img, i) => (
              <img
                key={i}
                src={img}
                className="h-24 w-full object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        {/* CHECKBOX */}
        <div className="flex flex-wrap gap-4 md:col-span-2 text-sm">
          <label>
            <input type="checkbox" id="furnished" onChange={handleChange} />{" "}
            Furnished
          </label>
          <label>
            <input type="checkbox" id="parking" onChange={handleChange} />{" "}
            Parking
          </label>
          <label>
            <input type="checkbox" id="offer" onChange={handleChange} /> Offer
          </label>
        </div>

        {/* BUTTON */}
        <button
          className="md:col-span-2 py-3 rounded-xl text-white font-semibold"
          style={{ background: "var(--gradient-primary)" }}
        >
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default CreateListingForm;
