import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import UpdateListingForm from "./UpdateListingForm";
import { updateListing } from "../../services/listingService";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalAnim = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 40,
    transition: { duration: 0.2 },
  },
};

const UpdateListingModal = ({ open, onClose, form, setForm, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (formData) => {
    if (!form?._id) {
      return toast.error("Invalid listing");
    }

    try {
      setLoading(true);

      const res = await updateListing(form._id, formData);

      toast.success("Listing updated");

      onSuccess(res);
      onClose();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* MODAL */}
          <motion.div
            variants={modalAnim}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed z-50 top-1/2 left-1/2 
            -translate-x-1/2 -translate-y-1/2
            w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto
            bg-[var(--color-card)] 
            text-[var(--color-foreground)] 
            rounded-2xl shadow-xl p-5 sm:p-6"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Update Listing</h3>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--color-muted)] transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM */}
            <UpdateListingForm
              form={form}
              setForm={setForm}
              onSubmit={handleUpdate}
              loading={loading}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpdateListingModal;
