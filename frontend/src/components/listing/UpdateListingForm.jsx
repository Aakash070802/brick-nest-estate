import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Checkbox from "../ui/Checkbox";

const container = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const UpdateListingForm = ({ form, setForm, onSubmit, loading }) => {
  const [newImages, setNewImages] = useState([]);
  const [keepImages, setKeepImages] = useState(() => form?.imageUrls || []);

  // FIXED: memory cleanup for object URLs
  useEffect(() => {
    return () => {
      newImages.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [newImages]);

  // INPUT CHANGE (no checkbox logic anymore)
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  // IMAGE ADD
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  // REMOVE IMAGE
  const handleRemoveImage = (index, isNew = false) => {
    if (isNew) {
      const updated = [...newImages];
      updated.splice(index, 1);
      setNewImages(updated);
    } else {
      const updated = [...keepImages];
      updated.splice(index, 1);
      setKeepImages(updated);
    }
  };

  // SUBMIT
  const handleSubmit = () => {
    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (key !== "imageUrls") {
        data.append(key, form[key]);
      }
    });

    data.append("keepImages", JSON.stringify(keepImages));

    newImages.forEach((file) => {
      data.append("images", file);
    });

    onSubmit(data);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* NAME */}
      <motion.input
        variants={item}
        id="name"
        value={form.name || ""}
        onChange={handleChange}
        placeholder="Name"
        className="input"
      />

      {/* ADDRESS */}
      <motion.input
        variants={item}
        id="address"
        value={form.address || ""}
        onChange={handleChange}
        placeholder="Address"
        className="input"
      />

      {/* DESCRIPTION */}
      <motion.textarea
        variants={item}
        id="description"
        value={form.description || ""}
        onChange={handleChange}
        placeholder="Description"
        className="input md:col-span-2"
      />

      {/* PRICES */}
      <motion.input
        variants={item}
        type="number"
        id="regularPrice"
        value={form.regularPrice || ""}
        onChange={handleChange}
        placeholder="Regular Price"
        className="input"
      />

      <motion.input
        variants={item}
        type="number"
        id="discountedPrice"
        value={form.discountedPrice || ""}
        onChange={handleChange}
        placeholder="Discount Price"
        className="input"
      />

      {/* ROOMS */}
      <motion.input
        variants={item}
        type="number"
        id="bedrooms"
        value={form.bedrooms || ""}
        onChange={handleChange}
        placeholder="Bedrooms"
        className="input"
      />

      <motion.input
        variants={item}
        type="number"
        id="bathrooms"
        value={form.bathrooms || ""}
        onChange={handleChange}
        placeholder="Bathrooms"
        className="input"
      />

      {/* TYPE */}
      <motion.select
        variants={item}
        id="type"
        value={form.type || "rent"}
        onChange={handleChange}
        className="input"
      >
        <option value="rent">Rent</option>
        <option value="sell">Sell</option>
      </motion.select>

      {/* FILE UPLOAD */}
      <motion.label
        variants={item}
        className="md:col-span-2 border border-dashed border-[var(--color-border)] 
        rounded-lg p-4 text-center cursor-pointer 
        hover:bg-[var(--color-muted)] transition"
      >
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Add more images
        </p>
        <input type="file" multiple hidden onChange={handleImageChange} />
      </motion.label>

      {/* EXISTING IMAGES */}
      {keepImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:col-span-2">
          {keepImages.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img.url}
                className="h-24 w-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(i)}
                className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* NEW IMAGES */}
      {newImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:col-span-2">
          {newImages.map((file, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(file)}
                className="h-24 w-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(i, true)}
                className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ CUSTOM CHECKBOX SYSTEM */}
      <div className="flex flex-wrap gap-6 md:col-span-2 text-sm text-[var(--color-foreground)]">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={form.furnished || false}
            onChange={(val) => setForm({ ...form, furnished: val })}
          />
          <span>Furnished</span>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={form.parking || false}
            onChange={(val) => setForm({ ...form, parking: val })}
          />
          <span>Parking</span>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={form.offer || false}
            onChange={(val) => setForm({ ...form, offer: val })}
          />
          <span>Offer</span>
        </div>
      </div>

      {/* BUTTON */}
      <motion.button
        variants={item}
        onClick={handleSubmit}
        disabled={loading}
        className="md:col-span-2 py-3 rounded-xl font-semibold 
        text-[var(--color-primary-foreground)] 
        bg-[var(--color-primary)] hover:opacity-90 transition"
      >
        {loading ? "Updating..." : "Update Listing"}
      </motion.button>
    </motion.div>
  );
};

export default UpdateListingForm;
