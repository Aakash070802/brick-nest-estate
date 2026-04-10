import { AnimatePresence, motion } from "framer-motion";
import Modal from "../common/Modal";

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
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 40,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const DeleteListingModal = ({ open, onClose, onConfirm, loading }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <motion.div variants={modalAnim}>
            <Modal onClose={onClose}>
              <h3 className="text-(--color-destructive) font-semibold mb-2">
                Delete Listing?
              </h3>

              <p className="text-sm text-(--color-muted-foreground) mb-4">
                This action cannot be undone. This will permanently remove your
                listing.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 p-2 rounded-xl text-white disabled:opacity-70"
                  style={{ background: "var(--color-destructive)" }}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 p-2 rounded-xl border border-(--color-border) text-(--color-foreground)"
                >
                  Cancel
                </button>
              </div>
            </Modal>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteListingModal;
