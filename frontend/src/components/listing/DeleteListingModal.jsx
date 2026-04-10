import { AnimatePresence, motion } from "framer-motion";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalAnim = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 40,
    transition: { duration: 0.2 },
  },
};

const DeleteListingModal = ({ open, onClose, onConfirm, loading }) => {
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
            w-[92%] sm:w-[400px] 
            bg-[var(--color-card)] 
            border border-[var(--color-border)] 
            rounded-2xl shadow-xl p-5"
          >
            {/* HEADER */}
            <h3 className="text-[var(--color-destructive)] font-semibold text-lg mb-2">
              Delete Listing?
            </h3>

            {/* DESCRIPTION */}
            <p className="text-sm text-[var(--color-muted-foreground)] mb-5">
              This action cannot be undone. This will permanently remove your
              listing.
            </p>

            {/* ACTIONS */}
            <div className="flex gap-3">
              {/* DELETE */}
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-2 rounded-xl font-medium
                text-[var(--color-destructive-foreground)]
                bg-[var(--color-destructive)]
                hover:opacity-90 transition
                disabled:opacity-60"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>

              {/* CANCEL */}
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-xl font-medium
                border border-[var(--color-border)]
                text-[var(--color-foreground)]
                bg-[var(--color-card)]
                hover:bg-[var(--color-muted)] transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteListingModal;
