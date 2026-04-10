import { useState } from "react";
import { createListing } from "../../services/listingService";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";

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

  const handleRemoveImage = (index) => {
    const updatedPreview = [...preview];
    updatedPreview.splice(index, 1);

    const updatedImages = [...form.images];
    updatedImages.splice(index, 1);

    setPreview(updatedPreview);
    setForm({ ...form, images: updatedImages });
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
      onSuccess(res);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mb-6 p-4 sm:p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-foreground)]">
          Create Listing
        </h2>
        <button onClick={onClose} className="text-[var(--color-destructive)]">
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
          <option value="" disabled>
            Rent OR Sell
          </option>
          <option value="rent">Rent</option>
          <option value="sell">Sell</option>
        </select>

        {/* FILE UPLOAD */}
        <label className="md:col-span-2 border border-dashed border-[var(--color-border)] rounded-lg p-4 text-center cursor-pointer hover:bg-[var(--color-muted)] transition">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Click to upload images
          </p>
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
              <div key={i} className="relative group">
                <img
                  src={img}
                  className="h-24 w-full object-cover rounded-lg"
                />

                {/* REMOVE BUTTON */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-1 right-1 
                bg-black/70 hover:bg-[var(--color-destructive)] text-white text-xs 
                px-2 py-0.5 rounded-md 
                opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <RxCross1 />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CHECKBOX */}
        <div className="flex flex-wrap gap-4 md:col-span-2 text-sm text-[var(--color-foreground)]">
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
        <button className="md:col-span-2 py-3 rounded-xl font-semibold text-[var(--color-primary-foreground)] bg-[var(--color-primary)]">
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default CreateListingForm;
